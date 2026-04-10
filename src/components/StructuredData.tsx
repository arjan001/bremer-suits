import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

/**
 * StructuredData – Injects JSON-LD structured data into <head> based on current route.
 * Provides Organization, LocalBusiness, and page-specific schemas for SEO.
 */
export function StructuredData() {
  const router = useRouter()
  const pathname = router.state.location.pathname

  useEffect(() => {
    // Remove previous structured data scripts
    document.querySelectorAll('script[data-structured]').forEach((el) => el.remove())

    const schemas: object[] = []

    // Organization schema (always present)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Bremer Suits',
      alternateName: ['BREMER SUITS', 'BremerSuits', 'Bremer', 'bremer suits', 'Bremer Suits & Style'],
      url: 'https://bremersuits.com',
      logo: 'https://bremersuits.com/images/og-logo-gold-black.jpg',
      description:
        "Nairobi's leading specialists in high-end, custom-made suits for weddings, corporate leadership, and special occasions.",
      sameAs: [
        'https://www.facebook.com/BREMERSUITS/',
        'https://www.instagram.com/bremer_suits/',
        'https://www.tiktok.com/@bremersuits',
      ],
    })

    // LocalBusiness schema (always present)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://bremersuits.com/#localbusiness',
      name: 'Bremer Suits',
      alternateName: ['BREMER SUITS', 'BremerSuits', 'Bremer', 'bremer suits', 'Bremer Suits & Style'],
      description:
        'Premier bespoke tailoring and custom-made suits in Nairobi. Specializing in wedding suits, corporate attire, Ruracio styling, and expert alterations.',
      url: 'https://bremersuits.com',
      image: 'https://bremersuits.com/images/og-logo-gold-black.jpg',
      telephone: '+254700000000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Nairobi',
        addressLocality: 'Nairobi',
        addressRegion: 'Nairobi',
        addressCountry: 'KE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.2921,
        longitude: 36.8219,
      },
      priceRange: '$$$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '16:00',
        },
      ],
    })

    // Page-specific schemas
    if (pathname === '/') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Bremer Suits',
        alternateName: ['BREMER SUITS', 'BremerSuits', 'Bremer'],
        url: 'https://bremersuits.com',
        description:
          "Experience the art of perfection with Bremer Suits. Nairobi's leading specialists in high-end, custom-made suits.",
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://bremersuits.com/portfolio?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      })
    }

    if (pathname === '/services') {
      const services = [
        {
          name: 'High-End Tailoring Services',
          description:
            'Custom suits, sport coats, trousers & overcoats with premium fabric library from Italian & British mills.',
        },
        {
          name: 'Wedding Styling',
          description:
            'Custom groom & groomsmen suit packages, Ruracio (traditional ceremony) styling, and pre-wedding consultations.',
        },
        {
          name: 'Corporate Image Consulting',
          description:
            'Executive wardrobe audits, corporate dress code workshops, and professional styling sessions.',
        },
        {
          name: 'Expert Alterations',
          description:
            'Precision suit alterations, resizing, and garment restoration by master tailors in Nairobi.',
        },
      ]
      services.forEach((service) => {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: service.name,
          provider: {
            '@type': 'LocalBusiness',
            name: 'Bremer Suits',
          },
          description: service.description,
          areaServed: {
            '@type': 'City',
            name: 'Nairobi',
          },
        })
      })
    }

    if (pathname === '/portfolio') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'Bremer Suits Bespoke Gallery',
        description:
          'Browse our custom-made wedding tuxedos, ruracio attire, and sharp corporate wear designed for Nairobi\'s most influential men.',
        publisher: {
          '@type': 'Organization',
          name: 'Bremer Suits',
        },
      })
    }

    if (pathname === '/contact') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Book a Fitting at Bremer Suits',
        description:
          'Schedule a private consultation at our Nairobi studio for expert measurements, fabric selection, and personalized styling.',
        mainEntity: {
          '@type': 'LocalBusiness',
          name: 'Bremer Suits',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nairobi',
            addressCountry: 'KE',
          },
        },
      })
    }

    if (pathname === '/about') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Bremer Suits',
        description:
          'Discover the story of Bremer Suits. Traditional craftsmanship meets modern styling with the finest fabrics.',
        mainEntity: {
          '@type': 'Organization',
          name: 'Bremer Suits',
          foundingLocation: {
            '@type': 'Place',
            name: 'Nairobi, Kenya',
          },
        },
      })
    }

    if (pathname === '/faq') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: 'Frequently Asked Questions - Bremer Suits',
        description: 'Common questions about custom tailoring, pricing, fittings, and delivery at Bremer Suits.',
      })
    }

    // Inject all schemas
    schemas.forEach((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-structured', `schema-${index}`)
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    return () => {
      document.querySelectorAll('script[data-structured]').forEach((el) => el.remove())
    }
  }, [pathname])

  return null
}
