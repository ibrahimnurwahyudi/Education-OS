import { useEffect, useState } from 'react';
import {
  ArrowRight, BrainCircuit, Check, ChevronDown, ChevronRight, CirclePlay,
  GraduationCap, Menu, Network, ShieldCheck, Sparkles, Target, Users, X, BarChart3, CalendarDays
} from 'lucide-react';

const programs = [
  {title:'Pembelajaran Terpadu',tag:'LEARNING',text:'Program, kelas, sesi, tugas, latihan, asesmen, dan materi berada dalam satu alur pembelajaran.'},
  {title:'Learning Intelligence',tag:'INTELLIGENCE',text:'Evidence Graph, Mastery Map, signals, intervensi, dan rekomendasi yang dapat ditelusuri.'},
  {title:'Quantum Learning',tag:'PEDAGOGY',text:'Attention, elaboration, retrieval, metacognition, transfer, dan reflection diterapkan sebagai siklus.'},
  {title:'Private Learning Room',tag:'PERSONAL',text:'Pendampingan personal dengan tujuan, agenda, mentor, evidence, review, dan next action.'},
  {title:'OSN Academy',tag:'ACHIEVEMENT',text:'Problem solving, competency graph, mastery, solution review, dan pembinaan kompetisi.'},
  {title:'AI Education Core',tag:'AI',text:'AI menjadi pendamping pendidikan dengan batas peran, human review, evidence, dan audit.'},
];

const journeys = [
  {id:'siswa',title:'Saya siswa',text:'Belajar lebih terarah, melihat evidence, target, dan langkah berikutnya.',icon:GraduationCap},
  {id:'orang-tua',title:'Saya orang tua',text:'Memahami perkembangan anak dengan konteks yang jelas dan dapat ditelusuri.',icon:Users},
  {id:'mentor',title:'Saya mentor',text:'Mendesain pembelajaran, membaca evidence, melakukan review, dan intervensi.',icon:BrainCircuit},
  {id:'institusi',title:'Saya institusi',text:'Mengelola akademik, operasional, mutu, CRM, finance, dan governance.',icon:Network},
];

const roles = [
  {title:'Siswa',text:'Belajar, berlatih, merefleksikan proses, dan melihat perkembangan diri.',icon:GraduationCap},
  {title:'Orang Tua',text:'Memahami perjalanan belajar anak tanpa harus menebak dari angka semata.',icon:Users},
  {title:'Mentor',text:'Mengelola pembelajaran, evidence, intervensi, dan review dalam konteks peserta.',icon:BrainCircuit},
  {title:'Institusi',text:'Menghubungkan akademik, operasional, mutu, finance, CRM, dan compliance.',icon:Network},
];

const faqs = [
  ['Apa itu Education OS?','Education OS adalah operating system pendidikan yang menghubungkan pembelajaran, pendampingan, prestasi, institusi, komunikasi, dan learning intelligence.'],
  ['Apakah ini hanya website bimbel?','Tidak. Website publik adalah pintu masuk. Di baliknya terdapat ruang kerja berbeda untuk siswa, orang tua, mentor, institusi, mentor OSN, dan administrator.'],
  ['Bagaimana perkembangan siswa dibuktikan?','Melalui evidence seperti sesi, kehadiran, asesmen, kompetensi, karya, learning cycle, intervensi, dan review—bukan angka yang dibuat-buat.'],
  ['Apa hubungan Quantum Learning dengan Education OS?','Prinsip Quantum Learning diterjemahkan menjadi bagian dari siklus belajar: attention, elaboration, retrieval, metacognition, transfer, dan reflection.'],
];

function go(id:string){ document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }

