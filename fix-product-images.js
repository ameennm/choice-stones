import * as appwrite from 'node-appwrite';
const { Client, Databases, Query } = appwrite;

// --- CONFIGURATION ---
const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function main() {
    console.log('🚀 Starting Image Reordering...');

    let products = [];
    try {
        // Fetch all products (limit 500)
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(500)]
        );
        products = response.documents;
        console.log(`Loaded ${products.length} products.`);
    } catch (e) {
        console.error('Failed to fetch products:', e.message);
        return;
    }

    let updatedCount = 0;

    for (const product of products) {
        const images = product.images || [];
        if (images.length === 0) continue;

        // Separate Real (Appwrite) and Placeholder images
        const realImages = [];
        const placeholders = [];

        for (const img of images) {
            if (img && img.includes('appwrite.io')) {
                realImages.push(img);
            } else {
                placeholders.push(img);
            }
        }

        // If we have real images and they are NOT already at the front
        if (realImages.length > 0) {
            // Check if reordering is needed
            // If the first image is NOT a real image, OR if we simply want to ensure all real images are first
            const newOrder = [...realImages, ...placeholders];

            // Check if order changed
            const isChanged = JSON.stringify(newOrder) !== JSON.stringify(images);

            if (isChanged) {
                console.log(`Ordering images for: ${product.name}`);
                try {
                    await databases.updateDocument(
                        DATABASE_ID,
                        COLLECTION_ID,
                        product.$id,
                        { images: newOrder }
                    );
                    updatedCount++;
                } catch (err) {
                    console.error(`   ❌ Failed to update ${product.name}:`, err.message);
                }
            }
        }
    }

    console.log(`\n✅ Processed all products. Updated ${updatedCount} products.`);
}

main();
