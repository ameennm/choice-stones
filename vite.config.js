import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

function LocalAdminApi() {
    return {
        name: 'local-admin-api',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url === '/api/unassigned' && req.method === 'GET') {
                    const unassignedDir = path.resolve('public/products/unassigned');
                    const assignedDir = path.resolve('public/products');
                    const allFiles = [];

                    if (fs.existsSync(unassignedDir)) {
                        const files = fs.readdirSync(unassignedDir)
                            .filter(f => fs.statSync(path.join(unassignedDir, f)).isFile())
                            .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
                            .map(f => ({ name: f, url: `/products/unassigned/${f}`, folder: 'unassigned' }));
                        allFiles.push(...files);
                    }
                    if (fs.existsSync(assignedDir)) {
                        const files = fs.readdirSync(assignedDir)
                            .filter(f => fs.statSync(path.join(assignedDir, f)).isFile())
                            .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
                            .map(f => ({ name: f, url: `/products/${f}`, folder: 'assigned' }));
                        allFiles.push(...files);
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(allFiles));
                    return;
                }

                if (req.url === '/api/products' && req.method === 'GET') {
                    // Exec query to D1 for live product mapping
                    exec('npx wrangler d1 execute choice-db --command "SELECT id, name, category, images FROM products" --json --remote', (err, stdout, stderr) => {
                        res.setHeader('Content-Type', 'application/json');
                        if (err) {
                            console.error('D1 Error:', stderr);
                            // Fallback back to local cache if D1 is slow/fails
                            if (fs.existsSync('full-products-backup.json')) {
                                const data = JSON.parse(fs.readFileSync('full-products-backup.json', 'utf8'));
                                res.end(JSON.stringify(data.map(d => ({ id: d.$id || d.id, name: d.name, category: d.category, images: d.images }))));
                            } else {
                                res.end(JSON.stringify({ error: "Failed to fetch from D1" }));
                            }
                        } else {
                            try {
                                const result = JSON.parse(stdout);
                                res.end(JSON.stringify(result[0].results));
                            } catch (e) {
                                res.end(JSON.stringify({ error: "Failed to parse D1 stats" }));
                            }
                        }
                    });
                    return;
                }

                if (req.url === '/api/assign' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => { body += chunk.toString() });
                    req.on('end', () => {
                        const { oldFileName, productId, products } = JSON.parse(body);
                        const product = products.find(p => p.id === productId);
                        if (!product) {
                            res.statusCode = 400;
                            return res.end(JSON.stringify({ error: "Product not found" }));
                        }

                        let currentImages = typeof product.images === 'string' ? JSON.parse(product.images || "[]") : (product.images || []);
                        const newIndex = currentImages.length + 1;

                        const ext = path.extname(oldFileName);
                        const cleanPName = productId;
                        const newFileName = `${cleanPName}-${Date.now()}${ext}`; // Ensure unique to avoid caching issues

                        const oldPath = path.resolve('public/products/unassigned', oldFileName);
                        const newPath = path.resolve('public/products', newFileName);

                        if (fs.existsSync(oldPath)) {
                            fs.renameSync(oldPath, newPath);
                        }

                        currentImages.push(`/products/${newFileName}`);
                        const newImagesStr = JSON.stringify(currentImages).replace(/'/g, "''");

                        // Update D1 database
                        const command = `npx wrangler d1 execute choice-db --command "UPDATE products SET images = '${newImagesStr}' WHERE id = '${productId}'" --remote`;

                        exec(command, (err, stdout, stderr) => {
                            if (err) {
                                console.error('D1 update error:', stderr);
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: "Database update failed" }));
                            } else {
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true, newFileName, images: currentImages }));
                            }
                        });
                    });
                    return;
                }

                if (req.url === '/api/delete-image' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => { body += chunk.toString() });
                    req.on('end', () => {
                        const { url } = JSON.parse(body);
                        const fullPath = path.resolve('public', url.startsWith('/') ? url.slice(1) : url);

                        try {
                            if (fs.existsSync(fullPath)) {
                                fs.unlinkSync(fullPath);
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true }));
                            } else {
                                res.statusCode = 404;
                                res.end(JSON.stringify({ error: "File not found" }));
                            }
                        } catch (e) {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: e.message }));
                        }
                    });
                    return;
                }

                if (req.url === '/api/upload-image' && req.method === 'POST') {
                    let body = Buffer.alloc(0);
                    req.on('data', chunk => { body = Buffer.concat([body, chunk]) });
                    req.on('end', () => {
                        try {
                            // Simple hack for file upload in vite middleware without busboy/multer
                            // We expect a base64 string or raw bytes. Let's assume JSON with { name, base64Data }
                            const { name, base64Data } = JSON.parse(body.toString());
                            const buffer = Buffer.from(base64Data, 'base64');
                            const targetPath = path.resolve('public/products/unassigned', name);

                            fs.writeFileSync(targetPath, buffer);

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true, url: `/products/unassigned/${name}` }));
                        } catch (e) {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: e.message }));
                        }
                    });
                    return;
                }

                if (req.url === '/api/update-product' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => { body += chunk.toString() });
                    req.on('end', () => {
                        const product = JSON.parse(body);
                        const { id, name, category, subtitle, description, price, unit, inStock, featured, images } = product;

                        const imagesStr = Array.isArray(images) ? JSON.stringify(images) : (images || '[]');
                        const safeDesc = (description || '').replace(/'/g, "''");
                        const safeName = (name || '').replace(/'/g, "''");
                        const safeSub = (subtitle || '').replace(/'/g, "''");

                        const command = `npx wrangler d1 execute choice-db --remote --command "UPDATE products SET name = '${safeName}', category = '${category}', subtitle = '${safeSub}', description = '${safeDesc}', price = ${price || 0}, unit = '${unit || 'sq.ft'}', inStock = ${inStock ? 1 : 0}, featured = ${featured ? 1 : 0}, images = '${imagesStr.replace(/'/g, "''")}' WHERE id = '${id}'"`;

                        exec(command, (err, stdout, stderr) => {
                            res.setHeader('Content-Type', 'application/json');
                            if (err) {
                                console.error('D1 Error:', stderr);
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: "Local D1 Sync Failed" }));
                            } else {
                                res.end(JSON.stringify({ success: true }));
                            }
                        });
                    });
                    return;
                }

                next();
            });
        }
    }
}

export default defineConfig({
    plugins: [react(), LocalAdminApi()],
    server: {
        port: 3000,
        open: true
    }
})
