import {useEffect,useMemo,useState} from 'react';
import {BarChart3,FileBarChart,Printer,RefreshCw,Search,X} from 'lucide-react';

const SUPABASE_URL='https://cbuunkkmpwwflxlqypxn.supabase.co';
const SUPABASE_KEY='sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV';

type ReportDef={key:string;title:string;description:string;view:string;group:string;columns:string[]};
const REPORTS:ReportDef[]=[
{key:'executive',title:'Executive Summary',description:'Ringkasan kesehatan Education OS per organisasi.',view:'report_executive_summary',group:'Eksekutif',columns:['organization_name','students','parents','mentors','programs','sessions','assessments','institutions','invoices','invoice_cents','audit_events']},
{key:'students',title:'Peserta Didik',description:'Status siswa, enrollment aktif, sesi, dan asesmen.',view:'report_student_overview',group:'Siswa',columns:['student_name','grade_level','status','active_enrollments','learning_sessions','assessments_attempted']},
{key:'enrollment',title:'Enrollment & Program',description:'Peserta, program, mata pelajaran, mentor, dan status enrollment.',view:'report_enrollment_program',group:'Akademik',columns:['enrollment_id','student_id','program_name','subject_name','mentor_id','status','started_at','ended_at']},
{key:'attendance',title:'Kehadiran Pembelajaran',description:'Kehadiran siswa/mentor dan status setiap sesi.',view:'report_attendance',group:'Akademik',columns:['session_id','student_id','mentor_id','scheduled_start','session_status','student_status','mentor_status','joined_at','left_at','present_flag']},
{key:'sessions',title:'Sesi Pembelajaran',description:'Jadwal, status, durasi, tujuan, dan closeout sesi.',view:'report_learning_sessions',group:'Akademik',columns:['session_id','student_id','mentor_id','scheduled_start','scheduled_end','status','duration_minutes','objectives','closeout_notes']},
{key:'assessment',title:'Kinerja Asesmen',description:'Attempt, skor, persentase, dan status asesmen.',view:'report_assessment_performance',group:'Asesmen',columns:['student_id','title','assessment_type','attempt_status','score','max_score','percentage','started_at','submitted_at']},
{key:'mastery',title:'Mastery Kompetensi',description:'Penguasaan kompetensi dan evidence per siswa.',view:'report_competency_mastery',group:'Learning Intelligence',columns:['student_id','competency_code','competency_name','competency_level','mastery','evidence_count','last_assessed_at']},
{key:'goals',title:'Target Belajar',description:'Target, tenggat, status, dan target yang terlambat.',view:'report_learning_goals',group:'Learning Intelligence',columns:['student_id','goal_id','title','target_date','status','overdue']},
{key:'interventions',title:'Intervensi Pembelajaran',description:'Observasi, interpretasi, rekomendasi, outcome, dan due date.',view:'report_interventions',group:'Learning Intelligence',columns:['student_id','intervention_id','title','status','due_date','interpretation','recommendation','outcome_status','outcome_recorded_at']},
{key:'cycles',title:'Learning Cycle / Quantum Learning',description:'Perubahan baseline-post score serta attention, engagement, fatigue, confidence.',view:'report_learning_cycles',group:'Quantum Learning',columns:['student_id','cycle_id','baseline_score','post_score','score_delta','attention_pre','attention_post','engagement_pre','engagement_post','confidence_pre','confidence_post','created_at']},
{key:'mentor',title:'Kinerja Mentor',description:'Caseload, sesi, marketplace booking, dan rating.',view:'report_mentor_performance',group:'Mentor',columns:['mentor_name','verification_status','active_students','sessions','marketplace_bookings','average_rating']},
{key:'osn',title:'Prestasi & Pembinaan OSN',description:'Track, enrollment, attempt, skor rata-rata, dan skor terbaik.',view:'report_osn_performance',group:'OSN Academy',columns:['student_id','track_name','discipline','level','enrollment_status','attempts','average_score','best_score']},
{key:'institution',title:'Operasional Institusi',description:'Institusi, cabang, siswa, dan mentor.',view:'report_institution_operations',group:'Institusi',columns:['name','code','institution_type','city','province','status','campuses','students','mentors']},
{key:'admissions',title:'Admissions & CRM Pipeline',description:'Lead dan registration application beserta statusnya.',view:'report_admissions_crm',group:'Admissions & CRM',columns:['source','record_id','person_name','status','created_at']},
{key:'crm',title:'Aktivitas CRM',description:'Aktivitas kontak, follow-up, due date, dan completion.',view:'report_crm_activity',group:'Admissions & CRM',columns:['contact_name','contact_type','contact_status','activity_type','subject','due_at','completed_at','created_at']},
{key:'receivables',title:'Piutang & Tagihan',description:'Invoice, jatuh tempo, status pembayaran, dan overdue.',view:'report_finance_receivables',group:'Finance',columns:['invoice_id','student_id','amount_cents','currency','status','due_at','paid_at','overdue_cents']},
{key:'payments',title:'Pembayaran',description:'Penerimaan pembayaran berdasarkan provider dan status.',view:'report_finance_payments',group:'Finance',columns:['payment_id','invoice_id','amount_cents','provider','status','paid_at','created_at']},
{key:'accounting',title:'Accounting Journal',description:'Jurnal, debit, kredit, net movement, dan posting.',view:'report_accounting_journal',group:'Accounting',columns:['journal_no','journal_date','source_type','description','status','posted_at','debit_cents','credit_cents','net_cents']},
{key:'documents',title:'Status Dokumen',description:'Dokumen operasional dan status verifikasinya.',view:'report_documents',group:'Governance',columns:['document_id','entity_type','entity_id','document_type','file_name','status','created_at']},
{key:'compliance',title:'Compliance & Evidence',description:'Kontrol, owner, status, evidence, dan review terakhir.',view:'report_compliance',group:'Governance',columns:['control_code','control_name','owner_role','status','last_reviewed_at','evidence_count','last_evidence_at']},
{key:'audit',title:'Audit Activity',description:'Jejak aktivitas perubahan di Education OS.',view:'report_audit_activity',group:'Governance',columns:['event_id','actor_user_id','action','entity_type','entity_id','created_at']},
{key:'ai',title:'AI / EDUHOST Usage',description:'Interaksi AI, token, confidence, human review, dan action.',view:'report_ai_usage',group:'AI / EDUHOST',columns:['model','intent','interactions','input_tokens','output_tokens','avg_confidence','human_review_required','actions_taken']},
{key:'ai_budget',title:'AI Budget',description:'Pemakaian token terhadap batas periode.',view:'report_ai_budget',group:'AI / EDUHOST',columns:['period_start','period_end','token_limit','token_used','alert_threshold','usage_percent']}
];

