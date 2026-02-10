import { create } from 'zustand'
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite'
import { Query } from 'appwrite'

const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    initialized: false,

    fetchProducts: async (force = false) => {
        const { initialized, loading } = get()
        if (initialized && !force && !loading) return

        set({ loading: true, error: null })
        try {
            // Fetch all products (limit 1000 to get all)
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.limit(1000)]
            )
            set({ products: response.documents, loading: false, initialized: true })
        } catch (error) {
            console.error('Error fetching products:', error)
            set({ error: error.message, loading: false })
        }
    },

    getProduct: (id) => {
        return get().products.find(p => p.$id === id || p.id === id)
    },

    // Include static categories for now, but could be fetched if we migrate categories too
    categories: [
        {
            id: 'paving-stones',
            name: 'Paving Stones',
            description: 'Premium quality paving stones for driveways, pathways & outdoor flooring',
            icon: 'Layers',
            image: '/products/category-paving.jpg',
            productCount: 22
        },
        {
            id: 'cladding-stones',
            name: 'Cladding Stones',
            description: 'Natural stone cladding, tiles, mosaics & terracotta for walls & facades',
            icon: 'LayoutGrid',
            image: '/products/category-cladding.jpg',
            productCount: 60
        },
        {
            id: 'stone-products',
            name: 'Stone Products',
            description: 'Garden benches, granite pillars, stone tables & chairs',
            icon: 'Landmark',
            image: '/products/category-stone-products.jpg',
            productCount: 3
        },
        {
            id: 'artificial-grass',
            name: 'Artificial Grass & Imported Grass',
            description: 'High-quality artificial and imported grass for landscaping',
            icon: 'Sprout',
            image: '/products/category-grass.jpg',
            productCount: 5
        },
        {
            id: 'pebble-stones',
            name: 'Pebble Stones',
            description: 'Kalstone river pebbles & decorative pebble collections',
            icon: 'Circle',
            image: '/products/category-pebbles.jpg',
            productCount: 7
        }
    ]
}))

export default useProductStore
