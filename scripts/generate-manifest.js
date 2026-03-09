import fs from 'fs';
import path from 'path';

const unassignedDir = 'public/products/unassigned';
const manifestFile = 'public/unassigned-manifest.json';

try {
    if (fs.existsSync(unassignedDir)) {
        const files = fs.readdirSync(unassignedDir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
        fs.writeFileSync(manifestFile, JSON.stringify(files));
        console.log(`✅ Generated manifest for ${files.length} unassigned images.`);
    } else {
        fs.writeFileSync(manifestFile, JSON.stringify([]));
        console.log('⚠️ No unassigned directory found, generated empty manifest.');
    }
} catch (error) {
    console.error('❌ Failed to generate image manifest:', error.message);
}
