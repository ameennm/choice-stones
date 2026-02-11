import fs from 'node:fs';
import path from 'path';
import stringSimilarity from 'string-similarity';
import { Client, Databases, Query } from 'node-appwrite';

// --- CONFIGURATION ---
const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const BUCKET_ID = '698b48890012634c5cd7';

const IMAGES_DIR = './cladding stones images';
const LIST_FILE = './product-list.txt';

// Appwrite only for Database operations
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function uploadFileFetch(filePath, fileName) {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append('fileId', 'unique()');
    formData.append('file', blob, fileName);
    // Permissions
    formData.append('permissions[]', 'read("any")');
    formData.append('permissions[]', 'write("users")');

    const response = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files`, {
        method: 'POST',
        headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY, // API Key required for server-side upload
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

async function main() {
    console.log('🚀 Starting Image Assignment with Native Fetch...');

    // 1. Parse List
    const listContent = fs.readFileSync(LIST_FILE, 'utf-8');
    const productMap = new Map();
    const lines = listContent.split('\n');
    let maxItemNum = 0;

    for (const line of lines) {
        const match = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*/);
        if (match) {
            const num = parseInt(match[1]);
            const name = match[2].trim();
            productMap.set(num, name);
            if (num > maxItemNum) maxItemNum = num;
        }
    }
    console.log(`Parsed ${productMap.size} items from list.`);

    // 2. Fetch DB Products
    console.log('Fetching DB products...');
    let dbProducts = [];
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(500)]);
        dbProducts = response.documents;
    } catch (e) {
        console.error('DB Fetch Error:', e.message);
        return;
    }
    const dbProductNames = dbProducts.map(p => p.name);

    // 3. Process Images
    const files = fs.readdirSync(IMAGES_DIR)
        .filter(f => /^img(\d+)\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => {
            const num = parseInt(f.match(/^img(\d+)\./)[1]);
            return { file: f, num };
        })
        .sort((a, b) => a.num - b.num);

    console.log(`Found ${files.length} images.`);

    for (let i = 0; i < files.length; i++) {
        const current = files[i];
        const next = files[i + 1];
        const startNum = current.num;
        const endNum = next ? next.num - 1 : maxItemNum;

        console.log(`\nProcessing ${current.file} (Items ${startNum} - ${endNum})...`);

        let fileUrl;
        try {
            const fileId = await uploadFileFetch(path.join(IMAGES_DIR, current.file), current.file);
            fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
            console.log(`   Uploaded: ${fileUrl}`);
        } catch (err) {
            console.error(`   ❌ Upload Error:`, err.message);
            continue;
        }

        // Assign to Items
        for (let itemNum = startNum; itemNum <= endNum; itemNum++) {
            const listName = productMap.get(itemNum);
            if (!listName) continue;

            // Fuzzy Match
            const matches = stringSimilarity.findBestMatch(listName, dbProductNames);
            const bestMatch = matches.bestMatch;

            if (bestMatch.rating > 0.6) {
                const dbProduct = dbProducts.find(p => p.name === bestMatch.target);
                console.log(`   Ref: "${listName}" -> DB: "${dbProduct.name}" (${(bestMatch.rating * 100).toFixed(0)}%)`);

                try {
                    const currentImages = dbProduct.images || [];
                    if (!currentImages.includes(fileUrl)) {
                        await databases.updateDocument(
                            DATABASE_ID,
                            COLLECTION_ID,
                            dbProduct.$id,
                            { images: [...currentImages, fileUrl] }
                        );
                        console.log(`      ✅ Updated Product`);
                    } else {
                        console.log(`      (Skip duplicate)`);
                    }
                } catch (uErr) {
                    console.error(`      ❌ DB Update Error:`, uErr.message);
                }
            } else {
                console.log(`   ⚠️ No match for "${listName}" (Best: ${bestMatch.target} ${Math.floor(bestMatch.rating * 100)}%)`);
            }
        }
    }
    console.log('\n✅ Done!');
}

main();