function label(k:string){return k.replaceAll('_',' ').replace(/\b\w/g,m=>m.toUpperCase())}
function formatValue(key:string,value:any){
 if(value===null||value===undefined||value==='')return '—';
 if(key.endsWith('_cents'))return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(value)/100);
 if(key.endsWith('_at')||key.endsWith('_date')){const d=new Date(value);if(!Number.isNaN(d.getTime()))return d.toLocaleString('id-ID',{dateStyle:'medium',timeStyle:key.endsWith('_at')?'short':undefined});}
 if(typeof value==='boolean')return value?'Ya':'Tidak';
 if(typeof value==='number')return new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(value);
 return String(value);
}
async function queryView(view:string,token?:string,organizationId?:string){
 const params=new URLSearchParams({select:'*',limit:'500'});
 if(organizationId)params.set('organization_id','eq.'+organizationId);
 const res=await fetch(SUPABASE_URL+'/rest/v1/'+view+'?'+params.toString(),{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+(token||SUPABASE_KEY)}});
 const body=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(body?.message||body?.hint||'Database report tidak dapat dibaca.');
 return Array.isArray(body)?body:[];
}

export default function ReportingWorkspace({onClose,accessToken,organizationId,module,submenu}:{onClose:()=>void;accessToken?:string;organizationId?:string;module:string;submenu:string}){
 const [selected,setSelected]=useState('executive'),[rows,setRows]=useState<any[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState(''),[search,setSearch]=useState('');
 const report=REPORTS.find(r=>r.key===selected)||REPORTS[0];
 const groups=useMemo(()=>Array.from(new Set(REPORTS.map(r=>r.group))),[]);
 const load=async()=>{setLoading(true);setError('');try{setRows(await queryView(report.view,accessToken,organizationId))}catch(e:any){setRows([]);setError(e?.message||'Gagal memuat laporan.')}finally{setLoading(false)}};
 useEffect(()=>{load()},[selected,accessToken,organizationId]);
 const filtered=rows.filter(row=>JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
 const print=()=>window.print();
 return <div className="fixed inset-0 z-50 bg-slate-950/85 p-3 sm:p-5">
  <div className="mx-auto flex h-full max-w-[1500px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
   <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
    <div><div className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">EDUCATION OS · REPORT CENTER</div><h2 className="mt-1 text-lg font-bold text-white">Laporan Database Education OS</h2><p className="text-xs text-slate-500">{module} · {submenu} · query Supabase</p></div>
    <div className="flex gap-2"><button onClick={load} className="m-outline"><RefreshCw size={14}/> Refresh</button><button onClick={print} className="m-outline"><Printer size={14}/> Cetak</button><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white/5"><X size={18}/></button></div>
   </header>
   <div className="grid min-h-0 flex-1 lg:grid-cols-[260px_1fr]">
    <aside className="overflow-auto border-b border-white/10 p-3 lg:border-b-0 lg:border-r">
      <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold text-slate-400"><FileBarChart size={14}/> Semua laporan</div>
      {groups.map(g=><div key={g} className="mb-4"><div className="px-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-slate-600">{g}</div>{REPORTS.filter(r=>r.group===g).map(r=><button key={r.key} onClick={()=>setSelected(r.key)} className={'mb-1 w-full rounded-xl px-3 py-2 text-left text-xs '+(r.key===selected?'bg-cyan-300/10 text-cyan-200':'text-slate-400 hover:bg-white/5')}>{r.title}</button>)}</div>)}
    </aside>
    <main className="min-h-0 overflow-auto p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><div className="text-[10px] uppercase tracking-widest text-cyan-300">{report.group}</div><h3 className="mt-1 text-xl font-bold text-white">{report.title}</h3><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">{report.description}</p></div><div className="flex items-center gap-2"><BarChart3 size={16} className="text-cyan-300"/><span className="text-xs text-slate-500">{filtered.length} baris</span></div></div>
      <div className="mb-4 flex gap-2"><Search size={15} className="mt-3 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} className="field max-w-md" placeholder="Cari pada hasil laporan..."/></div>
      {error&&<div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-xs leading-5 text-amber-200">{error}<div className="mt-1 text-amber-200/60">Untuk data tenant terlindungi, gunakan sesi administrator terautentikasi. View laporan memakai security_invoker agar RLS database tetap berlaku.</div></div>}
      {loading?<div className="grid min-h-[260px] place-items-center text-sm text-slate-500">Menjalankan query {report.view}…</div>:
       <div className="overflow-auto rounded-2xl border border-white/10"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-white/[.035]"><tr>{report.columns.map(c=><th key={c} className="whitespace-nowrap px-3 py-3 font-semibold text-slate-400">{label(c)}</th>)}</tr></thead><tbody>{filtered.map((row,i)=><tr key={row.id||row.record_id||i} className="border-t border-white/5">{report.columns.map(c=><td key={c} className="max-w-[340px] px-3 py-3 align-top text-slate-300">{formatValue(c,row[c])}</td>)}</tr>)}{!filtered.length&&<tr><td colSpan={report.columns.length} className="px-4 py-12 text-center text-slate-600">Tidak ada data yang dapat ditampilkan pada scope ini.</td></tr>}</tbody></table></div>}
    </main>
   </div>
  </div>
 </div>;
}
