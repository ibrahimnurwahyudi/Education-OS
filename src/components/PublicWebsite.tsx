import { useEffect, useState } from 'react';
import { ArrowRight, BrainCircuit, Check, ChevronDown, ChevronRight, GraduationCap, Menu, Network, ShieldCheck, Sparkles, Target, Users, X } from 'lucide-react';

const programs = [
  ['Pembelajaran', 'Program, kelas, sesi, tugas, latihan, asesmen, dan materi dalam satu alur.'],
  ['Learning Intelligence', 'Mastery Map, Evidence Graph, signals, intervensi, dan rekomendasi berbasis evidence.'],
  ['Quantum Learning', 'Attention, elaboration, retrieval, metacognition, transfer, dan reflection.'],
  ['Private Learning Room', 'Pendampingan personal dengan konteks siswa, mentor, agenda, evidence, dan tindak lanjut.'],
  ['OSN Academy', 'Pembinaan problem solving, kompetensi, latihan, review solusi, dan kesiapan kompetisi.'],
  ['AI Education Core', 'AI sebagai pendamping siswa, orang tua, mentor, dan institusi dengan review dan audit.'],
];

const faqs = [
  ['Apa itu Education OS?', 'Education OS adalah operating system pendidikan yang menghubungkan pembelajaran, pendampingan, prestasi, institusi, komunikasi, dan learning intelligence.'],
  ['Apakah hanya untuk siswa?', 'Tidak. Setiap peran memiliki ruang kerja sendiri: siswa, orang tua, mentor, institusi, mentor OSN, dan administrator.'],
  ['Bagaimana laporan perkembangan dibuat?', 'Laporan menggunakan evidence dari sesi, kehadiran, asesmen, kompetensi, learning cycle, intervensi, dan aktivitas pembelajaran.'],
  ['Apa peran Quantum Learning?', 'Quantum Learning diterjemahkan menjadi siklus belajar yang dapat diamati: attention, retrieval, metacognition, transfer, dan reflection.'],
];

function go(id:string){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }

