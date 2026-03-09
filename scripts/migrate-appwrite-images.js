import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const UNASSIGNED_DIR = 'public/products/unassigned';
const DEST_DIR = 'public/products';
const BACKUP_FILE = 'full-products-backup.json';
const DB_NAME = 'choice-db';

async function run() {
    if (!fs.existsSync(BACKUP_FILE)) {
        console.error('Backup file not found!');
        return;
    }

    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
    const fileIdToProductId = {};

    backupData.forEach(product => {
        const productId = product.$id || product.id;
        const images = product.images || [];
        images.forEach(url => {
            // Extract ID from Appwrite URL: .../files/[ID]/view...
            const match = url.match(/\/files\/([^\/]+)\/view/);
            if (match) {
                fileIdToProductId[match[1]] = productId;
            }
        });
    });

    console.log(`Loaded mapping for ${Object.keys(fileIdToProductId).length} Appwrite image IDs.`);

    if (!fs.existsSync(UNASSIGNED_DIR)) {
        console.log('Unassigned directory not found.');
        return;
    }

    const files = fs.readdirSync(UNASSIGNED_DIR);
    console.log(`Found ${files.length} files in unassigned.`);

    const updates = {}; // { productId: [newPaths] }

    files.forEach(file => {
        // Filename pattern usually: [AppwriteID]-[OriginalName]
        const firstDash = file.indexOf('-');
        if (firstDash === -1) return;

        const appwriteId = file.substring(0, firstDash);
        const productId = fileIdToProductId[appwriteId];

        if (productId) {
            const ext = path.extname(file);
            const newFileName = `${productId}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
            const oldPath = path.join(UNASSIGNED_DIR, file);
            const newPath = path.join(DEST_DIR, newFileName);

            try {
                fs.renameSync(oldPath, newPath);
                if (!updates[productId]) updates[productId] = [];
                updates[productId].push(`/products/${newFileName}`);
            } catch (e) {
                console.error(`Error moving ${file}:`, e.message);
            }
        }
    });

    console.log(`Moved images for ${Object.keys(updates).length} products.`);

    // Update D1
    console.log('Fetching current products from D1 to avoid overwriting...');
    const productsRaw = execSync(`npx wrangler d1 execute ${DB_NAME} --command "SELECT id, images FROM products" --json --remote`).toString();
    const d1Products = JSON.parse(productsRaw)[0].results;

    const d1Map = {};
    d1Products.forEach(p => d1Map[p.id] = JSON.parse(p.images || '[]'));

    let sqlStatements = [];
    for (const productId in updates) {
        if (!d1Map[productId]) {
            console.log(`Warning: Product ${productId} not found in D1.`);
            continue;
        }

        const currentImages = d1Map[productId];
        const newImages = [...new Set([...currentImages, ...updates[productId]])];

        if (JSON.stringify(currentImages) !== JSON.stringify(newImages)) {
            const imagesStr = JSON.stringify(newImages).replace(/'/g, "''");
            sqlStatements.push(`UPDATE products SET images = '${imagesStr}' WHERE id = '${productId}';`);
        }
    }

    if (sqlStatements.length === 0) {
        console.log('No database updates needed.');
        return;
    }

    console.log(`Executing ${sqlStatements.length} updates to D1...`);
    const chunkSize = 50;
    for (let i = 0; i < sqlStatements.length; i += chunkSize) {
        const chunk = sqlStatements.slice(i, i + chunkSize);
        const batchSql = chunk.join('\n');
        fs.writeFileSync('temp_migrate.sql', batchSql);
        console.log(`Running batch ${Math.floor(i / chunkSize) + 1}...`);
        execSync(`npx wrangler d1 execute ${DB_NAME} --file=temp_migrate.sql --remote`);
    }

    if (fs.existsSync('temp_migrate.sql')) fs.unlinkSync('temp_migrate.sql');
    console.log('Migration complete!');
}

run().catch(console.error);
