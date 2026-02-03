import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
}

const Seo: React.FC<SeoProps> = ({
    title = "Saurabh Lokhande - AI Developer & Innovation Specialist",
    description = "Portfolio of Saurabh Lokhande, an AI Developer specializing in advanced agentic workflows, LLM integration, and full-stack innovation.",
    image = "/profile.jpg",
    url = "https://saurabhlokhande.com", // Replace with actual domain when known or verified
    type = "website",
    keywords = "AI Developer, React, Portfolio, Machine Learning, LLM, Agentic Workflow, Saurabh Lokhande",
}) => {
    const siteTitle = "Saurabh Lokhande";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    // Structured Data (JSON-LD) for Person/Portfolio
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Saurabh Lokhande",
        "url": url,
        "image": `${url}${image}`,
        "jobTitle": "AI Developer",
        "description": description,
        "sameAs": [
            // Add actual social links if known, otherwise placeholders or omit
            "https://github.com/saurabhlokhande",
            "https://linkedin.com/in/saurabhlokhande"
        ]
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Saurabh Lokhande" />
            <meta name="application-name" content="Saurabh Lokhande Portfolio" />
            <meta name="theme-color" content="#ffffff" /> {/* Adjust color as needed */}
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default Seo;
