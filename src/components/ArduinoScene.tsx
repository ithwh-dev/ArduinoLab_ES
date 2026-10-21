import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, OrbitControls, RoundedBox } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { boardParts, type BoardPartId } from '../data/boardParts';

type SceneProps = { ledOn: boolean; intensity: number; showWires: boolean; resistance: number; boardMode: boolean; selectedPart: BoardPartId | null; onSelectPart: (id: BoardPartId) => void };
type Overlay = { id: string; position: THREE.Vector3; text: string; part?: BoardPartId };
function ProjectLabels({ labels, elements }: { labels: Overlay[]; elements: React.RefObject<Map<string, HTMLDivElement>> }) {
  const { camera, size } = useThree();
  const point = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    for (const label of labels) {
      const element = elements.current.get(label.id);
      if (!element) continue;
      point.copy(label.position).project(camera);
      element.style.transform = `translate(-50%, -50%) translate(${(point.x + 1) * size.width / 2}px, ${(1 - point.y) * size.height / 2}px)`;
      element.style.visibility = point.z < 1 && point.z > -1 ? 'visible' : 'hidden';
    }
  });
  return null;
}

function CameraFraming({ boardMode }: { boardMode: boolean }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const scale = Math.max(1, size.height / size.width * 0.92) * (boardMode ? 0.82 : 1);
    camera.position.set(6.4 * scale, 0.3 + 6.9 * scale, 8.7 * scale);
    camera.lookAt(0, 0.3, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, boardMode, invalidate]);
  return null;
}

function ArduinoUno({ boardMode, selectedPart, onSelectPart }: SceneProps) {
  const pinXs = Array.from({ length: 14 }, (_, i) => -1.39 + i * 0.213);
  return (
    <group position={[-1.15, 0.12, 0]}>
      <RoundedBox args={[3.65, 0.13, 2.25]} radius={0.12} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#087fa1" metalness={0.22} roughness={0.44} />
      </RoundedBox>
      {/* Microcontrolador + puerto USB + conector de alimentación */}
      <mesh position={[0.15, 0.20, -0.02]} castShadow>
        <boxGeometry args={[1.08, 0.18, 0.42]} />
        <meshStandardMaterial color="#1a2431" />
      </mesh>
      <mesh position={[-1.82, 0.22, -0.58]} castShadow>
        <boxGeometry args={[0.68, 0.43, 0.63]} />
        <meshStandardMaterial color="#b9c7d1" metalness={0.65} roughness={0.31} />
      </mesh>
      <mesh position={[-1.56, 0.30, 0.65]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.54, 20]} />
        <meshStandardMaterial color="#202632" roughness={0.74} />
      </mesh>
      <mesh position={[0.06, 0.22, -0.91]}>
        <boxGeometry args={[3.15, 0.26, 0.26]} />
        <meshStandardMaterial color="#263246" />
      </mesh>
      <mesh position={[-0.77, 0.22, 0.94]}>
        <boxGeometry args={[1.63, 0.26, 0.26]} />
        <meshStandardMaterial color="#263246" />
      </mesh>
      <mesh position={[0.96, 0.22, 0.94]}>
        <boxGeometry args={[1.35, 0.26, 0.26]} />
        <meshStandardMaterial color="#263246" />
      </mesh>
      {pinXs.map((x, i) => (
        <mesh key={i} position={[x + 0.12, 0.365, -0.91]}>
          <boxGeometry args={[0.076, 0.04, 0.085]} />
          <meshStandardMaterial color={i === 0 ? '#d89b42' : '#ceb780'} metalness={0.45} />
        </mesh>
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[i < 8 ? -1.47 + i * 0.2 : 0.43 + (i - 8) * 0.213, 0.365, 0.94]}>
          <boxGeometry args={[0.072, 0.04, 0.08]} />
          <meshStandardMaterial color="#ceb780" metalness={0.5}/>
        </mesh>
      ))}
      <mesh position={[1.44, 0.24, 0.52]}>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshStandardMaterial color="#f9c65f" emissive="#ffd37c" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.65, 0.21, -0.05]}>
        <boxGeometry args={[0.34, 0.14, 0.36]} />
        <meshStandardMaterial color="#222b39" />
      </mesh>
      {boardMode && boardParts.map((part) => <group key={part.id} position={[...part.position]}>
        <mesh onClick={event => { event.stopPropagation(); onSelectPart(part.id); }}>
          <sphereGeometry args={[0.12, 16, 12]}/>
          <meshStandardMaterial color={selectedPart === part.id ? '#ffb02e' : '#087a77'} emissive="#087a77" emissiveIntensity={0.3}/>
        </mesh>
      </group>)}
    </group>
  );
}

