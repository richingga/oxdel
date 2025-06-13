import React from "react";
import { Link } from "react-router-dom";
import { Rocket, ShieldCheck, LayoutDashboard, Users } from "lucide-react";

const features = [
  {
    icon: <Rocket className="w-12 h-12 text-blue-600 mb-2" />,
    title: "Deploy Instan",
    desc: "Buat, kelola, dan publish halaman digital atau undangan hanya dalam hitungan menit.",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-green-600 mb-2" />,
    title: "Keamanan Data",
    desc: "Data kamu terenkripsi & private. Hanya kamu dan tamu yang bisa mengakses.",
  },
  {
    icon: <LayoutDashboard className="w-12 h-12 text-purple-600 mb-2" />,
    title: "Dashboard Analytics",
    desc: "Pantau trafik, RSVP, performa undangan & halaman bisnis kamu secara realtime.",
  },
  {
    icon: <Users className="w-12 h-12 text-yellow-600 mb-2" />,
    title: "Kolaborasi & Afiliasi",
    desc: "Bagi akses, undang tim/EO, dan dapatkan komisi dengan sistem afiliasi.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-violet-100 flex flex-col">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="relative max-w-4xl w-full mx-auto">
          {/* SVG Bubble hanya dekorasi, jangan terlalu besar */}
          <svg className="absolute -top-20 -left-24 w-72 h-72 opacity-40 -z-10" viewBox="0 0 300 300">
            <defs>
              <radialGradient id="bubble1" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2"/>
              </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="150" fill="url(#bubble1)" />
          </svg>
          <svg className="absolute -bottom-16 -right-24 w-60 h-60 opacity-30 -z-10" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="110" fill="#60a5fa" />
          </svg>

          {/* CARD HERO FLOATING */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-2xl px-12 py-16 text-center border-none relative animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Platform <span className="text-blue-600">Undangan & Landing Page</span> <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-500 text-transparent bg-clip-text">#SaaS</span> Modern
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 mb-10 max-w-2xl mx-auto">
              Buat & kelola undangan digital, landing page bisnis, analitik tamu, galeri, dan banyak lagi. Semua dalam satu platform super cepat & mudah!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/register"
                className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-150"
              >
                🚀 Daftar Gratis
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 font-bold text-lg shadow hover:bg-blue-50 hover:-translate-y-1 transition-all duration-150"
              >
                Login
              </Link>
            </div>
            <img
              src="https://undraw.co/static/images/undraw_modern_design_re_dlp8.svg"
              alt="Oxdel Landing"
              className="w-full max-w-lg mx-auto mt-10 rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="my-14 flex justify-center">
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500/30 via-violet-400/20 to-transparent rounded-full blur-[2px]"></div>
      </div>

      {/* FITUR UTAMA */}
      <section className="py-12 px-4 bg-slate-50 animate-fade-in-up">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 duration-200 animate-fade-in-up"
              style={{ minWidth: 200 }}
            >
              {f.icon}
              <h3 className="mt-2 mb-3 text-xl font-bold text-slate-900">{f.title}</h3>
              <p className="text-slate-600 text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="my-14 flex justify-center">
        <div className="h-1 w-32 bg-gradient-to-r from-violet-400/40 via-blue-400/30 to-transparent rounded-full blur-[2px]"></div>
      </div>

      {/* VALUE PROPOSITION */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-2xl px-10 py-14 animate-fade-in-up">
          <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Mengapa Pilih Oxdel?</h2>
          <p className="text-lg text-slate-700 mb-8">
            Dengan teknologi terbaru, UI super clean, dan fitur terintegrasi, kamu bisa fokus ke acara/bisnis tanpa ribet urusan teknis. Dukungan prioritas & pembaruan fitur rutin!
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:-translate-y-1 hover:bg-blue-700 transition"
          >
            🚀 Coba Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-slate-500 text-sm bg-white/80 backdrop-blur rounded-t-2xl shadow mt-12">
        © {new Date().getFullYear()} <span className="font-bold text-blue-600">Oxdel</span> — All rights reserved.
      </footer>
    </div>
  );
}
