import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, OrbitControls, RoundedBox } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { UnoBoard } from './UnoBoard';
import * as THREE from 'three';
import { boardParts, type BoardPartId } from '../data/boardParts';

type SceneProps = { ledOn: boolean; intensity: number; showWires: boolean; resistance: number; boardMode: boolean; selectedPart: BoardPartId | null; onSelectPart: (id: BoardPartId) => void };
type InspectionId = BoardPartId | 'led' | 'resistor';
type InteractiveSceneProps = SceneProps & { hovered: InspectionId | null; onHover: (id: InspectionId | null) => void };
type Overlay = { id: string; position: THREE.Vector3; text: string; part?: BoardPartId; inspect?: 'led' | 'resistor' };
function ProjectLabels({ labels, elements }: { labels: Overlay[]; elements: React.RefObject<Map<string, HTMLDivElement>> }) {
  const { camera, size } = useThree();
  const point = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    for (const label of labels) {
      const element = elements.current.get(label.id);
      if (!element) continue;
      point.copy(label.position).project(camera);
      element.style.transform = `translate(-50%, -50%) translate(${(point.x + 1) * size.width / 2}px, ${(1 - point.y) * size.height / 2}px)`;
      const x = (point.x + 1) * size.width / 2;
      element.style.setProperty('--tooltip-x', `${Math.max(125, Math.min(size.width - 125, x)) - x}px`);
      element.style.visibility = point.z < 1 && point.z > -1 ? 'visible' : 'hidden';
    }
  });
  return null;
}

function CameraFraming({ boardMode }: { boardMode: boolean }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const scale = Math.max(1, size.height / size.width * 0.92) * (boardMode ? 0.68 : 1);
    const center = boardMode ? -1.15 : 0;
    camera.position.set(center + 6.4 * scale, 0.3 + 7.8 * scale, 8.7 * scale);
    camera.lookAt(center, 0.3, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, boardMode, invalidate]);
  return null;
}

function Breadboard({ ledOn, intensity, resistance, hovered, onHover }: InteractiveSceneProps) {
  const inspect = (id: InspectionId) => ({ onPointerOver: (event: { stopPropagation: () => void }) => { event.stopPropagation(); onHover(id); }, onPointerOut: () => onHover(null) });
  const emissive = ledOn ? '#ff3931' : '#4d120d';
  return (
    <group position={[2.35, 0.13, 0.18]}>
      <RoundedBox args={[2.30, 0.18, 2.42]} radius={0.10} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#f0ede6" roughness={0.8} />
      </RoundedBox>
      {Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, j) => (
        <mesh key={`${i}-${j}`} position={[-0.87 + i*0.194, 0.096, -0.90 + j*0.2]}>
          <boxGeometry args={[0.065, 0.011, 0.065]} />
          <meshStandardMaterial color="#454956" />
        </mesh>
      )))}
      <mesh position={[0,0.1,0]}><boxGeometry args={[2.06,0.015,0.055]}/><meshStandardMaterial color="#aaa99f"/></mesh>
      {[-1,1].map(side=><Line key={side} points={[[-1.04,0.11,side*1.08],[1.04,0.11,side*1.08]]} color={side===1?'#b35a50':'#486a9b'} lineWidth={1.2}/>)}
      <group {...inspect('resistor')}>
      <mesh position={[-0.05, 0.35, -0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 0.5, 20]} />
        <meshStandardMaterial color="#d5b788" />
      </mesh>
      {[-0.14, 0, 0.14].map((offset, i) => (
        <mesh key={i} position={[-0.05 + offset, 0.35, -0.58]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.115, 0.115, 0.025, 20]} />
          <meshStandardMaterial color={(resistance === 220 ? ['#cf2929', '#cf2929', '#794128'] : resistance === 1000 ? ['#794128', '#171717', '#cf2929'] : ['#794128', '#171717', '#e28322'])[i]} />
        </mesh>
      ))}
      <Line points={[[-0.55,0.35,-0.58],[-0.3,0.35,-0.58]]} color="#9b9b9b" lineWidth={3}/>
      <Line points={[[0.2,0.35,-0.58],[0.45,0.35,-0.58]]} color="#9b9b9b" lineWidth={3}/>
      {hovered === 'resistor' && <mesh position={[-0.05,0.35,-0.58]}><boxGeometry args={[0.65,0.3,0.3]}/><meshBasicMaterial color="#22d6c5" transparent opacity={0.25} depthWrite={false}/></mesh>}
      </group>
      <Line points={[[0.17,0.37,0.4],[0.17,0.12,0.4]]} color="#9b9b9b" lineWidth={3}/>
      <Line points={[[0.43,0.37,0.4],[0.43,0.12,0.4]]} color="#9b9b9b" lineWidth={3}/>
      <group {...inspect('led')}>
      <mesh position={[0.30, 0.50, 0.40]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.30, 32]} />
        <meshStandardMaterial color={ledOn ? '#fa5350' : '#a44e48'} emissive={emissive} emissiveIntensity={ledOn ? 2 * intensity : 0.03} roughness={0.24} transparent opacity={0.94} />
      </mesh>
      <mesh position={[0.30, 0.71, 0.40]}>
        <sphereGeometry args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={ledOn ? '#ff4a43' : '#c04d47'} emissive={emissive} emissiveIntensity={ledOn ? 3 * intensity : 0.02} transparent opacity={0.9} />
      </mesh>
      {hovered === 'led' && <mesh position={[0.3,0.55,0.4]}><sphereGeometry args={[0.3,20,16]}/><meshBasicMaterial color="#22d6c5" transparent opacity={0.2} depthWrite={false}/></mesh>}
      </group>
      {ledOn && <pointLight position={[0.3, 1.07, 0.4]} color="#ff5247" intensity={intensity * 10} distance={2.7} decay={2} />}
    </group>
  );
}

