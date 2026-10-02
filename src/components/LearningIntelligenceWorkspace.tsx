import { useEffect, useMemo, useState } from 'react';
import { Activity, BrainCircuit, CheckCircle2, Headphones, Play, Pause, RotateCcw, Sparkles, Target, TimerReset } from 'lucide-react';

type Props = {
  role: string;
  studentId: string;
  organizationId?: string;
  accessToken?: string;
};

const SUPABASE_URL='https://cbuunkkmpwwflxlqypxn.supabase.co';
const SUPABASE_KEY='sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV';

type AudioItem={id:string;title:string;audio_type:string;intended_use:string;duration_seconds:number|null;external_url?:string|null;evidence_note?:string|null;safety_note?:string|null};
type Measurement={metric:string;value:number;phase:string};

const phases=[
  {key:'pre',label:'Baseline',duration:3,desc:'Cek kesiapan, fokus, energi, dan tujuan.'},
  {key:'opening',label:'Ignition',duration:5,desc:'Aktivasi rasa ingin tahu dan tujuan belajar.'},
  {key:'focus',label:'Focus',duration:20,desc:'Belajar aktif, elaborasi, retrieval, dan diskusi.'},
  {key:'break',label:'Recovery',duration:3,desc:'Jeda opsional dengan soundscape/relaksasi.'},
  {key:'practice',label:'Practice',duration:20,desc:'Latihan, problem solving, dan feedback.'},
  {key:'reflection',label:'Reflection',duration:5,desc:'Metakognisi: apa yang dipahami dan belum.'},
  {key:'post',label:'Post-check',duration:4,desc:'Ukur perubahan setelah siklus.'}
];

