import fs from 'fs';
import path from 'path';

async function downloadUnassigned() {
    try {
        const bucketData = JSON.parse(fs.readFileSync('bucket-files.json', 'utf8'));
        const publicDir = './public/products/unassigned';
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // We already downloaded attached images to /public/products. Let's get files from the bucket JSON.
        const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
        const PROJECT_ID = '698b47890022a5343849';
        const BUCKET_ID = '698b48890012634c5cd7';

        console.log(`Checking ${bucketData.length} files in the bucket...`);

        let totalDownloaded = 0;
        let batchSize = 10;

        for (let i = 0; i < bucketData.length; i += batchSize) {
            const batch = bucketData.slice(i, i + batchSize);
            const promises = batch.map(async (file) => {
                // Ensure unique name since there are files with the same name
                const localFileName = `${file.id}-${file.name}`;
                const fullLocalPath = path.join(publicDir, localFileName);

                if (fs.existsSync(fullLocalPath)) {
                    return; // Skip if already there
                }

                const url = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.id}/view?project=${PROJECT_ID}`;
                try {
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const buffer = await res.arrayBuffer();
                    fs.writeFileSync(fullLocalPath, Buffer.from(buffer));
                    totalDownloaded++;
                    if (totalDownloaded % 50 === 0) console.log(`Downloaded ${totalDownloaded} unassigned images...`);
                } catch (err) {
                    console.error(`Error downloading ${file.id}:`, err.message);
                }
            });
            await Promise.all(promises);
            // short delay
            await new Promise(r => setTimeout(r, 200));
        }

        console.log(`Total unassigned images downloaded: ${totalDownloaded}`);
        console.log(`They are located in public/products/unassigned/`);
    } catch (error) {
        console.error("Error processing:", error);
    }
}

downloadUnassigned();
