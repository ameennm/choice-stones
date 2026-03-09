import { Client, Databases, Storage, Query, Permission, Role } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const BUCKET_ID = '698b48890012634c5cd7';
const PUBLIC_DIR = './public/products';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

function buildUrl(fileId) {
    return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}

async function uploadFile(filePath, fileName) {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append('fileId', 'unique()');
    formData.append('file', blob, fileName);
    formData.append('permissions[]', 'read("any")');

    const response = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files`, {
        method: 'POST',
        headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY,
        },
        body: formData
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Upload failed: ${response.status} ${err}`);
    }

    const data = await response.json();
    return data.$id;
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
    const log = (msg) => { console.log(msg); logLines.push(msg); };
    const logLines = [];

    log('=== Upload local images to Appwrite & update DB ===\n');

    // Get all products
    log('Fetching all products...');
    const products = await getAllProducts();
    log(`Total: ${products.length}\n`);

    // Filter products with LOCAL paths (not Appwrite URLs)
    const localProducts = products.filter(p => {
        const imgs = p.images || [];
        return imgs.length > 0 && !imgs[0]?.includes('appwrite.io');
    });

    log(`Products with local paths to fix: ${localProducts.length}\n`);

    let updatedCount = 0;
    let failedCount = 0;
    const uploadCache = new Map(); // local path -> appwrite url (avoid re-uploading same file)

    for (const product of localProducts) {
        const localImages = product.images || [];
        const newAppwriteUrls = [];
        let success = true;

        log(`Processing: ${product.name} (${product.category}) - ${localImages.length} images`);

        // Remove duplicates from the image list
        const uniqueImages = [...new Set(localImages)];

        for (const localPath of uniqueImages) {
            if (!localPath) continue;

            // Check if we already uploaded this file
            if (uploadCache.has(localPath)) {
                newAppwriteUrls.push(uploadCache.get(localPath));
                continue;
            }

            // Build local file path (remove leading /)
            const fileName = localPath.replace(/^\/products\//, '');
            const fullPath = path.join(PUBLIC_DIR, fileName);

            if (!fs.existsSync(fullPath)) {
                log(`  WARNING: File not found: ${fullPath}`);
                success = false;
                continue;
            }

            try {
                const fileId = await uploadFile(fullPath, fileName);
                const appwriteUrl = buildUrl(fileId);
                newAppwriteUrls.push(appwriteUrl);
                uploadCache.set(localPath, appwriteUrl);
                log(`  Uploaded: ${fileName} -> ${fileId}`);

                // Small delay to avoid rate limits
                await new Promise(r => setTimeout(r, 200));
            } catch (err) {
                log(`  ERROR uploading ${fileName}: ${err.message}`);
                success = false;
            }
        }

        // Update product in DB with new Appwrite URLs
        if (newAppwriteUrls.length > 0) {
            try {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    product.$id,
                    { images: newAppwriteUrls }
                );
                log(`  DB Updated with ${newAppwriteUrls.length} Appwrite URLs`);
                updatedCount++;
            } catch (err) {
                log(`  ERROR updating DB: ${err.message}`);
                failedCount++;
            }
        } else {
            log(`  SKIPPED (no images to upload)`);
            failedCount++;
        }
    }

    log(`\n=== Summary ===`);
    log(`Updated: ${updatedCount}`);
    log(`Failed: ${failedCount}`);
    log(`Upload cache (unique files uploaded): ${uploadCache.size}`);
    log(`\nDone! All products should now use Appwrite Storage URLs.`);

    fs.writeFileSync('upload-report.txt', logLines.join('\n'), 'utf8');
}

main().catch(err => console.error('Fatal:', err));
