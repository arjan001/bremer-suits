import { Lock, Phone } from 'lucide-react'

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
          A Note From Your Developer
        </p>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-5xl font-bold leading-[1.05] mb-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Kindly Pay Your Developer
        </h1>

        {/* Gold rule */}
        <div className="w-12 h-0.5 bg-[#c9a961] mx-auto mb-6" />

        {/* Message */}
        <p className="text-sm sm:text-base text-[#1a1a1a]/70 leading-relaxed mb-8">
          The website is fully delivered, yet a project balance remains owed to the
          developer and has not been paid despite countless calls. Numerous phone
          calls have gone unanswered, and every office visit has either found you
          unavailable or ended in a promise to pay that was never honoured. The
          agreed scope was a website, but SEO optimisation and Google Analytics
          were also delivered as a goodwill extra at no added cost &mdash; hours of
          additional work invested to lift your visibility, all of it built and
          earning you traffic. Kindly settle the balance, now due in
          <span className="text-black font-semibold"> one week</span>, to restore
          the site.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs tracking-[0.2em] uppercase bg-[#25D366] text-white hover:bg-[#1eb858] transition-colors duration-300 font-semibold"
          >
            <WhatsAppGlyph size={16} />
            Call Developer
          </a>
          <div className="flex items-center gap-2 text-[11px] text-[#1a1a1a]/50 tracking-wider">
            <Phone size={11} />
            <span className="font-mono">{maskedPhone}</span>
          </div>
        </div>

        <p className="text-[11px] tracking-wider text-[#1a1a1a]/40">
          Once payment clears, full access is restored automatically.
        </p>
      </div>
    </div>
  )
}
