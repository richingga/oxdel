import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';

// --- ICONS ---
const WebsiteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;
const LandingPageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="m15 3-6 6 6 6"/><path d="M3 12h12"/></svg>;
const InvitationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const AdsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
const SeoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>;

// --- PAGE SECTIONS ---
const HeroSection = ({ stats, isAuthenticated }) => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    const handleViewTemplates = () => {
        if (isAuthenticated) {
            navigate('/template-picker');
        } else {
            // Scroll to templates section
            const templatesSection = document.getElementById('templates');
            if (templatesSection) {
                templatesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section>
            <div className="relative container mx-auto px-4 pt-24 pb-16 md:pt-25 md:pb-20 z-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:py-20 md:px-16 text-center flex flex-col justify-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4 tracking-tighter">
                            Wujudkan Ide Anda, <br />
                            <span className="font-serif bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">Tanpa Batas Kreativitas.</span>
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-700 mb-6">
                            Platform termudah untuk membangun landing page, website, dan undangan digital yang memukau. Cepat, modern, dan tanpa perlu coding.
                        </p>
                        
                        {/* Stats */}
                        {stats && (
                            <div className="flex justify-center gap-8 mb-8 text-sm text-gray-600">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.totalTemplates}+</div>
                                    <div>Template</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.totalUsers}+</div>
                                    <div>Pengguna</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{stats.totalPages}+</div>
                                    <div>Proyek</div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleGetStarted}
                                className="px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                            >
                                {isAuthenticated ? 'Ke Dashboard' : 'Mulai Sekarang'}
                            </button>
                            <button 
                                onClick={handleViewTemplates}
                                className="px-8 py-4 rounded-full font-bold text-blue-700 bg-white hover:bg-blue-100 border border-blue-200 transition-colors duration-300"
                            >
                                {isAuthenticated ? 'Pilih Template' : 'Lihat Template'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeaturesSection = () => {
    const featuresData = [
        { 
            icon: <WebsiteIcon />, 
            title: "Website Profesional", 
            description: "Bangun citra profesional bisnis Anda dengan website modern yang responsif dan SEO-friendly." 
        },
        { 
            icon: <LandingPageIcon />, 
            title: "Landing Page Efektif", 
            description: "Tingkatkan konversi penjualan dengan landing page yang fokus pada tujuan dan optimasi tinggi." 
        },
        { 
            icon: <InvitationIcon />, 
            title: "Undangan Digital", 
            description: "Buat kesan tak terlupakan dengan undangan acara yang modern, interaktif, dan mudah dibagikan." 
        },
        { 
            icon: <AdsIcon />, 
            title: "Katalog Jasa", 
            description: "Tampilkan layanan Anda dengan profesional - dari jasa sedot WC hingga wedding organizer." 
        },
        { 
            icon: <SeoIcon />, 
            title: "SEO Optimized", 
            description: "Semua template sudah dioptimalkan untuk mesin pencari agar mudah ditemukan pelanggan." 
        }
    ];

    return (
        <section id="fitur" className="py-20 overflow-x-hidden">
            <div className="container mx-auto px-6 text-center mb-16">
                <h2 className="text-4xl font-bold mb-3 tracking-tight">Solusi Digital Lengkap</h2>
                <p className="text-lg text-slate-700 max-w-2xl mx-auto">Dari undangan digital hingga website bisnis, semua kebutuhan digital Anda tersedia di satu platform.</p>
            </div>
            
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <div key={index} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                            <p className="text-slate-700">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TemplatesSection = ({ templates, loading, isAuthenticated }) => {
    const navigate = useNavigate();

    const handleUseTemplate = (template) => {
        if (isAuthenticated) {
            // Redirect to template picker with category filter
            navigate(`/template-picker?category=${encodeURIComponent(template.category)}`);
        } else {
            navigate('/register');
        }
    };

    return (
        <section id="templates" className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-3 tracking-tight">Template Siap Pakai</h2>
                    <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                        Pilih dari {templates.length}+ template profesional yang dapat disesuaikan dengan kebutuhan Anda.
                    </p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.slice(0, 6).map((template) => (
                            <div key={template.id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-slate-200">
                                <div className="aspect-square relative">
                                    <img 
                                        src={template.thumbnail_url || template.preview_url || `https://placehold.co/400x400/3b82f6/ffffff?text=${encodeURIComponent(template.name)}`} 
                                        alt={template.name} 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = `https://placehold.co/400x400/3b82f6/ffffff?text=${encodeURIComponent(template.name)}`;
                                        }}
                                    />
                                    {template.is_premium && (
                                        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            Premium
                                        </div>
                                    )}
                                    {template.featured && (
                                        <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            Featured
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-1">{template.name}</h3>
                                        {template.rating > 0 && (
                                            <div className="flex items-center text-yellow-500 text-sm">
                                                <span>★</span>
                                                <span className="ml-1">{template.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mb-4">
                                        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                                            {template.category}
                                        </span>
                                        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                                            {template.type}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                        <a 
                                            href={`/api/templates/${template.id}/preview`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center py-2.5 rounded-full font-semibold text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors duration-300"
                                        >
                                            Preview
                                        </a>
                                        <button 
                                            onClick={() => handleUseTemplate(template)}
                                            className="flex-1 text-center py-2.5 rounded-full font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                        >
                                            Gunakan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="text-center mt-12">
                    <button 
                        onClick={() => {
                            if (isAuthenticated) {
                                navigate('/template-picker');
                            } else {
                                navigate('/register');
                            }
                        }}
                        className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-blue-300"
                    >
                        {isAuthenticated ? 'Lihat Semua Template' : 'Daftar untuk Akses Template'}
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonialsData = [
        { 
            name: "Andi Pratama", 
            role: "CEO, Startup Maju", 
            image: "https://placehold.co/100x100/e2e8f0/334155?text=A", 
            text: "Landing page yang dibuat dengan Oxdel benar-benar meningkatkan konversi kami hingga 300%. Prosesnya sangat mudah dan hasilnya profesional!" 
        },
        { 
            name: "Siti Rahayu", 
            role: "Wedding Organizer", 
            image: "https://placehold.co/100x100/e2e8f0/334155?text=S", 
            text: "Undangan digitalnya luar biasa! Klien kami sangat suka dengan fitur RSVP dan galeri foto. Membuat acara terasa lebih spesial dan modern." 
        },
        { 
            name: "Budi Santoso", 
            role: "Pemilik Jasa Sedot WC", 
            image: "https://placehold.co/100x100/e2e8f0/334155?text=B", 
            text: "Berkat website dari Oxdel, bisnis jasa saya jadi lebih profesional. Pelanggan mudah menghubungi dan order meningkat drastis!" 
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-3 tracking-tight">Dipercaya Ribuan Pengguna</h2>
                    <p className="text-lg text-slate-700 max-w-2xl mx-auto">Lihat apa kata mereka tentang pengalaman menggunakan Oxdel.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <img 
                                    className="w-14 h-14 rounded-full object-cover mr-4" 
                                    src={testimonial.image} 
                                    alt={`Foto ${testimonial.name}`} 
                                />
                                <div>
                                    <p className="font-bold text-slate-800">{testimonial.name}</p>
                                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 italic leading-relaxed">"{testimonial.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = ({ isAuthenticated }) => {
    const navigate = useNavigate();

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-16 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Proyek Anda?</h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Bergabunglah dengan ribuan pengguna yang telah mempercayai Oxdel untuk kebutuhan digital mereka.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => {
                                if (isAuthenticated) {
                                    navigate('/dashboard');
                                } else {
                                    navigate('/register');
                                }
                            }}
                            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                        >
                            {isAuthenticated ? 'Ke Dashboard' : 'Daftar Gratis Sekarang'}
                        </button>
                        <button 
                            onClick={() => {
                                if (isAuthenticated) {
                                    navigate('/template-picker');
                                } else {
                                    navigate('/register');
                                }
                            }}
                            className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-300"
                        >
                            {isAuthenticated ? 'Pilih Template' : 'Jelajahi Template'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- MAIN COMPONENT ---
export default function HomePage() {
    const [templates, setTemplates] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch templates
                const templatesResponse = await fetch('/api/templates?limit=6&featured=true');
                if (templatesResponse.ok) {
                    const templatesData = await templatesResponse.json();
                    setTemplates(templatesData.data || []);
                }

                // Fetch basic stats (public endpoint would be ideal)
                const statsResponse = await fetch('/api/templates');
                if (statsResponse.ok) {
                    const allTemplates = await statsResponse.json();
                    setStats({
                        totalTemplates: allTemplates.data?.length || 0,
                        totalUsers: 1250, // This would come from a public stats endpoint
                        totalPages: 3400  // This would come from a public stats endpoint
                    });
                }
            } catch (error) {
                console.error('Error fetching homepage data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Helmet>
                <title>Oxdel - Platform Undangan Digital & Website Profesional</title>
                <meta name="description" content="Buat undangan digital, landing page, dan website profesional dengan mudah. Template siap pakai untuk wedding, bisnis, jasa, dan portofolio. Tanpa coding, hasil profesional." />
                <meta name="keywords" content="undangan digital, website builder, landing page, template wedding, jasa sedot wc, portofolio, bisnis online" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Oxdel - Platform Undangan Digital & Website Profesional" />
                <meta property="og:description" content="Buat undangan digital, landing page, dan website profesional dengan mudah. Template siap pakai untuk wedding, bisnis, jasa, dan portofolio." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://oxdel.id" />
                <meta property="og:image" content="https://oxdel.id/og-image.jpg" />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Oxdel - Platform Undangan Digital & Website Profesional" />
                <meta name="twitter:description" content="Buat undangan digital, landing page, dan website profesional dengan mudah." />
                <meta name="twitter:image" content="https://oxdel.id/og-image.jpg" />
                
                {/* Canonical */}
                <link rel="canonical" href="https://oxdel.id" />
                
                {/* Schema.org structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "Oxdel",
                        "description": "Platform untuk membuat undangan digital, landing page, dan website profesional",
                        "url": "https://oxdel.id",
                        "applicationCategory": "WebApplication",
                        "operatingSystem": "Web Browser",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "IDR"
                        }
                    })}
                </script>
            </Helmet>

            <div className="antialiased">
                <main>
                    <HeroSection stats={stats} isAuthenticated={isAuthenticated} />
                    <FeaturesSection />
                    <TemplatesSection templates={templates} loading={loading} isAuthenticated={isAuthenticated} />
                    <TestimonialsSection />
                    <CTASection isAuthenticated={isAuthenticated} />
                </main>
            </div>
        </>
    );
}