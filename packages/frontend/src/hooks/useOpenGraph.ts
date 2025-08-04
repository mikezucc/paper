import { useEffect } from 'react'

interface OpenGraphData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  siteName?: string
  author?: string
  publishedTime?: string
  tags?: string[]
}

export function useOpenGraph(data: OpenGraphData) {
  useEffect(() => {
    // Skip if running on server
    if (typeof document === 'undefined') return
    
    // Update document title
    document.title = data.title ? `${data.title} - Paper` : 'Paper'

    // Function to set or update meta tags
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attributeName = isName ? 'name' : 'property'
      let metaTag = document.querySelector(`meta[${attributeName}="${property}"]`) as HTMLMetaElement
      
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute(attributeName, property)
        document.head.appendChild(metaTag)
      }
      
      metaTag.content = content
    }

    // Set basic meta tags
    if (data.description) {
      setMetaTag('description', data.description, true)
    }

    // Set Open Graph meta tags
    setMetaTag('og:title', data.title)
    if (data.description) setMetaTag('og:description', data.description)
    if (data.image) {
      setMetaTag('og:image', data.image)
      setMetaTag('og:image:width', '1200')
      setMetaTag('og:image:height', '630')
    }
    if (data.url) setMetaTag('og:url', data.url)
    setMetaTag('og:type', data.type || 'article')
    setMetaTag('og:site_name', data.siteName || 'Paper')
    
    // Set article-specific meta tags
    if (data.author) setMetaTag('article:author', data.author)
    if (data.publishedTime) setMetaTag('article:published_time', data.publishedTime)
    if (data.tags) {
      data.tags.forEach((tag, index) => {
        setMetaTag(`article:tag:${index}`, tag)
      })
    }

    // Set Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image', true)
    setMetaTag('twitter:title', data.title, true)
    if (data.description) setMetaTag('twitter:description', data.description, true)
    if (data.image) setMetaTag('twitter:image', data.image, true)

    // Cleanup function to remove dynamically added meta tags
    return () => {
      // Reset title
      document.title = 'Paper'
      
      // Remove dynamically added meta tags
      const metaTags = document.querySelectorAll('meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], meta[name="description"]')
      metaTags.forEach(tag => {
        if (tag.parentNode === document.head) {
          document.head.removeChild(tag)
        }
      })
    }
  }, [data])
}