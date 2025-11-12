import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export const SEO = ({
  title = "Jubee Love - Educational Games for Kids",
  description = "Interactive learning games for children featuring writing practice, shape recognition, and fun educational activities with Jubee the friendly bee mascot.",
  keywords = ["educational games", "kids learning", "interactive education", "children apps", "writing practice", "shape recognition"],
  ogImage = "/placeholder.svg",
  canonicalUrl
}: SEOProps) => {
  const location = useLocation();
  
  // Use location-based canonical URL if not provided
  const finalCanonicalUrl = useMemo(() => {
    if (canonicalUrl) return canonicalUrl;
    return `${window.location.origin}${location.pathname}`;
  }, [canonicalUrl, location.pathname]);

  // Memoize keywords string to prevent unnecessary updates
  const keywordsString = useMemo(() => keywords.join(', '), [keywords]);

  // Memoize structured data to prevent recreation on every render
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Jubee Love",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Any",
    "description": description,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "250"
    }
  }), [description]);
  useEffect(() => {
    // Update document title only if changed
    if (document.title !== title) {
      document.title = title;
    }

    // Optimized meta tag update - only update if content changed
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      // Only update if content actually changed
      if (element.getAttribute('content') !== content) {
        element.setAttribute('content', content);
      }
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywordsString);
    updateMetaTag('author', 'Jubee Love Team');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');

    // Open Graph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', finalCanonicalUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'Jubee Love', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Theme color
    updateMetaTag('theme-color', '#FFD93D');
    updateMetaTag('msapplication-TileColor', '#FFD93D');

    // Canonical URL - only update if changed
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    if (canonical.href !== finalCanonicalUrl) {
      canonical.href = finalCanonicalUrl;
    }

    // Structured data - only update if changed
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    const structuredDataString = JSON.stringify(structuredData);
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    
    if (scriptTag.textContent !== structuredDataString) {
      scriptTag.textContent = structuredDataString;
    }
  }, [title, description, keywordsString, ogImage, finalCanonicalUrl, structuredData]);

  return null;
};
