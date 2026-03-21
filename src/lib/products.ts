export interface ProductColor {
  name: string
  value: string
}

export interface Product {
  id: string
  title: string
  category: string
  fabric: string
  price: string
  numericPrice: number
  image: string
  tag?: string | null
  description?: string
  salePrice?: string
  originalPrice?: string
  colors: ProductColor[]
  sizes: string[]
  sku: string
}

function generateSKU(id: string): string {
  // Generate a deterministic UUID-like SKU from the product id
  const hash = id.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0
  }, 0)
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return `BRM-${hex.slice(0, 4).toUpperCase()}-${hex.slice(4, 8).toUpperCase()}`
}

const defaultSuitSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const defaultVestSizes = ['S', 'M', 'L', 'XL', 'XXL']

export const allProducts: Product[] = [
  {
    id: 'midnight-navy',
    title: 'The Midnight Navy',
    category: 'Business',
    fabric: 'Super 150s Wool',
    price: 'KSh 2,800',
    numericPrice: 2800,
    image: '/images/suit-navy.webp',
    tag: 'Best Seller',
    description:
      'A masterfully tailored navy suit crafted from Super 150s Wool. The Midnight Navy delivers a refined silhouette with impeccable drape, making it the ideal choice for boardroom meetings and formal occasions alike. Features a half-canvas construction, surgeon cuffs, and pick-stitch detailing throughout.',
    colors: [
      { name: 'Navy', value: '#1e3a5f' },
      { name: 'Deep Blue', value: '#0a1f3f' },
      { name: 'Steel Blue', value: '#4682b4' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('midnight-navy'),
  },
  {
    id: 'boardroom',
    title: 'The Boardroom',
    category: 'Business',
    fabric: 'Charcoal Pinstripe',
    price: 'KSh 2,400',
    numericPrice: 2400,
    image: '/images/suit-charcoal.webp',
    tag: 'New',
    description:
      'The quintessential executive suit. Cut from a luxurious charcoal pinstripe cloth, The Boardroom combines traditional tailoring techniques with a modern slim fit. A natural shoulder line and tapered trousers create a contemporary silhouette that commands respect in any professional setting.',
    colors: [
      { name: 'Charcoal', value: '#36454f' },
      { name: 'Dark Grey', value: '#3d3d3d' },
      { name: 'Slate', value: '#708090' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('boardroom'),
  },
  {
    id: 'eveningwear',
    title: 'The Eveningwear',
    category: 'Black Tie',
    fabric: 'Midnight Barathea',
    price: 'KSh 3,500',
    numericPrice: 3500,
    image: '/images/suit-formal.webp',
    tag: null,
    description:
      'For the most distinguished occasions. The Eveningwear tuxedo is crafted from premium midnight barathea with silk-faced peak lapels. Featuring a single-button closure, grosgrain side stripe, and hand-finished details that elevate every black-tie affair.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Midnight', value: '#191970' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('eveningwear'),
  },
  {
    id: 'continental',
    title: 'The Continental',
    category: 'Casual',
    fabric: 'Italian Linen Blend',
    price: 'KSh 2,200',
    numericPrice: 2200,
    image: '/images/suit-classic.webp',
    tag: 'Popular',
    description:
      'Relaxed elegance meets Italian craftsmanship. The Continental is tailored from a breathable Italian linen blend, perfect for warm-weather occasions and destination events. The soft, unstructured shoulder and patch pockets lend a casual yet polished aesthetic.',
    colors: [
      { name: 'Sand', value: '#c2b280' },
      { name: 'Olive', value: '#556b2f' },
      { name: 'Light Grey', value: '#b0b0b0' },
      { name: 'Cream', value: '#fffdd0' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('continental'),
  },
  {
    id: 'diplomat',
    title: 'The Diplomat',
    category: 'Business',
    fabric: 'Super 130s Merino',
    price: 'KSh 3,200',
    numericPrice: 3200,
    image: '/images/suit-business.webp',
    tag: null,
    description:
      'Engineered for the modern power player. The Diplomat is fashioned from Super 130s Merino wool sourced from Australia\'s finest mills. A structured shoulder, roped sleeve head, and double-vented back create an authoritative presence with every step.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Navy', value: '#1e3a5f' },
      { name: 'Charcoal', value: '#36454f' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('diplomat'),
  },
  {
    id: 'classic-vest-set',
    title: 'Classic Vest Set',
    category: 'Vests',
    fabric: 'Premium Wool Blend',
    price: 'KSh 1,800',
    numericPrice: 1800,
    image: '/images/suit-vest.webp',
    tag: 'New',
    description:
      'Versatile, refined, and endlessly wearable. The Classic Vest Set features a five-button waistcoat and matching trousers in a premium wool blend. Layer it under a blazer for formal occasions or wear it alone for a sharp, contemporary look.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Grey', value: '#808080' },
      { name: 'Brown', value: '#6b4226' },
      { name: 'Navy', value: '#1e3a5f' },
    ],
    sizes: defaultVestSizes,
    sku: generateSKU('classic-vest-set'),
  },
  {
    id: 'weekend',
    title: 'The Weekend',
    category: 'Casual',
    fabric: 'Cotton Twill',
    price: 'KSh 1,600',
    numericPrice: 1600,
    image: '/images/suit-casual.webp',
    tag: null,
    description:
      'Where comfort meets style. The Weekend is cut from a soft cotton twill that moves with you, featuring an unlined construction, patch pockets, and a relaxed fit. Perfect for brunches, gallery openings, and everything in between.',
    colors: [
      { name: 'Khaki', value: '#c3b091' },
      { name: 'Stone', value: '#928e85' },
      { name: 'Light Blue', value: '#add8e6' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('weekend'),
  },
  {
    id: 'gala',
    title: 'The Gala',
    category: 'Black Tie',
    fabric: 'Black Wool Mohair',
    price: 'KSh 3,800',
    numericPrice: 3800,
    image: '/images/suit-hero.webp',
    tag: 'Premium',
    description:
      'The pinnacle of evening elegance. The Gala dinner suit is crafted from a black wool-mohair blend that delivers a subtle, lustrous sheen under candlelight. Shawl lapels, a one-button closure, and hand-sewn buttonholes make this the definitive black-tie statement.',
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Midnight Blue', value: '#191970' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('gala'),
  },
  {
    id: 'summer-formal',
    title: 'Summer Formal',
    category: 'Seasonal',
    fabric: 'Ivory Tropical Wool',
    price: 'KSh 2,600',
    numericPrice: 2600,
    image: '/images/suit-navy.webp',
    tag: null,
    description:
      'A warm-weather masterpiece. Summer Formal is tailored from an ivory tropical wool that offers breathability without sacrificing structure. Ideal for outdoor weddings, garden parties, and summer galas where light hues and crisp tailoring set you apart.',
    colors: [
      { name: 'Ivory', value: '#fffff0' },
      { name: 'Cream', value: '#fffdd0' },
      { name: 'Pale Blue', value: '#afeeee' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('summer-formal'),
  },
  {
    id: 'heritage-tweed',
    title: 'Heritage Tweed',
    category: 'Seasonal',
    fabric: 'British Tweed',
    price: 'KSh 2,600',
    numericPrice: 2600,
    image: '/images/suit-business.webp',
    tag: 'New',
    description:
      'A distinguished piece inspired by British country heritage. The Heritage Tweed is crafted from authentic British tweed sourced from traditional mills in Scotland. Its textured weave and earthy tones bring character and warmth, making it the perfect companion for autumn events and countryside gatherings.',
    colors: [
      { name: 'Brown Tweed', value: '#8b6914' },
      { name: 'Green Tweed', value: '#4f6228' },
      { name: 'Rust', value: '#b7410e' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('heritage-tweed'),
  },
]

export const signatureProducts: Product[] = [
  {
    id: 'windsor-elegance',
    title: 'Windsor Elegance',
    category: 'Formal',
    fabric: 'Premium Barathea',
    image: '/images/suit-formal.webp',
    price: '$55.00 USD',
    salePrice: '$55.00 USD',
    originalPrice: '$60.00 USD',
    numericPrice: 55,
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Midnight', value: '#191970' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('windsor-elegance'),
  },
  {
    id: 'classic-gentleman',
    title: 'The Classic Gentleman',
    category: 'Three-Piece',
    fabric: 'Premium Wool Blend',
    image: '/images/suit-vest.webp',
    price: '$64.00 USD',
    salePrice: '$64.00 USD',
    originalPrice: '$70.00 USD',
    numericPrice: 64,
    colors: [
      { name: 'Charcoal', value: '#36454f' },
      { name: 'Navy', value: '#1e3a5f' },
      { name: 'Black', value: '#000000' },
    ],
    sizes: defaultVestSizes,
    sku: generateSKU('classic-gentleman'),
  },
  {
    id: 'urban-tailor',
    title: 'Urban Tailor',
    category: 'Casual',
    fabric: 'Stretch Cotton Blend',
    image: '/images/suit-casual.webp',
    price: '$75.00 USD',
    salePrice: '$75.00 USD',
    originalPrice: '$80.00 USD',
    numericPrice: 75,
    colors: [
      { name: 'Tan', value: '#d2b48c' },
      { name: 'Olive', value: '#556b2f' },
      { name: 'Grey', value: '#808080' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('urban-tailor'),
  },
  {
    id: 'royal-navy-charm',
    title: 'Royal Navy Charm',
    category: 'Business',
    fabric: 'Super 120s Wool',
    image: '/images/suit-navy.webp',
    price: '$55.00 USD',
    salePrice: '$55.00 USD',
    originalPrice: '$60.00 USD',
    numericPrice: 55,
    colors: [
      { name: 'Navy', value: '#1e3a5f' },
      { name: 'Royal Blue', value: '#4169e1' },
    ],
    sizes: defaultSuitSizes,
    sku: generateSKU('royal-navy-charm'),
  },
]

export function getProductById(id: string): Product | undefined {
  return [...allProducts, ...signatureProducts].find((p) => p.id === id)
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  const current = getProductById(currentId)
  if (!current) return allProducts.slice(0, limit)

  // Prefer same category, then fill with others
  const sameCategory = allProducts.filter(
    (p) => p.id !== currentId && p.category === current.category
  )
  const others = allProducts.filter(
    (p) => p.id !== currentId && p.category !== current.category
  )
  return [...sameCategory, ...others].slice(0, limit)
}
