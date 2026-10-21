import { useEffect, useMemo } from 'react';
import { Edges, Line, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { boardParts, type BoardPartId } from '../data/boardParts';

type Point = [number, number, number];
type Props = { active: BoardPartId | null; onHover: (id: BoardPartId | null) => void; onSelect: (id: BoardPartId) => void };

function Block({ position, size, color = '#242b3b', metal = false, outline = false }: { position: Point; size: Point; color?: string; metal?: boolean; outline?: boolean }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={metal ? 0.65 : 0.12} roughness={metal ? 0.32 : 0.65}/>{outline && <Edges color="#182237" threshold={25}/>}</mesh>;
}

/** Serigrafía original: dibujo procedural, sin recursos externos ni logotipos de terceros. */
function useBoardTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 960;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#344d82'; ctx.fillRect(0, 0, 1536, 960);
    ctx.lineWidth = 2; ctx.strokeStyle = '#6079a155';
    for (let i = 0; i < 32; i++) {
      const x = 220 + i * 34; const y = 250 + (i % 6) * 45;
      ctx.beginPath(); ctx.moveTo(x, 125); ctx.lineTo(x, y); ctx.lineTo(x + 55, y + 55); ctx.lineTo(x + 55, 810); ctx.stroke();
    }
    ctx.strokeStyle = '#dce4ee'; ctx.lineWidth = 3; ctx.strokeRect(60, 65, 1416, 830);
    ctx.fillStyle = '#e6ebdf'; ctx.font = 'bold 57px sans-serif'; ctx.fillText('LAB UNO', 860, 340);
    ctx.font = '24px monospace'; ctx.fillText('ATmega328P · 16 MHz', 860, 385);
    ctx.font = 'bold 19px monospace'; ctx.fillText('DIGITAL', 1050, 200); ctx.fillText('ANALÓGICAS', 1020, 745); ctx.fillText('ALIMENTACIÓN', 350, 745);
    ctx.font = '18px monospace';
    for (let i = 0; i < 14; i++) ctx.fillText(String(13 - i), 220 + i * 88, 155);
    ['IO','RST','3V3','5V','GND','GND','VIN'].forEach((name,i)=>ctx.fillText(name, 170+i*84, 820));
    for (let i = 0; i < 6; i++) ctx.fillText('A'+i, 980+i*80, 820);
    ctx.font = 'bold 20px monospace'; ctx.fillText('ON', 1390, 550); ctx.fillText('RESET', 220, 310); ctx.fillText('USB', 70, 400);
    const result = new THREE.CanvasTexture(canvas); result.colorSpace = THREE.SRGBColorSpace; result.anisotropy = 4; return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

export function UnoBoard({ active, onHover, onSelect }: Props) {
  const texture = useBoardTexture();
  const events = (id: BoardPartId) => ({
    onPointerOver: (event: { stopPropagation: () => void }) => { event.stopPropagation(); onHover(id); },
    onPointerOut: () => onHover(null),
    onClick: (event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect(id); },
  });
  const glow = (id: BoardPartId, position: Point, size: Point) => active === id && <mesh position={position}><boxGeometry args={size}/><meshBasicMaterial color="#1fe1cb" transparent opacity={0.19} depthWrite={false}/><Edges color="#25d9c9"/></mesh>;
  const header = (xs: number[], z: number) => <>
    <Block position={[(xs[0]+xs[xs.length-1])/2,0.235,z]} size={[xs[xs.length-1]-xs[0]+0.19,0.32,0.24]} outline/>
    {xs.map(x=><group key={x} position={[x,0.4,z]}>
      <Block position={[0,0,0]} size={[0.107,0.008,0.12]} color="#080e1a"/>
      <Block position={[0,0.004,-0.052]} size={[0.08,0.007,0.012]} color="#8c918b" metal/>
    </group>)}
  </>;
  return <group position={[-1.15,0.12,0]}>
    <RoundedBox args={[3.65,0.13,2.25]} radius={0.035} smoothness={2} castShadow receiveShadow><meshStandardMaterial color="#344d82" roughness={0.6}/><Edges color="#17243b" threshold={35}/></RoundedBox>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.071,0]}><planeGeometry args={[3.5,2.1]}/><meshStandardMaterial map={texture} roughness={0.72}/></mesh>
    {[[-1.62,-0.94],[1.58,-0.94],[-1.62,0.94],[1.58,0.94]].map(([x,z],i)=><group key={i} position={[x,0.075,z]}>
      <mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[0.064,0.12,24]}/><meshStandardMaterial color="#d3c6a0" metalness={0.7} roughness={0.4}/></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.001,0]}><circleGeometry args={[0.06,20]}/><meshStandardMaterial color="#182337"/></mesh>
    </group>)}
    <group {...events('usb')}>
      <Block position={[-1.72,0.3,-0.56]} size={[0.72,0.48,0.62]} color="#bac1bc" metal outline/>
      <Block position={[-2.086,0.3,-0.56]} size={[0.012,0.33,0.46]} color="#384459" outline/>
      <Block position={[-2.096,0.3,-0.56]} size={[0.014,0.18,0.29]} color="#e0ddd1"/>
      <Block position={[-1.7,0.548,-0.56]} size={[0.47,0.013,0.39]} color="#a0a7a5" metal outline/>
      {glow('usb',[-1.72,0.31,-0.56],[0.77,0.53,0.67])}
    </group>
    <group {...events('power')}>
      <Block position={[-1.55,0.27,0.6]} size={[0.59,0.39,0.46]} outline/>
      <mesh position={[-1.85,0.29,0.6]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.18,0.18,0.15,24]}/><meshStandardMaterial color="#202738"/><Edges color="#11192b"/></mesh>
      <mesh position={[-1.93,0.29,0.6]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.105,0.105,0.012,24]}/><meshStandardMaterial color="#080e18"/></mesh>
      {header(Array.from({length:8},(_,i)=>-1.47+i*0.2),0.94)}
      {glow('power',[-0.77,0.26,0.94],[1.68,0.39,0.3])}
    </group>
    <group {...events('digital')}>{header(Array.from({length:14},(_,i)=>-1.27+i*0.213),-0.91)}{glow('digital',[0.11,0.26,-0.91],[3.05,0.39,0.3])}</group>
    <group {...events('analog')}>{header(Array.from({length:6},(_,i)=>0.43+i*0.213),0.94)}{glow('analog',[0.96,0.26,0.94],[1.4,0.39,0.3])}</group>
    <group {...events('chip')}>
      <Block position={[0.15,0.22,0.26]} size={[1.7,0.14,0.53]} color="#141c2a" outline/>
      <Block position={[0.15,0.32,0.26]} size={[1.52,0.18,0.36]} outline/>
      {Array.from({length:14},(_,i)=>[-1,1].map(side=><Block key={`${i}-${side}`} position={[-0.52+i*0.104,0.24,0.26+side*0.235]} size={[0.044,0.16,0.08]} color="#b5b9b2" metal/>))}
      {glow('chip',[0.15,0.3,0.26],[1.8,0.35,0.64])}
    </group>
    {boardParts.map(part=><Line key={part.id} points={[[...part.position],[...part.callout]]} color={active===part.id?'#159d92':'#82908d'} lineWidth={1} dashed dashSize={0.035} gapSize={0.025}/>)}
    {/* Oscilador, regulador, interfaz USB, condensadores y componentes de superficie. */}
    <RoundedBox position={[-0.57,0.2,-0.43]} args={[0.53,0.22,0.24]} radius={0.09} smoothness={2} castShadow><meshStandardMaterial color="#ddd8bc" metalness={0.7} roughness={0.3}/><Edges color="#6e7785"/></RoundedBox>
    <Block position={[-0.75,0.18,-0.03]} size={[0.31,0.13,0.3]} outline/>
    {[-1.12,-0.82].map((x,i)=><group key={i} position={[x,0.25,0.48]}>
      <mesh castShadow><cylinderGeometry args={[0.135,0.135,0.32,24]}/><meshStandardMaterial color="#858f99" metalness={0.65} roughness={0.34}/><Edges color="#283348"/></mesh>
      <mesh position={[0,0.164,0]}><cylinderGeometry args={[0.119,0.119,0.012,24]}/><meshStandardMaterial color="#d5d6c9" metalness={0.6}/></mesh>
      <Block position={[0,0.175,0]} size={[0.12,0.004,0.009]} color="#6a7481"/>
    </group>)}
    <Block position={[-1.24,0.12,-0.04]} size={[0.32,0.1,0.22]} color="#929aa2" metal/>
    <mesh position={[-1.27,0.21,-0.04]}><cylinderGeometry args={[0.09,0.09,0.12,20]}/><meshStandardMaterial color="#c95347"/></mesh>
    {Array.from({length:18},(_,i)=><group key={i} position={[-1.12+(i%4)*0.21,0.13,-0.7+Math.floor(i/4)*0.14]}>
      <Block position={[0,0,0]} size={[0.11,0.055,0.055]} color={i%3===0?'#b99e61':'#30384a'}/>
      {[-1,1].map(side=><Block key={side} position={[side*0.055,0,0]} size={[0.026,0.06,0.06]} color="#b6b9ae" metal/>)}
    </group>)}
    <Block position={[1.32,0.15,0.46]} size={[0.15,0.06,0.075]} color="#8ed7a5"/>
    <mesh position={[1.32,0.19,0.46]}><boxGeometry args={[0.06,0.02,0.04]}/><meshStandardMaterial color="#90e7a8" emissive="#5ce8a4" emissiveIntensity={0.7}/></mesh>
    {[0,1].map(row=>[0,1,2].map(col=><Block key={`${row}-${col}`} position={[1.27+col*0.16,0.3,0.08+row*0.17]} size={[0.045,0.37,0.045]} color="#d8c797" metal/>))}
  </group>;
}
