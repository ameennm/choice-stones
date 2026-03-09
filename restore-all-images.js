import { Client, Databases, Query } from 'node-appwrite';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const BUCKET_ID = '698b48890012634c5cd7';
const COMMIT = '161a476';
const TEMP_DIR = './temp-restore';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

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
        headers: { 'X-Appwrite-Project': PROJECT_ID, 'X-Appwrite-Key': API_KEY },
        body: formData
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return (await response.json()).$id;
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

// Import the local products.js to get the image path mapping per product
import { products as localProducts } from './src/data/products.js';

async function main() {
    const log = [];
    const l = (msg) => { console.log(msg); log.push(msg); };

    l('=== Restore ALL 4 images per product from git ===\n');

    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

    // 1. Get list of ALL files in git commit
    const gitFilesRaw = execSync(`git diff --name-only 2e088aa ${COMMIT}`, { encoding: 'utf8' });
    const gitFiles = gitFilesRaw.split('\n').filter(f => f.startsWith('public/products/')).map(f => f.trim());
    l(`Files in git commit: ${gitFiles.length}`);

    // 2. Get all products from DB
    const dbProducts = await getAllProducts();
    l(`Products in DB: ${dbProducts.length}\n`);

    // 3. Build mapping: for each DB product, find matching local product to get image paths
    const uploadCache = new Map(); // local path -> appwrite url
    let updatedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const dbProd of dbProducts) {
        if (dbProd.name === 'System Settings') continue;

        // Find matching local product
        const localProd = localProducts.find(lp =>
            lp.name === dbProd.name ||
            lp.id === dbProd.$id
        );

        if (!localProd) {
            // Products not in local data (added directly in admin) - skip if already has images
            if (dbProd.images?.length > 0 && dbProd.images[0]?.includes('appwrite.io')) {
                skippedCount++;
                continue;
            }
            l(`SKIP: ${dbProd.name} - not in local products.js, already has ${dbProd.images?.length || 0} images`);
            skippedCount++;
            continue;
        }

        const localImages = localProd.images || [];
        if (localImages.length === 0) {
            skippedCount++;
            continue;
        }

        // Check if any of these images exist in git
        const newUrls = [];
        let allFromCache = true;

        for (const imgPath of localImages) {
            if (!imgPath) continue;

            // Check cache first
            if (uploadCache.has(imgPath)) {
                newUrls.push(uploadCache.get(imgPath));
                continue;
            }

            allFromCache = false;
            const gitPath = `public${imgPath}`;
            const fileName = path.basename(imgPath);
            const tempFile = path.join(TEMP_DIR, fileName);

            // Check if file exists in git
            if (!gitFiles.includes(gitPath)) {
                // File not in git commit, check if it exists locally already
                const localFile = path.join('public/products', fileName);
                if (fs.existsSync(localFile)) {
                    try {
                        const fileId = await uploadFile(localFile, fileName);
                        const url = buildUrl(fileId);
                        newUrls.push(url);
                        uploadCache.set(imgPath, url);
                        await new Promise(r => setTimeout(r, 100));
                    } catch (err) {
                        l(`  ERR uploading local ${fileName}: ${err.message.substring(0, 50)}`);
                    }
                }
                continue;
            }

            // Extract from git and upload
            try {
                execSync(`git show ${COMMIT}:"${gitPath}" > "${tempFile}"`, { stdio: 'pipe' });
                const stat = fs.statSync(tempFile);
                if (stat.size < 100) { fs.unlinkSync(tempFile); continue; }

                const fileId = await uploadFile(tempFile, fileName);
                const url = buildUrl(fileId);
                newUrls.push(url);
                uploadCache.set(imgPath, url);
                fs.unlinkSync(tempFile);
                await new Promise(r => setTimeout(r, 100));
            } catch (err) {
                // silently skip
            }
        }

        if (newUrls.length > 0) {
            try {
                await databases.updateDocument(DATABASE_ID, COLLECTION_ID, dbProd.$id, { images: newUrls });
                l(`${dbProd.name}: ${newUrls.length} images`);
                updatedCount++;
            } catch (err) {
                l(`${dbProd.name}: DB ERROR: ${err.message.substring(0, 50)}`);
                failedCount++;
            }
        } else {
            skippedCount++;
        }
    }

    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true });

    l(`\n=== Summary ===`);
    l(`Updated: ${updatedCount}`);
    l(`Failed: ${failedCount}`);
    l(`Skipped (already good/not in local): ${skippedCount}`);
    l(`Unique images uploaded: ${uploadCache.size}`);

    fs.writeFileSync('restore-all-report.txt', log.join('\n'), 'utf8');
}

main().catch(err => console.error('Fatal:', err));