function Breadboard({ ledOn, intensity, resistance }: SceneProps) {
  const emissive = ledOn ? '#ff3931' : '#4d120d';
  return (
    <group position={[2.35, 0.13, 0.18]}>
      <RoundedBox args={[2.30, 0.18, 2.42]} radius={0.10} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#f0ede6" roughness={0.8} />
      </RoundedBox>
      {Array.from({ length: 10 }, (_, i) => Array.from({ length: 4 }, (_, j) => (
        <mesh key={`${i}-${j}`} position={[-0.87 + i*0.194, 0.096, -0.80 + j*0.52]}>
          <boxGeometry args={[0.055, 0.011, 0.055]} />
          <meshStandardMaterial color="#919aa6" />
        </mesh>
      )))}
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
      <Line points={[[0.17,0.37,0.4],[0.17,0.12,0.4]]} color="#9b9b9b" lineWidth={3}/>
      <Line points={[[0.43,0.37,0.4],[0.43,0.12,0.4]]} color="#9b9b9b" lineWidth={3}/>
      <mesh position={[0.30, 0.50, 0.40]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.30, 32]} />
        <meshStandardMaterial color={ledOn ? '#fa5350' : '#a44e48'} emissive={emissive} emissiveIntensity={ledOn ? 2 * intensity : 0.03} roughness={0.24} transparent opacity={0.94} />
      </mesh>
      <mesh position={[0.30, 0.71, 0.40]}>
        <sphereGeometry args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={ledOn ? '#ff4a43' : '#c04d47'} emissive={emissive} emissiveIntensity={ledOn ? 3 * intensity : 0.02} transparent opacity={0.9} />
      </mesh>
      {ledOn && <pointLight position={[0.3, 1.07, 0.4]} color="#ff5247" intensity={intensity * 10} distance={2.7} decay={2} />}
    </group>
  );
}

function World(props: SceneProps) {
  return <>
    <color attach="background" args={['#f5eee2']}/>
    <ambientLight intensity={1.9} />
    <directionalLight position={[5, 8, 5]} intensity={3} castShadow shadow-mapSize={[1024, 1024]}/>
    <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0,-0.07,0]}>
      <planeGeometry args={[200,200]}/>
      <meshStandardMaterial color="#f5eee2" roughness={1} />
    </mesh>
    <gridHelper args={[40,40,new THREE.Color('#d6c9b5'),new THREE.Color('#e5dac7')]} position={[0, -0.05, 0]}/>
    <ArduinoUno {...props}/>
    {!props.boardMode && <>
      <Breadboard {...props}/>
      {props.showWires && <>
        {/* Extremos coinciden con los pines y terminales visibles, en coordenadas del mundo. */}
        <Line points={[[-2.42,0.485,-0.91],[-2.42,0.7,-1.4],[1.5,0.7,-1.4],[1.8,0.48,-0.4]]} color="#b16b00" lineWidth={3}/>
        <Line points={[[2.8,0.48,-0.4],[3.05,0.48,-0.1],[2.52,0.25,0.58]]} color="#b16b00" lineWidth={3}/>
        <Line points={[[2.78,0.25,0.58],[3.2,0.25,1.25],[-1.62,0.25,1.25],[-1.62,0.485,0.94]]} color="#263246" lineWidth={3}/>
      </>}
    </>}
    <OrbitControls makeDefault enablePan enableZoom minDistance={5.5} maxDistance={26} minPolarAngle={0.18} maxPolarAngle={Math.PI/2.13} target={[0,0.3,0]}/>
  </>;
}

export function ArduinoScene(props: SceneProps) {
  const elements = useRef(new Map<string, HTMLDivElement>());
  const labels = useMemo<Overlay[]>(() => {
    const base: Overlay[] = [
      { id: 'd13', position: new THREE.Vector3(-2.42, 0.64, -1.15), text: 'D13' },
      { id: 'gnd', position: new THREE.Vector3(-1.62, 0.64, 1.2), text: 'GND' },
      { id: 'analog', position: new THREE.Vector3(-0.13, 0.64, 1.2), text: 'A0–A5' },
    ];
    if (props.boardMode) return [...base, ...boardParts.map((part, index) => ({
      id: `part-${part.id}`, part: part.id, text: String(index + 1),
      position: new THREE.Vector3(part.position[0] - 1.15, part.position[1] + 0.34, part.position[2]),
    }))];
    return [...base,
      { id: 'resistor', position: new THREE.Vector3(2.3, 0.83, -0.4), text: `${props.resistance.toLocaleString('es-GT')} Ω en serie` },
      { id: 'anode', position: new THREE.Vector3(2.1, 0.29, 0.78), text: 'Ánodo (+)' },
      { id: 'cathode', position: new THREE.Vector3(3.15, 0.29, 0.78), text: 'Cátodo (−)' },
    ];
  }, [props.boardMode, props.resistance]);
  return <>
    <Canvas frameloop="demand" shadows dpr={[1,1.65]} camera={{position:[6.4, 7.2, 8.7], fov:39}} gl={{antialias:true, alpha:false}}>
      <Suspense fallback={null}><World {...props}/><CameraFraming boardMode={props.boardMode}/><ProjectLabels labels={labels} elements={elements}/></Suspense>
    </Canvas>
    <div className="scene-overlays">{labels.map(label => <div key={label.id} className="projected-label" ref={element => { if (element) elements.current.set(label.id, element); else elements.current.delete(label.id); }}>
      {label.part ? <button className="scene-marker" aria-label={`Explorar ${boardParts.find(part => part.id === label.part)?.name}`} aria-pressed={props.selectedPart === label.part} onClick={() => { if (label.part) props.onSelectPart(label.part); }}>{label.text}</button> : <span className="circuit-label">{label.text}</span>}
    </div>)}</div>
  </>;
}
