"use client";
import {useEffect,useRef,useState} from "react";

type Props={latitude:number|null;longitude:number|null;onPick:(latitude:number,longitude:number)=>void;description?:string};
type LeafletModule=typeof import("leaflet");
export default function PitchMapPicker({latitude,longitude,onPick,description}:Props){
 const container=useRef<HTMLDivElement>(null);
 const map=useRef<import("leaflet").Map|null>(null);
 const marker=useRef<import("leaflet").CircleMarker|null>(null);
 const leaflet=useRef<LeafletModule|null>(null);
 const callback=useRef(onPick);
 const [query,setQuery]=useState("");
 const [results,setResults]=useState<Array<{place_id:number;display_name:string;lat:string;lon:string}>>([]);
 const [searching,setSearching]=useState(false);
 const [searchError,setSearchError]=useState("");
 const [searched,setSearched]=useState(false);
 const searchAbort=useRef<AbortController|null>(null);
 const lastSearchAt=useRef(0);
 async function searchPlace(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  const term=query.trim();
  if(term.length<3){setSearchError("Enter at least 3 characters.");return}
  if(searching)return;
  const now=Date.now();
  if(now-lastSearchAt.current<1100){setSearchError("Please wait a moment before searching again.");return;}
  lastSearchAt.current=now;
  searchAbort.current?.abort();
  const controller=new AbortController();searchAbort.current=controller;
  setSearching(true);setSearchError("");setResults([]);setSearched(false);
  try{
   const response=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=ng&q=${encodeURIComponent(term)}`,{signal:controller.signal,headers:{"Accept":"application/json"}});
   if(!response.ok)throw new Error("Search is temporarily unavailable. Select the pitch manually on the map.");
   const data:unknown=await response.json();
   if(!Array.isArray(data))throw new Error("Unexpected search response.");
   setResults(data.filter((item):item is {place_id:number;display_name:string;lat:string;lon:string}=>item!=null&&typeof item==="object"&&typeof item.display_name==="string"&&typeof item.lat==="string"&&typeof item.lon==="string"&&typeof item.place_id==="number").slice(0,5));setSearched(true);
  }catch(error){if(!controller.signal.aborted)setSearchError(error instanceof Error?error.message:"Search failed. Select the pitch manually.");}
  finally{if(!controller.signal.aborted)setSearching(false)}
 }
 function selectPlace(result:{lat:string;lon:string}){
  const lat=Number(result.lat),lon=Number(result.lon);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat < -90||lat > 90||lon < -180||lon > 180)return;
  map.current?.setView([lat,lon],17);
  callback.current(Number(lat.toFixed(7)),Number(lon.toFixed(7)));
  setResults([]);setSearched(false);setSearchError("");
 }
 useEffect(()=>()=>searchAbort.current?.abort(),[]);
 useEffect(()=>{callback.current=onPick},[onPick]);
 useEffect(()=>{
  let cancelled=false;
  async function initialize(){
   const L=await import("leaflet");
   if(cancelled||!container.current||map.current)return;
   const center: [number,number]=latitude!=null&&longitude!=null?[latitude,longitude]:[9.082,8.6753];
   const instance=L.map(container.current).setView(center,latitude!=null?14:6);
   map.current=instance;
   leaflet.current=L;
   if(latitude!=null&&longitude!=null){marker.current=L.circleMarker([latitude,longitude],{radius:9,color:"#166534",fillColor:"#22c55e",fillOpacity:0.9}).addTo(instance);}
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(instance);
   instance.on("click",(event:L.LeafletMouseEvent)=>callback.current(Number(event.latlng.lat.toFixed(7)),Number(event.latlng.lng.toFixed(7))));
   setTimeout(()=>instance.invalidateSize(),100);
  }
  void initialize();
  return()=>{cancelled=true;map.current?.remove();map.current=null;marker.current=null;leaflet.current=null};
  // Initialize once; coordinates are updated in the separate effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{
  const L=leaflet.current,instance=map.current;
  if(!L||!instance)return;
  if(latitude==null||longitude==null){marker.current?.remove();marker.current=null;return}
  const position:L.LatLngExpression=[latitude,longitude];
  if(marker.current)marker.current.setLatLng(position);
  else marker.current=L.circleMarker(position,{radius:9,color:"#166534",fillColor:"#22c55e",fillOpacity:0.9}).addTo(instance);
  instance.panTo(position);
 },[latitude,longitude]);
 return <div><form onSubmit={searchPlace} style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}><input aria-label="Search for pitch or place in Nigeria" placeholder="Search pitch, stadium or address in Nigeria" value={query} onChange={e=>setQuery(e.target.value)} style={{flex:"1 1 210px",minWidth:0,padding:10,border:"1px solid #d1d5db",borderRadius:8}}/><button type="submit" disabled={searching} style={{padding:"10px 14px",border:"1px solid #d1d5db",borderRadius:8}}>{searching?"Searching...":"Search"}</button></form>{searchError&&<p role="alert">{searchError}</p>}{results.length>0&&<div aria-label="Search results" style={{maxHeight:180,overflowY:"auto",marginBottom:8}}>{results.map(result=><button key={result.place_id} type="button" onClick={()=>selectPlace(result)} style={{display:"block",width:"100%",textAlign:"left",padding:8,background:"white",border:"1px solid #e5e7eb",borderRadius:6,marginBottom:4}}>{result.display_name}</button>)}</div>}{searched&&results.length===0&&<p role="status">No matching places found. Zoom in and click the map to set an exact pin.</p>}<p>{description||"Click anywhere on the map to select your home pitch. Zoom in for accuracy."}</p><div ref={container} style={{height:340,width:"100%",borderRadius:12,zIndex:0}} role="application" aria-label="Interactive map: click to choose pitch location"/><p style={{fontSize:12}}>Map data © OpenStreetMap contributors. You can also type coordinates above.</p></div>;
}
