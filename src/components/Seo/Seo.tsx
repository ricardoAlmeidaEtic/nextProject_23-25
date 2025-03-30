import Head from "next/head";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const defaultSEO = {
    title: "My App",
    description: "Discover music, playlists, and more.",
    keywords: "music, playlists, albums, artists, podcasts",
    image: "/default-image.jpg",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
};

const SEO = ({ title, description, keywords, image, url }: SEOProps) => {
    return (
      <Head>
        <title>{title || defaultSEO.title}</title>
        <meta name="description" content={description || defaultSEO.description} />
        <meta name="keywords" content={keywords || defaultSEO.keywords} />
        <meta property="og:title" content={title || defaultSEO.title} />
        <meta property="og:description" content={description || defaultSEO.description} />
        <meta property="og:image" content={image || defaultSEO.image} />
        <meta property="og:url" content={url || defaultSEO.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={image || defaultSEO.image} />
      </Head>
    );  
};

export default SEO;