function Wire({ points, color }: { points: [number, number, number][]; color: string }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), false, 'centripetal'), [points]);
  return <mesh castShadow><tubeGeometry args={[curve,40,0.025,8,false]}/><meshStandardMaterial color={color} roughness={0.46}/></mesh>;
}

function World(props: InteractiveSceneProps) {
  return <>
    <color attach="background" args={['#f7efdf']}/>
    <ambientLight intensity={1.25} />
    <directionalLight position={[5, 8, 5]} intensity={2.8} castShadow shadow-mapSize={[1024, 1024]}/>
    <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0,-0.07,0]}>
      <planeGeometry args={[200,200]}/>
      <meshBasicMaterial color="#f7efdf" toneMapped={false} />
    </mesh>
    <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-0.068,0]}><planeGeometry args={[200,200]}/><shadowMaterial transparent opacity={0.17} depthWrite={false}/></mesh>
    <gridHelper args={[40,80,new THREE.Color('#d6c9b5'),new THREE.Color('#e5dac7')]} position={[0, -0.05, 0]}/>
    <UnoBoard active={props.hovered === 'led' || props.hovered === 'resistor' ? null : props.hovered ?? props.selectedPart} onHover={props.onHover} onSelect={props.onSelectPart}/>
    {!props.boardMode && <>
      <Breadboard {...props}/>
      {props.showWires && <>
        {/* Extremos coinciden con los pines y terminales visibles, en coordenadas del mundo. */}
        <Wire points={[[-2.42,0.485,-0.91],[-2.42,0.7,-1.4],[1.5,0.7,-1.4],[1.8,0.48,-0.4]]} color="#ce8c27"/>
        <Wire points={[[2.8,0.48,-0.4],[3.05,0.48,-0.1],[2.52,0.25,0.58]]} color="#ce8c27"/>
        <Wire points={[[2.78,0.25,0.58],[3.2,0.25,1.25],[-1.62,0.25,1.25],[-1.62,0.485,0.94]]} color="#273548"/>
      </>}
    </>}
    <OrbitControls makeDefault enablePan enableZoom minDistance={5.5} maxDistance={26} minPolarAngle={0.18} maxPolarAngle={Math.PI/2.13} target={props.boardMode ? [-1.15,0.3,0] : [0,0.3,0]}/>
  </>;
}

