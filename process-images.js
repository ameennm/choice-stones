import { createWorker } from 'tesseract.js';
import stringSimilarity from 'string-similarity';
import { Client, Databases, Storage, ID, Query, Permission, Role } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const BUCKET_ID = '698b48890012634c5cd7';

const IMAGES_DIR = './cladding stones images';

// Setup Appwrite
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function main() {
    console.log('🚀 Starting Image Processing...');

    // 1. Fetch products
    console.log('Fetching products...');
    let products = [];
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(500)]);
        products = response.documents;
        console.log(`Loaded ${products.length} products.`);
    } catch (e) {
        console.error('Failed to fetch products:', e.message);
        return;
    }
    const productNames = products.map(p => p.name);

    // 2. Tesseract Worker
    const worker = await createWorker('eng');

    // 3. Process Images
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`Directory not found: ${IMAGES_DIR}`);
        return;
    }
    const files = fs.readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    console.log(`Found ${files.length} images.`);

    for (const file of files) {
        const filePath = path.join(IMAGES_DIR, file);
        console.log(`\nProcessing: ${file}...`);

        try {
            // OCR
            const { data: { text } } = await worker.recognize(filePath);
            const cleanText = text.replace(/\s+/g, ' ').trim();

            // Fuzzy Match
            const matches = stringSimilarity.findBestMatch(cleanText, productNames);
            const bestMatch = matches.bestMatch;

            console.log(`   OCR: "${cleanText.substring(0, 50)}..."`);
            console.log(`   Match: "${bestMatch.target}" (${(bestMatch.rating * 100).toFixed(1)}%)`);

            if (bestMatch.rating > 0.4) {
                const matchedProduct = products.find(p => p.name === bestMatch.target);
                console.log(`   ✅ Matched: ${matchedProduct.name}`);

                // Upload
                console.log(`   Uploading...`);
                // Use stream instead of InputFile
                const uploadedFile = await storage.createFile(
                    BUCKET_ID,
                    ID.unique(),
                    fs.createReadStream(filePath), // Stream
                    [
                        Permission.read(Role.any()),
                        Permission.write(Role.users())
                    ]
                );

                const fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;

                // Update Product
                const currentImages = matchedProduct.images || [];
                const newImages = [...currentImages, fileUrl];

                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    matchedProduct.$id,
                    { images: newImages }
                );
                console.log(`   🎉 Updated!`);

            } else {
                console.log(`   ⚠️ No match.`);
            }

        } catch (err) {
            console.error(`   ❌ Error:`, err.message);
        }
    }

    await worker.terminate();
    console.log('\n✅ Done!');
}

main();
