import React, { useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { generateSeoMetadata, applySeoToDom, SeoMetadata } from '../services/seo';

interface DynamicSEOProps {
  isAdmin?: boolean;
}

export const DynamicSEO: React.FC<DynamicSEOProps> = ({ isAdmin = false }) => {
  const { activeTab, selectedProduct, filters, lang } = useStore();

  const seoData: SeoMetadata = useMemo(() => {
    return generateSeoMetadata({
      activeTab,
      selectedProduct,
      selectedCategory: filters.selectedCategory,
      lang,
      isAdmin
    });
  }, [activeTab, selectedProduct, filters.selectedCategory, lang, isAdmin]);

  // Synchronously update DOM head elements (document.title, meta, canonical link, JSON-LD)
  useEffect(() => {
    applySeoToDom(seoData);
  }, [seoData]);

  // Also render React 19 Document Metadata elements (automatically hoisted to <head>)
  return (
    <>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <link rel="canonical" href={seoData.canonicalUrl} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:type" content={seoData.ogType} />
      {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      {seoData.ogImage && <meta name="twitter:image" content={seoData.ogImage} />}
      {seoData.keywords && (
        <meta name="keywords" content={seoData.keywords.join(', ')} />
      )}
      <meta
        name="robots"
        content={seoData.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
      />
    </>
  );
};