export function ArduinoScene(props: SceneProps) {
  const [hovered, setHovered] = useState<InspectionId | null>(null);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') setHovered(null); };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, []);
  const inspected = hovered === 'led' ? { name: 'LED', description: 'El ánodo (+) recibe corriente desde D13 a través de la resistencia; el cátodo (−) retorna a GND. HIGH enciende el LED en esta simulación guiada.' } : hovered === 'resistor' ? { name: 'Resistencia en serie', description: `La resistencia de ${props.resistance.toLocaleString('es-GT')} Ω limita la corriente del LED. A mayor resistencia, menor corriente y brillo ilustrativo.` } : boardParts.find(part => part.id === hovered);
  const elements = useRef(new Map<string, HTMLDivElement>());
  const labels = useMemo<Overlay[]>(() => {
    const base: Overlay[] = [
      { id: 'd13', position: new THREE.Vector3(-2.42, 0.64, -1.15), text: 'D13' },
      { id: 'gnd', position: new THREE.Vector3(-1.62, 0.64, 1.2), text: 'GND' },
      { id: 'analog', position: new THREE.Vector3(-0.13, 0.64, 1.2), text: 'A0–A5' },
    ];
    return [...(props.boardMode ? [] : base), ...boardParts.map((part) => ({
      id: `part-${part.id}`, part: part.id, text: part.name,
      position: new THREE.Vector3(part.callout[0] - 1.15, part.callout[1] + 0.12, part.callout[2]),
    })), ...(props.boardMode ? [] : [
      { id: 'resistor', inspect: 'resistor' as const, position: new THREE.Vector3(2.3, 0.83, -0.4), text: `${props.resistance.toLocaleString('es-GT')} Ω en serie` },
      { id: 'anode', inspect: 'led' as const, position: new THREE.Vector3(2.1, 0.29, 0.78), text: 'Ánodo (+)' },
      { id: 'cathode', position: new THREE.Vector3(3.15, 0.29, 0.78), text: 'Cátodo (−)' },
    ])];
  }, [props.boardMode, props.resistance]);
  return <>
    <Canvas style={{ cursor: hovered ? 'pointer' : 'grab' }} frameloop="demand" shadows dpr={[1,1.65]} camera={{position:[6.4, 7.2, 8.7], fov:39}} gl={{antialias:true, alpha:false}}>
      <Suspense fallback={null}><World {...props} hovered={hovered} onHover={setHovered}/><CameraFraming boardMode={props.boardMode}/><ProjectLabels labels={labels} elements={elements}/></Suspense>
    </Canvas>
    <div className="scene-overlays" style={{ cursor: hovered ? 'pointer' : 'grab' }}>{labels.map(label => <div key={label.id} className="projected-label" ref={element => { if (element) elements.current.set(label.id, element); else elements.current.delete(label.id); }}>
      {label.part || label.inspect ? <button className="scene-marker" aria-label={label.part ? `Explorar ${boardParts.find(part => part.id === label.part)?.name}` : `Información de ${label.inspect === 'led' ? 'LED' : 'resistencia'}`} aria-pressed={props.selectedPart === label.part} aria-describedby={hovered === (label.part ?? label.inspect) ? "component-tooltip" : undefined} onMouseEnter={() => setHovered(label.part ?? label.inspect ?? null)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(label.part ?? label.inspect ?? null)} onBlur={() => setHovered(null)} onKeyDown={event => { if (event.key === 'Escape') { setHovered(null); event.stopPropagation(); } }} onClick={() => { if (label.part) props.onSelectPart(label.part); else setHovered(label.inspect ?? null); }}>{label.text}</button> : <span className="circuit-label">{label.text}</span>}
      {inspected && hovered === (label.part ?? label.inspect) && <div className="component-tooltip" id="component-tooltip" role="tooltip"><b>{inspected.name}</b><p>{inspected.description}</p></div>}
    </div>)}</div>
  </>;
}
