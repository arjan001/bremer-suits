import { createFileRoute, Link } from '@tanstack/react-router'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { useCart } from '@/lib/cart-context'
import { getProductById } from '@/lib/products'

export const Route = createFileRoute('/wishlist')({
  component: WishlistPage,
})

function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()

  const wishlistProducts = items
    .map((id) => getProductById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/suit-formal.webp"
            alt="Wishlist"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3 font-medium">
            Your Favorites
          </p>
          <h1
            className="text-4xl lg:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Wishlist
          </h1>
          <p className="text-white/60 font-light">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                <Heart size={32} className="text-gray-300" />
              </div>
              <h2
                className="text-2xl font-bold text-black mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Your wishlist is empty
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                Browse our collection and tap the heart icon on products you love to save them here.
              </p>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
              >
                Browse Collections
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <Link
                      to="/collections/$slug"
                      params={{ slug: product.id }}
                      className="block"
                    >
                      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover product-img-zoom"
                        />
                        {product.tag && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-[10px] tracking-wider uppercase font-semibold">
                            {product.tag}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    </Link>

                    <div className="p-4 lg:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] tracking-wide uppercase text-gray-400">
                          {product.category}
                        </p>
                        <p className="text-[11px] tracking-wide text-gray-400 hidden sm:block">
                          {product.fabric}
                        </p>
                      </div>
                      <Link
                        to="/collections/$slug"
                        params={{ slug: product.id }}
                      >
                        <h3 className="text-sm lg:text-base font-semibold text-black mb-1 hover:text-gray-600 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-black font-medium mb-4">{product.price}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            addItem({
                              id: product.id,
                              title: product.title,
                              price: product.numericPrice,
                              image: product.image,
                              category: product.category,
                              fabric: product.fabric,
                            })
                          }
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <ShoppingBag size={14} />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="flex items-center justify-center w-10 h-10 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                          aria-label={`Remove ${product.title} from wishlist`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
                >
                  Continue Shopping <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
