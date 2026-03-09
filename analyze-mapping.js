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
    const l = (msg) => { log.push(msg); };

    l('=== Analyze file upload patterns for product mapping ===\n');

    const allFiles = await getAllFiles();
    allFiles.sort((a, b) => a.$id.localeCompare(b.$id));

    // Filter to ORIGINAL files only (exclude my uploads today which start with 69a3)
    const originalFiles = allFiles.filter(f => !f.$id.startsWith('69a3'));
    l(`Original files (pre-fix): ${originalFiles.length}`);

    // Separate numeric product images from catalog/other images
    const numericFiles = originalFiles.filter(f => /^\d+\.(jpg|jpeg|png|webp)$/i.test(f.name));
    const imgCatalogFiles = originalFiles.filter(f => /^img\d+\./i.test(f.name));

    l(`Numeric product images: ${numericFiles.length}`);
    l(`img[N] catalog images: ${imgCatalogFiles.length}`);

    // Group numeric files by time proximity
    // Files uploaded within 30 seconds of each other are in the same batch
    const batches = [];
    let currentBatch = [];

    numericFiles.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));

    for (let i = 0; i < numericFiles.length; i++) {
        const file = numericFiles[i];
        if (currentBatch.length === 0) {
            currentBatch.push(file);
        } else {
            const prevTime = new Date(currentBatch[currentBatch.length - 1].$createdAt);
            const currTime = new Date(file.$createdAt);
            const gapSec = (currTime - prevTime) / 1000;

            if (gapSec <= 30) {
                // Same batch
                currentBatch.push(file);
            } else {
                // New batch
                batches.push(currentBatch);
                currentBatch = [file];
            }
        }
    }
    if (currentBatch.length > 0) batches.push(currentBatch);

    l(`\nBatches found: ${batches.length}`);
    l('');
    batches.forEach((batch, i) => {
        l(`Batch ${i}: ${batch.length} files (${batch[0].$createdAt} - ${batch[batch.length - 1].$createdAt})`);
        batch.forEach(f => l(`  ${f.name} [${f.$id}]`));
    });

    // Get products in creation order
    const products = await getAllProducts();
    products.sort((a, b) => a.$createdAt.localeCompare(b.$createdAt));
    const realProducts = products.filter(p => p.name !== 'System Settings');

    l(`\nProducts: ${realProducts.length}`);

    fs.writeFileSync('batch-analysis.txt', log.join('\n'), 'utf8');
    console.log(`Analysis written to batch-analysis.txt (${batches.length} batches for ${realProducts.length} products)`);
}

main().catch(err => console.error(err));