export default function PublicWebsite(){
  const [open,setOpen]=useState<number|null>(0);
  const [journey,setJourney]=useState('siswa');
  const [mobile,setMobile]=useState(false);
  const [scrolled,setScrolled]=useState(false);

  useEffect(()=>{
    document.title='Education OS — Education Operating System';
    const onScroll=()=>setScrolled(window.scrollY>18);
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  const nav=[['Program','program'],['Cara Kerja','cara-kerja'],['Mentor','mentor'],['OSN Academy','osn'],['Institusi','institusi']];

  return <main className="eo-site" id="top">
    <div className="eo-announcement">
      <div className="eo-container eo-announcement-inner">
        <span><Sparkles size={13}/> Education OS · satu operating layer untuk perjalanan belajar</span>
        <button onClick={()=>go('cara-kerja')}>Pelajari sistem <ArrowRight size={13}/></button>
      </div>
    </div>

    <header className={scrolled?'eo-header scrolled':'eo-header'}>
      <div className="eo-container eo-nav">
        <button className="eo-brand" onClick={()=>go('top')} aria-label="Education OS">
          <span className="eo-brand-mark"><Sparkles size={18}/></span>
          <span><b>Education OS</b><small>Education Operating System</small></span>
        </button>
        <nav className={mobile?'eo-nav-links open':'eo-nav-links'}>
          {nav.map(([label,id])=><button key={id} onClick={()=>{go(id);setMobile(false)}}>{label}</button>)}
          <a href="./app/">Masuk ke Education OS <ArrowRight size={15}/></a>
        </nav>
        <div className="eo-nav-actions">
          <a href="./app/" className="eo-login">Masuk</a>
          <a href="./app/" className="eo-cta eo-cta-small">Mulai belajar <ArrowRight size={15}/></a>
        </div>
        <button className="eo-menu" onClick={()=>setMobile(!mobile)} aria-label="Buka menu">{mobile?<X/>:<Menu/>}</button>
      </div>
    </header>

    <section className="eo-hero">
      <div className="eo-grid-bg"/>
      <div className="eo-container eo-hero-grid">
        <div className="eo-hero-copy">
          <div className="eo-pill"><span className="eo-dot"/> Education Operating System</div>
          <h1>Pendidikan yang <span>terhubung.</span><br/>Perkembangan yang <span>terlihat.</span></h1>
          <p className="eo-lead">Education OS menyatukan siswa, orang tua, mentor, institusi, dan pembinaan OSN dalam satu alur—dari tujuan belajar, pembelajaran, evidence, intelligence, hingga tindakan berikutnya.</p>
          <div className="eo-hero-actions">
            <a href="./app/" className="eo-cta">Masuk ke Education OS <ArrowRight size={17}/></a>
            <button className="eo-secondary" onClick={()=>go('cara-kerja')}><CirclePlay size={16}/> Lihat cara kerja</button>
          </div>
          <div className="eo-trust-row">
            <span><Check size={14}/> Evidence-based</span>
            <span><Check size={14}/> Role-aware</span>
            <span><Check size={14}/> Audit-ready</span>
            <span><Check size={14}/> Mobile-ready</span>
          </div>
        </div>

        <div className="eo-product">
          <div className="eo-window">
            <div className="eo-window-top"><i/><i/><i/><b>Ruang Belajar · Education OS</b><span>LIVE SYSTEM</span></div>
            <div className="eo-window-body">
              <aside><strong>EO</strong><i/><i/><i/><i/><i/></aside>
              <div className="eo-preview">
                <div className="eo-preview-head"><div><small>RUANG BELAJAR SISWA</small><h3>Perjalanan Belajar</h3></div><span>AF</span></div>
                <div className="eo-kpis">
                  <div><small>Target aktif</small><b>—</b><em>berdasarkan data</em></div>
                  <div><small>Learning cycle</small><b>—</b><em>sedang berjalan</em></div>
                  <div><small>Evidence</small><b>—</b><em>terverifikasi</em></div>
                </div>
                <div className="eo-preview-card">
                  <div><b>Mastery Map</b><small>Evidence-based</small></div>
                  <div className="eo-bars"><i style={{width:'82%'}}/><i style={{width:'64%'}}/><i style={{width:'51%'}}/><i style={{width:'72%'}}/></div>
                  <small>Kompetensi · Evidence · Review</small>
                </div>
                <div className="eo-next"><Target size={16}/><span><b>Next action</b><small>Review refleksi sebelum sesi berikutnya</small></span><ChevronRight size={15}/></div>
              </div>
            </div>
          </div>
          <div className="eo-float eo-float-one"><BrainCircuit size={17}/><span><b>Learning Intelligence</b><small>Signals · mastery · recommendation</small></span></div>
          <div className="eo-float eo-float-two"><ShieldCheck size={17}/><span><b>Evidence verified</b><small>Review & audit trail</small></span></div>
        </div>
      </div>
    </section>

    <section className="eo-section eo-journeys">
      <div className="eo-container">
        <div className="eo-head center"><span className="eo-eyebrow">Mulai dari peran Anda</span><h2>Satu platform, pengalaman yang berbeda.</h2><p>Education OS menyesuaikan konteks, tugas, dan informasi yang tampil sesuai peran pengguna.</p></div>
        <div className="eo-journey-switcher">{journeys.map(item=>{const Icon=item.icon;return <button key={item.id} className={journey===item.id?'active':''} onClick={()=>setJourney(item.id)}><Icon size={17}/><span>{item.title}</span></button>})}</div>
        <div className="eo-journey-panel">
          {journeys.map(item=>item.id===journey&&<div key={item.id} className="eo-journey-copy"><span className="eo-eyebrow">Ruang yang relevan</span><h3>{item.title}</h3><p>{item.text}</p><a href="./app/" className="eo-cta">Masuk ke Education OS <ArrowRight size={16}/></a></div>)}
          <div className="eo-mini-ui"><div className="eo-mini-top"><span>Education OS</span><span>Personal workspace</span></div><div className="eo-mini-grid"><div><small>Tujuan aktif</small><b>Learning goal</b><span>Tujuan belajar terhubung ke kompetensi.</span></div><div><small>Evidence terbaru</small><b>Learning evidence</b><span>Sesi, asesmen, karya, dan refleksi.</span></div><div><small>Next action</small><b>Review & lanjutkan</b><span>Tindakan berikutnya berdasarkan konteks.</span></div></div></div>
        </div>
      </div>
    </section>

    <section id="program" className="eo-section eo-soft">
      <div className="eo-container">
        <div className="eo-head">
          <div><span className="eo-eyebrow">Satu ekosistem</span><h2>Bukan kumpulan halaman.<br/>Satu perjalanan yang saling terhubung.</h2></div>
          <p>Setiap modul punya konteks, action, evidence, review, lifecycle, dan next action. Website menjelaskan produknya; ruang kerja menjalankan sistemnya.</p>
        </div>
        <div className="eo-program-grid">{programs.map(item=><article className="eo-card" key={item.title}>
          <span>{item.tag}</span><h3>{item.title}</h3><p>{item.text}</p><ArrowRight size={16}/>
        </article>)}</div>
      </div>
    </section>

    <section id="cara-kerja" className="eo-section">
      <div className="eo-container">
        <div className="eo-head center"><span className="eo-eyebrow">Cara kerja</span><h2>Dari tujuan belajar menjadi tindakan yang dapat ditelusuri.</h2><p>Alur ini menjadi fondasi Education OS di seluruh role dan ruang kerja.</p></div>
        <div className="eo-flow">{[
          ['01','Tujuan','Tujuan, program, kompetensi, dan konteks peserta.'],
          ['02','Pembelajaran','Sesi, materi, tugas, latihan, retrieval, dan refleksi.'],
          ['03','Evidence','Asesmen, karya, kehadiran, observasi, dan learning cycle.'],
          ['04','Intelligence','Mastery, signals, intervensi, dan rekomendasi.'],
          ['05','Next action','Tindakan berikutnya dan siklus belajar berikutnya.']
        ].map(([n,t,d],i)=><div className="eo-flow-item" key={n}><b>{n}</b><div><h3>{t}</h3><p>{d}</p></div>{i<4&&<ChevronRight className="eo-flow-arrow"/>}</div>)}</div>
      </div>
    </section>

    <section id="mentor" className="eo-section eo-dark">
      <div className="eo-container eo-two">
        <div><span className="eo-eyebrow">Untuk mentor & guru</span><h2>Ruang kerja untuk membimbing, bukan sekadar melihat daftar siswa.</h2>
          <p>Mentor bekerja dari konteks peserta: merancang pembelajaran, membaca evidence, menilai kompetensi, melakukan intervensi, mereview, dan menentukan tindakan berikutnya.</p>
          <div className="eo-checks">{['Learning Design & Learning Cycle','Evidence Graph & Mastery Map','Metacognition & Reflection Review','Intervention Engine','Experiment Lab & Recommendation Review'].map(x=><span key={x}><Check size={15}/>{x}</span>)}</div>
          <a href="./app/" className="eo-cta eo-light-cta">Masuk ke ruang mentor <ArrowRight size={16}/></a>
        </div>
        <div className="eo-mentor-card">
          <div className="eo-card-top"><b>Ruang Kerja Mentor</b><small>Learning Intelligence</small></div>
          <div className="eo-person"><span>AP</span><div><b>Mentor Matematika</b><small>Review & coaching</small></div><em>Aktif</em></div>
          <div className="eo-mentor-metrics"><div><small>Peserta aktif</small><b>Live data</b></div><div><small>Evidence review</small><b>Live data</b></div><div><small>Intervensi</small><b>Live data</b></div></div>
          <div className="eo-insight"><BrainCircuit size={17}/><span><b>Insight tersedia</b><small>Review evidence untuk menentukan tindakan berikutnya.</small></span></div>
        </div>
      </div>
    </section>

    <section id="osn" className="eo-section">
      <div className="eo-container eo-osn">
        <div className="eo-orbit"><div><GraduationCap size={28}/><b>OSN</b><small>Academy</small></div><i className="a">Problem Solving</i><i className="b">Mastery</i><i className="c">Deep Focus</i><i className="d">Solution Review</i></div>
        <div><span className="eo-eyebrow">OSN Academy</span><h2>Pembinaan prestasi yang dibangun dari kompetensi.</h2><p>Jalur OSN menghubungkan problem set, competency graph, mastery map, deep focus, retrieval, metacognition, transfer, dan solution reflection.</p><a href="./app/" className="eo-secondary">Buka OSN Academy <ArrowRight size={16}/></a></div>
      </div>
    </section>

    <section id="institusi" className="eo-section eo-soft">
      <div className="eo-container">
        <div className="eo-head"><div><span className="eo-eyebrow">Untuk seluruh ekosistem</span><h2>Satu sistem. Role berbeda.<br/>Konteks tetap terjaga.</h2></div><p>Setiap pengguna melihat ruang yang sesuai dengan tanggung jawabnya, sementara data dan governance tetap terhubung.</p></div>
        <div className="eo-role-grid">{roles.map(({title,text,icon:Icon})=><article className="eo-role" key={title}><span><Icon size={20}/></span><h3>{title}</h3><p>{text}</p><ArrowRight size={16}/></article>)}</div>
      </div>
    </section>

    <section className="eo-section">
      <div className="eo-container eo-faq-layout">
        <div><span className="eo-eyebrow">Pertanyaan umum</span><h2>Kompleks di belakang.<br/>Sederhana di depan.</h2><p>UX Education OS dirancang agar pengguna tidak perlu memahami seluruh arsitektur sistem untuk menyelesaikan pekerjaannya.</p></div>
        <div className="eo-faq-list">{faqs.map(([q,a],i)=><div className={open===i?'eo-faq-item open':'eo-faq-item'} key={q}><button onClick={()=>setOpen(open===i?null:i)}><b>{q}</b><ChevronDown size={18}/></button>{open===i&&<p>{a}</p>}</div>)}</div>
      </div>
    </section>

    <section className="eo-section eo-proof">
      <div className="eo-container eo-proof-grid">
        <div><span className="eo-eyebrow">Fondasi sistem</span><h2>UX sederhana di depan. Arsitektur pendidikan serius di belakang.</h2><p>Website ini adalah pintu masuk. Setelah masuk, Education OS membawa pengguna ke ruang kerja dengan role, scope data, action, evidence, review, lifecycle, dan audit yang sesuai.</p></div>
        <div className="eo-proof-list">
          <div><span><ShieldCheck size={18}/></span><b>Evidence-based</b><small>Perkembangan dibangun dari data pembelajaran yang dapat ditelusuri.</small></div>
          <div><span><Target size={18}/></span><b>Action-oriented</b><small>Setiap informasi diarahkan pada keputusan atau tindakan berikutnya.</small></div>
          <div><span><BarChart3 size={18}/></span><b>Learning Intelligence</b><small>Mastery, signals, intervensi, dan rekomendasi tetap memiliki konteks.</small></div>
          <div><span><CalendarDays size={18}/></span><b>Learning cycle</b><small>Tujuan, belajar, evidence, refleksi, review, lalu siklus berikutnya.</small></div>
        </div>
      </div>
    </section>

    <section className="eo-final">
      <div className="eo-container"><span className="eo-pill dark-pill"><Sparkles size={14}/> Education OS</span><h2>Bangun perjalanan belajar yang lebih terarah.</h2><p>Masuk ke Education OS dan lihat bagaimana pembelajaran, evidence, intelligence, dan tindakan berikutnya bekerja sebagai satu sistem.</p><a href="./app/" className="eo-cta">Masuk ke Education OS <ArrowRight size={17}/></a></div>
    </section>

    <footer className="eo-footer">
      <div className="eo-container eo-footer-grid">
        <div><div className="eo-brand"><span className="eo-brand-mark"><Sparkles size={17}/></span><span><b>Education OS</b><small>Education Operating System</small></span></div><p>Platform pendidikan untuk pembelajaran, pendampingan, prestasi, dan institusi.</p></div>
        <div><b>Platform</b><a href="#program">Program</a><a href="#cara-kerja">Cara Kerja</a><a href="#mentor">Mentor</a><a href="#osn">OSN Academy</a></div>
        <div><b>Ekosistem</b><a href="#institusi">Siswa</a><a href="#institusi">Orang Tua</a><a href="#institusi">Mentor</a><a href="#institusi">Institusi</a></div>
        <div><b>Akses</b><a href="./app/">Masuk ke Education OS</a><a href="mailto:dwahyudi8377@gmail.com">dwahyudi8377@gmail.com</a><span>Indonesia</span></div>
      </div>
      <div className="eo-container eo-bottom"><span>© {new Date().getFullYear()} Education OS</span><span>Evidence-based · Role-aware · Audit-ready</span></div>
    </footer>
  </main>;
}
