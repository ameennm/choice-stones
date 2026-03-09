import { execSync } from 'child_process';

const DB_NAME = 'choice-db';

try {
    const raw = execSync(`npx wrangler d1 execute ${DB_NAME} --command "SELECT images FROM products" --json --remote`).toString();
    const data = JSON.parse(raw);
    let totalImages = 0;

    data[0].results.forEach(row => {
        try {
            const images = JSON.parse(row.images || '[]');
            totalImages += images.length;
        } catch (e) { }
    });

    console.log(`TOTAL_IMAGES_IN_DB: ${totalImages}`);
} catch (error) {
    console.error(error.message);
}
