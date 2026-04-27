import { Lock, Phone } from 'lucide-react'

export function DeveloperPaymentLock() {
  const whatsappUrl = 'https://wa.me/254113626187?text=Hello%2C%20regarding%20the%20outstanding%20website%20balance.'

  return (
    <div className="min-h-screen w-full bg-[#f5f1ea] text-[#1a1a1a] flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="max-w-xl w-full text-center">
        {/* Lock badge */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
            <Lock size={22} className="text-[#c9a961]" strokeWidth={2.25} />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#c9a961] font-semibold mb-4">
          Service Temporarily Suspended
        </p>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-5xl font-bold leading-[1.05] mb-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Pay Your Developer
        </h1>

        {/* Gold rule */}
        <div className="w-12 h-0.5 bg-[#c9a961] mx-auto mb-6" />

        {/* Message */}
        <p className="text-sm sm:text-base text-[#1a1a1a]/70 leading-relaxed mb-8">
          This website has been temporarily disabled until the outstanding
          invoice for development and SEO work is settled. Calls have gone
          unanswered and shop visits have not resulted in payment. The work is
          delivered, the invoice is now
          <span className="text-black font-semibold"> one full week past due</span>.
          Kindly settle the balance to restore the site &mdash; it represents
          your image and your business image.
        </p>

        {/* CTA */}
        <div className="flex justify-center mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-[#1a1a1a] transition-colors duration-300 font-semibold"
          >
            <Phone size={14} />
            0113 626 187
          </a>
        </div>

        <p className="text-[11px] tracking-wider text-[#1a1a1a]/40">
          Once payment clears, full access is restored automatically.
        </p>
      </div>
    </div>
  )
}
