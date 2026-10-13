"use client";
import {useEffect,useRef} from "react";

type Props={latitude:number|null;longitude:number|null;onPick:(latitude:number,longitude:number)=>void};
type LeafletModule=typeof import("leaflet");
export default function PitchMapPicker({latitude,longitude,onPick}:Props){
 const container=useRef<HTMLDivElement>(null);
 const map=useRef<import("leaflet").Map|null>(null);
 const marker=useRef<import("leaflet").CircleMarker|null>(null);
 const leaflet=useRef<LeafletModule|null>(null);
 const callback=useRef(onPick);
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
  else marker.current=L.circleMarker(position,{radius:9,color:"#166534",fillColor:"#22c55e",fillOpacity:0.9}).addTo(instance) as unknown as L.Marker;
  instance.panTo(position);
 },[latitude,longitude]);
 return <div><p>Click anywhere on the map to select your home pitch. Zoom in for accuracy.</p><div ref={container} style={{height:340,width:"100%",borderRadius:12,zIndex:0}} role="application" aria-label="Interactive map: click to choose pitch location"/><p style={{fontSize:12}}>Map data © OpenStreetMap contributors. You can also type coordinates above.</p></div>;
}