async function api(path:string,token:string|undefined,method='GET',body?:unknown){
  const res=await fetch(SUPABASE_URL+'/rest/v1/'+path,{method,headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+(token||SUPABASE_KEY),'Content-Type':'application/json',Prefer:'return=representation'},body:body?JSON.stringify(body):undefined});
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function LearningIntelligenceWorkspace({role,studentId,organizationId,accessToken}:Props){
  const [audios,setAudios]=useState<AudioItem[]>([]);
  const [selectedAudio,setSelectedAudio]=useState('');
  const [phase,setPhase]=useState('pre');
  const [running,setRunning]=useState(false);
  const [seconds,setSeconds]=useState(180);
  const [measurements,setMeasurements]=useState<Measurement[]>([]);
  const [attention,setAttention]=useState(3);
  const [energy,setEnergy]=useState(3);
  const [fatigue,setFatigue]=useState(3);
  const [confidence,setConfidence]=useState(3);
  const [reflection,setReflection]=useState('');
  const [agentMessage,setAgentMessage]=useState('EDUHOST sedang membaca kesiapan belajar dan akan mengusulkan langkah berikutnya berdasarkan evidence.');
  const [saved,setSaved]=useState(false);
  const [error,setError]=useState('');

  useEffect(()=>{api('learning_audio_catalog?active=eq.true&select=*',accessToken).then(setAudios).catch(e=>setError(String(e.message||e)));},[accessToken]);

  useEffect(()=>{
    if(!running)return;
    const id=window.setInterval(()=>setSeconds(s=>{if(s<=1){setRunning(false);return 0}return s-1}),1000);
    return()=>window.clearInterval(id);
  },[running]);

  const audio=audios.find(a=>a.id===selectedAudio)||audios[0];
  const pre=useMemo(()=>measurements.filter(x=>x.phase==='pre'),[measurements]);
  const post=useMemo(()=>measurements.filter(x=>x.phase==='post'),[measurements]);

  const recommend=()=>{
    const readiness=(attention+energy+confidence)/3;
    if(readiness<2.5){setAgentMessage('EDUHOST: kesiapan rendah. Mulai dengan 3 menit breathing/soundscape, lalu gunakan aktivitas konsep ringan sebelum latihan intensif.');}
    else if(fatigue>=4){setAgentMessage('EDUHOST: fatigue tinggi. Pertahankan jeda Recovery dan kurangi beban instruksi pada blok pertama.');}
    else{setAgentMessage('EDUHOST: kesiapan cukup. Gunakan active learning → retrieval → practice, lalu Recovery singkat sebelum blok latihan.');}
  };

  const capture=async(phaseName:string)=>{
    setError('');
    const rows=[
      {organization_id:organizationId||null,student_id:studentId,phase:phaseName,metric:'attention',value_numeric:attention,source:'self_report'},
      {organization_id:organizationId||null,student_id:studentId,phase:phaseName,metric:'energy',value_numeric:energy,source:'self_report'},
      {organization_id:organizationId||null,student_id:studentId,phase:phaseName,metric:'fatigue',value_numeric:fatigue,source:'self_report'},
      {organization_id:organizationId||null,student_id:studentId,phase:phaseName,metric:'confidence',value_numeric:confidence,source:'self_report'}
    ];
    try{
      await api('learning_session_measurements',accessToken,'POST',rows);
      setMeasurements(m=>[...m,...rows.map(x=>({metric:x.metric,value:x.value_numeric,phase:phaseName}))]);
      setSaved(true); setTimeout(()=>setSaved(false),1800);
      if(phaseName==='post') recommend();
    }catch(e:any){setError(e.message||'Pengukuran gagal disimpan.');}
  };

  const createCycle=async()=>{
    setError('');
    const get=(p:string,m:string)=>measurements.find(x=>x.phase===p&&x.metric===m)?.value ?? null;
    try{
      await api('learning_cycles',accessToken,'POST',{organization_id:organizationId||null,student_id:studentId,attention_pre:get('pre','attention'),attention_post:get('post','attention'),fatigue_pre:get('pre','fatigue'),fatigue_post:get('post','fatigue'),confidence_pre:get('pre','confidence'),confidence_post:get('post','confidence'),reflection_pre:phase==='pre'?reflection:null,reflection_post:phase==='post'?reflection:null,evidence:{method:'QL_ACTIVE_CYCLE',audio_id:selectedAudio||null,role}});
      await api('learning_agent_runs',accessToken,'POST',{organization_id:organizationId||null,student_id:studentId,agent_name:'EDUHOST Learning Agent',trigger:'learning_cycle_completed',input_snapshot:{measurements,phase,audio:selectedAudio||null},recommendation:agentMessage,actions:['review_pre_post','suggest_next_activity','flag_for_mentor_review'],status:'recommended'});
      setSaved(true); setTimeout(()=>setSaved(false),1800);
    }catch(e:any){setError(e.message||'Learning cycle gagal disimpan.');}
  };

  const current=phases.find(p=>p.key===phase)||phases[0];

  return <div className="space-y-5">
    <section className="rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[.08] via-white/[.025] to-transparent p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-300"><BrainCircuit size={15}/> Learning Intelligence Layer</div>
          <h1 className="mt-2 text-2xl font-semibold">Quantum Learning Cycle</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Siklus belajar aktif yang menggabungkan orientasi, fokus, retrieval, latihan, jeda recovery, refleksi, dan pengukuran sebelum–sesudah.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-slate-400">Mode: <strong className="text-slate-200">{role}</strong><br/>Student scope: <strong className="text-slate-200">{studentId}</strong></div>
      </div>
    </section>

    <div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
      <section className="rounded-3xl border border-white/10 bg-white/[.025] p-5">
        <div className="flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-widest text-cyan-300">Session protocol</div><h2 className="mt-1 text-lg font-semibold">{current.label}</h2></div><div className="text-xs text-slate-500">{current.duration} min target</div></div>
        <p className="mt-2 text-sm text-slate-400">{current.desc}</p>
        <div className="mt-5 grid gap-2 md:grid-cols-7">{phases.map((p,i)=><button key={p.key} onClick={()=>{setPhase(p.key);setSeconds(p.duration*60)}} className={'rounded-xl border p-3 text-left '+(p.key===phase?'border-cyan-300/30 bg-cyan-300/10':'border-white/10 hover:bg-white/[.03]')}><div className="text-[9px] uppercase tracking-widest text-slate-600">0{i+1}</div><div className="mt-1 text-xs font-medium">{p.label}</div><div className="mt-1 text-[10px] text-slate-600">{p.duration}m</div></button>)}</div>
        <div className="mt-5 flex flex-wrap items-center gap-3"><div className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-lg font-mono"><TimerReset size={16}/>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</div><button onClick={()=>setRunning(v=>!v)} className="rounded-xl bg-cyan-300 px-4 py-3 text-xs font-semibold text-slate-950">{running?<Pause size={14} className="mr-1 inline"/>:<Play size={14} className="mr-1 inline"/>}{running?'Jeda timer':'Mulai timer'}</button><button onClick={()=>setSeconds(current.duration*60)} className="rounded-xl border border-white/10 px-4 py-3 text-xs"><RotateCcw size={14} className="mr-1 inline"/>Reset</button></div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[.025] p-5">
        <div className="flex items-center gap-2 text-cyan-300"><Headphones size={16}/><span className="text-xs uppercase tracking-widest">Recovery audio</span></div>
        <h2 className="mt-1 text-lg font-semibold">Jeda pemulihan</h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">Audio bersifat opsional. Sistem mengukur efeknya, bukan menganggapnya otomatis meningkatkan kemampuan otak.</p>
        <select className="m-input mt-4" value={selectedAudio} onChange={e=>setSelectedAudio(e.target.value)}><option value="">Tanpa audio</option>{audios.map(a=><option key={a.id} value={a.id}>{a.title} · {a.audio_type}</option>)}</select>
        {audio?.external_url&&<audio className="mt-4 w-full" controls src={audio.external_url}/>}
        {audio&&<div className="mt-4 rounded-xl border border-white/10 p-3 text-xs text-slate-500"><strong className="text-slate-300">{audio.intended_use}</strong><br/>{audio.evidence_note}<br/><span className="text-amber-300">{audio.safety_note}</span></div>}
      </section>
    </div>

    <section className="rounded-3xl border border-white/10 bg-white/[.025] p-5">
      <div className="flex items-center gap-2 text-cyan-300"><Activity size={16}/><span className="text-xs uppercase tracking-widest">Before / After Lab</span></div>
      <h2 className="mt-1 text-lg font-semibold">Ukur perubahan, bukan sekadar menyatakan “lebih pintar”</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-4">{[['attention','Fokus'],['energy','Energi'],['fatigue','Fatigue'],['confidence','Confidence']].map(([key,label])=><label key={key}><span className="m-label">{label} · 1–5</span><input className="w-full" type="range" min="1" max="5" value={({attention,energy,fatigue,confidence} as any)[key]} onChange={e=>({attention:setAttention,energy:setEnergy,fatigue:setFatigue,confidence:setConfidence} as any)[key](Number(e.target.value))}/><div className="mt-1 text-xs text-slate-400">Nilai: {({attention,energy,fatigue,confidence} as any)[key]}</div></label>)}</div>
      <textarea className="m-input mt-4 min-h-24" value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Refleksi singkat: apa yang paling siap / paling sulit?"/>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>capture(phase==='post'?'post':'pre')} className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-950"><CheckCircle2 size={14} className="mr-1 inline"/>Simpan pengukuran {phase==='post'?'POST':'PRE'}</button><button onClick={recommend} className="rounded-xl border border-cyan-300/20 px-4 py-2.5 text-xs text-cyan-200"><Sparkles size={14} className="mr-1 inline"/>Minta EDUHOST menganalisis</button><button onClick={createCycle} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs">Simpan Learning Cycle</button></div>
      {saved&&<div className="mt-3 text-xs text-emerald-300">Tersimpan.</div>}{error&&<div className="mt-3 text-xs text-rose-300">{error}</div>}
    </section>

    <section className="rounded-3xl border border-cyan-300/10 bg-cyan-300/[.025] p-5">
      <div className="flex items-center gap-2 text-cyan-300"><Sparkles size={16}/><span className="text-xs uppercase tracking-widest">EDUHOST Learning Agent</span></div>
      <h2 className="mt-1 text-lg font-semibold">Adaptive Learning Orchestrator</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{agentMessage}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-white/10 p-3"><Target size={15}/><div className="mt-2 text-xs font-medium">Personalize</div><div className="mt-1 text-[11px] text-slate-500">Memilih urutan aktivitas dari readiness dan evidence.</div></div><div className="rounded-xl border border-white/10 p-3"><BrainCircuit size={15}/><div className="mt-2 text-xs font-medium">Evidence loop</div><div className="mt-1 text-[11px] text-slate-500">Menghubungkan asesmen → sesi → evidence → mastery.</div></div><div className="rounded-xl border border-white/10 p-3"><Activity size={15}/><div className="mt-2 text-xs font-medium">Human review</div><div className="mt-1 text-[11px] text-slate-500">Keputusan penting tetap membutuhkan mentor/otoritas.</div></div></div>
    </section>
  </div>;
}
