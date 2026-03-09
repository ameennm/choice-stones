import { Client, Databases, Query } from 'node-appwrite';

const PROJECT_ID = '698b47890022a5343849';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DATABASE_ID = '698b4f32203f6fcdb38c';
const COLLECTION_ID = '698b4f32b5e034ac9a19';
const API_KEY = 'standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function run() {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('category', 'cladding-stones'),
        Query.limit(5)
    ]);
    res.documents.forEach(doc => {
        console.log("Name:", doc.name);
        console.log("Images:", doc.images);
        console.log("Image:", doc.image); // checking if there is an image property
    });
}

run();
