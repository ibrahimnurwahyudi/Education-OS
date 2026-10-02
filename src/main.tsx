import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NexusLanding from './NexusLanding';
import { captureOAuthSession } from './lib/registration';
import './index.css';
import './nexus.css';

const oauthCaptured = captureOAuthSession();
const hasStoredSession = Boolean(localStorage.getItem('education-os-supabase-session'));

function Root(){
  const [entered,setEntered]=useState(oauthCaptured || hasStoredSession);
  return entered?<App/>:<NexusLanding onEnter={()=>setEntered(true)}/>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Root/></React.StrictMode>);