import fs from 'fs';

try {
    const data = JSON.parse(fs.readFileSync('full-products-backup.json', 'utf8'));

    const sqlStatements = data.map(item => {
        // Safe string escape helper
        const escapeStr = (str) => {
            if (str == null) return "NULL";
            return `'${String(str).replace(/'/g, "''")}'`;
        };

        // Ensure boolean are encoded as 0 or 1
        const toBool = (val) => val ? 1 : 0;

        // Helper to stringify JSON arrays properly, handling cases where it's not an array
        const encJson = (val) => {
            if (!val) return "'[]'";
            let arr = Array.isArray(val) ? val : [val];
            return escapeStr(JSON.stringify(arr));
        };

        const id = escapeStr(item.$id);
        const name = escapeStr(item.name);
        const subtitle = escapeStr(item.subtitle);
        const description = escapeStr(item.description);
        const category = escapeStr(item.category);
        const price = item.price || 0;
        const unit = escapeStr(item.unit);
        const minOrder = item.minOrder || 1;

        const sizes = encJson(item.sizes);
        const finish = encJson(item.finish);
        const thickness = encJson(item.thickness);
        const features = encJson(item.features);
        const applications = encJson(item.applications);
        const inStock = toBool(item.inStock);
        const featured = toBool(item.featured);

        const rating = item.rating || 0;
        const reviews = item.reviews || 0;

        // We handle Images differently. We must map the Appwrite URLs to local URLs
        // Wait, did we already update them? The download-and-update.js updated the public/products folder.
        // It's better to reconstruct the image URLs based on the code logic there.
        let localImagesUrl = [];
        const appwriteUrls = item.images || [];
        for (let i = 0; i < appwriteUrls.length; i++) {
            const ext = '.jpg';
            const localFileName = `${item.$id}-${i + 1}${ext}`;
            const localPathForDb = `/products/${localFileName}`;
            localImagesUrl.push(localPathForDb);
        }
        const images = escapeStr(JSON.stringify(localImagesUrl));

        return `INSERT INTO products (id, name, subtitle, description, category, price, unit, minOrder, sizes, finish, thickness, features, applications, images, inStock, featured, rating, reviews) VALUES (${id}, ${name}, ${subtitle}, ${description}, ${category}, ${price}, ${unit}, ${minOrder}, ${sizes}, ${finish}, ${thickness}, ${features}, ${applications}, ${images}, ${inStock}, ${featured}, ${rating}, ${reviews});`;
    });

    const chunkSize = 50;
    for (let i = 0; i < sqlStatements.length; i += chunkSize) {
        const chunk = sqlStatements.slice(i, i + chunkSize);
        fs.writeFileSync(`full-insert-chunk-${i}.sql`, chunk.join('\n'));
    }

    console.log(`Generated ${Math.ceil(sqlStatements.length / chunkSize)} full SQL files.`);
} catch (error) {
    console.error("Error processing JSON:", error);
}
