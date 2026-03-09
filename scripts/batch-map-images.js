import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SOURCE_DIRS = [
    'public/products',
    'public/products/unassigned',
    'paving stone images',
    'pebble stone images'
];
const DB_NAME = 'choice-db';
const TARGET_DIR = 'public/products';

async function run() {
    console.log('Fetching products from D1...');
    const productsRaw = execSync(`npx wrangler d1 execute ${DB_NAME} --command "SELECT id, name, images FROM products" --json --remote`).toString();
    const products = JSON.parse(productsRaw)[0].results;

    console.log(`Found ${products.length} products.`);

    const productMap = {};
    products.forEach(p => {
        productMap[p.id] = {
            id: p.id,
            name: p.name,
            currentImages: JSON.parse(p.images || '[]'),
            newImages: []
        };
    });

    let matchedCount = 0;
    let movedCount = 0;
    let unmatched = [];

    SOURCE_DIRS.forEach(dir => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
        console.log(`Scanning ${files.length} images in ${dir}...`);

        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            const base = path.basename(file, ext);

            let matchedProductId = null;

            // Try slugified versions
            let slugs = [
                base,
                base.replace(/-\d+$/, ''),
                base.toLowerCase(),
                base.toLowerCase().replace(/-\d+$/, ''),
                base.replace(/ /g, '-').toLowerCase().replace(/-\d+$/, ''),
                base.replace(/_/g, '-').toLowerCase().replace(/-\d+$/, '')
            ];

            // Specific patterns for the project
            if (dir === 'paving stone images') slugs.push(`paving-${base}`, `paving-${base.toLowerCase()}`);
            if (dir === 'pebble stone images') slugs.push(`pebble-${base}`, `pebble-${base.toLowerCase()}`);

            // Try to find the product ID
            for (let slug of slugs) {
                if (productMap[slug]) {
                    matchedProductId = slug;
                    break;
                }
            }

            if (!matchedProductId) {
                // Try fuzzy matching by product name slug
                for (const id in productMap) {
                    const p = productMap[id];
                    const nameSlug = p.name.toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[^\w-]/g, '')
                        .replace(/-+/g, '-');

                    if (slugs.includes(nameSlug)) {
                        matchedProductId = id;
                        break;
                    }
                }
            }

            if (matchedProductId) {
                const p = productMap[matchedProductId];
                let finalFileName = file;

                // Move if it's in a source folder that isn't the target dir
                if (dir !== TARGET_DIR) {
                    finalFileName = `${matchedProductId}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
                    try {
                        fs.renameSync(path.join(dir, file), path.join(TARGET_DIR, finalFileName));
                        movedCount++;
                    } catch (e) {
                        console.error(`Failed to move ${file}: ${e.message}`);
                    }
                }

                const relativePath = `/products/${finalFileName}`;
                if (!p.newImages.includes(relativePath) && !p.currentImages.includes(relativePath)) {
                    p.newImages.push(relativePath);
                }
                matchedCount++;
            } else {
                unmatched.push(`${dir}/${file}`);
            }
        });
    });

    console.log(`Matched ${matchedCount} images. Moved ${movedCount} to ${TARGET_DIR}.`);
    console.log(`Unmatched ${unmatched.length} images.`);

    // Prepare SQL Batch
    let sqlStatements = [];
    for (const id in productMap) {
        const p = productMap[id];
        // Combine old and new (avoid duplicates)
        const allImages = [...new Set([...p.currentImages, ...p.newImages])];
        if (allImages.length > 0 && JSON.stringify(allImages) !== JSON.stringify(p.currentImages)) {
            const imagesStr = JSON.stringify(allImages).replace(/'/g, "''");
            sqlStatements.push(`UPDATE products SET images = '${imagesStr}' WHERE id = '${id}';`);
        }
    }

    if (sqlStatements.length === 0) {
        console.log('No updates needed.');
        return;
    }

    console.log(`Executing ${sqlStatements.length} updates...`);

    // Split into chunks to avoid command length limits
    const chunkSize = 50;
    for (let i = 0; i < sqlStatements.length; i += chunkSize) {
        const chunk = sqlStatements.slice(i, i + chunkSize);
        const batchSql = chunk.join('\n');
        fs.writeFileSync('temp_batch.sql', batchSql);

        console.log(`Running batch ${Math.floor(i / chunkSize) + 1}...`);
        execSync(`npx wrangler d1 execute ${DB_NAME} --file=temp_batch.sql --remote`);
    }

    if (fs.existsSync('temp_batch.sql')) fs.unlinkSync('temp_batch.sql');
    console.log('Done!');
}

run().catch(console.error);
