import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NexusLanding from './NexusLanding';
import './index.css';
import './nexus.css';
function Root(){const [entered,setEntered]=useState(false);return entered?<App/>:<NexusLanding onEnter={()=>setEntered(true)}/>}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Root/></React.StrictMode>);