// src/components/SEO.tsx
"use client";

import { getSEOConfig } from "@/lib/seoConfig";
import Head from "next/head";
import { usePathname } from "next/navigation";

interface SEOProps {
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  customImage?: string;
  customSchema?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  customTitle,
  customDescription,
  customKeywords,
  customImage,
  customSchema
}) => {
  const pathname = usePathname();
  const seoData = getSEOConfig(pathname);

  const title = customTitle || seoData.title;
  const description = customDescription || seoData.description;
  const keywords = customKeywords || seoData.keywords;
  const ogImage = customImage || seoData.ogImage;
  const canonicalUrl = seoData.canonicalUrl;
  const ogType = seoData.ogType;
  const schemaMarkup = customSchema || seoData.schemaMarkup;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Schema Markup */}
      {schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaMarkup)
          }}
        />
      )}
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default SEO;