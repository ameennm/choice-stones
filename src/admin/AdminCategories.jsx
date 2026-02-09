import { useState } from 'react'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'
import { categories as initialCategories } from '../data/products'

function AdminCategories() {
    const [categories, setCategories] = useState(initialCategories)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(c => c.id !== id))
        }
    }

    const handleEdit = (category) => {
        setEditingCategory({ ...category })
        setShowModal(true)
    }

    const handleAddNew = () => {
        setEditingCategory({
            id: '',
            name: '',
            description: '',
            icon: 'Layers'
        })
        setShowModal(true)
    }

    const handleSave = () => {
        if (!editingCategory.name) {
            alert('Category name is required')
            return
        }

        const id = editingCategory.id || editingCategory.name.toLowerCase().replace(/\s+/g, '-')
        const categoryToSave = { ...editingCategory, id }

        if (categories.find(c => c.id === editingCategory.id)) {
            setCategories(categories.map(c => c.id === editingCategory.id ? categoryToSave : c))
        } else {
            setCategories([...categories, categoryToSave])
        }
        setShowModal(false)
        setEditingCategory(null)
    }

    return (
        <div className="admin-categories">
            <div className="page-header">
                <div>
                    <h1>Categories</h1>
                    <p>Manage product categories</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            {/* Categories Grid */}
            <div className="categories-grid">
                {categories.map(category => (
                    <div key={category.id} className="category-card">
                        <div className="category-header">
                            <h3>{category.name}</h3>
                            <div className="category-actions">
                                <button
                                    className="action-btn"
                                    title="Edit"
                                    onClick={() => handleEdit(category)}
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="action-btn danger"
                                    title="Delete"
                                    onClick={() => handleDelete(category.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="category-description">{category.description}</p>
                        <span className="category-id">ID: {category.id}</span>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="no-results">
                    <p>No categories found. Add your first category!</p>
                </div>
            )}

            {/* Edit/Add Modal */}
            {showModal && editingCategory && (
                <div className="modal-overlay">
                    <div className="modal modal-sm">
                        <div className="modal-header">
                            <h2>{editingCategory.id ? 'Edit Category' : 'Add New Category'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Category Name *</label>
                                <input
                                    type="text"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editingCategory.description}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                    rows="3"
                                    placeholder="Enter category description"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Icon Name</label>
                                <input
                                    type="text"
                                    value={editingCategory.icon}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                                    placeholder="Lucide icon name (e.g., Layers, Grid3X3)"
                                />
                                <span className="form-hint">Use Lucide React icon names</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={18} />
                                Save Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCategories
