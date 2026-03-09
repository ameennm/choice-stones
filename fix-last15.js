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

const databases = new Databases(client);

function buildUrl(fileId) {
    return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}

// Manual mapping: product name -> bucket file IDs (from bucket-files.json analysis)
// These are the best matches from the descriptive filenames in the bucket
const bucketFiles = JSON.parse(fs.readFileSync('bucket-files.json', 'utf8'));

function findFiles(keywords) {
    return bucketFiles.filter(f =>
        keywords.some(kw => f.name.toLowerCase().includes(kw.toLowerCase()))
    );
}

// Build manual mappings based on bucket file analysis
const manualMap = {
    'Granite Stone Pillar': findFiles(['jodhpur-stone-pillar', 'stone-pillar']),
    'Garden Stone Bench': findFiles(['bench', 'garden-stone', 'a576d212']),  // generic stone image
    'Stone Table and Chair': findFiles(['table', 'chair', '45073']),
    '25mm Green': findFiles(['50mm-artificial-green-grass']).slice(0, 1),  // reuse grass images
    '35mm Green': findFiles(['50mm-artificial-green-grass']).slice(1, 2),
    '40mm Green': findFiles(['50mm-artificial-green-grass']).slice(2, 3),
    '40mm Mix': findFiles(['50mm-artificial-green-grass']).slice(3, 4),
    '50mm Green': findFiles(['50mm-artificial-green-grass']).slice(4, 5),
    // For panels and waterfalls, use OIP images as they were likely generic stone images
    'Waterfall Black': findFiles(['OIP']).slice(0, 1),
    'Waterfall Autumn': findFiles(['OIP']).slice(1, 2),
    'Panel Restik Black': findFiles(['OIP']).slice(2, 3),
    'Panel 3D Mix': findFiles(['OIP']).slice(3, 4),
    'Panel Indian Autumn': findFiles(['OIP']).slice(4, 5),
    'Panel Green Restik': findFiles(['OIP']).slice(5, 6),
    'Panel L Black': findFiles(['aacba5bc']),
};

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
    const l = (msg) => { console.log(msg); log.push(msg); };

    l('=== Fix last 15 products with bucket file matching ===\n');

    const products = await getAllProducts();
    const needsFix = products.filter(p => {
        const imgs = p.images || [];
        if (p.name === 'System Settings') return false;
        if (imgs.length === 0) return true;
        return !imgs[0]?.includes('appwrite.io');
    });

    l(`Products needing fix: ${needsFix.length}\n`);

    let updated = 0;
    let failed = 0;

    for (const product of needsFix) {
        const matchedFiles = manualMap[product.name];

        if (matchedFiles && matchedFiles.length > 0) {
            const urls = matchedFiles.map(f => buildUrl(f.id));
            l(`${product.name}: Found ${urls.length} matching file(s)`);

            try {
                await databases.updateDocument(
                    DATABASE_ID, COLLECTION_ID, product.$id,
                    { images: urls }
                );
                l(`  Updated DB`);
                updated++;
            } catch (err) {
                l(`  ERROR: ${err.message}`);
                failed++;
            }
        } else {
            l(`${product.name}: No matching files found - will show placeholder`);
            // Clear the broken local paths so placeholder shows instead of broken images
            try {
                await databases.updateDocument(
                    DATABASE_ID, COLLECTION_ID, product.$id,
                    { images: [] }
                );
                l(`  Cleared broken paths`);
            } catch (err) {
                l(`  ERROR clearing: ${err.message}`);
            }
            failed++;
        }
    }

    l(`\n=== Summary ===`);
    l(`Updated with images: ${updated}`);
    l(`No images available: ${failed}`);

    fs.writeFileSync('fix-last15-report.txt', log.join('\n'), 'utf8');
}

main().catch(err => console.error(err));
