import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, url, image }) {
  const siteName = "The Prana Elixir";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Founded by an doctor, The Prana Elixir offers handcrafted cold process soaps and pure skincare. Chemical-free, safe for delicate skin, and deeply nurturing.";
  const defaultKeywords = "artisanal soap, cold process soap, ayurvedic skincare, natural skincare, chemical free soap, luxury wellness, sensitive skin care, The Prana Elixir";
  const defaultImage = "https://www.thepranaelixir.com/src/assets/logo.svg"; // Fallback image
  const defaultUrl = "https://www.thepranaelixir.com/";

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={url || defaultUrl} />

      {/* Open Graph (Facebook/LinkedIn) */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
