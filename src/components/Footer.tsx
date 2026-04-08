import { Facebook, Instagram, Twitter, MapPin, ChevronRight } from 'lucide-react';
import { NavLink } from '../types';

interface FooterProps {
  navLinks: NavLink[];
}

export default function Footer({ navLinks }: FooterProps) {
  return (
    <footer className="bg-emerald-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-emerald-100">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" 
                  alt="Logo Desa" 
                  className="w-9 h-9 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none">Desa Sejahtera</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Website Resmi</span>
              </div>
            </div>
            <p className="text-emerald-100/60 max-w-sm mb-8 leading-relaxed">
              Website resmi Desa Sejahtera, Kecamatan Makmur, Kabupaten Berkah. 
              Media informasi dan pelayanan publik digital terpadu.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Menu Cepat</h4>
            <ul className="space-y-4 text-emerald-100/60">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={(e) => {
                      if (link.action) {
                        e.preventDefault();
                        link.action();
                        window.scrollTo(0, 0);
                      }
                    }}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Kontak Kami</h4>
            <ul className="space-y-4 text-emerald-100/60">
              <li className="flex gap-3">
                <MapPin className="shrink-0 text-emerald-500" size={20} />
                <span>Jl. Raya Desa No. 123, Kec. Makmur, Kab. Berkah, 12345</span>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <span className="text-emerald-500 font-bold">@</span>
                </div>
                <span>kontak@desasejahtera.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-emerald-100/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Pemerintah Desa Sejahtera. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
