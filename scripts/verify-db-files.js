import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DB_NAME = 'choice-db';
const BASE_DIR = 'public'; // Since paths start with /products/

try {
    const raw = execSync(`npx wrangler d1 execute ${DB_NAME} --command "SELECT images FROM products" --json --remote`).toString();
    const data = JSON.parse(raw);

    let totalFound = 0;
    let totalMissing = 0;
    const missingFiles = [];

    data[0].results.forEach(row => {
        try {
            const images = JSON.parse(row.images || '[]');
            images.forEach(imgUrl => {
                // imgUrl is like "/products/filename.jpg"
                const fullPath = path.join(BASE_DIR, imgUrl);
                if (fs.existsSync(fullPath)) {
                    totalFound++;
                } else {
                    totalMissing++;
                    missingFiles.push(imgUrl);
                }
            });
        } catch (e) { }
    });

    console.log(`VERIFICATION_RESULTS:`);
    console.log(`- Files found in storage: ${totalFound}`);
    console.log(`- Files missing from storage: ${totalMissing}`);
    if (totalMissing > 0) {
        console.log(`- First 5 missing: ${missingFiles.slice(0, 5).join(', ')}`);
    }
} catch (error) {
    console.error(error.message);
}
