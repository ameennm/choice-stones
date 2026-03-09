import { Client, Storage, Query } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import https from 'https';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const BUCKET_ID = '698b48890012634c5cd7';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const storage = new Storage(client);
const downloadDir = path.join(process.cwd(), 'public', 'products_appwrite');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

(async () => {
    try {
        let hasMore = true;
        let cursor = null;
        let files = [];

        console.log('Fetching file list from Appwrite Storage...');
        while (hasMore) {
            const queries = [Query.limit(100)];
            if (cursor) queries.push(Query.cursorAfter(cursor));

            const res = await storage.listFiles(BUCKET_ID, queries);
            files.push(...res.files);

            if (res.files.length < 100) hasMore = false;
            else cursor = res.files[res.files.length - 1].$id;
        }

        console.log(`Found ${files.length} files in bucket.`);

        for (const f of files) {
            const destPath = path.join(downloadDir, f.name);
            if (!fs.existsSync(destPath)) {
                console.log(`Downloading ${f.name}...`);
                const url = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${f.$id}/view?project=${PROJECT_ID}`;
                await downloadFile(url, destPath);
            }
        }
        console.log('✅ Done downloading images from Appwrite Storage!');

    } catch (e) {
        console.error(e);
    }
})();
