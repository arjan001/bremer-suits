import { Lock, AlertTriangle, Phone, Store, Wrench, BarChart3, Clock } from 'lucide-react'

function WhatsAppGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

export function DeveloperPaymentLock() {
  const whatsappUrl = 'https://wa.me/254113626187?text=Hello%2C%20regarding%20the%20outstanding%20website%20balance.'
  const maskedPhone = '+254 113 ••• 187'

  return (
    <div className="min-h-screen w-full bg-[#f5f1ea] text-[#1a1a1a] flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Decorative corner ornaments */}
      <div className="absolute top-0 left-0 w-40 h-40 border-t border-l border-[#c9a961]/30 m-6 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-40 border-b border-r border-[#c9a961]/30 m-6 pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative">
        {/* Lock badge */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#c9a961]/20 blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center ring-2 ring-[#c9a961]/40 ring-offset-4 ring-offset-[#f5f1ea]">
              <Lock size={24} className="text-[#c9a961]" strokeWidth={2.25} />
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#c9a961] font-semibold mb-4">
          A Note From Your Developer
        </p>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] mb-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Kindly Pay Your <span className="italic text-[#c9a961]">Developer</span>
        </h1>

        {/* Gold rule */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-10 h-px bg-[#c9a961]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a961]" />
          <div className="w-10 h-px bg-[#c9a961]" />
        </div>

        {/* Lead message */}
        <p className="text-sm sm:text-base text-[#1a1a1a]/75 leading-relaxed mb-8 max-w-lg mx-auto">
          The website is fully delivered, yet a project balance remains owed to the
          developer &mdash; unpaid despite countless calls and follow-ups.
        </p>

        {/* Grievance list */}
        <ul className="text-left max-w-lg mx-auto space-y-4 mb-9 bg-white/60 border border-[#c9a961]/30 px-6 py-6 backdrop-blur-sm">
          <li className="flex items-start gap-3.5">
            <span className="shrink-0 w-8 h-8 rounded-full bg-black/90 flex items-center justify-center mt-0.5">
              <Phone size={14} className="text-[#c9a961]" />
            </span>
            <p className="text-sm text-[#1a1a1a]/85 leading-relaxed pt-1">
              Numerous phone calls placed &mdash; <span className="font-semibold text-black">left unanswered</span>.
            </p>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="shrink-0 w-8 h-8 rounded-full bg-black/90 flex items-center justify-center mt-0.5">
              <Store size={14} className="text-[#c9a961]" />
            </span>
            <p className="text-sm text-[#1a1a1a]/85 leading-relaxed pt-1">
              Every visit to the office &mdash; either you were <span className="font-semibold text-black">unavailable</span>,
              or a promise to pay was made and <span className="font-semibold text-black">never honoured</span>.
            </p>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="shrink-0 w-8 h-8 rounded-full bg-black/90 flex items-center justify-center mt-0.5">
              <Wrench size={14} className="text-[#c9a961]" />
            </span>
            <p className="text-sm text-[#1a1a1a]/85 leading-relaxed pt-1">
              The agreed scope was a website &mdash; yet <span className="font-semibold text-black">SEO optimisation</span> and
              <span className="font-semibold text-black"> Google Analytics</span> were delivered as a goodwill extra at no added cost.
            </p>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="shrink-0 w-8 h-8 rounded-full bg-black/90 flex items-center justify-center mt-0.5">
              <BarChart3 size={14} className="text-[#c9a961]" />
            </span>
            <p className="text-sm text-[#1a1a1a]/85 leading-relaxed pt-1">
              Hours of additional work invested to lift your visibility &mdash; <span className="font-semibold text-black">all of it built, all of it earning you traffic</span>.
            </p>
          </li>
        </ul>

        {/* Deadline banner */}
        <div className="flex items-center justify-center gap-3 mb-8 mx-auto max-w-md bg-black text-white px-5 py-4">
          <AlertTriangle size={18} className="text-[#c9a961] shrink-0" />
          <p className="text-xs sm:text-sm tracking-wide">
            Balance now due in <span className="text-[#c9a961] font-bold">1 week</span> &mdash; final settlement window.
          </p>
        </div>

        {/* WhatsApp CTA */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-[#25D366] text-white hover:bg-[#1eb858] transition-all duration-300 shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:-translate-y-0.5"
          >
            <WhatsAppGlyph size={20} />
            <span className="text-sm tracking-[0.18em] uppercase font-bold">
              Settle on WhatsApp
            </span>
          </a>
          <div className="flex items-center gap-2 text-[11px] text-[#1a1a1a]/50 tracking-wider">
            <Phone size={11} />
            <span className="font-mono">{maskedPhone}</span>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 text-[11px] tracking-wider text-[#1a1a1a]/45 mt-8">
          <Clock size={11} />
          <span>Site restores automatically once the balance clears.</span>
        </div>
      </div>
    </div>
  )
}
