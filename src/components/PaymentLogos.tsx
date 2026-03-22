interface LogoProps {
  className?: string
  size?: number
}

export function VisaLogo({ className = '', size = 48 }: LogoProps) {
  const h = size * 0.6
  return (
    <svg
      viewBox="0 0 780 500"
      width={size}
      height={h}
      className={className}
      aria-label="Visa"
      role="img"
    >
      <rect width="780" height="500" rx="40" fill="#1A1F71" />
      <path
        d="M293.2 348.7l33.4-195.8h53.4l-33.4 195.8H293.2zM540.7 157.2c-10.6-4-27.2-8.3-47.9-8.3-52.8 0-90 26.6-90.2 64.6-.3 28.1 26.5 43.8 46.8 53.2 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-32 19.2-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 43.8c12.5 5.5 35.6 10.2 59.6 10.5 56.2 0 92.6-26.3 93-67.1.2-22.4-14.1-39.4-45-53.4-18.7-9.1-30.2-15.2-30.1-24.4 0-8.2 9.7-16.9 30.7-16.9 17.5-.3 30.2 3.5 40.1 7.5l4.8 2.3 7.2-42.1z"
        fill="#fff"
      />
      <path
        d="M615.5 152.9h-41.3c-12.8 0-22.4 3.5-28 16.3L460 348.7h56.2s9.2-24.1 11.3-29.4c6.1 0 60.8.1 68.6.1 1.6 6.9 6.5 29.3 6.5 29.3h49.7l-43.3-195.8h6.5zm-83.2 126.3c4.4-11.3 21.4-54.8 21.4-54.8-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47 12.5 56.6h-44.6z"
        fill="#fff"
      />
      <path
        d="M247.6 152.9l-52.3 133.5-5.6-27c-9.7-31.2-40-65.1-73.9-82l47.9 171.2h56.6l84.2-195.7h-56.9z"
        fill="#fff"
      />
      <path
        d="M146.9 152.9H59.7l-.7 3.8c67.1 16.2 111.5 55.4 129.9 102.5l-18.7-90c-3.2-12.5-12.6-15.8-23.3-16.3z"
        fill="#F7B600"
      />
    </svg>
  )
}

export function MastercardLogo({ className = '', size = 48 }: LogoProps) {
  const h = size * 0.6
  return (
    <svg
      viewBox="0 0 780 500"
      width={size}
      height={h}
      className={className}
      aria-label="Mastercard"
      role="img"
    >
      <rect width="780" height="500" rx="40" fill="#000" />
      <circle cx="310" cy="250" r="140" fill="#EB001B" />
      <circle cx="470" cy="250" r="140" fill="#F79E1B" />
      <path
        d="M390 148.5c34.8 27.8 57 70 57 117.5s-22.2 89.7-57 117.5c-34.8-27.8-57-70-57-117.5s22.2-89.7 57-117.5z"
        fill="#FF5F00"
      />
    </svg>
  )
}

export function MpesaLogo({ className = '', size = 48 }: LogoProps) {
  const h = size * 0.6
  return (
    <svg
      viewBox="0 0 780 500"
      width={size}
      height={h}
      className={className}
      aria-label="M-PESA"
      role="img"
    >
      <rect width="780" height="500" rx="40" fill="#4CAF50" />
      <g transform="translate(100, 130)">
        {/* Phone icon */}
        <rect x="0" y="10" width="80" height="130" rx="12" fill="none" stroke="#fff" strokeWidth="8" />
        <line x1="25" y1="125" x2="55" y2="125" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="35" r="8" fill="none" stroke="#fff" strokeWidth="5" />
        {/* Signal waves */}
        <path d="M65 30 C75 20, 85 20, 85 30" fill="none" stroke="#C8E6C9" strokeWidth="5" strokeLinecap="round" />
        <path d="M65 15 C80 0, 100 0, 100 15" fill="none" stroke="#C8E6C9" strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* M-PESA text */}
      <text x="300" y="225" fontFamily="Arial, Helvetica, sans-serif" fontSize="90" fontWeight="bold" fill="#fff" dominantBaseline="middle">
        M-PESA
      </text>
      <text x="300" y="300" fontFamily="Arial, Helvetica, sans-serif" fontSize="36" fill="#C8E6C9" dominantBaseline="middle">
        by Safaricom
      </text>
    </svg>
  )
}

