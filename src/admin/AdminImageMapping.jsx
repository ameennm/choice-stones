import { useState, useEffect } from 'react'
import { Loader, ChevronLeft, ChevronRight, Image as ImageIcon, Trash2, Upload } from 'lucide-react'

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
    const [imgSearch, setImgSearch] = useState('')

    const ITEMS_PER_PAGE = 24

    const getImagesArray = (images) => {
        if (Array.isArray(images)) return images;
        if (!images) return [];
        try {
            return JSON.parse(images);
        } catch (e) {
            // Fallback for malformed strings like [/products/...]
            let raw = String(images || '').trim();
            if (raw.startsWith('[') && raw.endsWith(']')) {
                raw = raw.slice(1, -1);
                if (!raw) return [];
                return raw.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            }
            return [];
        }
    }

    const reloadData = async () => {
        try {
            // Fetch Products from local API pulling from D1
            const prodsRes = await fetch('/api/products');
            const prodsJson = await prodsRes.json();

            let sortedProducts = [];
            if (Array.isArray(prodsJson)) {
                sortedProducts = prodsJson
                    .filter(p => p.name !== 'System Settings')
                    .sort((a, b) => a.name.localeCompare(b.name));
            }
            setProducts(sortedProducts)

            // Fetch manifest from build
            const unRes = await fetch('/api/unassigned');
            if (unRes.ok) {
                const files = await unRes.json();
                setBucketFiles(files)
            } else {
                setBucketFiles([]);
            }

            // Initialize assignments state using products images array
            const initialAssignments = {}
            for (const product of sortedProducts) {
                const imagesArray = getImagesArray(product.images);
                for (const url of imagesArray) {
                    if (url) initialAssignments[url] = product.id || product.$id
                }
            }
            setAssignments(initialAssignments)
        } catch (error) {
            console.error('Error fetching data:', error)
            setStatusMsg('Error loading data')
        }
    }

    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setStatusMsg('Uploading image...');

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Data = reader.result.split(',')[1];
                const res = await fetch('/api/upload-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: file.name, base64Data })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Upload failed');
                }

                setStatusMsg(`✅ Image "${file.name}" uploaded to unassigned!`);
                await reloadData();
                setIsUploading(false);
            };
        } catch (error) {
            console.error('Upload error:', error);
            setStatusMsg('❌ Upload error: ' + error.message);
            setIsUploading(false);
            if (!window.location.hostname.includes('localhost')) {
                alert('Live upload is not supported. Use the local development environment.');
            }
        }
    }

    const handleDeleteImage = async (file) => {
        if (!confirm(`Are you sure you want to permanently delete ${file.name}?`)) {
            return;
        }

        try {
            const res = await fetch('/api/delete-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: file.url })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Server error');
            }

            setBucketFiles(prev => prev.filter(f => f.url !== file.url));
            setStatusMsg(`🗑️ Image "${file.name}" deleted permanently.`);
        } catch (error) {
            // Only log if it's not the intentional 403 live-restriction error
            if (!error.message.includes('Live image deletion')) {
                console.error('Delete error:', error);
            }

            // Fallback for live site: hide it from the UI for the current session
            setBucketFiles(prev => prev.filter(f => f.url !== file.url));
            setStatusMsg(`📝 Image "${file.name}" hidden. (Permanent deletion requires local cleanup and redeploy).`);
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
            const res = await fetch('/api/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldFileName: file.name,
                    productId: newProductId,
                    products
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Server error');
            }

            const data = await res.json();

            if (newProductId && newProductId !== 'unassigned') {
                setBucketFiles(prev => prev.filter(f => f.name !== file.name));
            } else {
                // If unassigned, just reload state
                await reloadData();
            }

            setStatusMsg(data.message || `✅ Saved automatically & assigned!`);
        } catch (error) {
            console.error('Auto-save error:', error)
            setStatusMsg('❌ Error saving: ' + error.message)
            await reloadData()
        }
    }


    let displayFiles = bucketFiles.map(f => ({
        ...f,
        $id: f.name,
        url: f.url
    }))

    if (showOnlyUnassigned) {
        displayFiles = displayFiles.filter(f => !assignments[f.url])
    }

    if (filterCategory !== 'all') {
        displayFiles = displayFiles.filter(f => {
            const assignedProductId = assignments[f.url]
            if (!assignedProductId) return false
            const product = products.find(p => (p.id || p.$id) === assignedProductId)
            return product && product.category === filterCategory
        })
    }

    if (imgSearch) {
        const term = imgSearch.toLowerCase()
        displayFiles = displayFiles.filter(f => f.name.toLowerCase().includes(term))
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

    const productOptions = products.map(p => ({ value: p.id || p.$id, label: `${p.name} (${(p.category || 'unknown').split('-')[0]})` }));

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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', background: '#1a1a2e', padding: '20px', borderRadius: '16px', border: '1px solid #2a2a3e', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter by Category</label>
                    <select
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value)
                            setShowOnlyUnassigned(false)
                            setCurrentPage(0)
                        }}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0d0d1a', border: '1px solid #3a3a3e', color: '#fff', outline: 'none' }}
                    >
                        <option value="all">All Images</option>
                        <option value="cladding-stones">Cladding Stones</option>
                        <option value="paving-stones">Paving Stones</option>
                        <option value="pebble-stones">Pebble Stones</option>
                        <option value="stone-products">Stone Products</option>
                        <option value="artificial-grass">Artificial Grass</option>
                    </select>
                </div>

                <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '10px', height: '42px', paddingBottom: '8px' }}>
                    <input
                        type="checkbox"
                        id="unassignedOnly"
                        checked={showOnlyUnassigned}
                        onChange={(e) => {
                            setShowOnlyUnassigned(e.target.checked)
                            if (e.target.checked) setFilterCategory('all')
                            setCurrentPage(0)
                        }}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="unassignedOnly" style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Show Unassigned Only</label>
                </div>

                <div style={{ flex: '2 1 250px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Search Images</label>
                    <div className="search-box" style={{ width: '100%', display: 'flex', alignItems: 'center', background: '#0d0d1a', border: '1px solid #3a3a3e', borderRadius: '8px', padding: '0 12px' }}>
                        <input
                            type="text"
                            placeholder="Enter image name..."
                            value={imgSearch}
                            onChange={(e) => {
                                setImgSearch(e.target.value)
                                setCurrentPage(0)
                            }}
                            style={{ background: 'none', border: 'none', color: '#fff', width: '100%', outline: 'none', padding: '10px 0' }}
                        />
                    </div>
                </div>

                <div style={{ flex: '1 1 200px', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end', minWidth: 'fit-content' }}>
                    <label className="btn btn-primary" style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                        {isUploading ? <Loader className="spin" size={18} /> : <Upload size={18} />}
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                            disabled={isUploading}
                        />
                    </label>

                    <div style={{ textAlign: 'center', background: '#0d0d1a', padding: '4px 12px', borderRadius: '8px', border: '1px solid #3a3a3e' }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{displayFiles.length}</div>
                        <div style={{ color: '#888', fontSize: '10px', textTransform: 'uppercase' }}>Files</div>
                    </div>
                </div>
            </div>

            {/* Image Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px'
            }}>
                {paginatedFiles.map((file) => {
                    const assignedProductId = assignments[file.url] || 'unassigned'

                    return (
                        <div key={file.$id || file.name} style={{
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

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                    <SearchableSelect
                                        value={assignedProductId}
                                        options={productOptions}
                                        onChange={(newId) => handleAssign({ ...file }, newId)}
                                    />
                                    <button
                                        onClick={() => handleDeleteImage(file)}
                                        style={{
                                            background: '#ef444422',
                                            border: '1px solid #ef4444',
                                            color: '#ef4444',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                        title="Delete image"
                                    >
                                        <Trash2 size={18} />
                                    </button>
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
