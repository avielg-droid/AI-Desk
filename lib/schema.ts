import type { Product, FAQ } from '@/types/product'

export function buildProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: product.affiliateUrl,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        description: 'See current price on Amazon',
      },
      seller: {
        '@type': 'Organization',
        name: 'Amazon',
      },
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Organization',
        name: 'The AI Desk',
      },
      reviewBody: product.verdict,
      datePublished: product.lastUpdated,
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  }
}

export function buildFAQSchema(faq: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The AI Desk',
    url: 'https://theaidesk.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://theaidesk.com/og-image.png',
      width: 1200,
      height: 630,
    },
    description: 'Independent benchmark-driven reviews of GPUs, Mini PCs, and AI accessories for running large language models and Stable Diffusion locally.',
    sameAs: [
      'https://twitter.com/theaidesk',
      'https://www.reddit.com/r/LocalLLaMA/',
    ],
    knowsAbout: [
      'Local AI hardware',
      'Large language models',
      'GPU benchmarks',
      'Stable Diffusion',
      'Ollama',
      'VRAM requirements',
      'Memory bandwidth',
      'Tokens per second',
      'Mini PCs for AI',
    ],
  }
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The AI Desk',
    url: 'https://theaidesk.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://theaidesk.com/products?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildItemListSchema(
  name: string,
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}


export function buildHowToSchema({
  name,
  description,
  slug,
  steps,
}: {
  name: string
  description: string
  slug: string
  steps: { name: string; text: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url: `https://theaidesk.com/guides/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'The AI Desk',
      url: 'https://theaidesk.com',
    },
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

export function buildSpeakableSchema(cssSelectors: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  }
}

export function buildBlogPostingSchema({
  title,
  description,
  publishedAt,
  updatedAt,
  slug,
}: {
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt,
    url: `https://theaidesk.com/blog/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'The AI Desk',
      url: 'https://theaidesk.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The AI Desk',
      url: 'https://theaidesk.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://theaidesk.com/blog/${slug}`,
    },
  }
}
