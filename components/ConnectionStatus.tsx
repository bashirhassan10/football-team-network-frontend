"use client";
import {useEffect,useState} from "react";

export default function ConnectionStatus(){
 const[offline,setOffline]=useState(false),[restored,setRestored]=useState(false);
 useEffect(()=>{
  setOffline(!navigator.onLine);
  const lost=()=>{setOffline(true);setRestored(false)};
  const online=()=>{setOffline(false);setRestored(true)};
  const stopOfflineSubmit=(event:SubmitEvent)=>{if(!navigator.onLine){event.preventDefault();event.stopPropagation();setOffline(true)}};
  window.addEventListener("offline",lost);window.addEventListener("online",online);document.addEventListener("submit",stopOfflineSubmit,true);
  return()=>{window.removeEventListener("offline",lost);window.removeEventListener("online",online);document.removeEventListener("submit",stopOfflineSubmit,true)};
 },[]);
 if(!offline&&!restored)return null;
 return <aside className="connectionNotice" role="status" aria-live="polite"><strong>{offline?"You are offline":"Connection restored"}</strong><p>{offline?"Reconnect before uploading documents, sending forms or checking payments. Actions are not queued for later submission.":"Refresh to load current account and payment information. Previous actions will not be submitted again."}</p>{!offline&&<><button onClick={()=>window.location.reload()}>Refresh current page</button><button onClick={()=>setRestored(false)}>Dismiss</button></>}</aside>;
}
