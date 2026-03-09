import { Client, Databases, Query } from 'node-appwrite';
const c = new Client().setEndpoint('https://sgp.cloud.appwrite.io/v1').setProject('698b47890022a5343849').setKey('standard_e9b4f45f4681ee2acff4fd60c6a84271e6ce59b56151be15f11a60aa86ed5df686f6a89776f010320387183cc8d404f58b53854298f7cfb40a9e76c7cfc32da5aabf8c43fb669270d3f5173441859a5bd8d9e324f4ac4feb94201b41b90c9f536313eb598a6e1bd07e2c5d51c66c9aa838bf42190ed0a5cf308c75a9a6a8a47a');
const db = new Databases(c);
async function f() {
    let all = [], cur = null;
    while (true) {
        const q = [Query.limit(100), Query.equal('category', 'cladding-stones')];
        if (cur) q.push(Query.cursorAfter(cur));
        const r = await db.listDocuments('698b4f32203f6fcdb38c', '698b4f32b5e034ac9a19', q);
        all.push(...r.documents);
        if (r.documents.length < 100) break;
        cur = r.documents[r.documents.length - 1].$id;
    }
    let total = 0;
    all.forEach(p => { total += (p.images || []).length; });
    console.log('Cladding products:', all.length);
    console.log('Total cladding images:', total);
    console.log('');
    all.forEach(p => console.log(`  ${p.name}: ${(p.images || []).length} image(s)`));
}
f();
