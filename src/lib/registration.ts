const SUPABASE_URL='https://cbuunkkmpwwflxlqypxn.supabase.co';
const SUPABASE_KEY='sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV';

export type RegistrationRole='student'|'parent'|'mentor'|'osn_mentor'|'institution';
export type RegistrationPayload=Record<string,unknown>;

async function auth(path:string,body:Record<string,unknown>){
  const res=await fetch(SUPABASE_URL+'/auth/v1/'+path,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},body:JSON.stringify(body)});
  const json=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json.error_description||json.msg||json.message||'Autentikasi gagal.');
  return json;
}
export async function signUpRegistration(email:string,password:string,role:RegistrationRole,fullName:string,phone:string,payload:RegistrationPayload){
  return auth('signup',{email,password,options:{data:{education_role:role,full_name:fullName,registration_payload:payload}}});
}
export function startGoogleAuth(){
  const redirectTo=window.location.origin+window.location.pathname;
  window.location.href=SUPABASE_URL+'/auth/v1/authorize?provider=google&redirect_to='+encodeURIComponent(redirectTo);
}
export function captureOAuthSession(){
  const hash=new URLSearchParams(window.location.hash.replace(/^#/,''));
  const access=hash.get('access_token'), refresh=hash.get('refresh_token');
  if(!access||!refresh)return false;
  localStorage.setItem('education-os-supabase-session',JSON.stringify({access_token:access,refresh_token:refresh}));
  history.replaceState(null,'',window.location.pathname+window.location.search);
  return true;
}
export async function getCurrentAuthUser(){
  const raw=localStorage.getItem('education-os-supabase-session');
  if(!raw)return null;
  try{
    const s=JSON.parse(raw);
    const res=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+s.access_token}});
    if(!res.ok)return null;
    return {user:await res.json(),accessToken:s.access_token,refreshToken:s.refresh_token};
  }catch{return null}
}
async function rest(path:string,token:string,init?:RequestInit){
  const res=await fetch(SUPABASE_URL+'/rest/v1/'+path,{...init,headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+token,'Content-Type':'application/json',...(init?.headers||{})}});
  const json=await res.json().catch(()=>null);
  if(!res.ok)throw new Error(json?.message||'Gagal menyimpan pendaftaran.');
  return json;
}
export async function findPendingRegistration(token:string,userId:string){
  const rows=await rest('registration_applications?select=*&user_id=eq.'+encodeURIComponent(userId)+'&order=created_at.desc&limit=1',token);
  return rows?.[0]||null;
}
export async function submitRegistration(token:string,input:{applicationId?:string;role:RegistrationRole;fullName:string;email:string;phone:string;payload:RegistrationPayload;programId?:string|null}){
  if(input.applicationId){
    const rows=await rest('registration_applications?id=eq.'+encodeURIComponent(input.applicationId),token,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({full_name:input.fullName,email:input.email,phone:input.phone||null,payload:input.payload,selected_program_id:input.programId||null,status:'payment_pending',submitted_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
    return rows?.[0]||null;
  }
  const rows=await rest('rpc/create_registration_application',{method:'POST',body:JSON.stringify({p_requested_role:input.role,p_full_name:input.fullName,p_email:input.email,p_phone:input.phone||null,p_payload:input.payload,p_selected_program_id:input.programId||null})});
  const id=rows;
  return {id};
}
export async function saveStudentDetails(token:string,applicationId:string,payload:RegistrationPayload){
  const row={application_id:applicationId,...payload};
  return rest('student_registration_profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(row)});
}
export async function saveParentDetails(token:string,applicationId:string,payload:RegistrationPayload){
  const row={application_id:applicationId,...payload};
  return rest('parent_registration_profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(row)});
}
export async function saveMentorApplication(token:string,applicationId:string,input:Record<string,unknown>){
  const row={registration_application_id:applicationId,user_id:input.user_id,status:'pending',credentials:{},bio:String(input.bio||''),submitted_at:new Date().toISOString(),...input};
  return rest('mentor_applications',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(row)});
}
export async function saveApplicationDocument(token:string,input:Record<string,unknown>){
  return rest('application_documents',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(input)});
}
