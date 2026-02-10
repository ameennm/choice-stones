const PROJECT_ID = "698b47890022a5343849";
const API_KEY = "698b4c05560935398242";
const DATABASE_ID = "698b4f32203f6fcdb38c";
const COLLECTION_ID = "698b4f32b5e034ac9a19";
const ENDPOINT = "https://sgp.cloud.appwrite.io/v1";

const HEADERS = {
    "X-Appwrite-Project": PROJECT_ID,
    "X-Appwrite-Key": API_KEY,
    "Content-Type": "application/json"
};

const newProducts = [
    {
        name: "White Polished Pebble",
        category: "pebble-stones",
        description: "Premium white polished pebbles for garden and landscaping.",
        price: 0,
        unit: "kg",
        inStock: true,
        featured: false,
        images: []
    },
    {
        name: "White Unpolished Pebble",
        category: "pebble-stones",
        description: "Natural white unpolished pebbles for rustic garden designs.",
        price: 0,
        unit: "kg",
        inStock: true,
        featured: false,
        images: []
    },
    {
        name: "Black Polished Pebble",
        category: "pebble-stones",
        description: "Elegant black polished pebbles for sophisticated landscaping.",
        price: 0,
        unit: "kg",
        inStock: true,
        featured: false,
        images: []
    },
    {
        name: "Black Unpolished Pebble",
        category: "pebble-stones",
        description: "Natural black unpolished pebbles for textured ground cover.",
        price: 0,
        unit: "kg",
        inStock: true,
        featured: false,
        images: []
    }
];

async function updatePebbles() {
    try {
        console.log('Fetching all products using fetch API...');

        let allDocuments = [];
        let offset = 0;
        let limit = 100;
        let total = 0;

        // Fetch first batch to get total
        const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents?queries[]=limit(${limit})`;
        const response = await fetch(url, { headers: HEADERS });
        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

        const data = await response.json();
        allDocuments = data.documents;
        total = data.total;
        console.log(`Initial fetch: ${allDocuments.length} / ${total}`);

        // Fetch remaining pages if needed
        while (allDocuments.length < total) {
            const lastId = allDocuments[allDocuments.length - 1].$id;
            const nextUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents?queries[]=limit(${limit})&queries[]=cursorAfter(${lastId})`;
            const nextRes = await fetch(nextUrl, { headers: HEADERS });
            const nextData = await nextRes.json();
            allDocuments = [...allDocuments, ...nextData.documents];
            console.log(`Fetched ${allDocuments.length} / ${total}`);
        }

        console.log('All products fetched. Processing updates...');

        // 1. Rename Kalstone to Choice
        for (const product of allDocuments) {
            if (product.category !== 'pebble-stones') continue;

            let updatedName = product.name;
            let updatedDesc = product.description;
            let needsUpdate = false;

            if (product.name.toLowerCase().includes('kalstone')) {
                updatedName = product.name.replace(/Kalstone/gi, 'Choice');
                needsUpdate = true;
            }

            if (product.description && product.description.toLowerCase().includes('kalstone')) {
                updatedDesc = product.description.replace(/Kalstone/gi, 'Choice');
                needsUpdate = true;
            }

            if (needsUpdate) {
                console.log(`Updating "${product.name}" to "${updatedName}"...`);
                const updateUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${product.$id}`;
                await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: HEADERS,
                    body: JSON.stringify({
                        data: {
                            name: updatedName,
                            description: updatedDesc
                        }
                    })
                });
            }
        }

        // 2. Add New Products
        console.log('Adding new products...');
        for (const newProduct of newProducts) {
            // Check existence in fetched list
            const exists = allDocuments.some(p => p.name === newProduct.name);
            if (!exists) {
                console.log(`Creating "${newProduct.name}"...`);
                const createUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`;
                await fetch(createUrl, {
                    method: 'POST',
                    headers: HEADERS,
                    body: JSON.stringify({
                        documentId: 'unique()',
                        data: newProduct,
                        permissions: [
                            'read("any")',
                            'update("users")',
                            'delete("users")'
                        ]
                    })
                });
            } else {
                console.log(`Skipping "${newProduct.name}" (already exists)`);
            }
        }

        console.log('✅ Pebble updates completed successfully!');
    } catch (error) {
        console.error('❌ Error in script:', error);
    }
}

updatePebbles();
