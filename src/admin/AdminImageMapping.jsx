import { useState, useEffect } from 'react'
import { Loader, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { databases, storage, DATABASE_ID, COLLECTION_ID, BUCKET_ID } from '../lib/appwrite'
import { Query } from 'appwrite'

const PROJECT_ID = '698b47890022a5343849';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';

function buildUrl(fileId) {
    return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}

// Custom Searchable Dropdown Component
function SearchableSelect({ value, options, onChange, placeholder = "-- Select Product --" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedOption = options.find(o => o.value === value);
    const filteredOptions = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '8px 12px',
                    background: value !== 'unassigned' ? '#2a2a3e' : '#ef444422',
                    border: value !== 'unassigned' ? '1px solid #4a4a5e' : '1px solid #ef4444',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: value !== 'unassigned' ? 'bold' : 'normal'
                }}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <span style={{ fontSize: '10px', marginLeft: '8px' }}>▼</span>
            </div>

            {isOpen && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    />

                    <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        right: 0,
                        marginBottom: '4px',
                        background: '#1a1a2e',
                        border: '1px solid #3a3a4e',
                        borderRadius: '6px',
                        zIndex: 200,
                        height: '220px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 -4px 16px rgba(0,0,0,0.6)'
                    }}>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: '10px',
                                background: '#0d0d1a',
                                border: 'none',
                                borderBottom: '1px solid #3a3a4e',
                                color: '#fff',
                                width: '100%',
                                outline: 'none',
                                fontSize: '13px',
                                borderRadius: '6px 6px 0 0'
                            }}
                            onClick={e => e.stopPropagation()}
                        />
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            <div
                                style={{ padding: '10px', cursor: 'pointer', color: '#ef4444', fontSize: '13px', borderBottom: '1px solid #2a2a3e' }}
                                onClick={() => { onChange('unassigned'); setIsOpen(false); setSearch(''); }}
                            >
                                {placeholder}
                            </div>
                            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                                <div
                                    key={opt.value}
                                    style={{
                                        padding: '10px',
                                        cursor: 'pointer',
                                        background: opt.value === value ? '#2563eb' : 'transparent',
                                        color: '#fff',
                                        fontSize: '13px',
                                        borderBottom: '1px solid #2a2a3e'
                                    }}
                                    onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(''); }}
                                    onMouseEnter={(e) => {
                                        if (opt.value !== value) e.target.style.background = '#2a2a3e'
                                    }}
                                    onMouseLeave={(e) => {
                                        if (opt.value !== value) e.target.style.background = 'transparent'
                                    }}
                                >
                                    {opt.label}
                                </div>
                            )) : (
                                <div style={{ padding: '10px', color: '#666', fontSize: '13px', textAlign: 'center' }}>No matches found</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}


