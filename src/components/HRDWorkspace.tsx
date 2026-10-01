import {useEffect,useMemo,useState} from 'react';
import {CheckCircle2,ChevronRight,FileText,RefreshCw,Search,ShieldCheck,XCircle} from 'lucide-react';
import {approveMentorApplication,rejectMentorApplication} from '../lib/registration';

type Session={name:string;personId:string;organizationId?:string;accessToken?:string};
type Application={id:string;registration_application_id:string|null;organization_id:string|null;user_id:string;status:string;full_name:string|null;email:string|null;phone:string|null;position_applied:string|null;education_summary:string|null;years_experience:number|null;specializations:string[]|null;availability:Record<string,unknown>;salary_expectation_cents:number|null;cover_letter:string|null;hr_notes:string|null;hrd_decision:string|null;submitted_at:string;reviewed_at:string|null};
type Document={id:string;mentor_application_id:string|null;document_type:string;file_name:string;mime_type:string|null;file_size_bytes:number|null;visibility:string;status:string;uploaded_at:string};

const URL='https://cbuunkkmpwwflxlqypxn.supabase.co';
const KEY='sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV';

async function rest(path:string,token:string){
 const res=await fetch(URL+'/rest/v1/'+path,{headers:{apikey:KEY,Authorization:'Bearer '+token}});
 const body=await res.json().catch(()=>[]);
 if(!res.ok)throw new Error(body?.message||'Gagal memuat data HRD.');
 return body;
}