export function WhatsAppLogo({ className = '', size = 48 }: LogoProps) {
  const h = size * 0.6
  return (
    <svg
      viewBox="0 0 780 500"
      width={size}
      height={h}
      className={className}
      aria-label="WhatsApp"
      role="img"
    >
      <rect width="780" height="500" rx="40" fill="#25D366" />
      <g transform="translate(230, 90)">
        <path
          d="M160 0C89.3 0 32 57.3 32 128c0 24.2 6.7 46.8 18.4 66.1L32 320l128.7-18c18.3 10.3 39.4 16.2 61.3 16.2 70.7 0 128-57.3 128-128S230.7 0 160 0zm0 234.7c-20.3 0-40.2-5.5-57.4-15.9l-4.1-2.4-42.5 11.1 11.3-41.3-2.7-4.3c-11.4-18.2-17.4-39.2-17.4-60.9 0-58.8 47.9-106.7 106.8-106.7 58.8 0 106.7 47.9 106.7 106.7 0 58.9-47.9 106.7-106.7 106.7zm58.5-79.9c-3.2-1.6-19-9.4-21.9-10.5-2.9-1.1-5.1-1.6-7.2 1.6-2.1 3.2-8.2 10.5-10.1 12.6-1.9 2.1-3.7 2.4-6.9.8-3.2-1.6-13.5-5-25.7-15.9-9.5-8.5-15.9-19-17.8-22.2-1.9-3.2-.2-4.9 1.4-6.5 1.4-1.4 3.2-3.7 4.8-5.6 1.6-1.9 2.1-3.2 3.2-5.3 1.1-2.1.5-4-.3-5.6-.8-1.6-7.2-17.3-9.8-23.7-2.6-6.2-5.2-5.4-7.2-5.5-1.9-.1-4-.1-6.1-.1-2.1 0-5.6.8-8.5 4-2.9 3.2-11.2 10.9-11.2 26.7s11.5 31 13.1 33.1c1.6 2.1 22.6 34.5 54.8 48.4 7.7 3.3 13.7 5.3 18.3 6.8 7.7 2.4 14.7 2.1 20.2 1.3 6.2-.9 19-7.8 21.7-15.3 2.7-7.5 2.7-14 1.9-15.3-.8-1.4-2.9-2.2-6.1-3.8z"
          fill="#fff"
        />
      </g>
    </svg>
  )
}

/** Small inline badge versions for compact display */
export function VisaBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 20" width="36" height="12" className={className} aria-label="Visa">
      <rect width="60" height="20" rx="3" fill="#1A1F71" />
      <text x="30" y="14" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="bold" fill="#fff">VISA</text>
    </svg>
  )
}

export function MastercardBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 20" width="36" height="12" className={className} aria-label="Mastercard">
      <rect width="60" height="20" rx="3" fill="#252525" />
      <circle cx="23" cy="10" r="7" fill="#EB001B" />
      <circle cx="37" cy="10" r="7" fill="#F79E1B" />
      <path d="M30 4.6a6.96 6.96 0 0 1 0 10.8 6.96 6.96 0 0 1 0-10.8z" fill="#FF5F00" />
    </svg>
  )
}

export function MpesaBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 20" width="44" height="12" className={className} aria-label="M-PESA">
      <rect width="72" height="20" rx="3" fill="#4CAF50" />
      <text x="36" y="14" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="9" fontWeight="bold" fill="#fff">M-PESA</text>
    </svg>
  )
}

/** Card brand indicator shown in card number input */
export function CardBrandIndicator({ brand }: { brand: 'visa' | 'mastercard' | '' }) {
  if (brand === 'visa') {
    return (
      <svg viewBox="0 0 48 30" width="38" height="24" aria-label="Visa detected">
        <rect width="48" height="30" rx="4" fill="#1A1F71" />
        <text x="24" y="19" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="bold" fill="#fff" letterSpacing="0.5">VISA</text>
      </svg>
    )
  }
  if (brand === 'mastercard') {
    return (
      <svg viewBox="0 0 48 30" width="38" height="24" aria-label="Mastercard detected">
        <rect width="48" height="30" rx="4" fill="#252525" />
        <circle cx="19" cy="15" r="8" fill="#EB001B" />
        <circle cx="29" cy="15" r="8" fill="#F79E1B" />
        <path d="M24 8.5a7.96 7.96 0 0 1 0 13 7.96 7.96 0 0 1 0-13z" fill="#FF5F00" />
      </svg>
    )
  }
  return null
}
