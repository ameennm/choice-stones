// Products data for Choice Stones
// Categories and products - No pricing displayed

export const categories = [
    {
        id: 'paving-stones',
        name: 'Paving Stones',
        description: 'Premium quality paving stones for driveways, pathways & outdoor flooring',
        icon: 'Layers',
        image: '/products/category-paving-new.jpeg',
        productCount: 22
    },
    {
        id: 'cladding-stones',
        name: 'Cladding Stones',
        description: 'Natural stone cladding, tiles, mosaics & terracotta for walls & facades',
        icon: 'LayoutGrid',
        image: '/products/cladding-category.jpg',
        productCount: 130
    },
    {
        id: 'stone-products',
        name: 'Stone Products',
        description: 'Garden benches, granite pillars, stone tables & chairs',
        icon: 'Landmark',
        image: '/products/stone products-category.jpg',
        productCount: 3
    },
    {
        id: 'artificial-grass',
        name: 'Artificial Grass & Imported Grass',
        description: 'High-quality artificial and imported grass for landscaping',
        icon: 'Sprout',
        image: '/products/artificial grass category.webp',
        productCount: 5
    },
    {
        id: 'pebble-stones',
        name: 'Pebble Stones',
        description: 'Choice river pebbles & decorative pebble collections',
        icon: 'Circle',
        image: '/products/pebbles.jpg',
        productCount: 7
    }
];

// Helper to create placeholder image array (4 slots per product)
const img = (name) => [
    `/products/${name}-1.jpg`,
    `/products/${name}-2.jpg`,
    `/products/${name}-3.jpg`,
    `/products/${name}-4.jpg`
];

export const products = [];

export const testimonials = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        role: 'Architect',
        company: 'Design Studio Kerala',
        content: 'Choice Stones has been our go-to supplier for premium natural stones. Their collection is exceptional - perfect finish, timely delivery, and competitive pricing.',
        rating: 5
    },
    {
        id: 2,
        name: 'Priya Menon',
        role: 'Interior Designer',
        company: 'Priya Interiors',
        content: 'The quality of cladding stones from Choice Stones is unmatched. My clients are always impressed with the natural beauty and durability. Highly recommended!',
        rating: 5
    },
    {
        id: 3,
        name: 'Mohammed Shareef',
        role: 'Construction Contractor',
        company: 'Shareef Constructions',
        content: 'We have completed over 50 projects using Choice Stones products. Their paving stones are perfect for commercial applications. Great service!',
        rating: 5
    }
];

export const companyInfo = {
    name: 'Choice Stones',
    tagline: 'Premium Natural Stones & Tiles',
    description: 'Leading supplier of high-quality natural stones, cladding, paving, pebbles and artificial grass for construction and landscaping projects.',
    phone: '+91 62381 65933',
    email: 'info@choicestones.com',
    address: 'Industrial Area, Bangalore - 560001, Karnataka, India',
    workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    social: {
        facebook: '#',
        instagram: '#',
        whatsapp: '+916238165933',
        youtube: '#'
    }
};

export const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '100+', label: 'Stone Varieties' },
    { value: '15+', label: 'Years Experience' },
    { value: '1000+', label: 'Happy Clients' }
];