function AdminImageMapping() {
    const [products, setProducts] = useState([])
    const [bucketFiles, setBucketFiles] = useState([])
    const [assignments, setAssignments] = useState({}) // { [fileUrl]: productId }
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [statusMsg, setStatusMsg] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(false)

    const ITEMS_PER_PAGE = 24

    const reloadData = async () => {
        try {
            const prodRes = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.limit(1000)]
            )
            const sortedProducts = prodRes.documents
                .filter(p => p.name !== 'System Settings')
                .sort((a, b) => a.name.localeCompare(b.name))
            setProducts(sortedProducts)

            let allFiles = []
            let cursor = null
            while (true) {
                const queries = [Query.limit(100)]
                if (cursor) queries.push(Query.cursorAfter(cursor))
                const res = await storage.listFiles(BUCKET_ID, queries)
                allFiles.push(...res.files)
                if (res.files.length < 100) break
                cursor = res.files[res.files.length - 1].$id
            }

            const files = allFiles.filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f.name))
            files.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
            setBucketFiles(files)

            const initialAssignments = {}
            for (const product of sortedProducts) {
                for (const url of (product.images || [])) {
                    initialAssignments[url] = product.$id
                }
            }
            setAssignments(initialAssignments)
        } catch (error) {
            console.error('Error fetching data:', error)
            setStatusMsg('Error loading data')
        }
    }

    useEffect(() => {
        const init = async () => {
            await reloadData()
            setLoading(false)
        }
        init()
    }, [])

    const handleAssign = async (file, newProductId) => {
        // Optimistic UI Update
        const oldProductId = assignments[file.url];
        if (oldProductId === newProductId) return;

        setAssignments(prev => {
            const next = { ...prev }
            if (!newProductId || newProductId === 'unassigned') {
                delete next[file.url]
            } else {
                next[file.url] = newProductId
            }
            return next
        })

        setStatusMsg('Auto-saving...')

        try {
            // Re-calculate the next assignments state to perform backend operations
            const nextAssignments = { ...assignments }
            if (!newProductId || newProductId === 'unassigned') {
                delete nextAssignments[file.url]
            } else {
                nextAssignments[file.url] = newProductId
            }

            // 1. Rename File in Storage
            let newFileName = file.name;
            if (newProductId && newProductId !== 'unassigned') {
                const product = products.find(p => p.$id === newProductId);
                if (product) {
                    // Count how many files are currently mapped to this newly assigned product
                    const mappedToNewProduct = Object.keys(nextAssignments).filter(url => nextAssignments[url] === newProductId);
                    // Determine index for file (1 to 4)
                    const existingIndex = mappedToNewProduct.indexOf(file.url);
                    const indexNumber = existingIndex !== -1 ? existingIndex + 1 : mappedToNewProduct.length || 1;

                    const extMatch = file.name.match(/\.[0-9a-z]+$/i);
                    const ext = extMatch ? extMatch[0] : '.jpg';
                    const cleanName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                    newFileName = `${cleanName}-${indexNumber}${ext}`;

                    if (newFileName !== file.name) {
                        await storage.updateFile(BUCKET_ID, file.$id, newFileName);
                    }
                }
            }

            // 2. Update Database for Affected Products
            const affectedProducts = new Set();
            if (oldProductId && oldProductId !== 'unassigned') affectedProducts.add(oldProductId);
            if (newProductId && newProductId !== 'unassigned') affectedProducts.add(newProductId);

            for (const pId of affectedProducts) {
                const productUrls = Object.keys(nextAssignments).filter(url => nextAssignments[url] === pId);
                await databases.updateDocument(DATABASE_ID, COLLECTION_ID, pId, {
                    images: productUrls
                });
            }

            // 3. Update File name in local state
            setBucketFiles(prev => prev.map(f => f.$id === file.$id ? { ...f, name: newFileName } : f))

            setStatusMsg(`✅ Saved automatically & renamed to: ${newFileName}`)

            // Re-fetch quietly to ensure clean sync
            await reloadData()
        } catch (error) {
            console.error('Auto-save error:', error)
            setStatusMsg('❌ Error saving: ' + error.message)
            // Revert state on failure
            await reloadData()
        }
    }


    let displayFiles = bucketFiles.map(f => ({
        ...f,
        url: buildUrl(f.$id)
    }))

    if (showOnlyUnassigned) {
        displayFiles = displayFiles.filter(f => !assignments[f.url])
    }

    if (filterCategory !== 'all') {
        displayFiles = displayFiles.filter(f => {
            const assignedProductId = assignments[f.url]
            if (!assignedProductId) return false
            const product = products.find(p => p.$id === assignedProductId)
            return product && product.category === filterCategory
        })
    }

    const totalPages = Math.ceil(displayFiles.length / ITEMS_PER_PAGE)
    const safePage = Math.min(currentPage, Math.max(0, totalPages - 1))

    const paginatedFiles = displayFiles.slice(
        safePage * ITEMS_PER_PAGE,
        (safePage + 1) * ITEMS_PER_PAGE
    )

    if (loading) {
        return <div className="loading-container"><Loader className="spin" /> Loading all images and products...</div>
    }

    const productOptions = products.map(p => ({ value: p.$id, label: `${p.name} (${p.category.split('-')[0]})` }));

    return (
        <div className="admin-image-mapping" style={{ paddingBottom: '90px' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                <div>
                    <h1><ImageIcon size={24} style={{ marginRight: 8 }} /> Master Image Mapping</h1>
                    <p>Assign images directly. Automatically saves & renames the file.</p>
                </div>
            </div>

            {statusMsg && (
                <div style={{
                    padding: '12px 16px',
                    background: statusMsg.includes('✅') ? '#1a3a1a' : statusMsg.includes('❌') ? '#3a1a1a' : '#2a2a3e',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    color: statusMsg.includes('✅') ? '#4ade80' : statusMsg.includes('❌') ? '#f87171' : '#fbbf24',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: '80px',
                    zIndex: 10
                }}>
                    {statusMsg}
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: '#1a1a2e', padding: '16px', borderRadius: '12px', border: '1px solid #2a2a3e', alignItems: 'center' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px' }}>Filter by Assigned Category</label>
                    <select
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value)
                            setShowOnlyUnassigned(false)
                            setCurrentPage(0)
                        }}
                        style={{ padding: '8px', borderRadius: '6px', background: '#0d0d1a', border: '1px solid #3a3a3e', color: '#fff' }}
                    >
                        <option value="all">All Images</option>
                        <option value="cladding-stones">Cladding Stones</option>
                        <option value="paving-stones">Paving Stones</option>
                        <option value="pebble-stones">Pebble Stones</option>
                        <option value="stone-products">Stone Products</option>
                        <option value="artificial-grass">Artificial Grass</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                    <input
                        type="checkbox"
                        id="unassignedOnly"
                        checked={showOnlyUnassigned}
                        onChange={(e) => {
                            setShowOnlyUnassigned(e.target.checked)
                            if (e.target.checked) setFilterCategory('all')
                            setCurrentPage(0)
                        }}
                        style={{ width: '18px', height: '18px' }}
                    />
                    <label htmlFor="unassignedOnly" style={{ cursor: 'pointer' }}>Show Unassigned Images Only</label>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{displayFiles.length}</span>
                    <span style={{ color: '#888', fontSize: '14px', marginLeft: '6px' }}>Images</span>
                </div>
            </div>

            {/* Image Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {paginatedFiles.map((file) => {
                    const assignedProductId = assignments[file.url] || 'unassigned'

                    return (
                        <div key={file.$id} style={{
                            background: '#1a1a2e',
                            borderRadius: '12px',
                            border: assignedProductId !== 'unassigned' ? '1px solid #3a3a4e' : '1px solid #ef444455',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ aspectRatio: '4/3', position: 'relative', background: '#0d0d1a', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', overflow: 'hidden' }}>
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                                {assignedProductId !== 'unassigned' && (
                                    <div style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        background: '#22c55e', color: '#000', fontSize: '11px',
                                        padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold'
                                    }}>
                                        ✓ Assigned
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px', wordBreak: 'break-all', display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>File:</span>
                                    {file.name}
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <SearchableSelect
                                        value={assignedProductId}
                                        options={productOptions}
                                        onChange={(newId) => handleAssign({ ...file }, newId)}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {displayFiles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    No images found for the selected filters.
                </div>
            )}

            {/* Pagination Box */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '40px',
                    padding: '20px',
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    border: '1px solid #2a2a3e'
                }}>
                    <button
                        className="btn btn-secondary"
                        disabled={safePage === 0}
                        onClick={() => {
                            window.scrollTo(0, 0);
                            setCurrentPage(p => p - 1);
                        }}
                        style={{ padding: '10px 20px' }}
                    >
                        <ChevronLeft size={20} /> Prev
                    </button>

                    <span style={{ color: '#ccc', fontSize: '15px', fontWeight: 'bold' }}>
                        Page {safePage + 1} of {totalPages}
                    </span>

                    <button
                        className="btn btn-secondary"
                        disabled={safePage >= totalPages - 1}
                        onClick={() => {
                            window.scrollTo(0, 0);
                            setCurrentPage(p => p + 1);
                        }}
                        style={{ padding: '10px 20px' }}
                    >
                        Next <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default AdminImageMapping
