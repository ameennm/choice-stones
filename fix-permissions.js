import { Client, Databases, Permission, Role } from 'node-appwrite';

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

async function fixPermissions() {
    try {
        console.log('🔍 Checking collection permissions...\n');

        // 1. Get current collection info
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        console.log(`📁 Collection: ${collection.name}`);
        console.log(`   ID: ${collection.$id}`);
        console.log(`   Document Security: ${collection.documentSecurity}`);
        console.log(`   Current Permissions:`);
        if (collection.$permissions.length === 0) {
            console.log('   ⚠️  NO PERMISSIONS SET! This is the problem.');
        } else {
            collection.$permissions.forEach(p => console.log(`   - ${p}`));
        }

        // 2. Fix collection permissions - allow public read
        console.log('\n🔧 Updating collection permissions...');
        await databases.updateCollection(
            DATABASE_ID,
            COLLECTION_ID,
            collection.name,
            [
                Permission.read(Role.any()),      // Anyone can read (public website)
                Permission.create(Role.users()),   // Authenticated users can create
                Permission.update(Role.users()),   // Authenticated users can update
                Permission.delete(Role.users())    // Authenticated users can delete
            ],
            collection.documentSecurity,  // Keep existing document security setting
            collection.enabled            // Keep enabled status
        );
        console.log('✅ Collection permissions updated!\n');

        // 3. Verify the fix
        const updated = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        console.log('📋 Updated Permissions:');
        updated.$permissions.forEach(p => console.log(`   - ${p}`));

        // 4. Also check and fix document-level permissions
        console.log('\n🔍 Checking document permissions...');
        const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        console.log(`   Total documents: ${docs.total}`);

        let fixedCount = 0;
        for (const doc of docs.documents) {
            const hasReadAny = doc.$permissions.some(p => p.includes('read("any")'));
            if (!hasReadAny) {
                // Add read("any") permission to this document
                const newPermissions = [
                    ...doc.$permissions.filter(p => !p.includes('read')),
                    Permission.read(Role.any()),
                ];
                // Also ensure write permissions for users
                if (!doc.$permissions.some(p => p.includes('update'))) {
                    newPermissions.push(Permission.update(Role.users()));
                }
                if (!doc.$permissions.some(p => p.includes('delete'))) {
                    newPermissions.push(Permission.delete(Role.users()));
                }

                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    doc.$id,
                    {},  // No data changes
                    newPermissions
                );
                fixedCount++;
            }
        }

        if (fixedCount > 0) {
            console.log(`   ✅ Fixed permissions on ${fixedCount} documents.`);
        } else {
            console.log('   ✅ All documents already have correct read permissions.');
        }

        console.log('\n🎉 Done! Your website should now work correctly.');
        console.log('   Try refreshing https://choice-stones.vercel.app');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('   Full error:', error);
    }
}

fixPermissions();
