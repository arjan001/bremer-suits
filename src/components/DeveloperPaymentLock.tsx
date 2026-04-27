import { Lock, Phone, Mail } from 'lucide-react'

export function DeveloperPaymentLock() {
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
          This website has been temporarily disabled until the outstanding invoice
          for development and SEO work is settled. Calls have gone unanswered and
          shop visits have not resulted in payment. The work is delivered, the
          invoice is now <span className="text-black font-semibold">one full week past due</span>.
          Kindly settle the balance to restore the site &mdash; it represents your
          image and your business image.
        </p>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="tel:+254113626187"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-[#1a1a1a]/90 transition-colors duration-300 font-semibold"
          >
            <Phone size={14} />
            0113 626 187
          </a>
          <a
            href="mailto:arjannky@gmail.com?subject=Outstanding%20Invoice%20%E2%80%94%20Website"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase border border-black/80 text-black hover:bg-black hover:text-white transition-colors duration-300 font-semibold"
          >
            <Mail size={14} />
            arjannky@gmail.com
          </a>
        </div>

        <p className="text-[11px] tracking-wider text-[#1a1a1a]/40">
          Once payment clears, full access is restored automatically.
        </p>
      </div>
    </div>
  )
}