export default function HRDWorkspace({session,onLogout}:{session:Session;onLogout:()=>void}){
 const [applications,setApplications]=useState<Application[]>([]);
 const [documents,setDocuments]=useState<Document[]>([]);
 const [selected,setSelected]=useState<Application|null>(null);
 const [query,setQuery]=useState('');
 const [status,setStatus]=useState('all');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const token=session.accessToken||'';

 const load=async()=>{
  if(!token)return;
  setBusy(true);setMessage('');
  try{
   const apps=await rest('mentor_applications?select=id,registration_application_id,organization_id,user_id,status,full_name,email,phone,position_applied,education_summary,years_experience,specializations,availability,salary_expectation_cents,cover_letter,hr_notes,hrd_decision,submitted_at,reviewed_at&order=submitted_at.desc&limit=500',token);
   const docs=await rest('application_documents?select=id,mentor_application_id,document_type,file_name,mime_type,file_size_bytes,visibility,status,uploaded_at&order=uploaded_at.desc&limit=1000',token);
   setApplications(Array.isArray(apps)?apps:[]);setDocuments(Array.isArray(docs)?docs:[]);
   if(selected){setSelected((Array.isArray(apps)?apps:[]).find((x:Application)=>x.id===selected.id)||null)}
  }catch(e){setMessage(e instanceof Error?e.message:'Gagal memuat antrean HRD.')}finally{setBusy(false)}
 };
 useEffect(()=>{void load()},[token]);
 const filtered=useMemo(()=>applications.filter(a=>(status==='all'||a.status===status)&&((a.full_name||'').toLowerCase().includes(query.toLowerCase())||(a.email||'').toLowerCase().includes(query.toLowerCase())||(a.position_applied||'').toLowerCase().includes(query.toLowerCase()))),[applications,status,query]);
 const counts=useMemo(()=>({all:applications.length,pending:applications.filter(x=>['pending','submitted','screening','interview','credential_verification'].includes(x.status)).length,approved:applications.filter(x=>x.status==='approved').length,rejected:applications.filter(x=>x.status==='rejected').length}),[applications]);
 const selectedDocs=selected?documents.filter(d=>d.mentor_application_id===selected.id):[];
 const decide=async(kind:'approve'|'reject')=>{
  if(!selected||!token)return;
  setBusy(true);setMessage('');
  try{
   if(kind==='approve')await approveMentorApplication(token,selected.id);
   else{
    const reason=window.prompt('Alasan penolakan (akan tersimpan sebagai catatan HRD):','Tidak memenuhi kriteria proses rekrutmen.');
    if(reason===null){setBusy(false);return}
    await rejectMentorApplication(token,selected.id,reason);
   }
   setMessage(kind==='approve'?'Lamaran disetujui dan jalur onboarding diaktifkan.':'Lamaran ditolak dan keputusan dicatat.');
   await load();
  }catch(e){setMessage(e instanceof Error?e.message:'Tindakan HRD gagal.')}finally{setBusy(false)}
 };
 return <div className="min-h-screen bg-slate-950 text-slate-100">
  <header className="border-b border-white/10 bg-slate-950/95 px-5 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><div className="text-xs font-bold tracking-[.3em] text-cyan-300">EDUCATION OS</div><div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">HRD · Recruitment Operations</div></div><div className="flex items-center gap-2"><button onClick={()=>void load()} className="rounded-xl border border-white/10 px-3 py-2 text-xs"><RefreshCw size={14} className={busy?'animate-spin inline mr-1':'inline mr-1'}/>Refresh</button><button onClick={onLogout} className="rounded-xl border border-white/10 px-3 py-2 text-xs">Sign out</button></div></div></header>
  <main className="mx-auto max-w-7xl p-5 lg:p-8">
   <div className="mb-6"><div className="text-xs uppercase tracking-widest text-cyan-300">Ruang Kerja HRD</div><h1 className="mt-2 text-3xl font-semibold">Recruitment Control Center</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Antrean lamaran, credential, dokumen privat, keputusan HRD, dan transisi onboarding berada dalam satu alur yang dapat diaudit.</p></div>
   <div className="grid gap-3 sm:grid-cols-4">{[['all','Semua',counts.all],['pending','Perlu proses',counts.pending],['approved','Approved',counts.approved],['rejected','Rejected',counts.rejected]].map(([k,l,n])=><button key={k} onClick={()=>setStatus(String(k))} className={'rounded-2xl border p-4 text-left '+(status===k?'border-cyan-300/40 bg-cyan-300/[.06]':'border-white/10 bg-white/[.025]')}><div className="text-[10px] uppercase tracking-widest text-slate-500">{l}</div><div className="mt-2 text-2xl font-semibold">{n}</div></button>)}</div>
   <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
    <section className="rounded-3xl border border-white/10 bg-white/[.025]">
     <div className="border-b border-white/10 p-4"><div className="flex gap-2"><div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 px-3"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} className="w-full bg-transparent py-2.5 text-sm outline-none" placeholder="Cari nama, email, posisi..."/></div></div></div>
     <div className="divide-y divide-white/10">{filtered.map(a=><button key={a.id} onClick={()=>setSelected(a)} className={'flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-white/[.03] '+(selected?.id===a.id?'bg-cyan-300/[.04]':'')}><div className="min-w-0"><div className="font-medium">{a.full_name||'Kandidat'}</div><div className="mt-1 truncate text-xs text-slate-500">{a.position_applied||'Mentor'} · {a.email||'—'}</div></div><div className="flex items-center gap-2"><span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wide">{a.status}</span><ChevronRight size={15}/></div></button>)}{filtered.length===0&&<div className="p-10 text-center text-sm text-slate-500">Tidak ada lamaran pada filter ini.</div>}</div>
    </section>
    <section className="rounded-3xl border border-white/10 bg-white/[.025] p-5">{selected?<><div className="flex items-start justify-between gap-3"><div><div className="text-xs uppercase tracking-widest text-cyan-300">Application</div><h2 className="mt-1 text-xl font-semibold">{selected.full_name||'Kandidat'}</h2><div className="mt-1 text-xs text-slate-500">{selected.email} · {selected.phone||'Telepon belum diisi'}</div></div><ShieldCheck size={20} className="text-cyan-300"/></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{[['Posisi',selected.position_applied||'—'],['Status',selected.status],['Pendidikan',selected.education_summary||'—'],['Pengalaman',selected.years_experience==null?'—':selected.years_experience+' tahun'],['Keahlian',(selected.specializations||[]).join(', ')||'—'],['Diajukan',new Date(selected.submitted_at).toLocaleString('id-ID')]].map(([k,v])=><div key={String(k)} className="rounded-xl border border-white/10 p-3"><div className="text-[10px] uppercase tracking-widest text-slate-500">{k}</div><div className="mt-1 text-sm">{v}</div></div>)}</div>
      <div className="mt-4 rounded-2xl border border-white/10 p-4"><div className="text-xs font-semibold">Cover letter / motivasi</div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">{selected.cover_letter||'Tidak ada surat lamaran.'}</p></div>
      <div className="mt-4"><div className="mb-2 flex items-center gap-2 text-xs font-semibold"><FileText size={15}/> Dokumen kandidat · HRD only</div><div className="space-y-2">{selectedDocs.length?selectedDocs.map(d=><div key={d.id} className="flex items-center justify-between rounded-xl border border-white/10 p-3"><div><div className="text-sm">{d.file_name}</div><div className="mt-1 text-[10px] text-slate-500">{d.document_type} · {d.status} · {d.file_size_bytes?Math.ceil(d.file_size_bytes/1024)+' KB':'ukuran—'}</div></div><span className="text-[10px] text-amber-300">{d.visibility}</span></div>):<div className="rounded-xl border border-dashed border-white/10 p-4 text-xs text-slate-500">Belum ada dokumen.</div>}</div></div>
      {message&&<div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[.04] p-3 text-xs text-cyan-100">{message}</div>}
      {['approved','rejected'].includes(selected.status)?<div className="mt-5 rounded-xl border border-white/10 p-3 text-xs text-slate-400">Keputusan sudah dicatat: <b className="text-slate-200">{selected.status}</b>.</div>:<div className="mt-5 flex gap-2"><button disabled={busy} onClick={()=>void decide('reject')} className="flex-1 rounded-xl border border-red-300/20 px-4 py-3 text-xs font-semibold text-red-200"><XCircle size={15} className="mr-1 inline"/>Tolak</button><button disabled={busy} onClick={()=>void decide('approve')} className="flex-1 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-semibold text-slate-950"><CheckCircle2 size={15} className="mr-1 inline"/>Approve & Onboarding</button></div>}</>:<div className="grid h-full min-h-[480px] place-items-center text-center"><div><ShieldCheck size={28} className="mx-auto text-slate-600"/><div className="mt-3 text-sm text-slate-400">Pilih lamaran untuk membuka dossier HRD.</div><div className="mt-1 text-xs text-slate-600">Dokumen kandidat tidak ditampilkan di luar workflow HRD.</div></div></div>}</section>
   </div>
  </main>
 </div>;
}
