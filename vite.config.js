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
                    if (fs.existsSync(unassignedDir)) {
                        const files = fs.readdirSync(unassignedDir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(files));
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify([]));
                    }
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
