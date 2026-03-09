import { Client, Databases, Storage, Query } from 'node-appwrite';
import fs from 'fs';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const BUCKET_ID = '698b48890012634c5cd7';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const storage = new Storage(client);
const databases = new Databases(client);

async function getAllFiles() {
    let allFiles = [];
    let cursor = null;
    while (true) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const res = await storage.listFiles(BUCKET_ID, queries);
        allFiles.push(...res.files);
        if (res.files.length < 100) break;
        cursor = res.files[res.files.length - 1].$id;
    }
    return allFiles;
}

async function getAllProducts() {
    let all = [];
    let cursor = null;
    while (true) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
        all.push(...res.documents);
        if (res.documents.length < 100) break;
        cursor = res.documents[res.documents.length - 1].$id;
    }
    return all;
}

async function main() {
    const log = [];
    const l = (msg) => { log.push(msg); };

    const files = await getAllFiles();
    l(`Total files in bucket: ${files.length}`);

    // Categorize files
    const patterns = {};
    for (const f of files) {
        let pattern;
        if (/^img\d+\./i.test(f.name)) pattern = 'img[N] (cladding)';
        else if (/^paving-img/i.test(f.name)) pattern = 'paving-img*';
        else if (/^pebble-img/i.test(f.name)) pattern = 'pebble-img*';
        else if (/whatsapp/i.test(f.name)) pattern = 'WhatsApp';
        else if (/\.(jpeg|jpg|png|webp)$/i.test(f.name)) pattern = 'other-image';
        else pattern = 'unknown';
        if (!patterns[pattern]) patterns[pattern] = 0;
        patterns[pattern]++;
    }
    l('\nFile patterns:');
    for (const [p, c] of Object.entries(patterns)) l(`  ${p}: ${c}`);

    // Products
    const products = await getAllProducts();
    l(`\nTotal products: ${products.length}`);

    let appwriteCount = 0, localCount = 0, emptyCount = 0;
    for (const p of products) {
        const imgs = p.images || [];
        if (imgs.length === 0) emptyCount++;
        else if (imgs[0]?.includes('appwrite.io')) appwriteCount++;
        else localCount++;
    }
    l(`  Appwrite URLs: ${appwriteCount}`);
    l(`  Local paths: ${localCount}`);
    l(`  No images: ${emptyCount}`);

    // Show ALL products with their image status
    l('\n--- ALL PRODUCTS ---');
    for (const p of products) {
        const imgs = p.images || [];
        const status = imgs.length === 0 ? 'EMPTY' : (imgs[0]?.includes('appwrite.io') ? 'APPWRITE' : 'LOCAL');
        l(`${status} | ${p.category} | ${p.name} | imgs: ${imgs.length}`);
    }

    fs.writeFileSync('diagnose-report.txt', log.join('\n'), 'utf8');
    console.log('Report written to diagnose-report.txt');
}

main().catch(err => console.error(err));
