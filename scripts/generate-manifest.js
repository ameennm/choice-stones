import fs from 'fs';
import path from 'path';

const dirs = [
    { name: 'unassigned', path: 'public/products/unassigned', urlPrefix: '/products/unassigned/' },
    { name: 'assigned', path: 'public/products', urlPrefix: '/products/' }
];
const manifestFile = 'public/unassigned-manifest.json';

try {
    const allFiles = [];
    dirs.forEach(dir => {
        if (fs.existsSync(dir.path)) {
            const files = fs.readdirSync(dir.path)
                .filter(f => fs.statSync(path.join(dir.path, f)).isFile())
                .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
                .map(f => ({
                    name: f,
                    url: `${dir.urlPrefix}${f}`,
                    folder: dir.name
                }));
            allFiles.push(...files);
        }
    });

    fs.writeFileSync(manifestFile, JSON.stringify(allFiles));
    console.log(`✅ Generated manifest for ${allFiles.length} total images.`);
} catch (error) {
    console.error('❌ Failed to generate image manifest:', error.message);
}
