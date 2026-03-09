import { Client, Databases, Storage, Query } from 'node-appwrite';
import fs from 'fs';

const PROJECT_ID = '698b47890022a5343849';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const BUCKET_ID = '698b48890012634c5cd7';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Parse the product-list.txt to get the item number -> product name mapping
function parseProductList() {
    const content = fs.readFileSync('./product-list.txt', 'utf-8');
    const map = new Map();
    let maxNum = 0;
    for (const line of content.split('\n')) {
        const match = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*/);
        if (match) {
            const num = parseInt(match[1]);
            const name = match[2].trim();
            map.set(num, name);
            if (num > maxNum) maxNum = num;
        }
    }
    return { map, maxNum };
}

function buildAppwriteUrl(fileId) {
    return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}

async function getAllFiles() {
    let allFiles = [];
    let cursor = null;
    while (true) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const res = await storage.listFiles(BUCKET_ID, queries);
        allFiles.push(...res.files);
        if (res.files.length < 100) break;
        cursor = res.files[res.files.length - 1].$id;
    }
    return allFiles;
}

async function getAllProducts() {
    let allProducts = [];
    let cursor = null;
    while (true) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
        allProducts.push(...res.documents);
        if (res.documents.length < 100) break;
        cursor = res.documents[res.documents.length - 1].$id;
    }
    return allProducts;
}

async function main() {
    console.log('=== Restore Appwrite Storage Image URLs ===\n');

    // 1. Get all files from Storage bucket
    console.log('1. Fetching all files from Appwrite Storage...');
    const allFiles = await getAllFiles();
    console.log(`   Found ${allFiles.length} files in bucket.\n`);

    // Separate cladding images (img*.jpg) from other images
    const claddingImgFiles = allFiles
        .filter(f => /^img\d+\.(jpg|jpeg|png|webp)$/i.test(f.name))
        .sort((a, b) => {
            const numA = parseInt(a.name.match(/img(\d+)\./)[1]);
            const numB = parseInt(b.name.match(/img(\d+)\./)[1]);
            return numA - numB;
        });

    console.log(`   Cladding images (img*.jpg): ${claddingImgFiles.length}`);

    // 2. Parse product list for cladding mapping
    const { map: productListMap, maxNum } = parseProductList();
    console.log(`   Product list items: ${productListMap.size} (max item: ${maxNum})\n`);

    // 3. Build cladding image mapping: product name -> [appwrite URLs]
    // Each img file covers items from its number to the next img file's number - 1
    const claddingImageMap = new Map(); // productName -> [urls]

    for (let i = 0; i < claddingImgFiles.length; i++) {
        const current = claddingImgFiles[i];
        const next = claddingImgFiles[i + 1];
        const startNum = parseInt(current.name.match(/img(\d+)\./)[1]);
        const endNum = next ? parseInt(next.name.match(/img(\d+)\./)[1]) - 1 : maxNum;
        const fileUrl = buildAppwriteUrl(current.$id);

        for (let itemNum = startNum; itemNum <= endNum; itemNum++) {
            const productName = productListMap.get(itemNum);
            if (!productName) continue;

            if (!claddingImageMap.has(productName)) {
                claddingImageMap.set(productName, []);
            }
            const urls = claddingImageMap.get(productName);
            if (!urls.includes(fileUrl)) {
                urls.push(fileUrl);
            }
        }
    }

    console.log(`   Built image mapping for ${claddingImageMap.size} cladding product names.\n`);

    // 4. Get all products from DB
    console.log('2. Fetching all products from Appwrite DB...');
    const allProducts = await getAllProducts();
    console.log(`   Found ${allProducts.length} products.\n`);

    // 5. Update products
    console.log('3. Updating product images...\n');
    let updatedCount = 0;
    let skippedCount = 0;
    let alreadyGoodCount = 0;

    for (const product of allProducts) {
        const images = product.images || [];

        // Check if product already has working Appwrite Storage URLs
        const hasAppwriteUrls = images.some(img => img && img.includes('appwrite.io'));

        if (hasAppwriteUrls) {
            alreadyGoodCount++;
            continue;
        }

        // Check if this product has local paths that exist (paving/pebble images)
        const hasWorkingLocalPaths = images.length > 0 && images.every(img => {
            if (!img) return false;
            // Paving and pebble images exist locally, so they work fine
            return img.includes('paving-img') ||
                img.includes('pebble-img') ||
                img.includes('category-') ||
                img.includes('antiskid-') ||
                img.includes('bangalore-') ||
                img.includes('black-exporting') ||
                img.includes('tumbled-') ||
                img.includes('stone products-') ||
                img.includes('artificial grass') ||
                img.includes('pebbles.jpg') ||
                img.includes('cladding-category');
        });

        if (hasWorkingLocalPaths) {
            alreadyGoodCount++;
            continue;
        }

        // This product needs Appwrite Storage URLs
        // Try to find matching images from the cladding mapping
        const matchedUrls = claddingImageMap.get(product.name);

        if (matchedUrls && matchedUrls.length > 0) {
            console.log(`   Updating: ${product.name} -> ${matchedUrls.length} Appwrite image(s)`);
            try {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    product.$id,
                    { images: matchedUrls }
                );
                updatedCount++;
            } catch (err) {
                console.error(`   ERROR updating ${product.name}: ${err.message}`);
            }
        } else {
            // Try fuzzy match by checking if product name is contained in any cladding name
            let found = false;
            for (const [claddingName, urls] of claddingImageMap.entries()) {
                if (product.name.toLowerCase() === claddingName.toLowerCase() ||
                    claddingName.toLowerCase().includes(product.name.toLowerCase()) ||
                    product.name.toLowerCase().includes(claddingName.toLowerCase())) {
                    console.log(`   Fuzzy match: "${product.name}" ~ "${claddingName}" -> ${urls.length} image(s)`);
                    try {
                        await databases.updateDocument(
                            DATABASE_ID,
                            COLLECTION_ID,
                            product.$id,
                            { images: urls }
                        );
                        updatedCount++;
                        found = true;
                    } catch (err) {
                        console.error(`   ERROR updating ${product.name}: ${err.message}`);
                    }
                    break;
                }
            }
            if (!found) {
                skippedCount++;
                console.log(`   SKIP (no match): ${product.name} (category: ${product.category})`);
            }
        }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total products: ${allProducts.length}`);
    console.log(`Already good: ${alreadyGoodCount}`);
    console.log(`Updated with Appwrite URLs: ${updatedCount}`);
    console.log(`Skipped (no image match): ${skippedCount}`);
    console.log(`\nDone! Refresh your website to see the images.`);
}

main().catch(err => console.error('Fatal error:', err));
