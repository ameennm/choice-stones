
import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("698b47890022a5343849");

const databases = new Databases(client);

const DATABASE_ID = "698b4f32203f6fcdb38c";
const COLLECTION_ID = "698b4f32b5e034ac9a19";

const productsToAdd = [
    { name: "Rainbow", sizes: ["4x24"] },
    { name: "Teak Sand Blast", sizes: ["6x24"] },
    { name: "Teak Champered", sizes: ["4x12"] },
    { name: "Black Rough", sizes: ["4x12"] },
    { name: "Natural Clay", sizes: ["3x9"] },
    { name: "Multi Gold", sizes: ["1x1"] },
    { name: "White Rough", sizes: ["4x12"] },
    { name: "Latarate Stone", sizes: ["12x7", "7x7"] },
    { name: "Teak Champered BI", sizes: ["4x12"] },
    { name: "White", sizes: ["4x12"] },
    { name: "Chocolate", sizes: [] },
    { name: "N Green", sizes: [] },
    { name: "Pista Green", sizes: [] },
    { name: "Black Butching", sizes: [] },
    { name: "Pink", sizes: [] },
    { name: "Butching", sizes: [] },
    { name: "Rustic Black", sizes: ["12x6", "12"] },
    { name: "C Gold", sizes: ["12x6", "12x4"] },
    { name: "Automan", sizes: ["12x6", "12x4"] },
    { name: "Slate Black", sizes: ["12x4"] },
    { name: "Pink Plain", sizes: ["12x4"] },
    { name: "Plain", sizes: ["6x12"] },
    { name: "Lime Black", sizes: [] },
    { name: "N Green Patties", sizes: [] },
    { name: "CGold Patties", sizes: [] },
    { name: "Plain Patties", sizes: ["4x2"] },
    { name: "Lime Black Patties", sizes: [] },
    { name: "Black Restik", sizes: [] },
    { name: "S White", sizes: [] },
    { name: "Cera", sizes: [] },
    { name: "T Yellow", sizes: [] },
    { name: "Flammed Black", sizes: [] },
    { name: "Agra Red", sizes: [] },
    { name: "Calibration Slab", sizes: ["24x1"] },
    { name: "M-Green", sizes: [] },
    { name: "Automn", sizes: [] },
    { name: "Copper", sizes: [] },
    { name: "D-Green", sizes: [] },
    { name: "Silver Grey", sizes: [] },
    { name: "Silver Shine", sizes: [] },
    { name: "Star Gallexy", sizes: [] },
    { name: "Jek Black", sizes: [] },
    { name: "Teak", sizes: [] },
    { name: "Forest Fire", sizes: [] },
    { name: "Stacking", sizes: ["2x12", "4x12"] },
    { name: "Copper Stacking", sizes: [] },
    { name: "Silver Shine Stacking", sizes: [] },
    { name: "Teak Stacking", sizes: [] },
    { name: "Grey Chipout", sizes: [] },
    { name: "Black Chipout", sizes: [] },
    { name: "Pink Chipout", sizes: [] },
    { name: "Rainbow Chipout", sizes: [] },
    { name: "White Chipout", sizes: [] },
    { name: "Teak Chipout", sizes: [] },
    { name: "Green Chipout", sizes: [] },
    { name: "C-Gold Waterfall", sizes: [] },
    { name: "Black Waterfall", sizes: [] },
    { name: "Autumn Waterfall", sizes: [] },
    { name: "KK White Panel", sizes: [] },
    { name: "C Gold Panel", sizes: [] },
    { name: "Restik Black Panel", sizes: [] },
    { name: "D-Green Panel", sizes: [] },
    { name: "3D Mix Panel", sizes: [] },
    { name: "Indian Autumn Panel", sizes: [] },
    { name: "Green Restik Panel", sizes: [] },
    { name: "L Black Panel", sizes: [] },
    { name: "Teak Rock Panel", sizes: [] },
    { name: "Silver Grey Panel", sizes: [] },
    { name: "Silver Shine Panel", sizes: [] },
    { name: "Copper Panel", sizes: [] },
    { name: "Star Galaxy Panel", sizes: [] },
    { name: "Khag Lawa Panel", sizes: [] },
    { name: "Teak Sand Blast Panel", sizes: [] },
    { name: "Exogen Automn", sizes: [] },
    { name: "Exogen R Black", sizes: [] },
    { name: "Exogen Black", sizes: [] },
    { name: "Exogen Automn Mosaic", sizes: [] },
    { name: "Exogen Pink Mosaic", sizes: [] },
    { name: "Forest Teak Green Mosaic", sizes: [] },
    { name: "Yellow Teak Mosaic", description: "1 inch strips", sizes: [] },
    { name: "Grenate Mosaics", sizes: [] },
    { name: "Mint Roman Mosaic", sizes: [] },
    { name: "Star Galaxy Mosaic", sizes: [] },
    { name: "Copper Mosaic", sizes: [] },
    { name: "Silver Shine Mosaic", sizes: [] },
    { name: "Teak Roman Mosaic", sizes: [] },
    { name: "Bidasar Brown Mosaic", sizes: [] },
    { name: "N-Green Mosaic", sizes: [] },
    { name: "Bidasar Green Mosaic", sizes: [] },
    { name: "Edan (w)", sizes: [] },
    { name: "Camp (inigma)", sizes: [] },
    { name: "Square (TV)", sizes: [] },
    { name: "Ruby (rexo)", sizes: [] },
    { name: "Zebra", sizes: [] },
    { name: "Petal (panama)", sizes: [] },
    { name: "Pearl (koresh)", sizes: [] },
    { name: "Oppal (vivo)", sizes: [] },
    { name: "Indian Jaalis", sizes: ["8.5x8.5"] },
    { name: "Camp", sizes: [] },
    { name: "Petal", sizes: [] },
    { name: "Opal", sizes: [] },
    { name: "Perl", sizes: [] },
    { name: "Ruby", sizes: [] },
    { name: "Diamond", sizes: [] },
    { name: "Terracotta Jaalis", sizes: ["8x8"] },
    { name: "Cupuccino", sizes: [] },
    { name: "Fireclay", sizes: [] },
    { name: "Terracotta", sizes: [] },
    { name: "Terracotta Wall Tiles", sizes: ["240x60x9 mm"] },
    { name: "Chocolate Floor Tile", sizes: [] },
    { name: "Terracotta Floor Tile", sizes: ["12x12"] },
    { name: "Cuppuccino Floor Tile", sizes: [] },
    { name: "Grey Floor Tile", sizes: [] },
    { name: "Fire Clay Floor Tile", sizes: [] },
    { name: "Burgundy Floor Tile", sizes: [] }
];