export default function PublicWebsite(){
  const [open,setOpen]=useState<number|null>(0);
  const [mobile,setMobile]=useState(false);
  useEffect(()=>{document.title='Education OS — Ekosistem Pembelajaran Indonesia';},[]);
  const nav=[['Program','program'],['Cara Kerja','cara-kerja'],['Mentor','mentor'],['OSN Academy','osn'],['Institusi','institusi']];
  return <main className="eo-site">
    <header className="eo-header"><div className="eo-container eo-nav">
      <button className="eo-brand" onClick={()=>go('top')}><span className="eo-brand-mark"><Sparkles size={18}/></span><span><b>Education OS</b><small>Education Operating System</small></span></button>
      <nav className={mobile?'eo-nav-links open':'eo-nav-links'}>{nav.map(([a,id])=><button key={id} onClick={()=>{go(id);setMobile(false)}}>{a}</button>)}<a href="./app/">Masuk ke Education OS <ArrowRight size={15}/></a></nav>
      <div className="eo-nav-actions"><a href="./app/" className="eo-login">Masuk</a><a href="./app/" className="eo-cta eo-cta-small">Mulai belajar <ArrowRight size={15}/></a></div>
      <button className="eo-menu" onClick={()=>setMobile(!mobile)} aria-label="Menu">{mobile?<X/>:<Menu/>}</button>
    </div></header>

    <section id="top" className="eo-hero"><div className="eo-container eo-hero-grid">
      <div className="eo-hero-copy"><div className="eo-pill"><span className="eo-dot"/> Platform pendidikan yang dibangun sebagai sistem</div>
        <h1>Belajar lebih terarah. <span>Berkembang dengan bukti.</span></h1>
        <p className="eo-lead">Education OS menghubungkan siswa, orang tua, mentor, institusi, dan pembinaan OSN dalam satu operating system pendidikan—dari tujuan belajar sampai evidence dan tindakan berikutnya.</p>
        <div className="eo-hero-actions"><a href="./app/" className="eo-cta">Masuk ke Education OS <ArrowRight size={17}/></a><button className="eo-secondary" onClick={()=>go('cara-kerja')}>Lihat cara kerja <ChevronRight size={17}/></button></div>
        <div className="eo-trust-row"><span><Check size={14}/> Evidence-based</span><span><Check size={14}/> Role-aware</span><span><Check size={14}/> Mobile-ready</span><span><Check size={14}/> Audit-ready</span></div>
      </div>
      <div className="eo-product"><div className="eo-window"><div className="eo-window-top"><i/><i/><i/><b>Ruang Belajar Siswa</b></div><div className="eo-window-body"><aside><strong>EO</strong><i/><i/><i/><i/></aside><div className="eo-preview"><div className="eo-preview-head"><div><small>SELAMAT DATANG</small><h3>Ruang Belajar</h3></div><span>AF</span></div><div className="eo-kpis"><div><small>Target aktif</small><b>4</b><em>minggu ini</em></div><div><small>Learning cycle</small><b>2</b><em>berjalan</em></div><div><small>Evidence</small><b>18</b><em>terverifikasi</em></div></div><div className="eo-preview-card"><div><b>Mastery Map</b><small>Evidence-based</small></div><div className="eo-bars"><i style={{width:'86%'}}/><i style={{width:'68%'}}/><i style={{width:'54%'}}/><i style={{width:'76%'}}/></div><small>Kompetensi • Progress • Evidence</small></div><div className="eo-next"><Target size={16}/><span><b>Next action</b><small>Review refleksi sebelum sesi berikutnya</small></span><ChevronRight size={15}/></div></div></div></div><div className="eo-float eo-float-one"><BrainCircuit size={17}/><span><b>Learning Intelligence</b><small>Signals & recommendations</small></span></div><div className="eo-float eo-float-two"><ShieldCheck size={17}/><span><b>Evidence verified</b><small>Audit trail tersedia</small></span></div></div>
    </div></section>

    <section id="program" className="eo-section eo-soft"><div className="eo-container"><div className="eo-head"><div><span className="eo-eyebrow">Satu ekosistem</span><h2>Semua bagian penting dari perjalanan belajar.</h2></div><p>Bukan kumpulan halaman. Modul terhubung ke konteks, tindakan, evidence, review, lifecycle, dan next action.</p></div><div className="eo-program-grid">{programs.map(([t,d])=><article className="eo-card" key={t}><span>{t}</span><h3>{t}</h3><p>{d}</p><ArrowRight size={16}/></article>)}</div></div></section>

    <section id="cara-kerja" className="eo-section"><div className="eo-container"><div className="eo-head center"><span className="eo-eyebrow">Cara kerja</span><h2>Dari tujuan belajar menjadi tindakan yang dapat ditelusuri.</h2><p>Education OS membuat alur pembelajaran lebih jelas untuk siswa maupun orang dewasa yang mendampingi.</p></div><div className="eo-flow">{[['01','Tujuan','Tetapkan tujuan, program, kompetensi, dan konteks peserta.'],['02','Pembelajaran','Jalankan sesi, materi, tugas, latihan, retrieval, dan refleksi.'],['03','Evidence','Kumpulkan asesmen, karya, kehadiran, observasi, dan learning cycle.'],['04','Intelligence','Baca mastery, signals, intervensi, dan rekomendasi.'],['05','Next action','Ambil tindakan berikutnya dan teruskan siklus.']].map(([n,t,d],i)=><div className="eo-flow-item" key={n}><b>{n}</b><div><h3>{t}</h3><p>{d}</p></div>{i<4&&<ChevronRight className="eo-flow-arrow"/>}</div>)}</div></div></section>

    <section id="mentor" className="eo-section eo-dark"><div className="eo-container eo-two"><div><span className="eo-eyebrow">Untuk mentor & guru</span><h2>Ruang kerja mentor, bukan sekadar daftar siswa.</h2><p>Rancang sesi, lihat evidence, nilai kompetensi, catat intervensi, lakukan review, dan arahkan next action dari satu ruang kerja.</p><div className="eo-checks">{['Learning Design & Learning Cycle','Evidence Graph & Mastery Map','Metacognition & Reflection Review','Intervention Engine','Experiment Lab & Recommendation Review'].map(x=><span key={x}><Check size={15}/>{x}</span>)}</div><a href="./app/" className="eo-cta eo-light-cta">Masuk ke ruang mentor <ArrowRight size={16}/></a></div><div className="eo-mentor-card"><div className="eo-card-top"><b>Ruang Kerja Mentor</b><small>Learning Intelligence</small></div><div className="eo-person"><span>AP</span><div><b>Mentor Matematika</b><small>Review & coaching</small></div><em>Aktif</em></div><div className="eo-mentor-metrics"><div><small>Peserta aktif</small><b>—</b></div><div><small>Evidence review</small><b>—</b></div><div><small>Intervensi</small><b>—</b></div></div><div className="eo-insight"><BrainCircuit size={17}/><span><b>Insight tersedia</b><small>Review evidence untuk menentukan tindakan berikutnya.</small></span></div></div></div></section>

    <section id="osn" className="eo-section"><div className="eo-container eo-osn"><div className="eo-orbit"><div><GraduationCap size={28}/><b>OSN</b><small>Academy</small></div><i className="a">Problem Solving</i><i className="b">Mastery</i><i className="c">Deep Focus</i><i className="d">Solution Review</i></div><div><span className="eo-eyebrow">OSN Academy</span><h2>Pembinaan prestasi yang dibangun dari kompetensi.</h2><p>Jalur OSN menggabungkan problem set, competency graph, mastery map, deep focus, retrieval, metacognition, transfer, dan solution reflection.</p><a href="./app/" className="eo-secondary">Buka OSN Academy <ArrowRight size={16}/></a></div></div></section>

    <section id="institusi" className="eo-section eo-soft"><div className="eo-container"><div className="eo-head"><div><span className="eo-eyebrow">Untuk institusi</span><h2>Satu operating layer untuk akademik dan operasional.</h2></div><p>Data terhubung, permission jelas, laporan, finance, CRM, compliance, dan audit dalam satu sistem.</p></div><div className="eo-role-grid">{[['Siswa','Ruang belajar personal.',GraduationCap],['Orang Tua','Pendampingan berbasis evidence.',Users],['Mentor','Ruang kerja pembelajaran.',BrainCircuit],['Institusi','Operasional dan mutu.',Network]].map(([t,d,I])=>{const Icon=I as any;return <article className="eo-role" key={t as string}><span><Icon size={20}/></span><h3>{t as string}</h3><p>{d as string}</p><ArrowRight size={16}/></article>})}</div></div></section>

    <section className="eo-section"><div className="eo-container eo-faq"><div><span className="eo-eyebrow">Pertanyaan umum</span><h2>Mulai dari yang ingin Anda capai.</h2><p>Kompleksitas sistem pendidikan dibuat sederhana di sisi pengguna.</p></div><div>{faqs.map(([q,a],i)=><div className={open===i?'eo-faq open':'eo-faq'} key={q}><button onClick={()=>setOpen(open===i?null:i)}><b>{q}</b><ChevronDown size={18}/></button>{open===i&&<p>{a}</p>}</div>)}</div></div></section>

    <section className="eo-final"><div className="eo-container"><span className="eo-pill dark-pill"><Sparkles size={14}/> Education OS</span><h2>Satu sistem untuk membuat pendidikan lebih terarah.</h2><p>Masuk dan lihat bagaimana pembelajaran, evidence, intelligence, dan tindakan berikutnya terhubung.</p><a href="./app/" className="eo-cta">Masuk ke Education OS <ArrowRight size={17}/></a></div></section>

    <footer className="eo-footer"><div className="eo-container eo-footer-grid"><div><div className="eo-brand"><span className="eo-brand-mark"><Sparkles size={17}/></span><span><b>Education OS</b><small>Education Operating System</small></span></div><p>Platform pendidikan untuk pembelajaran, pendampingan, prestasi, dan institusi.</p></div><div><b>Platform</b><a href="#program">Program</a><a href="#cara-kerja">Cara Kerja</a><a href="#mentor">Mentor</a><a href="#osn">OSN Academy</a></div><div><b>Institusi</b><a href="#institusi">Ruang Institusi</a><a href="./app/">Masuk ke sistem</a><a href="#faq">FAQ</a></div><div><b>Kontak</b><a href="mailto:dwahyudi8377@gmail.com">dwahyudi8377@gmail.com</a><span>Indonesia</span></div></div><div className="eo-container eo-bottom"><span>© {new Date().getFullYear()} Education OS</span><span>Built for evidence-based learning</span></div></footer>
  </main>;
}
