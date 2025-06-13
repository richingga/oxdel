import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-transparent text-slate-800 w-full">
            <div className="container mx-auto px-6 py-12">
                <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl shadow-lg p-8 md:p-12 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Wujudkan Ide Anda Hari Ini.</h2>
                            <p className="text-slate-700 max-w-xl">Mulai perjalanan kreatif Anda bersama Oxdel—tanpa kartu kredit, tanpa komitmen.</p>
                        </div>
                        <a href="/login" className="px-8 py-4 flex-shrink-0 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                            Mulai Gratis Sekarang &rarr;
                        </a>
                    </div>
                </div>
                <hr className="border-t border-white/30 my-8" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* ... (Kolom-kolom footer tetap sama) ... */}
                </div>
                <hr className="border-t border-white/30 my-8" />
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
};

export default Footer;