async function addMissingProducts() {
    try {
        console.log("Fetching existing products...");
        let existingProducts = [];
        let cursor = null;

        // Fetch all products (handling pagination)
        while (true) {
            const queries = [
                Query.limit(100),
                Query.select(['name', '$id'])
            ];
            if (cursor) {
                queries.push(Query.cursorAfter(cursor));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                queries
            );

            existingProducts = [...existingProducts, ...response.documents];

            if (response.documents.length < 100) break;
            cursor = response.documents[response.documents.length - 1].$id;
        }

        console.log(`Found ${existingProducts.length} existing products.`);

        // Create a normalized map of existing names
        const existingNames = new Set(
            existingProducts.map(p => p.name.toLowerCase().trim())
        );

        let addedCount = 0;
        let skippedCount = 0;

        for (const product of productsToAdd) {
            const normalizedName = product.name.toLowerCase().trim();

            if (existingNames.has(normalizedName)) {
                // console.log(`Skipping existing product: ${product.name}`);
                skippedCount++;
                continue;
            }

            console.log(`Adding new product: ${product.name}`);

            const payload = {
                name: product.name,
                category: 'cladding-stones', // Default to cladding-stones as requested
                sizes: product.sizes || [],
                description: product.description || `Premium ${product.name} product for cladding.`,
                price: 0,
                unit: 'sq.ft',
                inStock: true,
                featured: false,
                images: []
            };

            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                payload
            );

            addedCount++;
        }

        console.log(`\nSummary:`);
        console.log(`Check Total: ${productsToAdd.length}`);
        console.log(`Added: ${addedCount}`);
        console.log(`Skipped (Already Exists): ${skippedCount}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

addMissingProducts();
