import {useEffect,useRef} from 'react'
import type {Complaint} from '../../types'
// Leaflet is bundled locally as a browser script; map tiles are supplied by OSM.
const leaflet = () => (window as unknown as {L: any}).L
export default function LiveMap({items,selected,onSelect,onPick,point,heat}:{items:Complaint[],selected?:string,onSelect?:(id:string)=>void,onPick?:(lat:number,lon:number)=>void,point?:[number,number],heat?:boolean}){
 const host=useRef<HTMLDivElement>(null), instance=useRef<any>(null), layer=useRef<any>(null)
 const callbacks=useRef({onSelect,onPick}); useEffect(()=>{callbacks.current={onSelect,onPick}},[onSelect,onPick])
 useEffect(()=>{const L=leaflet(); if(!host.current||!L)return; const map=L.map(host.current).setView([17.98,79.58],12);instance.current=map; L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);layer.current=L.layerGroup().addTo(map);map.on('click',(e:any)=>callbacks.current.onPick?.(e.latlng.lat,e.latlng.lng));return()=>{map.remove();instance.current=null}},[])
 useEffect(()=>{const L=leaflet(),map=instance.current,g=layer.current;if(!map||!g)return;g.clearLayers();const positions:[number,number][]=[];for(const i of items){if(i.latitude==null||i.longitude==null)continue;const p:[number,number]=[i.latitude,i.longitude];positions.push(p);const color=i.status==='Resolved'?'#059669':i.status==='In Progress'?'#2563eb':'#d97706';if(heat&&! ['Resolved','Rejected'].includes(i.status))L.circle(p,{radius:350,stroke:false,fillColor:'#ef4444',fillOpacity:0.22,interactive:false}).addTo(g);const marker=L.circleMarker(p,{radius:i.id===selected?12:9,color:'#fff',weight:3,fillColor:color,fillOpacity:1}).addTo(g);const label=document.createElement('div');label.textContent=`${i.title} • ${i.status}`;marker.bindPopup(label);marker.on('click',()=>callbacks.current.onSelect?.(i.id));if(i.id===selected){map.setView(p,16);marker.openPopup()}}
 if(point){L.marker(point).addTo(g);map.setView(point,16)}else if(!selected&&positions.length){map.fitBounds(positions,{padding:[35,35],maxZoom:15})}},[items,selected,point,heat]);
 return <div ref={host} className="cb-map" role="region" aria-label="Interactive complaint location map"/>
}
