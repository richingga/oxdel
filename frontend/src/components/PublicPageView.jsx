import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PublicPageView = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pages/public/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Halaman tidak ditemukan');
          } else {
            setError('Gagal memuat halaman');
          }
          return;
        }

        const data = await response.json();
        setPage(data.data);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Gagal memuat halaman');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Halaman Tidak Ditemukan - Oxdel</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">{error}</p>
            <a 
              href="/"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </>
    );
  }

  if (!page) {
    return null;
  }

  // Render page content
  let htmlContent = page.template_code || '';
  
  // Replace placeholders with actual content
  if (page.content) {
    Object.entries(page.content).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'gi');
      htmlContent = htmlContent.replace(regex, value || '');
    });
  }

  return (
    <>
      <Helmet>
        <title>{page.title} - Oxdel</title>
        <meta name="description" content={`${page.title} - Dibuat dengan Oxdel`} />
        <meta name="keywords" content={`${page.template_name}, ${page.template_category}, oxdel`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={`${page.title} - Dibuat dengan Oxdel`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://oxdel.id/${page.slug}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={`${page.title} - Dibuat dengan Oxdel`} />
        
        {/* Canonical */}
        <link rel="canonical" href={`https://oxdel.id/${page.slug}`} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": page.title,
            "description": `${page.title} - Dibuat dengan Oxdel`,
            "url": `https://oxdel.id/${page.slug}`,
            "author": {
              "@type": "Person",
              "name": page.author_username
            },
            "publisher": {
              "@type": "Organization",
              "name": "Oxdel",
              "url": "https://oxdel.id"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Render the actual page content */}
        <div 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="w-full"
        />
        
        {/* Oxdel watermark */}
        <div className="fixed bottom-4 right-4 z-50">
          <a 
            href="https://oxdel.id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-full text-xs hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
          >
            <span>Dibuat dengan</span>
            <span className="font-bold">Oxdel</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default PublicPageView;