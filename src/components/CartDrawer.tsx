import { Link } from '@tanstack/react-router'
import { X, Minus, Plus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, isCartOpen, setCartOpen } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-[95] h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2
            className="text-xl font-bold text-black"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Cart
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-400 text-sm mb-4">Your cart is empty</p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-24 bg-gray-50 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-black leading-tight">
                          {item.title}
                        </h3>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-0.5">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-0.5 text-gray-300 hover:text-black transition-colors shrink-0"
                        aria-label={`Remove ${item.title}`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0 mt-3 border border-gray-200 w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-black border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-black">Subtotal</span>
              <span className="text-base font-semibold text-black">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>

            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full py-3.5 bg-black text-white text-center text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              Checkout
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="block w-full py-3 border border-gray-200 text-center text-sm tracking-wide text-black font-medium hover:bg-gray-50 transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
