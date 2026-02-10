import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1) => {
                const items = get().items
                // Handle both Appwrite ($id) and potential legacy (id) IDs
                const productId = product.id || product.$id
                const existingItem = items.find(item => item.id === productId)

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.id === productId
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    })
                } else {
                    set({
                        items: [...items, { ...product, id: productId, quantity }]
                    })
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter(item => item.id !== productId)
                })
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set({
                    items: get().items.map(item =>
                        item.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                })
            },

            clearCart: () => {
                set({ items: [] })
            },

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            }
        }),
        {
            name: 'choice-stones-cart'
        }
    )
)

export default useCartStore
