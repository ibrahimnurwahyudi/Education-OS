const SUPABASE_URL='https://cbuunkkmpwwflxlqypxn.supabase.co';
const SUPABASE_KEY='sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV';

type Identity={role:'Siswa'|'Orang Tua'|'Mentor'|'Mentor OSN'|'Institusi'|'HRD'|'Administrator';personId:string;organizationId?:string;accessToken?:string};
type DbStudent={id:string;profile_id:string;organization_id:string;status:string;grade_level:string|null;profiles?:{display_name:string|null}|{display_name:string|null}[]|null};

async function rest(path:string,token:string){
  const res=await fetch(SUPABASE_URL+'/rest/v1/'+path,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+token}});
  const body=await res.json().catch(()=>[]);
  if(!res.ok) throw new Error(body?.message||'Gagal membaca data Education OS.');
  return body;
}
function displayName(row:DbStudent){
  const p=Array.isArray(row.profiles)?row.profiles[0]:row.profiles;
  return p?.display_name||row.id;
}
function toRecord(row:DbStudent,index:number){
  const name=displayName(row);
  return {id:row.id,title:name,meta:[row.grade_level?'Kelas '+row.grade_level:null,row.status].filter(Boolean).join(' · ')||'Peserta didik',
    status:row.status==='active'?'Aktif':row.status==='graduated'?'Lulus':row.status==='paused'?'Ditangguhkan':'Diarsipkan',
    detail:'Rekam peserta didik berasal dari Education OS · Supabase. Scope ditentukan oleh identity dan RLS.',
    data:{'Student ID':row.id,'Nama lengkap':name,'Nama anak':name,'Nama peserta':name,'ID peserta':row.id,'ID peserta didik':row.id,'Program':'—','Kelas / kelompok':row.grade_level?String(row.grade_level):'—','Status enrollment':row.status,'Status':row.status,'Status data':row.status,'Scope':row.organization_id,'Urutan':String(index+1)}} as any;
}
export async function loadScopedStudentRecords(identity:Identity){
  if(!identity.accessToken)return [];
  let rows:DbStudent[]=[];
  const base='select=id,profile_id,organization_id,status,grade_level,profiles(display_name)';
  if(identity.role==='Siswa'){
    rows=await rest('students?'+base+'&id=eq.'+encodeURIComponent(identity.personId)+'&limit=1',identity.accessToken) as DbStudent[];
  }else if(identity.role==='Orang Tua'){
    const links=await rest('student_parent_relations?select=student_id&parent_id=eq.'+encodeURIComponent(identity.personId)+'&status=eq.active',identity.accessToken) as {student_id:string}[];
    const ids=links.map(x=>x.student_id); if(ids.length) rows=await rest('students?'+base+'&id=in.('+ids.map(encodeURIComponent).join(',')+')',identity.accessToken) as DbStudent[];
  }else if(identity.role==='Mentor'||identity.role==='Mentor OSN'){
    const links=await rest('student_mentor_assignments?select=student_id&mentor_id=eq.'+encodeURIComponent(identity.personId)+'&status=eq.active',identity.accessToken) as {student_id:string}[];
    const ids=links.map(x=>x.student_id); if(ids.length) rows=await rest('students?'+base+'&id=in.('+ids.map(encodeURIComponent).join(',')+')',identity.accessToken) as DbStudent[];
  }else if(identity.role==='Institusi'){
    let query='students?'+base; if(identity.organizationId) query+='&organization_id=eq.'+encodeURIComponent(identity.organizationId);
    rows=await rest(query+'&order=created_at.desc&limit=500',identity.accessToken) as DbStudent[];
  }else{
    return [];
  }
  return rows.map(toRecord);
}
