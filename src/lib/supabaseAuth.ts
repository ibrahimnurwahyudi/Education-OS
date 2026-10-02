const SUPABASE_URL='https://cbuunkkmpwwflxlqypxn.supabase.co';
const SUPABASE_KEY='sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV';

type DbMembership={organization_id:string;role:string;status:string};
type DbProfile={id:string;user_id:string;display_name:string|null;avatar_url:string|null;phone:string|null;timezone:string|null};

export type AuthIdentity={
  userId:string;
  email:string;
  displayName:string;
  avatarUrl:string;
  role:'Siswa'|'Orang Tua'|'Mentor'|'Institusi'|'Mentor OSN'|'HRD'|'Administrator';
  personId:string;
  organizationId:string;
  organizationName:string;
  accessToken:string;
  refreshToken:string;
};

type StoredSession={access_token:string;refresh_token:string;expires_at?:number};

const STORAGE_KEY='education-os-supabase-session';

async function authRequest(path:string,body:Record<string,string>){
  const res=await fetch(SUPABASE_URL+'/auth/v1/'+path,{
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},
    body:JSON.stringify(body)
  });
  const json=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json.error_description||json.msg||json.message||'Autentikasi gagal.');
  return json;
}

async function rest(path:string,accessToken:string){
  const res=await fetch(SUPABASE_URL+'/rest/v1/'+path,{
    headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+accessToken}
  });
  const json=await res.json().catch(()=>[]);
  if(!res.ok) throw new Error(json.message||'Gagal membaca identity.');
  return json;
}

async function user(accessToken:string){
  const res=await fetch(SUPABASE_URL+'/auth/v1/user',{
    headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+accessToken}
  });
  if(!res.ok) return null;
  return res.json();
}

async function refresh(refreshToken:string){
  return authRequest('token?grant_type=refresh_token',{refresh_token:refreshToken});
}

function mapRole(memberships:DbMembership[]){
  const roles=memberships.map(x=>x.role);
  if(roles.includes('admin')) return 'Administrator' as const;
  if(roles.includes('institution_owner')||roles.includes('academic_director')||roles.includes('academic_coordinator')||roles.includes('admissions')||roles.includes('finance')||roles.includes('auditor')) return 'Institusi' as const;
  if(roles.includes('osn_mentor')) return 'Mentor OSN' as const;
  if(roles.includes('mentor')) return 'Mentor' as const;
  if(roles.includes('hrd')) return 'HRD' as const;
  if(roles.includes('parent')) return 'Orang Tua' as const;
  return 'Siswa' as const;
}

async function buildIdentity(accessToken:string,refreshToken:string):Promise<AuthIdentity>{
  const u=await user(accessToken);
  if(!u?.id) throw new Error('Sesi autentikasi tidak valid.');
  const profiles=await rest('profiles?select=id,user_id,display_name,avatar_url,phone,timezone&user_id=eq.'+encodeURIComponent(u.id)+'&limit=1',accessToken) as DbProfile[];
  const profile=profiles[0];
  if(!profile) throw new Error('Akun berhasil masuk, tetapi profile Education OS belum dibuat.');
  const memberships=await rest('organization_members?select=organization_id,role,status&user_id=eq.'+encodeURIComponent(u.id)+'&status=eq.active&order=created_at.asc',accessToken) as DbMembership[];
  if(!memberships.length) throw new Error('Akun belum memiliki membership aktif di Education OS.');
  const membership=memberships[0];
  const role=mapRole(memberships);
  const orgs=await rest('organizations?select=id,name&id=eq.'+encodeURIComponent(membership.organization_id)+'&limit=1',accessToken) as {id:string;name:string}[];
  const organization=orgs[0];
  let personId=profile.id;
  const table=role==='Siswa'?'students':role==='Orang Tua'?'parents':role==='Mentor'?'mentors':role==='Mentor OSN'?'mentors':null;
  if(table){
    const rows=await rest(table+'?select=id&profile_id=eq.'+encodeURIComponent(profile.id)+'&organization_id=eq.'+encodeURIComponent(membership.organization_id)+'&limit=1',accessToken) as {id:string}[];
    if(rows[0]) personId=rows[0].id;
  } else personId=membership.organization_id;
  return {
    userId:u.id,email:u.email||'',displayName:profile.display_name||u.email||'Education OS User',
    avatarUrl:profile.avatar_url||'',role,personId,organizationId:membership.organization_id,
    organizationName:organization?.name||'Education OS',accessToken,refreshToken
  };
}

export async function signInWithPassword(email:string,password:string){
  const json=await authRequest('token?grant_type=password',{email,password});
  const identity=await buildIdentity(json.access_token,json.refresh_token);
  localStorage.setItem(STORAGE_KEY,JSON.stringify({access_token:json.access_token,refresh_token:json.refresh_token,expires_at:json.expires_at?Date.now()+json.expires_in*1000:undefined}));
  return identity;
}

export async function restoreIdentity(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return null;
    const stored=JSON.parse(raw) as StoredSession;
    let access=stored.access_token;
    let refreshToken=stored.refresh_token;
    let u=await user(access);
    if(!u){
      if(!refreshToken)return null;
      const refreshed=await refresh(refreshToken);
      access=refreshed.access_token;
      refreshToken=refreshed.refresh_token||refreshToken;
      localStorage.setItem(STORAGE_KEY,JSON.stringify({access_token:access,refresh_token:refreshToken,expires_at:refreshed.expires_at?Date.now()+refreshed.expires_in*1000:undefined}));
    }
    return await buildIdentity(access,refreshToken);
  }catch{return null}
}

export async function signOut(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw){
      const s=JSON.parse(raw);
      await fetch(SUPABASE_URL+'/auth/v1/logout',{method:'POST',headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+s.access_token}});
    }
  }finally{localStorage.removeItem(STORAGE_KEY)}
}
