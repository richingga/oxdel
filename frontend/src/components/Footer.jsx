import React from 'react';

// --- ICONS (Inline SVG) ---
const InstagramIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/></svg>;
const FacebookIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/></svg>;


const Footer = () => (
    <footer className="bg-transparent text-slate-800">
        <div className="container mx-auto px-6 py-12">
            {/* --- CTA Section --- */}
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Wujudkan Ide Anda Hari Ini.</h2>
                        <p className="text-slate-700 max-w-xl">Mulai perjalanan kreatif Anda bersama Oxdel—tanpa kartu kredit, tanpa komitmen.</p>
                    </div>
                    <a href="#" className="px-8 py-4 flex-shrink-0 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                        Mulai Gratis Sekarang &rarr;
                    </a>
                </div>
            </div>
            
            <hr className="border-t border-blue-200 my-8" />

            {/* --- Footer Links --- */}
            <div className="flex flex-col md:flex-row justify-between items-start text-left gap-8">
                {/* Kolom Kiri: Logo */}
                <div className="w-full md:w-auto mb-4 md:mb-0">
                     <a href="#" className="text-2xl font-bold text-slate-900 mb-2 inline-block">
                        <span className="text-blue-600">Ox</span>del
                    </a>
                    <p className="text-sm text-slate-600 italic">Platform visual untuk ide-ide hebat Anda.</p>
                </div>
                
                {/* Kolom Kanan: Grup Link */}
                <div className="flex flex-wrap justify-start md:justify-end gap-16">
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Produk</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Website Jasa</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Undangan Digital</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Harga</a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Perusahaan</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Hubungi Kami</a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Terhubung</h3>
                        <div className="flex flex-row space-x-4 items-center">
                            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors" title="Instagram">
                               <InstagramIcon />
                            </a>
                            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors" title="Facebook">
                               <FacebookIcon />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
             <hr className="border-t border-blue-200 my-8" />
            
            {/* --- Copyright Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-sm">
                <p className="text-slate-600">© 2025 Oxdel. Sebuah karya dari Indonesia, untuk dunia.</p>
                <div className="flex space-x-4">
                    <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Syarat & Ketentuan</a>
                    <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Kebijakan Privasi</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
