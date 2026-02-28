import { Client, Databases, Query } from 'node-appwrite';
import { products as localProducts } from './src/data/products.js';

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

async function formatAppwriteImages() {
    console.log('Fetching ALL products from Appwrite...');
    try {
        let appwriteProducts = [];
        let cursor = null;
        let hasMore = true;

        while (hasMore) {
            const queries = [Query.limit(100)];
            if (cursor) {
                queries.push(Query.cursorAfter(cursor));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                queries
            );

            appwriteProducts.push(...response.documents);

            if (response.documents.length < 100) {
                hasMore = false;
            } else {
                cursor = response.documents[response.documents.length - 1].$id;
            }
        }

        console.log(`Found ${appwriteProducts.length} total products in Appwrite.`);

        // Build a lookup map of local products
        const localMap = new Map();
        localProducts.forEach(p => localMap.set(p.id, p));

        let updatedCount = 0;

        for (const doc of appwriteProducts) {
            // Match against our local source of truth
            const localMatch = localMap.get(doc.$id) || localMap.get(doc.id) || localProducts.find(lp => lp.name === doc.name);

            if (localMatch) {
                const localImages = localMatch.images || [];
                const isDifferent = JSON.stringify(doc.images) !== JSON.stringify(localImages);

                if (isDifferent) {
                    console.log(`Updating ${localMatch.name} images...`);
                    await databases.updateDocument(
                        DATABASE_ID,
                        COLLECTION_ID,
                        doc.$id,
                        {
                            images: localImages
                        }
                    );
                    updatedCount++;
                }
            } else {
                console.log(`Warning: Could not find local frontend data for Appwrite item: ${doc.name}`);
            }
        }

        console.log(`\n✅ Finished! Updated ${updatedCount} products to use frontend images.`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

formatAppwriteImages();
