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
const TEMP_DIR = './temp-images';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

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
    const log = [];
    const l = (msg) => { console.log(msg); log.push(msg); };

    l('=== Fix remaining products from git history ===\n');

    // 1. Get products that still have LOCAL paths or are EMPTY
    l('Fetching products...');
    const products = await getAllProducts();
    const needsFix = products.filter(p => {
        const imgs = p.images || [];
        if (imgs.length === 0 && p.name !== 'System Settings') return true;
        return imgs.length > 0 && !imgs[0]?.includes('appwrite.io');
    });
    l(`Products still needing fix: ${needsFix.length}`);
    needsFix.forEach(p => l(`  - ${p.name} (${p.category}): ${(p.images || []).join(', ')}`));

    if (needsFix.length === 0) {
        l('\nAll products already have Appwrite URLs! Nothing to do.');
        fs.writeFileSync('fix-remaining-report.txt', log.join('\n'), 'utf8');
        return;
    }

    // 2. Create temp dir for extracting images from git
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

    // 3. For each product, extract its images from git commit and upload
    let updatedCount = 0;
    let failedCount = 0;
    const uploadCache = new Map();

    for (const product of needsFix) {
        const localImages = product.images || [];
        const uniqueImages = [...new Set(localImages)];
        const newAppwriteUrls = [];

        l(`\nProcessing: ${product.name}`);

        for (const localPath of uniqueImages) {
            if (!localPath) continue;

            // Check cache
            if (uploadCache.has(localPath)) {
                newAppwriteUrls.push(uploadCache.get(localPath));
                continue;
            }

            // Extract file from git commit
            const gitPath = localPath.startsWith('/') ? `public${localPath}` : localPath;
            const fileName = path.basename(localPath);
            const tempFile = path.join(TEMP_DIR, fileName);

            try {
                // Use git show to extract the file from the old commit
                execSync(`git show ${COMMIT}:"${gitPath}" > "${tempFile}"`, {
                    cwd: process.cwd(),
                    stdio: 'pipe'
                });

                // Check if file was actually extracted (not empty)
                const stat = fs.statSync(tempFile);
                if (stat.size < 100) {
                    l(`  WARNING: File too small, likely not found in git: ${gitPath}`);
                    continue;
                }

                // Upload to Appwrite
                const fileId = await uploadFile(tempFile, fileName);
                const url = buildUrl(fileId);
                newAppwriteUrls.push(url);
                uploadCache.set(localPath, url);
                l(`  Uploaded: ${fileName} -> ${fileId}`);

                // Clean up temp file
                fs.unlinkSync(tempFile);

                await new Promise(r => setTimeout(r, 200));
            } catch (err) {
                l(`  ERROR: ${fileName}: ${err.message.substring(0, 100)}`);
            }
        }

        // Update DB
        if (newAppwriteUrls.length > 0) {
            try {
                await databases.updateDocument(
                    DATABASE_ID, COLLECTION_ID, product.$id,
                    { images: newAppwriteUrls }
                );
                l(`  DB Updated with ${newAppwriteUrls.length} URLs`);
                updatedCount++;
            } catch (err) {
                l(`  DB ERROR: ${err.message}`);
                failedCount++;
            }
        } else {
            l(`  SKIPPED (no images found in git)`);
            failedCount++;
        }
    }

    // Cleanup
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true });

    l(`\n=== Summary ===`);
    l(`Updated: ${updatedCount}`);
    l(`Failed: ${failedCount}`);
    l(`Unique files uploaded: ${uploadCache.size}`);

    fs.writeFileSync('fix-remaining-report.txt', log.join('\n'), 'utf8');
}

main().catch(err => console.error('Fatal:', err));
