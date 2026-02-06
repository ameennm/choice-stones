// Products data for Choice Stones
// Sample pricing based on typical tiles/stones market rates

export const categories = [
    {
        id: 'flooring-stones',
        name: 'Flooring Stones',
        description: 'Premium quality flooring stones for outdoor and indoor applications',
        icon: 'Layers'
    },
    {
        id: 'paving-blocks',
        name: 'Paving Blocks',
        description: 'Durable cobblestones and paving blocks for pathways and driveways',
        icon: 'Grid3X3'
    },
    {
        id: 'wall-cladding',
        name: 'Wall Cladding',
        description: 'Natural stone cladding for interior and exterior walls',
        icon: 'LayoutGrid'
    },
    {
        id: 'decorative-stones',
        name: 'Decorative Stones',
        description: 'Unique decorative stones for landscaping and accent features',
        icon: 'Sparkles'
    }
];

export const products = [
    {
        id: 'bangalore-grey-stone',
        name: 'Bangalore Grey Stone',
        subtitle: 'Granite Polished Lines',
        description: 'Premium quality Bangalore Grey Stone with elegant granite polished lines finish. Perfect for driveways, courtyards, and outdoor flooring. This stone offers exceptional durability and a sophisticated grey tone that complements both modern and traditional architecture.',
        category: 'flooring-stones',
        price: 85,
        unit: 'sq.ft',
        minOrder: 100,
        sizes: ['2x2 ft', '2x3 ft', '3x3 ft', 'Custom'],
        finish: ['Polished', 'Honed', 'Natural'],
        thickness: ['20mm', '25mm', '30mm'],
        features: [
            'Weather resistant',
            'Anti-slip surface',
            'Low maintenance',
            'Frost resistant',
            'Heat resistant'
        ],
        applications: ['Driveways', 'Courtyards', 'Patios', 'Commercial spaces'],
        images: [
            '/products/bangalore-grey-stone.jpeg',
            '/products/bangalore-white-black-stone.jpeg',
            '/products/antiskid-tandur-stones.jpeg',
            '/products/tumbled-exporting-quality.jpeg'
        ],
        inStock: true,
        featured: true,
        rating: 4.8,
        reviews: 156
    },
    {
        id: 'bangalore-white-black-stone',
        name: 'Bangalore White Black Stone',
        subtitle: '2x2 Size Premium Tiles',
        description: 'Stunning contrast with Bangalore White Black Stone tiles. The elegant white surface with natural black veining creates a premium aesthetic perfect for modern homes. Ideal for open courtyards and garden pathways with artificial grass integration.',
        category: 'flooring-stones',
        price: 95,
        unit: 'sq.ft',
        minOrder: 100,
        sizes: ['2x2 ft', '2x4 ft', 'Custom'],
        finish: ['Polished', 'Matt', 'Bush Hammered'],
        thickness: ['20mm', '25mm', '30mm', '40mm'],
        features: [
            'Unique veining pattern',
            'High durability',
            'Easy to clean',
            'UV resistant',
            'Natural beauty'
        ],
        applications: ['Courtyards', 'Gardens', 'Pathways', 'Residential flooring'],
        images: [
            '/products/bangalore-white-black-stone.jpeg',
            '/products/bangalore-grey-stone.jpeg',
            '/products/black-exporting-quality.jpeg',
            '/products/antiskid-tandur-stones.jpeg'
        ],
        inStock: true,
        featured: true,
        rating: 4.9,
        reviews: 203
    },
    {
        id: 'black-exporting-quality',
        name: 'Black Cobblestone',
        subtitle: 'Export Quality Pavers',
        description: 'Premium export quality black cobblestones, perfect for creating stunning pathways and decorative flooring patterns. These hand-selected stones offer consistent color and superior durability, meeting international export standards.',
        category: 'paving-blocks',
        price: 120,
        unit: 'sq.ft',
        minOrder: 50,
        sizes: ['4x4 inch', '6x6 inch', '8x8 inch'],
        finish: ['Tumbled', 'Natural', 'Polished'],
        thickness: ['40mm', '50mm', '60mm'],
        features: [
            'Export quality grading',
            'Uniform color',
            'High compressive strength',
            'Chemical resistant',
            'Long-lasting'
        ],
        applications: ['Pathways', 'Garden borders', 'Decorative patterns', 'Driveways'],
        images: [
            '/products/black-exporting-quality.jpeg',
            '/products/tumbled-exporting-quality.jpeg',
            '/products/bangalore-grey-stone.jpeg',
            '/products/antiskid-tandur-stones.jpeg'
        ],
        inStock: true,
        featured: true,
        rating: 4.7,
        reviews: 89
    },
    {
        id: 'tumbled-exporting-quality',
        name: 'Tumbled Natural Stone',
        subtitle: 'Export Quality Collection',
        description: 'Beautifully tumbled natural stones with a rustic, aged appearance. The tumbling process creates soft, rounded edges and an antique finish that adds character to any space. Available in various natural color tones.',
        category: 'decorative-stones',
        price: 75,
        unit: 'sq.ft',
        minOrder: 75,
        sizes: ['4x4 inch', '6x6 inch', 'Mixed sizes'],
        finish: ['Tumbled'],
        thickness: ['20mm', '25mm', '30mm'],
        features: [
            'Antique appearance',
            'Soft rounded edges',
            'Natural color variations',
            'Non-slip surface',
            'Weather resistant'
        ],
        applications: ['Interior flooring', 'Accent walls', 'Outdoor patios', 'Pool surrounds'],
        images: [
            '/products/tumbled-exporting-quality.jpeg',
            '/products/black-exporting-quality.jpeg',
            '/products/bangalore-white-black-stone.jpeg',
            '/products/bangalore-grey-stone.jpeg'
        ],
        inStock: true,
        featured: false,
        rating: 4.6,
        reviews: 124
    },
    {
        id: 'antiskid-tandur-stones',
        name: 'Antiskid Tandur Stones',
        subtitle: 'Safety Flooring Solution',
        description: 'Premium anti-skid Tandur stones with grooved surface texture for maximum safety. Ideal for wet areas, pool decks, and commercial spaces where slip resistance is paramount. The natural grey tone complements any architectural style.',
        category: 'flooring-stones',
        price: 110,
        unit: 'sq.ft',
        minOrder: 100,
        sizes: ['2x2 ft', '2x3 ft', '2x4 ft'],
        finish: ['Grooved', 'Textured', 'Natural'],
        thickness: ['25mm', '30mm', '40mm'],
        features: [
            'Maximum slip resistance',
            'Commercial grade',
            'Wet area suitable',
            'Easy maintenance',
            'Heavy traffic resistant'
        ],
        applications: ['Pool decks', 'Ramps', 'Commercial flooring', 'Wet areas', 'Staircases'],
        images: [
            '/products/antiskid-tandur-stones.jpeg',
            '/products/bangalore-grey-stone.jpeg',
            '/products/bangalore-white-black-stone.jpeg',
            '/products/tumbled-exporting-quality.jpeg'
        ],
        inStock: true,
        featured: true,
        rating: 4.9,
        reviews: 178
    }
];

