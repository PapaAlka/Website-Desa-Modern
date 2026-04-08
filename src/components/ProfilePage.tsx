import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Users, 
  Map, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  TrendingUp,
  Navigation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Pagination as SwiperPagination, Autoplay } from 'swiper/modules';
import { NavLink } from '../types';
import Footer from './Footer';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProfilePageProps {
  onBack: () => void;
  navLinks: NavLink[];
}

export default function ProfilePage({ onBack, navLinks }: ProfilePageProps) {
  const staff = [
    { name: 'H. Ahmad Subarjo', role: 'Kepala Desa', image: 'https://picsum.photos/seed/staff1/400/400' },
    { name: 'Siti Aminah, S.E.', role: 'Sekretaris Desa', image: 'https://picsum.photos/seed/staff2/400/400' },
    { name: 'Budi Santoso', role: 'Kaur Keuangan', image: 'https://picsum.photos/seed/staff3/400/400' },
    { name: 'Drs. Mulyadi', role: 'Kaur Perencanaan', image: 'https://picsum.photos/seed/staff4/400/400' },
    { name: 'Rina Wijaya', role: 'Kaur TU dan Umum', image: 'https://picsum.photos/seed/staff5/400/400' },
    { name: 'Agus Setiawan', role: 'Kasi Pemerintahan', image: 'https://picsum.photos/seed/staff6/400/400' },
    { name: 'Hj. Fatimah', role: 'Kasi Kesejahteraan', image: 'https://picsum.photos/seed/staff7/400/400' },
    { name: 'Iwan Kurniawan', role: 'Kasi Pelayanan', image: 'https://picsum.photos/seed/staff8/400/400' },
    { name: 'Slamet Raharjo', role: 'Kepala Dusun', image: 'https://picsum.photos/seed/staff9/400/400' },
  ];

  const bpdStaff = [
    { name: 'H. Suherman, S.Pd.', role: 'Ketua BPD', image: 'https://picsum.photos/seed/bpd1/400/400' },
    { name: 'Dedi Mulyadi', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd2/400/400' },
    { name: 'Siti Rohmah', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd3/400/400' },
    { name: 'Andi Wijaya', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd4/400/400' },
    { name: 'Rahmat Kartolo', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd5/400/400' },
    { name: 'Lilis Suryani', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd6/400/400' },
    { name: 'Bambang Irawan', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd7/400/400' },
    { name: 'Yulia Fitriani', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd8/400/400' },
    { name: 'Eko Prasetyo', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd9/400/400' },
    { name: 'Dewi Lestari', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd10/400/400' },
    { name: 'Hendra Saputra', role: 'Anggota BPD', image: 'https://picsum.photos/seed/bpd11/400/400' },
  ];

  const stats = [
    { label: 'Luas Wilayah', value: '1,240 Ha', icon: <Map className="w-6 h-6" /> },
    { label: 'Jumlah Penduduk', value: '4,520 Jiwa', icon: <Users className="w-6 h-6" /> },
    { label: 'Batas Utara', value: 'Desa Makmur', icon: <Navigation className="w-6 h-6 rotate-0" /> },
    { label: 'Batas Selatan', value: 'Hutan Lindung', icon: <Navigation className="w-6 h-6 rotate-180" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900">
          <img 
            src="https://picsum.photos/seed/village-profile/1920/1080" 
            alt="Village Profile" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="absolute top-0 left-4 md:-top-20 flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Profil Desa Sejahtera
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-emerald-50/80 max-w-2xl mx-auto leading-relaxed"
          >
            Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan Desa Sejahtera yang berkomitmen untuk kemajuan bersama.
          </motion.p>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-emerald-950 mb-8 flex items-center gap-3">
              <span className="w-12 h-1 bg-emerald-600 rounded-full"></span>
              Sejarah Desa
            </h2>
            <div className="space-y-6 text-slate-600 leading-[1.8] text-lg">
              <p>
                Desa Sejahtera didirikan pada tahun 1945, tak lama setelah kemerdekaan Indonesia. Awalnya, wilayah ini merupakan hamparan perkebunan karet yang dikelola oleh masyarakat setempat secara gotong royong.
              </p>
              <p>
                Nama "Sejahtera" dipilih oleh para tetua desa dengan harapan agar seluruh penduduk yang tinggal di wilayah ini senantiasa diberikan kemakmuran dan kedamaian. Seiring berjalannya waktu, desa ini berkembang menjadi pusat perdagangan hasil bumi di tingkat kecamatan.
              </p>
              <p>
                Kini, Desa Sejahtera terus bertransformasi menjadi desa digital tanpa meninggalkan nilai-nilai luhur budaya gotong royong yang telah diwariskan oleh para pendahulu.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://picsum.photos/seed/history/800/600" 
                alt="Sejarah Desa" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="font-bold text-2xl">75+ Tahun</p>
              <p className="text-emerald-100 text-sm">Menjaga Tradisi</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-24 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visi & Misi</h2>
            <p className="text-emerald-100/60">Arah dan tujuan pembangunan Desa Sejahtera</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/10 flex flex-col justify-center"
            >
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Visi Kami</h3>
              <p className="text-2xl md:text-3xl font-bold leading-tight italic">
                "Menjadi desa mandiri yang unggul dalam pelayanan publik, ekonomi kreatif, dan kelestarian lingkungan berbasis teknologi digital."
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7"
            >
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-8">Misi Kami</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Meningkatkan kualitas SDM melalui program pendidikan dan pelatihan.',
                  'Mewujudkan tata kelola pemerintahan desa yang transparan dan akuntabel.',
                  'Mengembangkan potensi ekonomi lokal berbasis UMKM dan pariwisata.',
                  'Menjamin ketersediaan infrastruktur desa yang berkualitas dan merata.',
                  'Melestarikan nilai-nilai budaya dan kearifan lokal masyarakat.',
                  'Mendorong inovasi teknologi dalam pelayanan administrasi desa.'
                ].map((misi, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full">
                      <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                    </div>
                    <p className="text-emerald-50/80 leading-relaxed">{misi}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">Perangkat Desa</h2>
          <p className="text-slate-600">Para pelayan masyarakat yang berdedikasi untuk Desa Sejahtera</p>
        </div>

        <div className="relative px-12">
          <Swiper
            modules={[SwiperNavigation, SwiperPagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {staff.map((person, index) => (
              <SwiperSlide key={person.name}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 text-center h-full"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-50 group-hover:border-emerald-500 transition-colors duration-300">
                      <img 
                        src={person.image} 
                        alt={person.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300">
                      <User size={16} />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 mb-1">{person.name}</h4>
                  <p className="text-emerald-600 font-medium text-sm mb-6 uppercase tracking-wider">{person.role}</p>
                  
                  <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-stone-50 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <Mail size={18} />
                    </button>
                    <button className="p-2 bg-stone-50 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <Phone size={18} />
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-stone-100">
            <ChevronLeft size={24} />
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-stone-100">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* BPD Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-[3rem] my-12 shadow-sm border border-stone-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">Badan Permusyawaratan Desa (BPD)</h2>
          <p className="text-slate-600">Lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa</p>
        </div>

        <div className="relative px-12">
          <Swiper
            modules={[SwiperNavigation, SwiperPagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-bpd',
              nextEl: '.swiper-button-next-bpd',
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {bpdStaff.map((person, index) => (
              <SwiperSlide key={person.name}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-stone-50 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 text-center h-full"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white group-hover:border-emerald-500 transition-colors duration-300">
                      <img 
                        src={person.image} 
                        alt={person.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300">
                      <User size={16} />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 mb-1">{person.name}</h4>
                  <p className="text-emerald-600 font-medium text-sm mb-6 uppercase tracking-wider">{person.role}</p>
                  
                  <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <Mail size={18} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <Phone size={18} />
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-bpd absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-stone-100">
            <ChevronLeft size={24} />
          </button>
          <button className="swiper-button-next-bpd absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-stone-100">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Geografis & Demografis Section */}
      <section className="py-24 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-emerald-900/5 border border-stone-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-emerald-950 mb-6">Geografis & Demografis</h2>
                <p className="text-slate-600 leading-relaxed mb-10">
                  Secara administratif, Desa Sejahtera terletak di jantung wilayah Kabupaten Berkah dengan topografi dataran rendah yang subur, sangat mendukung sektor pertanian dan perkebunan.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-xl font-bold text-emerald-950">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-3xl overflow-hidden shadow-lg">
                  <img 
                    src="https://picsum.photos/seed/map/800/450" 
                    alt="Peta Desa" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pertumbuhan</p>
                    <p className="text-sm font-bold text-emerald-950">+2.4% / Tahun</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer navLinks={navLinks} />
    </div>
  );
}
