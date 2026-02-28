import { Client, Databases, Storage, Query } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const BUCKET_ID = '698b48890012634c5cd7';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const storage = new Storage(client);
const databases = new Databases(client);

async function formatAppwriteImages() {
    console.log('Fetching file list from Appwrite Storage to map IDs to Names...');
    const fileMap = new Map(); // Map file ID -> File Name
    let hasMore = true;
    let cursor = null;
    let files = [];

    while (hasMore) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));

        const res = await storage.listFiles(BUCKET_ID, queries);
        files.push(...res.files);

        if (res.files.length < 100) hasMore = false;
        else cursor = res.files[res.files.length - 1].$id;
    }

    files.forEach(f => {
        fileMap.set(f.$id, f.name);
    });
    console.log(`Mapped ${fileMap.size} files.`);

    console.log('\nFetching ALL products from Appwrite Database...');
    let appwriteProducts = [];
    cursor = null;
    hasMore = true;

    while (hasMore) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            queries
        );

        appwriteProducts.push(...response.documents);

        if (response.documents.length < 100) hasMore = false;
        else cursor = response.documents[response.documents.length - 1].$id;
    }

    console.log(`Found ${appwriteProducts.length} total products in Appwrite.`);
    let updatedCount = 0;

    for (const doc of appwriteProducts) {
        if (!doc.images || doc.images.length === 0) continue;

        let needsUpdate = false;
        const newImages = doc.images.map(imgUrl => {
            if (imgUrl.includes('/storage/buckets') && imgUrl.includes('/view')) {
                const match = imgUrl.match(/\/files\/([^\/]+)\/view/);
                if (match && match[1]) {
                    const fileId = match[1];
                    const fileName = fileMap.get(fileId);
                    if (fileName) {
                        needsUpdate = true;
                        // Return the new local URL format!
                        return `/products/${fileName}`;
                    }
                }
            }
            return imgUrl;
        });

        if (needsUpdate) {
            console.log(`Updating ${doc.name} to local images...`);
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    images: newImages
                }
            );
            updatedCount++;
        }
    }

    console.log(`\n✅ Finished! Updated ${updatedCount} products to use local frontend URLs.`);
}

formatAppwriteImages();