export const testimonials = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        role: 'Architect',
        company: 'Design Studio Kerala',
        content: 'Choice Stones has been our go-to supplier for premium natural stones. Their Bangalore Grey Stone collection is exceptional - perfect finish, timely delivery, and competitive pricing.',
        rating: 5
    },
    {
        id: 2,
        name: 'Priya Menon',
        role: 'Interior Designer',
        company: 'Priya Interiors',
        content: 'The quality of tumbled stones from Choice Stones is unmatched. My clients are always impressed with the natural beauty and durability. Highly recommended!',
        rating: 5
    },
    {
        id: 3,
        name: 'Mohammed Shareef',
        role: 'Construction Contractor',
        company: 'Shareef Constructions',
        content: 'We have completed over 50 projects using Choice Stones products. Their anti-skid Tandur stones are perfect for commercial applications. Great service!',
        rating: 5
    }
];

export const companyInfo = {
    name: 'Choice Stones',
    tagline: 'Premium Natural Stones & Tiles',
    description: 'Leading supplier of high-quality natural stones, tiles, and marbles for construction and interior design projects.',
    phone: '+91 9876543210',
    email: 'info@choicestones.com',
    address: 'Industrial Area, Bangalore - 560001, Karnataka, India',
    workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    social: {
        facebook: '#',
        instagram: '#',
        whatsapp: '+919876543210',
        youtube: '#'
    }
};

export const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '50+', label: 'Stone Varieties' },
    { value: '15+', label: 'Years Experience' },
    { value: '1000+', label: 'Happy Clients' }
];
