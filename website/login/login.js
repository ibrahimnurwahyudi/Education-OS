const SUPABASE_URL="https://cbuunkkmpwwflxlqypxn.supabase.co";
const SUPABASE_KEY="sb_publishable_Jvgq7Mjv2C4qrwDwkCaoMQ_efWLPRPV";
const PUBLIC_URL=new URL("../",location.href).href;
const $=id=>document.getElementById(id);
const setStatus=(msg,error=false)=>{
  const el=$("status");
  if(!el)return;
  el.textContent=msg;
  el.className="auth-status"+(error?" error":"");
};

document.addEventListener("DOMContentLoaded",async()=>{
  if(!window.supabase){
    setStatus("Layanan identity belum siap. Muat ulang halaman.",true);
    return;
  }

  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
  const googleBtn=$("googleBtn");
  const emailBtn=$("emailBtn");
  const verifyBtn=$("verifyBtn");
  const emailInput=$("email");
  const codeInput=$("code");
  const codeBox=$("codeBox");

  googleBtn?.addEventListener("click",async()=>{
    setStatus("Membuka Google...");
    const{error}=await client.auth.signInWithOAuth({
      provider:"google",
      options:{redirectTo:location.href}
    });
    if(error)setStatus(error.message,true);
  });

  emailBtn?.addEventListener("click",async()=>{
    const email=emailInput?.value.trim()||"";
    if(!email)return setStatus("Masukkan alamat email terlebih dahulu.",true);
    emailBtn.disabled=true;
    setStatus("Mengirim kode verifikasi...");
    const{error}=await client.auth.signInWithOtp({
      email,
      options:{shouldCreateUser:true}
    });
    emailBtn.disabled=false;
    if(error)return setStatus(error.message,true);
    codeBox?.classList.remove("hidden");
    setStatus("Kode verifikasi sudah dikirim. Periksa email Anda.");
    codeInput?.focus();
  });

  verifyBtn?.addEventListener("click",async()=>{
    const email=emailInput?.value.trim()||"";
    const token=codeInput?.value.trim()||"";
    if(!email)return setStatus("Masukkan alamat email terlebih dahulu.",true);
    if(token.length!==6)return setStatus("Masukkan kode verifikasi 6 digit.",true);
    verifyBtn.disabled=true;
    setStatus("Memverifikasi identity...");
    const{error}=await client.auth.verifyOtp({email,token,type:"email"});
    if(error){
      verifyBtn.disabled=false;
      return setStatus(error.message,true);
    }
    setStatus("Identity terverifikasi. Kembali ke website publik...");
    window.setTimeout(()=>{window.location.replace(PUBLIC_URL)},500);
  });

  try{
    const{data}=await client.auth.getSession();
    if(data?.session)setStatus("Identity sudah terhubung. Website ini tetap berada di mode publik.");
  }catch(error){
    setStatus("Sesi identity tidak dapat dibaca. Anda tetap dapat melanjutkan dari halaman ini.",true);
  }
});