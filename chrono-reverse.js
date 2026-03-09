import { Client, Databases, Storage, Query } from 'node-appwrite';
import fs from 'fs';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const BUCKET_ID = '698b48890012634c5cd7';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);
const storage = new Storage(client);

function buildUrl(fileId) {
    return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}

async function getAllFiles() {
    let all = [], cursor = null;
    while (true) {
        const q = [Query.limit(100)];
        if (cursor) q.push(Query.cursorAfter(cursor));
        const r = await storage.listFiles(BUCKET_ID, q);
        all.push(...r.files);
        if (r.files.length < 100) break;
        cursor = r.files[r.files.length - 1].$id;
    }
    return all;
}

async function getAllProducts() {
    let all = [], cursor = null;
    while (true) {
        const q = [Query.limit(100)];
        if (cursor) q.push(Query.cursorAfter(cursor));
        const r = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, q);
        all.push(...r.documents);
        if (r.documents.length < 100) break;
        cursor = r.documents[r.documents.length - 1].$id;
    }
    return all;
}

async function main() {
    const log = [];
    const l = (msg) => { console.log(msg); log.push(msg); };

    l('=== REVERSE Chronological Auto-Mapping ===\n');

    // 1. Get all products sorted by creation date (Oldest first)
    const products = await getAllProducts();
    products.sort((a, b) => a.$createdAt.localeCompare(b.$createdAt));
    const realProducts = products.filter(p => p.name !== 'System Settings');

    // 2. SAVE BACKUP
    const backup = realProducts.map(p => ({
        id: p.$id,
        name: p.name,
        category: p.category,
        images: [...(p.images || [])]
    }));
    fs.writeFileSync('images-backup.json', JSON.stringify(backup, null, 2), 'utf8');

    // 3. Get ALL original files
    const allFiles = await getAllFiles();
    const originalFiles = allFiles
        .filter(f => !f.$id.startsWith('69a3'))
        .filter(f => /^\d+\.(jpg|jpeg|png|webp)$/i.test(f.name))
        // SORT IMAGES IN REVERSE ORDER (Newest first)
        .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

    // 4. Assign 4 files to each product
    let fileIndex = 0;
    let updatedCount = 0;

    for (let i = 0; i < realProducts.length; i++) {
        const product = realProducts[i];

        const assignedFiles = [];
        // Optional: The reversing might also mean the order OF the 4 images is backward. 
        // We'll just grab the next 4 and assign.
        for (let j = 0; j < 4 && fileIndex < originalFiles.length; j++) {
            assignedFiles.push(originalFiles[fileIndex]);
            fileIndex++;
        }

        if (assignedFiles.length === 0) continue;

        // If the grouping of 4 itself was in normal order but sets were reverse, 
        // we might need to reverse the assignedFiles array. We'll reverse it so [1,2,3,4] instead of [4,3,2,1]
        assignedFiles.reverse();

        const newUrls = assignedFiles.map(f => buildUrl(f.$id));

        try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, product.$id, {
                images: newUrls
            });
            l(`${product.name}: ${assignedFiles.length} images assigned`);
            updatedCount++;
        } catch (err) {
            l(`${product.name}: ERROR - ${err.message.substring(0, 60)}`);
        }
    }

    l(`\n=== Summary ===`);
    l(`Updated: ${updatedCount}`);
}

main().catch(err => console.error('Fatal:', err));
