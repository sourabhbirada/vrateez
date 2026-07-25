import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vrateez.com'

  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bulk-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Category pages
  const categories = [
    'cookies',
    'infused-cookie',
    'energy-on-the-go',
    'savory-snacks',
    'wholesome-delights',
  ]

  const categoryRoutes = categories.map(category => ({
    url: `${baseUrl}/shop?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // TODO: Add dynamic product pages
  // Fetch from API and add product URLs
  // const products = await getProductsApi({ limit: 100 })
  // const productRoutes = products.items.map(product => ({
  //   url: `${baseUrl}/product/${product.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }))

  return [...routes, ...categoryRoutes]
}
