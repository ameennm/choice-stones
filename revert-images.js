import { Client, Databases } from 'node-appwrite';
import fs from 'fs';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

async function main() {
    if (!fs.existsSync('images-backup.json')) {
        console.error('No backup file found! Cannot revert.');
        process.exit(1);
    }

    const backup = JSON.parse(fs.readFileSync('images-backup.json', 'utf8'));
    console.log(`Reverting ${backup.length} products to backup state...\n`);

    let count = 0;
    for (const item of backup) {
        try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, item.id, {
                images: item.images
            });
            console.log(`Reverted: ${item.name} (${item.images.length} images)`);
            count++;
        } catch (err) {
            console.error(`ERROR: ${item.name}: ${err.message}`);
        }
    }

    console.log(`\nDone! Reverted ${count} products.`);
}

main().catch(err => console.error(err));
