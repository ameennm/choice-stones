import fs from 'fs';

try {
    const data = JSON.parse(fs.readFileSync('images-backup.json', 'utf8'));

    const sqlStatements = data.map(item => {
        const id = item.id.replace(/'/g, "''");
        const name = item.name.replace(/'/g, "''");
        const category = item.category.replace(/'/g, "''");
        const images = JSON.stringify(item.images).replace(/'/g, "''");

        return `INSERT INTO products (id, name, category, images) VALUES ('${id}', '${name}', '${category}', '${images}');`;
    });

    const chunkSize = 50;
    for (let i = 0; i < sqlStatements.length; i += chunkSize) {
        const chunk = sqlStatements.slice(i, i + chunkSize);
        fs.writeFileSync(`insert-chunk-${i}.sql`, chunk.join('\n'));
    }

    console.log(`Generated ${Math.ceil(sqlStatements.length / chunkSize)} SQL files.`);
} catch (error) {
    console.error("Error processing JSON:", error);
}
