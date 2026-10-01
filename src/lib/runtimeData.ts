const SUPABASE_URL='https://cbuunkkmpwwflxlqypxn.supabase.co';
const SUPABASE_KEY='sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV';
export type RuntimeRole='Siswa'|'Orang Tua'|'Mentor'|'Mentor OSN'|'Institusi'|'Administrator';
export type RuntimeIdentity={role:RuntimeRole;personId:string;organizationId:string;accessToken:string};
export type RuntimeRecord={id:string;title:string;meta:string;status:string;detail:string};
async function get(path:string,token:string){const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+token}});if(!r.ok)throw new Error('Data API '+r.status);return r.json();}
async function profiles(ids:string[],token:string){if(!ids.length)return [];return get('profiles?select=id,display_name,avatar_url&id=in.('+ids.map(encodeURIComponent).join(',')+')'.replace(' ','') ,token);}
export async function loadScopedStudents(identity:RuntimeIdentity,submenu:string):Promise<RuntimeRecord[]>{
 if(identity.role==='Administrator')return [];
 let students:any[]=[];
 if(identity.role==='Siswa') students=await get('students?select=id,profile_id,organization_id,status,grade_level&id=eq.'+encodeURIComponent(identity.personId)+'&limit=1',identity.accessToken);
 else if(identity.role==='Orang Tua'){const rel=await get('student_parent_relations?select=student_id&parent_id=eq.'+encodeURIComponent(identity.personId)+'&status=eq.active',identity.accessToken);const ids=rel.map((x:any)=>x.student_id);if(ids.length)students=await get('students?select=id,profile_id,organization_id,status,grade_level&id=in.('+ids.join(',')+')',identity.accessToken);}
 else if(identity.role==='Mentor'||identity.role==='Mentor OSN'){const rel=await get('student_mentor_assignments?select=student_id&mentor_id=eq.'+encodeURIComponent(identity.personId)+'&status=eq.active',identity.accessToken);const ids=rel.map((x:any)=>x.student_id);if(ids.length)students=await get('students?select=id,profile_id,organization_id,status,grade_level&id=in.('+ids.join(',')+')',identity.accessToken);}
 else students=await get('students?select=id,profile_id,organization_id,status,grade_level&organization_id=eq.'+encodeURIComponent(identity.organizationId)+'&order=created_at.asc&limit=75',identity.accessToken);
 const ids=students.map(x=>x.profile_id);const ps=await profiles(ids,identity.accessToken);const pm=new Map(ps.map((p:any)=>[p.id,p]));
 return students.map((s:any)=>{const p=pm.get(s.profile_id);const name=p?.display_name||'Siswa';return {id:s.id,title:name+' · '+submenu,meta:(s.grade_level||'Jenjang belum diisi')+' · '+s.status, status:s.status||'Aktif',detail:'Record berasal dari Supabase dan dibatasi oleh identity/RLS. Scope: '+identity.role+'.'}});
}
