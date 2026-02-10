
import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a'; // Provided by user
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_NAME = 'ChoiceStonesDB';
const COLLECTION_NAME = 'products';
const BUCKET_ID = '698b48890012634c5cd7'; // Provided by user

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function setup() {
    try {
        console.log('🚀 Starting Appwrite Setup...');

        // 1. Create Database
        let dbId;
        try {
            const dbs = await databases.list();
            const existingDb = dbs.databases.find(db => db.name === DATABASE_NAME);
            if (existingDb) {
                dbId = existingDb.$id;
                console.log(`✅ Database "${DATABASE_NAME}" already exists: ${dbId}`);
            } else {
                const db = await databases.create('unique()', DATABASE_NAME);
                dbId = db.$id;
                console.log(`✅ Created Database "${DATABASE_NAME}": ${dbId}`);
            }
        } catch (error) {
            console.error('Error managing database:', error.message);
            return;
        }

        // 2. Create Products Collection
        let collectionId;
        try {
            const collections = await databases.listCollections(dbId);
            const existingCollection = collections.collections.find(c => c.name === COLLECTION_NAME);

            if (existingCollection) {
                collectionId = existingCollection.$id;
                console.log(`✅ Collection "${COLLECTION_NAME}" already exists: ${collectionId}`);
            } else {
                // Create collection with read permissions for everyone (any), write for admins
                const collection = await databases.createCollection(
                    dbId,
                    'unique()',
                    COLLECTION_NAME,
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()), // Authenticated users can create
                        Permission.update(Role.users()),
                        Permission.delete(Role.users())
                    ]
                );
                collectionId = collection.$id;
                console.log(`✅ Created Collection "${COLLECTION_NAME}": ${collectionId}`);
            }
        } catch (error) {
            console.error('Error managing collection:', error.message);
            return;
        }

        // 3. Create Attributes
        const attributes = [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'subtitle', type: 'string', size: 255, required: false },
            { key: 'description', type: 'string', size: 5000, required: false },
            { key: 'category', type: 'string', size: 100, required: true },
            { key: 'price', type: 'double', required: false }, // Made optional to avoid errors on migration
            { key: 'unit', type: 'string', size: 50, required: false, default: 'sq.ft' },
            { key: 'minOrder', type: 'integer', required: false, default: 100 },
            { key: 'sizes', type: 'string', size: 255, required: false, array: true },
            { key: 'finish', type: 'string', size: 255, required: false, array: true },
            { key: 'thickness', type: 'string', size: 255, required: false, array: true },
            { key: 'features', type: 'string', size: 255, required: false, array: true },
            { key: 'applications', type: 'string', size: 255, required: false, array: true },
            { key: 'images', type: 'string', size: 1000, required: false, array: true }, // Array of Image URLs
            { key: 'inStock', type: 'boolean', required: false, default: true },
            { key: 'featured', type: 'boolean', required: false, default: false },
            { key: 'rating', type: 'double', required: false, default: 4.5 },
            { key: 'reviews', type: 'integer', required: false, default: 0 }
        ];

        console.log('⏳ Checking/Creating Attributes...');

        // Fetch existing attributes to avoid duplicates
        const existingAttrs = await databases.listAttributes(dbId, collectionId);
        const existingKeys = existingAttrs.attributes.map(a => a.key);

        for (const attr of attributes) {
            if (existingKeys.includes(attr.key)) {
                console.log(`   - Attribute "${attr.key}" already exists.`);
                continue;
            }

            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, collectionId, attr.key, attr.size, attr.required, attr.default, attr.array);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, collectionId, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
                } else if (attr.type === 'double') {
                    await databases.createFloatAttribute(dbId, collectionId, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, collectionId, attr.key, attr.required, attr.default, attr.array);
                }
                console.log(`   ✅ Created attribute: ${attr.key}`);

                // Wait a bit to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                console.error(`   ❌ Failed to create attribute ${attr.key}:`, err.message);
            }
        }

        // 4. Check Storage Bucket
        try {
            // Try to get the bucket
            await storage.getBucket(BUCKET_ID);
            console.log(`✅ Bucket "${BUCKET_ID}" confirmed.`);

            // Update permissions to ensure public read
            await storage.updateBucket(
                BUCKET_ID,
                'Choice Stones Images',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users())
                ],
                true, // fileSecurity 
                true, // enabled
                undefined, // maxFileSize
                ['jpg', 'jpeg', 'png', 'webp', 'gif'] // allowedExtensions
            );
            console.log('   - Updated bucket permissions.');

        } catch (error) {
            console.log(`⚠️ Bucket issue: ${error.message}. Creating new one if it doesn't exist...`);
            // If it doesn't exist, create it (rare given the ID provided, but good for robust script)
            try {
                await storage.createBucket(
                    BUCKET_ID,
                    'Choice Stones Images',
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users())
                    ],
                    true,
                    true,
                    undefined,
                    ['jpg', 'jpeg', 'png', 'webp', 'gif']
                );
                console.log(`   ✅ Created Bucket: ${BUCKET_ID}`);
            } catch (createErr) {
                console.error(`   ❌ Failed to create/update bucket:`, createErr.message);
            }
        }

        console.log('------------------------------------------------');
        console.log('🎉 Setup Complete!');
        console.log(`DATABASE_ID: ${dbId}`);
        console.log(`COLLECTION_ID: ${collectionId}`);
        console.log(`BUCKET_ID: ${BUCKET_ID}`);
        console.log('------------------------------------------------');

        // Export these IDs to a file so the app can use them
        const fs = await import('fs');
        const configContent = `
export const APPWRITE_CONFIG = {
    PROJECT_ID: '${PROJECT_ID}',
    ENDPOINT: '${ENDPOINT}',
    DATABASE_ID: '${dbId}',
    COLLECTION_ID: '${collectionId}',
    BUCKET_ID: '${BUCKET_ID}'
};
`;
        // We will output this to console and user can copy, or I will write another file later.

    } catch (error) {
        console.error('❌ Setup failed:', error);
    }
}

setup();
