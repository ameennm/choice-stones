// Products data for Choice Stones
// Categories and products - No pricing displayed

export const categories = [
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
        description: 'Choice river pebbles & decorative pebble collections',
        icon: 'Circle',
        image: '/products/category-pebbles.jpg',
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

export const products = [
    // ============ PAVING STONES ============
    // --- Bangalore Stones ---
    { id: 'bangalore-stone', name: 'Bangalore Stone', category: 'paving-stones', subcategory: 'Bangalore Stones', description: 'Premium Bangalore stone for durable and elegant outdoor flooring solutions.', images: ['/products/paving-img1.jpg', '/products/paving-img5.jpg', '/products/paving-img8.jpg', '/products/paving-img1.jpg'] },
    { id: 'bangalore-stone-halfcut', name: 'Bangalore Stone Halfcut', category: 'paving-stones', subcategory: 'Bangalore Stones', description: 'Half-cut Bangalore stone offering a refined finish for pathways and courtyards.', images: ['/products/paving-img11.jpg', '/products/paving-img14.jpg', '/products/paving-img17.jpg', '/products/paving-img11.jpg'] },
    { id: 'bangalore-stone-fullcut', name: 'Bangalore Stone Fullcut', category: 'paving-stones', subcategory: 'Bangalore Stones', description: 'Full-cut Bangalore stone with precise dimensions for clean modern installations.', images: ['/products/paving-img20.jpg', '/products/paving-img23.jpg', '/products/paving-img26.jpg', '/products/paving-img20.jpg'] },
    { id: 'bangalore-grey-stone', name: 'Bangalore Grey Stone', category: 'paving-stones', subcategory: 'Bangalore Stones', description: 'Elegant grey-toned Bangalore stone that complements both modern and traditional architecture.', images: ['/products/bangalore-grey-stone.jpeg', '/products/bangalore-grey-stone.jpeg', '/products/paving-img36.jpg', '/products/paving-img29.jpg'] },
    { id: 'magadi-pink-stone', name: 'Magadi Pink Stone', category: 'paving-stones', subcategory: 'Bangalore Stones', description: 'Beautiful pink-hued Magadi stone adding warmth and character to any outdoor space.', images: ['/products/paving-img39.jpg', '/products/paving-img42.jpg', '/products/paving-img45.jpg', '/products/paving-img39.jpg'] },

    // --- Tandure Stones ---
    { id: 'tandure-anti-skid', name: 'Anti Skid Stone', category: 'paving-stones', subcategory: 'Tandure Stones', description: 'Anti-skid Tandure stone with textured surface for maximum safety in wet areas.', images: ['/products/antiskid-tandur-stones.jpeg', '/products/antiskid-tandur-stones.jpeg', '/products/paving-img54.jpg', '/products/paving-img48.jpg'] },
    { id: 'tandure-yellow', name: 'Tandure Yellow Stone', category: 'paving-stones', subcategory: 'Tandure Stones', description: 'Warm yellow-toned Tandure stone ideal for vibrant outdoor flooring designs.', images: ['/products/paving-img57.jpg', '/products/paving-img60.jpg', '/products/paving-img63.jpg', '/products/paving-img57.jpg'] },
    { id: 'tandure-coffee', name: 'Tandure Coffee Stone', category: 'paving-stones', subcategory: 'Tandure Stones', description: 'Rich coffee-colored Tandure stone for a sophisticated natural look.', images: ['/products/paving-img67.jpg', '/products/paving-img70.jpg', '/products/paving-img73.jpg', '/products/paving-img67.jpg'] },
    { id: 'tandure-grey', name: 'Tandure Grey Stone', category: 'paving-stones', subcategory: 'Tandure Stones', description: 'Classic grey Tandure stone suitable for commercial and residential flooring.', images: ['/products/paving-img76.jpg', '/products/paving-img79.jpg', '/products/paving-img82.jpg', '/products/paving-img76.jpg'] },
    { id: 'tandure-polishing', name: 'Tandure Polishing Stones', category: 'paving-stones', subcategory: 'Tandure Stones', description: 'Polished finish Tandure stones offering a sleek and refined surface.', images: ['/products/paving-img85.jpg', '/products/paving-img88.jpg', '/products/paving-img91.jpg', '/products/paving-img85.jpg'] },
    { id: 'tandure-semi-polished', name: 'Tandure Semi Polished', category: 'paving-stones', subcategory: 'Tandure Stones', description: 'Semi-polished Tandure stone balancing natural texture with subtle sheen.', images: ['/products/paving-img94.jpg', '/products/paving-img98.jpg', '/products/paving-img101.jpg', '/products/paving-img94.jpg'] },

    // --- Other Paving ---
    { id: 'kadappa-stone', name: 'Kadappa Stone', category: 'paving-stones', subcategory: 'Other Paving', description: 'Premium Kadappa limestone known for its durability and dark elegant finish.', images: ['/products/paving-img104.jpg', '/products/paving-img107.jpg', '/products/paving-img110.jpg', '/products/paving-img104.jpg'] },
    { id: 'black-stone', name: 'Black Stone', category: 'paving-stones', subcategory: 'Other Paving', description: 'Deep black natural stone for bold and contemporary flooring designs.', images: ['/products/black-exporting-quality.jpeg', '/products/black-exporting-quality.jpeg', '/products/paving-img119.jpg', '/products/paving-img113.jpg'] },

    // --- Cobble Stones ---
    { id: 'cobble-stone', name: 'Cobble Stone', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Classic cobblestone for traditional pathways and decorative paving.', images: ['/products/paving-img122.jpg', '/products/paving-img125.jpg', '/products/paving-img129.jpg', '/products/paving-img122.jpg'] },
    { id: 'pink-cobble', name: 'Pink Cobble', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Beautiful pink cobblestones adding a unique color accent to landscapes.', images: ['/products/paving-img132.jpg', '/products/paving-img135.jpg', '/products/paving-img138.jpg', '/products/paving-img132.jpg'] },
    { id: 'bangalore-white-cobble', name: 'Bangalore White Cobble', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'White cobblestones sourced from Bangalore quarries for pristine pathways.', images: ['/products/bangalore-white-black-stone.jpeg', '/products/bangalore-white-black-stone.jpeg', '/products/paving-img147.jpg', '/products/paving-img141.jpg'] },
    { id: 'natural-cobble', name: 'Natural Cobble', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Natural cobblestones with organic shapes and authentic texture.', images: ['/products/paving-img150.jpg', '/products/paving-img153.jpg', '/products/paving-img156.jpg', '/products/paving-img150.jpg'] },
    { id: 'natural-black-cobble', name: 'Natural Black Cobble', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Naturally dark cobblestones for dramatic landscape designs.', images: ['/products/paving-img160.jpg', '/products/paving-img163.jpg', '/products/paving-img166.jpg', '/products/paving-img160.jpg'] },
    { id: 'block-box-cut-cobble', name: 'Block Box Cut Cobble', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Precision box-cut cobblestones for uniform and modern paving patterns.', images: ['/products/paving-img169.jpg', '/products/paving-img172.jpg', '/products/paving-img175.jpg', '/products/paving-img169.jpg'] },
    { id: 'tandure-cobble', name: 'Tandure Cobble', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Tandure-origin cobblestones combining durability with natural beauty.', images: ['/products/paving-img178.jpg', '/products/paving-img181.jpg', '/products/paving-img184.jpg', '/products/paving-img178.jpg'] },
    { id: 'kadappa-cobble', name: 'Kadappa Cobble', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Kadappa cobblestones with classic dark tones for elegant paving.', images: ['/products/paving-img187.jpg', '/products/paving-img191.jpg', '/products/paving-img1.jpg', '/products/paving-img187.jpg'] },
    { id: 'temple-export-quality', name: 'Temple Exporting Quality', category: 'paving-stones', subcategory: 'Cobble Stones', description: 'Export-grade temple quality cobblestones meeting international standards.', images: ['/products/tumbled-exporting-quality.jpeg', '/products/tumbled-exporting-quality.jpeg', '/products/paving-img11.jpg', '/products/paving-img5.jpg'] },

    // ============ CLADDING STONES ============
    // --- Stone & Tile Products ---
    { id: 'rainbow-4x24', name: 'Rainbow', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '4x24', description: 'Vibrant rainbow stone tiles with natural multi-color bands.', images: img('rainbow') },
    { id: 'teak-sand-blast-6x24', name: 'Teak Sand Blast', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '6x24', description: 'Sand-blasted teak stone with a warm, textured surface finish.', images: img('teak-sand-blast') },
    { id: 'teak-champered-4x12', name: 'Teak Champered', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '4x12', description: 'Chamfered teak stone tiles with beveled edges for a refined look.', images: img('teak-champered') },
    { id: 'black-rough-4x12', name: 'Black Rough', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '4x12', description: 'Raw textured black stone for bold, natural wall cladding.', images: img('black-rough') },
    { id: 'natural-clay-3x9', name: 'Natural Clay', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '3x9', description: 'Earthy natural clay tiles for warm, organic wall finishes.', images: img('natural-clay') },
    { id: 'multi-gold-1x1', name: 'Multi Gold', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '1x1', description: 'Golden-hued mosaic tiles for luxurious accent walls.', images: img('multi-gold') },
    { id: 'white-rough-4x12', name: 'White Rough', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '4x12', description: 'Rough-textured white stone tiles for clean, natural wall cladding.', images: img('white-rough') },
    { id: 'latarate-stone', name: 'Latarate Stone', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '12x7, 7x7', description: 'Traditional laterite stone with rustic red-brown tones.', images: img('latarate-stone') },
    { id: 'chocolate', name: 'Chocolate', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Rich chocolate-brown stone for warm, inviting wall designs.', images: img('chocolate') },
    { id: 'n-green', name: 'N Green', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Natural green stone tile with earthy forest tones.', images: img('n-green') },
    { id: 'pista-green', name: 'Pista Green', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Light pistachio green stone for subtle, elegant accents.', images: img('pista-green') },
    { id: 'black-butching', name: 'Black Butching', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Deep black butching stone with a striking natural texture.', images: img('black-butching') },
    { id: 'pink-cladding', name: 'Pink', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Soft pink stone cladding for delicate, warm wall finishes.', images: img('pink-cladding') },
    { id: 'rustic-black', name: 'Rustic Black', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '12x6, 12', description: 'Rustic-finish black stone with aged character and charm.', images: img('rustic-black') },
    { id: 'c-gold', name: 'C Gold', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '12x6, 12x4', description: 'Classic gold stone with warm, luminous tones for elegant walls.', images: img('c-gold') },
    { id: 'automan', name: 'Automan', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '12x6, 12x4', description: 'Autumn-toned stone with rich earthy hues and natural variation.', images: img('automan') },
    { id: 'slate-black', name: 'Slate Black', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '12x4', description: 'Premium black slate for sleek, modern wall applications.', images: img('slate-black') },
    { id: 'pink-plain', name: 'Pink Plain', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '12x4', description: 'Plain pink stone with uniform color for clean wall finishes.', images: img('pink-plain') },
    { id: 'lime-black', name: 'Lime Black', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Dark limestone with subtle natural veining.', images: img('lime-black') },
    { id: 'black-restik', name: 'Black Restik', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Rustic black stone with natural split-face texture.', images: img('black-restik') },
    { id: 's-white', name: 'S White', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Soft white stone for bright, airy wall cladding.', images: img('s-white') },
    { id: 'cera', name: 'Cera', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Ceramic-finish stone with smooth, refined surface.', images: img('cera') },
    { id: 't-yellow', name: 'T Yellow', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Warm yellow stone for sunlit, welcoming wall accents.', images: img('t-yellow') },
    { id: 'flammed-black', name: 'Flammed Black', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Flame-finished black stone with distinctive thermal texture.', images: img('flammed-black') },
    { id: 'agra-red', name: 'Agra Red', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Rich red sandstone inspired by iconic Agra architecture.', images: img('agra-red') },
    { id: 'calibration-slab', name: 'Calibration Slab', category: 'cladding-stones', subcategory: 'Stone & Tile Products', size: '24x1', description: 'Precision-calibrated slabs for uniform wall installations.', images: img('calibration-slab') },
    { id: 'm-green', name: 'M-Green', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Medium green stone with rich natural color depth.', images: img('m-green') },
    { id: 'automn', name: 'Automn', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Autumn-colored stone with warm orange and brown tones.', images: img('automn') },
    { id: 'copper', name: 'Copper', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Copper-toned stone with metallic warm undertones.', images: img('copper') },
    { id: 'd-green', name: 'D-Green', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Deep green stone for dramatic, nature-inspired walls.', images: img('d-green') },
    { id: 'silver-grey', name: 'Silver Grey', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Sophisticated silver-grey stone for contemporary elegance.', images: img('silver-grey') },
    { id: 'silver-shine', name: 'Silver Shine', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Shimmer-finished silver stone with subtle sparkle.', images: img('silver-shine') },
    { id: 'star-gallexy', name: 'Star Gallexy', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Galaxy-patterned stone with sparkling mineral inclusions.', images: img('star-gallexy') },
    { id: 'jek-black', name: 'Jek Black', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Jet-black stone for bold, striking wall features.', images: img('jek-black') },
    { id: 'teak-cladding', name: 'Teak', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Warm teak-toned stone for classic, natural wall cladding.', images: img('teak-cladding') },
    { id: 'forest-fire', name: 'Forest Fire', category: 'cladding-stones', subcategory: 'Stone & Tile Products', description: 'Fiery stone with dramatic red and orange natural patterns.', images: img('forest-fire') },

    // --- Stacking & Panels ---
    { id: 'stacking-2x12', name: 'Stacking', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '2x12, 4x12', description: 'Stacked stone panels for textured feature walls.', images: img('stacking') },
    { id: 'waterfall-cgold', name: 'Waterfall C-Gold', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2', description: 'Waterfall-style gold stone panels for cascading wall effects.', images: img('waterfall-cgold') },
    { id: 'waterfall-black', name: 'Waterfall Black', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2', description: 'Waterfall-style black stone panel creating flowing wall texture.', images: img('waterfall-black') },
    { id: 'waterfall-autumn', name: 'Waterfall Autumn', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2', description: 'Waterfall autumn stone panel with warm seasonal tones.', images: img('waterfall-autumn') },
    { id: 'panel-kk-white', name: 'Panel KK White', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'White stone panel for clean, modern feature walls.', images: img('panel-kk-white') },
    { id: 'panel-restik-black', name: 'Panel Restik Black', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'Rustic black stone panel with bold textured finish.', images: img('panel-restik-black') },
    { id: 'panel-d-green', name: 'Panel D-Green', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'Deep green stone panel for nature-inspired walls.', images: img('panel-d-green') },
    { id: 'panel-3d-mix', name: 'Panel 3D Mix', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: '3D mixed stone panel for dramatic dimensional effects.', images: img('panel-3d-mix') },
    { id: 'panel-indian-autumn', name: 'Panel Indian Autumn', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'Indian autumn stone panel with warm earthy palette.', images: img('panel-indian-autumn') },
    { id: 'panel-green-restik', name: 'Panel Green Restik', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'Green rustic stone panel with organic texture.', images: img('panel-green-restik') },
    { id: 'panel-l-black', name: 'Panel L Black', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'Black ledger stone panel for sleek feature walls.', images: img('panel-l-black') },
    { id: 'panel-teak-rock', name: 'Panel Teak Rock', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'Teak rock stone panel with natural warmth and texture.', images: img('panel-teak-rock') },
    { id: 'panel-silver-shine', name: 'Panel Silver Shine', category: 'cladding-stones', subcategory: 'Stacking & Panels', size: '6x2, 6x24', description: 'Silver shimmer stone panel for modern accent walls.', images: img('panel-silver-shine') },

    // --- Chipout Series ---
    { id: 'chipout-grey', name: 'Chipout Grey', category: 'cladding-stones', subcategory: 'Chipout Series', size: '4', description: 'Grey chipout stone with chipped-edge texture.', images: img('chipout-grey') },
    { id: 'chipout-black', name: 'Chipout Black', category: 'cladding-stones', subcategory: 'Chipout Series', size: '4', description: 'Black chipout stone for bold textured finishes.', images: img('chipout-black') },
    { id: 'chipout-pink', name: 'Chipout Pink', category: 'cladding-stones', subcategory: 'Chipout Series', size: '4', description: 'Pink chipout stone adding soft warmth to walls.', images: img('chipout-pink') },
    { id: 'chipout-rainbow', name: 'Chipout Rainbow', category: 'cladding-stones', subcategory: 'Chipout Series', size: '4', description: 'Rainbow chipout stone with multi-colored natural bands.', images: img('chipout-rainbow') },
    { id: 'chipout-white', name: 'Chipout White', category: 'cladding-stones', subcategory: 'Chipout Series', size: '4', description: 'White chipout stone for bright textured walls.', images: img('chipout-white') },
    { id: 'chipout-teak', name: 'Chipout Teak', category: 'cladding-stones', subcategory: 'Chipout Series', size: '4', description: 'Teak chipout stone with warm wood-like tones.', images: img('chipout-teak') },
    { id: 'chipout-green', name: 'Chipout Green', category: 'cladding-stones', subcategory: 'Chipout Series', size: '4', description: 'Green chipout stone for natural wall accents.', images: img('chipout-green') },

    // --- Exogen Series ---
    { id: 'exogen-automn', name: 'Exogen Automn', category: 'cladding-stones', subcategory: 'Exogen Series', size: '25x2', description: 'Exogen autumn stone with warm seasonal tones.', images: img('exogen-automn') },
    { id: 'exogen-r-black', name: 'Exogen R Black', category: 'cladding-stones', subcategory: 'Exogen Series', size: '25x2', description: 'Exogen rustic black stone for bold wall features.', images: img('exogen-r-black') },
    { id: 'exogen-black', name: 'Exogen Black', category: 'cladding-stones', subcategory: 'Exogen Series', size: '25x2', description: 'Jet-black exogen stone for sleek modern cladding.', images: img('exogen-black') },
    { id: 'exogen-mosaic-automn', name: 'Exogen Mosaic Automn', category: 'cladding-stones', subcategory: 'Exogen Series', description: 'Autumn mosaic exogen stone with patterned warmth.', images: img('exogen-mosaic-automn') },
    { id: 'exogen-mosaic-pink', name: 'Exogen Mosaic Pink', category: 'cladding-stones', subcategory: 'Exogen Series', description: 'Pink mosaic exogen stone for decorative accents.', images: img('exogen-mosaic-pink') },

    // --- Mosaics ---
    { id: 'forest-teak-green', name: 'Forest Teak Green', category: 'cladding-stones', subcategory: 'Mosaics', size: '12x12', description: 'Forest teak green mosaic for nature-inspired designs.', images: img('forest-teak-green') },
    { id: 'yellow-teak-mosaic', name: 'Yellow Teak', category: 'cladding-stones', subcategory: 'Mosaics', size: '12x12', description: 'Yellow teak mosaic with 1-inch strips for warm patterns.', images: img('yellow-teak-mosaic') },
    { id: 'grenate-mosaics', name: 'Grenate Mosaics', category: 'cladding-stones', subcategory: 'Mosaics', size: '12x12', description: 'Grenate mosaic tiles with deep jewel tones.', images: img('grenate-mosaics') },
    { id: 'mint-roman', name: 'Mint Roman', category: 'cladding-stones', subcategory: 'Mosaics', size: '12x12', description: 'Mint Roman mosaic with cool refreshing tones.', images: img('mint-roman') },
    { id: 'teak-roman', name: 'Teak Roman', category: 'cladding-stones', subcategory: 'Mosaics', size: '12x12', description: 'Teak Roman mosaic with classic warm earth tones.', images: img('teak-roman') },
    { id: 'bidasar-brown', name: 'Bidasar Brown', category: 'cladding-stones', subcategory: 'Mosaics', size: '12x12', description: 'Bidasar brown mosaic with rich marbled waves.', images: img('bidasar-brown') },
    { id: 'bidasar-green', name: 'Bidasar Green', category: 'cladding-stones', subcategory: 'Mosaics', size: '12x12', description: 'Bidasar green mosaic with elegant natural veining.', images: img('bidasar-green') },

    // --- Terracotta ---
    { id: 'indian-jaalis', name: 'Indian Jaalis', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8.5x8.5', description: 'Traditional Indian jaali patterns in terracotta for ventilation and decor.', images: img('indian-jaalis') },
    { id: 'terracotta-jaali-edan', name: 'Terracotta Jaali Edan', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Edan pattern terracotta jaali for decorative screens.', images: img('terracotta-jaali-edan') },
    { id: 'terracotta-jaali-camp', name: 'Terracotta Jaali Camp', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Camp pattern terracotta jaali with geometric elegance.', images: img('terracotta-jaali-camp') },
    { id: 'terracotta-jaali-square', name: 'Terracotta Jaali Square', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Square pattern terracotta jaali for modern lattice walls.', images: img('terracotta-jaali-square') },
    { id: 'terracotta-jaali-ruby', name: 'Terracotta Jaali Ruby', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Ruby pattern terracotta jaali with intricate detailing.', images: img('terracotta-jaali-ruby') },
    { id: 'terracotta-jaali-zebra', name: 'Terracotta Jaali Zebra', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Zebra pattern terracotta jaali with striped design.', images: img('terracotta-jaali-zebra') },
    { id: 'terracotta-jaali-petal', name: 'Terracotta Jaali Petal', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Petal pattern terracotta jaali with floral motifs.', images: img('terracotta-jaali-petal') },
    { id: 'terracotta-jaali-pearl', name: 'Terracotta Jaali Pearl', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Pearl pattern terracotta jaali with circular elegance.', images: img('terracotta-jaali-pearl') },
    { id: 'terracotta-jaali-oppal', name: 'Terracotta Jaali Oppal', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Oppal pattern terracotta jaali with organic flowing shapes.', images: img('terracotta-jaali-oppal') },
    { id: 'terracotta-jaali-diamond', name: 'Terracotta Jaali Diamond', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '8x8', description: 'Diamond pattern terracotta jaali with sharp geometric design.', images: img('terracotta-jaali-diamond') },
    { id: 'terracotta-wall-cupuccino', name: 'Terracotta Wall Tile Cupuccino', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '240x60x9mm', description: 'Cappuccino-colored terracotta wall tiles with smooth finish.', images: img('terracotta-wall-cupuccino') },
    { id: 'terracotta-wall-chocolate', name: 'Terracotta Wall Tile Chocolate', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '240x60x9mm', description: 'Chocolate terracotta wall tiles with rich brown tones.', images: img('terracotta-wall-chocolate') },
    { id: 'terracotta-wall-fireclay', name: 'Terracotta Wall Tile Fireclay', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '240x60x9mm', description: 'Fireclay terracotta wall tiles with authentic kiln-baked look.', images: img('terracotta-wall-fireclay') },
    { id: 'terracotta-wall-terracotta', name: 'Terracotta Wall Tile Terracotta', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '240x60x9mm', description: 'Classic terracotta wall tiles with traditional earth tones.', images: img('terracotta-wall-terracotta') },
    { id: 'terracotta-floor-chocolate', name: 'Terracotta Floor Tile Chocolate', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '12x12', description: 'Chocolate terracotta floor tile for warm interiors.', images: img('terracotta-floor-chocolate') },
    { id: 'terracotta-floor-terracotta', name: 'Terracotta Floor Tile Terracotta', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '12x12', description: 'Classic terracotta floor tile with traditional charm.', images: img('terracotta-floor-terracotta') },
    { id: 'terracotta-floor-cuppuccino', name: 'Terracotta Floor Tile Cuppuccino', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '12x12', description: 'Cappuccino terracotta floor tile with soft warm tones.', images: img('terracotta-floor-cuppuccino') },
    { id: 'terracotta-floor-grey', name: 'Terracotta Floor Tile Grey', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '12x12', description: 'Grey terracotta floor tile for modern minimalist spaces.', images: img('terracotta-floor-grey') },
    { id: 'terracotta-floor-fireclay', name: 'Terracotta Floor Tile Fire Clay', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '12x12', description: 'Fire clay terracotta floor tile with rustic character.', images: img('terracotta-floor-fireclay') },
    { id: 'terracotta-floor-burgundy', name: 'Terracotta Floor Tile Burgundy', category: 'cladding-stones', subcategory: 'Terracotta Products', size: '12x12', description: 'Burgundy terracotta floor tile with deep wine tones.', images: img('terracotta-floor-burgundy') },

    // ============ STONE PRODUCTS ============
    { id: 'garden-stone-bench', name: 'Garden Stone Bench', category: 'stone-products', description: 'Hand-crafted natural stone bench for gardens and outdoor seating areas.', images: img('garden-stone-bench') },
    { id: 'granite-stone-pillar', name: 'Granite Stone Pillar', category: 'stone-products', description: 'Elegant granite pillars for structural and decorative applications.', images: img('granite-stone-pillar') },
    { id: 'stone-table-chair', name: 'Stone Table and Chair', category: 'stone-products', description: 'Durable natural stone table and chair set for outdoor living spaces.', images: img('stone-table-chair') },

    // ============ ARTIFICIAL GRASS ============
    { id: 'grass-25-green', name: '25mm Green', category: 'artificial-grass', description: '25mm artificial green grass for balconies and light landscaping.', images: img('grass-25-green') },
    { id: 'grass-35-green', name: '35mm Green', category: 'artificial-grass', description: '35mm artificial green grass for gardens and play areas.', images: img('grass-35-green') },
    { id: 'grass-40-green', name: '40mm Green', category: 'artificial-grass', description: '40mm premium artificial green grass for lush landscaping.', images: img('grass-40-green') },
    { id: 'grass-40-mix', name: '40mm Mix', category: 'artificial-grass', description: '40mm mixed-tone artificial grass for a natural, realistic look.', images: img('grass-40-mix') },
    { id: 'grass-50-green', name: '50mm Green', category: 'artificial-grass', description: '50mm luxury artificial green grass for premium outdoor spaces.', images: img('grass-50-green') },

    // ============ PEBBLE STONES ============
    { id: 'kalstone-river-pebble-mix', name: 'Choice River Pebble Mix', category: 'pebble-stones', description: 'Mixed river pebbles by Choice for vibrant landscape accents.', images: ['/products/pebble-img1.jpg', '/products/pebble-img5.jpg', '/products/pebble-img1.jpg', '/products/pebble-img5.jpg'] },
    { id: 'kalstone-river-white', name: 'River White', category: 'pebble-stones', description: 'Pure white river pebbles for clean, serene garden designs.', images: ['/products/pebble-img8.jpg', '/products/pebble-img11.jpg', '/products/pebble-img8.jpg', '/products/pebble-img11.jpg'] },
    { id: 'kalstone-river-black', name: 'River Black', category: 'pebble-stones', description: 'Deep black river pebbles for bold landscape contrast.', images: ['/products/pebble-img14.jpg', '/products/pebble-img17.jpg', '/products/pebble-img14.jpg', '/products/pebble-img17.jpg'] },
    { id: 'kalstone-zebra', name: 'Zebra Choice', category: 'pebble-stones', description: 'Striped zebra pebbles with unique black and white patterns.', images: ['/products/pebble-img20.jpg', '/products/pebble-img23.jpg', '/products/pebble-img20.jpg', '/products/pebble-img23.jpg'] },
    { id: 'kalstone-teak-wood', name: 'Teak Wood Choice', category: 'pebble-stones', description: 'Warm teak wood-toned pebbles for natural garden accents.', images: ['/products/pebble-img26.jpg', '/products/pebble-img29.jpg', '/products/pebble-img26.jpg', '/products/pebble-img29.jpg'] },
    { id: 'kalstone-himalayan-river', name: 'Choice Himalayan River Pebble', category: 'pebble-stones', description: 'Himalayan river pebbles with unique mountain-origin character.', images: ['/products/pebble-img32.jpg', '/products/pebble-img36.jpg', '/products/pebble-img32.jpg', '/products/pebble-img36.jpg'] },
    { id: 'kalstone-deep-purple', name: 'Choice Deep Purple', category: 'pebble-stones', description: 'Rich deep purple pebbles for luxurious landscape accents.', images: ['/products/pebble-img39.jpg', '/products/pebble-img42.jpg', '/products/pebble-img39.jpg', '/products/pebble-img42.jpg'] },
];

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
