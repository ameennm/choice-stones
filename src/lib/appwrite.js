import { Client, Account, Databases, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("698b47890022a5343849");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Appwrite Configuration
export const DATABASE_ID = "698b4f32203f6fcdb38c";
export const COLLECTION_ID = "698b4f32b5e034ac9a19";
export const BUCKET_ID = "698b48890012634c5cd7";

export { client, account, databases, storage, ID };
