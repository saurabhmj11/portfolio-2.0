import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
    publishedAt?: string;
    tags?: string[];
}

const BASE_URL = 'https://saurabhlokhande.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

const Seo: React.FC<SeoProps> = ({
    title = 'Saurabh Lokhande — AI Engineer & Generative AI Specialist',
    description = 'AI Engineer specializing in LLM agents, RAG systems, and full-stack AI applications. Production-grade projects, live deployed agents, and autonomous AI workflows.',
    image = DEFAULT_IMAGE,
    url = BASE_URL,
    type = 'website',
    keywords = 'AI Engineer, Generative AI, Saurabh Lokhande, LLM Agents, RAG Systems, LangChain, OpenAI, Full-Stack AI, Machine Learning Portfolio',
    publishedAt,
    tags,
}) => {
    const siteTitle = 'Saurabh Lokhande';
    const fullTitle = title === siteTitle ? title : `${title} — ${siteTitle}`;
    const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
    const canonicalUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    const articleSchema = type === 'article' ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': title,
        'description': description,
        'image': imageUrl,
        'author': {
            '@type': 'Person',
            'name': 'Saurabh Lokhande',
            '@id': `${BASE_URL}/#person`,
        },
        'publisher': {
            '@type': 'Person',
            'name': 'Saurabh Lokhande',
            'url': BASE_URL,
        },
        'datePublished': publishedAt,
        'keywords': tags?.join(', '),
        'mainEntityOfPage': { '@type': 'WebPage', '@id': canonicalUrl },
    } : null;

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Saurabh Lokhande" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
            <meta name="theme-color" content="#020202" />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:site_name" content="Saurabh Lokhande" />
            <meta property="og:locale" content="en_US" />
            {publishedAt && <meta property="article:published_time" content={publishedAt} />}
            {tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@saurabhmj11" />
            <meta name="twitter:creator" content="@saurabhmj11" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:image:alt" content={fullTitle} />

            {/* Article structured data */}
            {articleSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default Seo;
