import fs from 'fs';
import path from 'path';

async function processAll() {
    try {
        const data = JSON.parse(fs.readFileSync('images-backup.json', 'utf8'));
        const publicDir = './public/products';
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const updateSql = [];
        let totalDownloaded = 0;
        let cache = new Map(); // to avoid re-downloading identical URLs

        for (const item of data) {
            const newImageUrls = [];
            const appwriteUrls = item.images || [];

            for (let i = 0; i < appwriteUrls.length; i++) {
                const url = appwriteUrls[i];
                const ext = '.jpg';
                const localFileName = `${item.id}-${i + 1}${ext}`;
                const localPathForDb = `/products/${localFileName}`;
                const fullLocalPath = path.join(publicDir, localFileName);

                if (url.includes('appwrite.io')) {
                    if (cache.has(url)) {
                        // copy from cached local file if already downloaded
                        fs.copyFileSync(cache.get(url), fullLocalPath);
                        console.log(`Copied duplicate ${localFileName}`);
                    } else {
                        try {
                            const res = await fetch(url);
                            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                            const buffer = await res.arrayBuffer();
                            fs.writeFileSync(fullLocalPath, Buffer.from(buffer));
                            cache.set(url, fullLocalPath);
                            console.log(`Downloaded ${localFileName}`);
                            totalDownloaded++;
                        } catch (err) {
                            console.error(`Error downloading ${url}:`, err);
                        }
                    }
                }
                newImageUrls.push(localPathForDb);
            }

            const imagesStr = JSON.stringify(newImageUrls).replace(/'/g, "''");
            updateSql.push(`UPDATE products SET images = '${imagesStr}' WHERE id = '${item.id.replace(/'/g, "''")}';`);
        }

        console.log(`Total unique images downloaded: ${totalDownloaded}`);

        const chunkSize = 50;
        let chunksGenerated = 0;
        for (let i = 0; i < updateSql.length; i += chunkSize) {
            const chunk = updateSql.slice(i, i + chunkSize);
            fs.writeFileSync(`update-chunk-${chunksGenerated}.sql`, chunk.join('\n'));
            chunksGenerated++;
        }
        console.log(`Generated ${chunksGenerated} SQL update chunks.`);
    } catch (error) {
        console.error("Error processing:", error);
    }
}

processAll();
