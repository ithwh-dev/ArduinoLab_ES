import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls, RoundedBox } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

type SceneProps = { ledOn: boolean; intensity: number; showWires: boolean };

function ArduinoUno() {
  const pinXs = Array.from({ length: 14 }, (_, i) => -1.39 + i * 0.213);
  return (
    <group position={[-1.15, 0.12, 0]} rotation={[0, -0.20, 0]}>
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
      <mesh position={[0.32, 0.22, 0.94]}>
        <boxGeometry args={[2.42, 0.26, 0.26]} />
        <meshStandardMaterial color="#263246" />
      </mesh>
      {pinXs.map((x, i) => (
        <mesh key={i} position={[x + 0.12, 0.365, -0.91]}>
          <boxGeometry args={[0.076, 0.04, 0.085]} />
          <meshStandardMaterial color={i === 1 ? '#d89b42' : '#ceb780'} metalness={0.45} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-0.72 + i * 0.25, 0.365, 0.94]}>
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
    </group>
  );
}

function Breadboard({ ledOn, intensity, showWires }: SceneProps) {
  const emissive = ledOn ? '#ff3931' : '#4d120d';
  return (
    <group position={[2.35, 0.13, 0.18]} rotation={[0, -0.08, 0]}>
      <RoundedBox args={[2.30, 0.18, 2.42]} radius={0.10} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#f0ede6" roughness={0.8} />
      </RoundedBox>
      {Array.from({ length: 10 }, (_, i) => Array.from({ length: 4 }, (_, j) => (
        <mesh key={`${i}-${j}`} position={[-0.87 + i*0.194, 0.096, -0.80 + j*0.52]}>
          <boxGeometry args={[0.055, 0.011, 0.055]} />
          <meshStandardMaterial color="#919aa6" />
        </mesh>
      )))}
      <mesh position={[0.25, 0.34, -0.25]}>
        <cylinderGeometry args={[0.13, 0.13, 0.42, 20]} />
        <meshStandardMaterial color="#d5b788" />
      </mesh>
      {[-0.13, -0.03, 0.06].map((offset, i) => (
        <mesh key={i} position={[0.25, 0.34+offset, -0.25]}>
          <cylinderGeometry args={[0.135, 0.135, 0.024, 20]} />
          <meshStandardMaterial color={i === 0 ? '#a65943' : '#8c5d32'} />
        </mesh>
      ))}
      <mesh position={[0.30, 0.50, 0.40]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.30, 32]} />
        <meshStandardMaterial color={ledOn ? '#fa5350' : '#a44e48'} emissive={emissive} emissiveIntensity={ledOn ? 2 * intensity : 0.03} roughness={0.24} transparent opacity={0.94} />
      </mesh>
      <mesh position={[0.30, 0.71, 0.40]}>
        <sphereGeometry args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={ledOn ? '#ff4a43' : '#c04d47'} emissive={emissive} emissiveIntensity={ledOn ? 3 * intensity : 0.02} transparent opacity={0.9} />
      </mesh>
      {ledOn && <pointLight position={[0.3, 1.07, 0.4]} color="#ff5247" intensity={intensity * 10} distance={2.7} decay={2} />}
      {showWires && <>
        <Line points={[[-2.8, 0.45, -0.95],[-1.4, 0.45, -1.05],[-0.65, 0.47, -0.25],[0.25,0.49,-0.25]]} color="#e9ad46" lineWidth={3} />
        <Line points={[[-2.2, 0.22, 0.90],[-0.8, 0.22, 1.02],[-0.15,0.45,0.4],[0.3,0.45,0.4]]} color="#35445a" lineWidth={3} />
        <Line points={[[0.25,0.40,-0.25],[0.25,0.35,0.08],[0.3,0.45,0.4]]} color="#e9ad46" lineWidth={2} />
      </>}
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
    <ArduinoUno />
    <Breadboard {...props}/>
    <OrbitControls makeDefault enablePan enableZoom minDistance={5.5} maxDistance={14} minPolarAngle={0.18} maxPolarAngle={Math.PI/2.13} target={[0,0.3,0]}/>
  </>;
}

export function ArduinoScene(props: SceneProps) {
  return (
    <Canvas shadows dpr={[1,1.65]} camera={{position:[6.4, 7.2, 8.7], fov:39}} gl={{antialias:true, alpha:false}}>
      <Suspense fallback={null}><World {...props}/></Suspense>
    </Canvas>
  );
}
