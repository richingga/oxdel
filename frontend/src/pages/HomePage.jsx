import React, { useState, useEffect } from 'react';

// --- ICONS (Dapat dipindahkan ke file terpisah seperti icons.js) ---
const WebsiteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;
const LandingPageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="m15 3-6 6 6 6"/><path d="M3 12h12"/></svg>;
const InvitationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const AdsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
const SeoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>;


// --- PAGE SECTIONS ---
const HeroSection = () => (
    <section>
        {/* Mengurangi padding atas di mobile, dan menjaga padding di desktop */}
        <div className="relative container mx-auto px-4 pt-24 pb-16 md:pt-25 md:pb-20 z-10">
            {/* Menghapus min-height di mobile, menambah padding vertikal di desktop */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:py-20 md:px-16 text-center flex flex-col justify-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4 tracking-tighter">
                        Wujudkan Ide Anda, <br />
                        <span className="font-serif bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">Tanpa Batas Kreativitas.</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-700 mb-10">
                        Platform termudah untuk membangun landing page, website, dan undangan digital yang memukau. Cepat, modern, dan tanpa perlu coding.
                    </p>
                    <div className="flex justify-center flex-col sm:flex-row gap-4">
                        <a href="/dashboard" className="px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                            Mulai Sekarang
                        </a>
                        <a href="#templates" className="px-8 py-4 rounded-full font-bold text-blue-700 bg-white hover:bg-blue-100 border border-blue-200 transition-colors duration-300">
                            Lihat Layanan
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const featuresData = [
    { icon: <WebsiteIcon />, title: "Pembuatan Website", description: "Bangun citra profesional bisnis Anda dengan website modern yang responsif." },
    { icon: <LandingPageIcon />, title: "Landing Page Efektif", description: "Tingkatkan konversi penjualan dengan landing page yang fokus pada tujuan." },
    { icon: <SeoIcon />, title: "SEO & Analitik", description: "Optimalkan peringkat website Anda di Google dan pahami perilaku pengunjung." },
    { icon: <InvitationIcon />, title: "Undangan Digital", description: "Buat kesan tak terlupakan dengan undangan acara yang modern dan interaktif." },
    { icon: <AdsIcon />, title: "Iklan Digital Ads", description: "Jangkau audiens yang tepat melalui Google & Social Media Ads yang terukur." }
];

const FeaturesSection = () => (
    <section id="fitur" className="py-20 overflow-x-hidden">
        <div className="container mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 tracking-tight">Layanan Profesional Kami</h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">Kami menyediakan solusi digital lengkap untuk membantu bisnis Anda bertumbuh.</p>
        </div>
        <swiper-container
            class="feature-carousel"
            slides-per-view="auto"
            effect="coverflow"
            grab-cursor="true"
            centered-slides="true"
            loop="true"
            autoplay-delay="3500"
            coverflow-effect-rotate="0"
            coverflow-effect-stretch="80"
            coverflow-effect-depth="200"
            coverflow-effect-modifier="1"
            coverflow-effect-slide-shadows="false"
            pagination="true"
            pagination-clickable="true"
            breakpoints='{
                "768": {
                    "slidesPerView": 3
                }
            }'
        >
            {featuresData.map((feature, index) => (
                <swiper-slide key={index}>
                    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-lg h-full flex flex-col items-center text-center">
                        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 flex-shrink-0">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                        <p className="text-slate-700">{feature.description}</p>
                    </div>
                </swiper-slide>
            ))}
        </swiper-container>
    </section>
);

const templatesData = [
    { title: "Agensi Kreatif", image: "https://placehold.co/400x400/3b82f6/ffffff?text=Kreatif" },
    { title: "Undangan Pernikahan", image: "https://placehold.co/400x400/ec4899/ffffff?text=Wedding" },
    { title: "Portofolio Fotografer", image: "https://placehold.co/400x400/8b5cf6/ffffff?text=Portfolio" },
    { title: "Toko Online", image: "https://placehold.co/400x400/10b981/ffffff?text=Toko" },
    { title: "Restoran", image: "https://placehold.co/400x400/f97316/ffffff?text=Resto" },
    { title: "Event Musik", image: "https://placehold.co/400x400/ef4444/ffffff?text=Event" },
];

const TemplatesSection = () => (
    <section id="templates" className="py-20">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-3 tracking-tight">Mulai dengan Desain Profesional</h2>
                <p className="text-lg text-slate-700 max-w-2xl mx-auto">Pilih template yang paling sesuai dan sesuaikan sesuka hati Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templatesData.map((template, index) => (
                     <div key={index} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-slate-200">
                        <div className="aspect-square">
                           <img src={template.image} alt={template.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">{template.title}</h3>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <button className="w-full py-2.5 rounded-full font-semibold text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors duration-300">Preview</button>
                                <button className="w-full py-2.5 rounded-full font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300">Gunakan</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const testimonialsData = [
    { name: "Andi Pratama", role: "CEO, Startup Maju", image: "https://placehold.co/100x100/e2e8f0/334155?text=A", text: "\"Landing page yang dibuat oleh tim Oxdel benar-benar meningkatkan konversi kami. Desainnya modern dan prosesnya sangat cepat. Sangat direkomendasikan!\"" },
    { name: "Siti Rahayu", role: "Wedding Organizer", image: "https://placehold.co/100x100/e2e8f0/334155?text=S", text: "\"Undangan digitalnya luar biasa! Klien kami sangat suka dengan fitur RSVP dan galeri foto. Membuat acara terasa lebih spesial dan terorganisir.\"" },
    { name: "Budi Santoso", role: "Pemilik Restoran", image: "https://placehold.co/100x100/e2e8f0/334155?text=B", text: "\"Berkat Google Ads yang dikelola Oxdel, restoran kami jadi lebih ramai. Target iklannya pas dan laporannya sangat jelas. Terima kasih banyak!\"" }
];

const TestimonialsSection = () => (
    <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-3 tracking-tight">Dipercaya oleh Ratusan Klien</h2>
                <p className="text-lg text-slate-700 max-w-2xl mx-auto">Lihat apa kata mereka tentang layanan kami.</p>
            </div>
            <swiper-container
                class="testimonial-carousel"
                slides-per-view="1"
                effect="slide"
                grab-cursor="true"
                centered-slides="true"
                loop="true"
                autoplay-delay="5000"
                pagination="true"
                pagination-clickable="true"
            >
                {testimonialsData.map((testimonial, index) => (
                    <swiper-slide key={index}>
                        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                            <div className="flex items-center mb-4">
                                <img className="w-14 h-14 rounded-full object-cover mr-4" src={testimonial.image} alt={`Foto ${testimonial.name}`} />
                                <div>
                                    <p className="font-bold text-slate-800">{testimonial.name}</p>
                                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 italic">{testimonial.text}</p>
                        </div>
                    </swiper-slide>
                ))}
            </swiper-container>
        </div>
    </section>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  useEffect(() => {
    const swiperScriptId = 'swiper-script';
    if (document.getElementById(swiperScriptId)) return;

    const fonts = document.createElement('link');
    fonts.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap";
    fonts.rel = "stylesheet";
    
    const swiperScript = document.createElement('script');
    swiperScript.id = swiperScriptId;
    swiperScript.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js";
    swiperScript.defer = true;
    
    const style = document.createElement('style');
    style.innerHTML = `
        body { font-family: 'Inter', sans-serif; background-color: #eff6ff; color: #1e293b; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .swiper-pagination-bullet { background-color: #93c5fd !important; }
        .swiper-pagination-bullet-active { background-color: #2563eb !important; }
        .feature-carousel { padding-top: 20px !important; padding-bottom: 50px !important; overflow: visible !important; }
        .feature-carousel swiper-slide {
            width: 320px;
            height: auto;
            transition: transform 0.6s, opacity 0.6s;
            transform: scale(0.8);
            opacity: 0.6;
        }
        .feature-carousel .swiper-slide-active {
            transform: scale(1.1);
            opacity: 1;
            z-index: 10;
        }
        .testimonial-carousel swiper-slide { 
            height: auto; 
            display: flex; 
            justify-content: center; 
            padding-bottom: 4rem; 
        }
    `;

    document.head.appendChild(fonts);
    document.head.appendChild(style);
    document.body.appendChild(swiperScript);
  }, []);

  return (
    <div className="antialiased">
      {/* <Header /> */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
        <TestimonialsSection />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
