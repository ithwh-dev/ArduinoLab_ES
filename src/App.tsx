import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { Activity, ArrowRight, BookOpen, CheckCircle2, ChevronRight, CircleHelp, CircuitBoard, Code2, GraduationCap, Info, Lightbulb, Menu, Pause, Play, RotateCcw, Settings2, SlidersHorizontal, Volume2, Zap } from 'lucide-react';
const ArduinoScene = lazy(() => import('./components/ArduinoScene').then(module => ({ default: module.ArduinoScene })));
import { useBlinkSimulation } from './hooks/useBlinkSimulation';
import { boardParts, boardChallenge, blinkChallenge, type BoardPartId } from './data/boardParts';
import { validProgress, canCompleteLesson } from './lib/progress';
import { lessons } from './data/lessons';
import { generateBlinkCode, ledBrightness, ledCurrentMa } from './lib/electronics';

type ConsoleEntry = { text: string; id: number };
const STORAGE_KEY = 'arduino-lab-es-progress-v1';

function loadProgress(): string[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); const data: unknown = raw ? JSON.parse(raw) : []; return validProgress(data); } catch { return []; }
}

function loadSettings(): { onMs: number; offMs: number; resistance: number } {
  try {
    const data = JSON.parse(localStorage.getItem('arduino-lab-es-settings-v1') ?? '{}');
    const duration = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 100 && value <= 2000 && value % 100 === 0 ? value : 500;
    return { onMs: duration(data?.onMs), offMs: duration(data?.offMs), resistance: [220, 1000, 10000].includes(data?.resistance) ? data.resistance : 220 };
  } catch { return { onMs: 500, offMs: 500, resistance: 220 }; }
}

export default function App() {
  const [settings] = useState(loadSettings);
  const [activeId, setActiveId] = useState('blink');
  const [onMs, setOnMs] = useState(settings.onMs);
  const [offMs, setOffMs] = useState(settings.offMs);
  const [resistance, setResistance] = useState(settings.resistance);
  const [showWires, setShowWires] = useState(true);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [selectedPart, setSelectedPart] = useState<BoardPartId | null>(null);
  const [explored, setExplored] = useState<BoardPartId[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState<string[]>(loadProgress);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const logId = useRef(0);
  const [tab, setTab] = useState<'learn'|'pins'|'challenge'>('learn');
  const lesson = lessons.find((item) => item.id === activeId) ?? lessons[1];
  const boardMode = lesson.id === 'board';
  const code = useMemo(() => generateBlinkCode(onMs, offMs), [onMs, offMs]);
  const current = ledCurrentMa(5, 2, resistance);
  const brightness = ledBrightness(resistance);
  const correct = quizAnswer === 1;
  const challenge = boardMode ? boardChallenge : blinkChallenge;
  const addLog = useCallback((message: string) => {
    setLogs((old) => [...old.slice(-7), { text: message, id: ++logId.current }]);
  }, []);

  const simulation = useBlinkSimulation(onMs, offMs, addLog);
  const { running, ledOn, hasRun, stop } = simulation;
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
      localStorage.setItem('arduino-lab-es-settings-v1', JSON.stringify({ onMs, offMs, resistance }));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [completed, onMs, offMs, resistance]);

  function run() {
    if (running) { stop(); return; }
    setLogs([]); simulation.start(); setTab('learn');
  }
  function selectPart(id: BoardPartId) {
    setSelectedPart(id);
    setExplored(old => old.includes(id) ? old : [...old, id]);
    setTab(old => old === 'challenge' ? 'learn' : old);
  }
  function changeLesson(id: string) {
    const target = lessons.find((l) => l.id === id);
    if (!target || target.status !== 'available') return;
    stop(); setActiveId(id); setShowMobileMenu(false); setTab('learn'); setLogs([]); setQuizAnswer(null);
  }
  function finish() {
    if (canCompleteLesson(activeId, quizAnswer, hasRun, explored)) setCompleted(c => c.includes(activeId) ? c : [...c, activeId]);
  }
  const progress = completed.length;
  const part = boardParts.find(item => item.id === selectedPart);
  const boardPanel = <>
    <p className="objective"><b>Objetivo:</b> identifica las cinco partes y explica cuál ejecuta un programa.</p>
    <p className="support-note">Selecciona un punto de la placa o usa estos botones con el teclado.</p>
    <div className="part-buttons" aria-label="Partes de Arduino UNO">{boardParts.map(item =>
      <button key={item.id} aria-pressed={selectedPart === item.id} onClick={() => selectPart(item.id)}>
        {explored.includes(item.id) ? '✓ ' : ''}{item.name}
      </button>)}</div>
    <div className="part-description" role="status"><h4>{part?.name ?? 'Explora la placa'}</h4><p>{part?.description ?? 'Empieza por el puerto USB y descubre la función de cada parte.'}</p></div>
    <p className="support-note">Partes exploradas: {explored.length}/5</p>
  </>;


  return <div className="shell"><a className="skip-link" href="#contenido">Ir al contenido</a>
    <aside className={`sidebar ${showMobileMenu ? 'open' : ''}`} aria-label="Navegación principal">
      <div className="brand-icon" title="Arduino Lab ES"><CircuitBoard size={27} strokeWidth={1.8}/></div>
      <div className="sidebar-divider"/>
      <nav id="navegacion" aria-label="Secciones">
        <button className="nav-icon selected" title="Lecciones" aria-label="Lecciones" onClick={()=>document.getElementById('lecciones')?.scrollIntoView()}><BookOpen size={22}/></button>
        <button className="nav-icon" title="Laboratorio" aria-label="Laboratorio" onClick={()=>document.getElementById('escena')?.scrollIntoView()}><CircuitBoard size={22}/></button>
        <button className="nav-icon" title="Código" aria-label="Código" disabled={boardMode} onClick={() => document.getElementById('code-panel')?.scrollIntoView({behavior:'smooth'})}><Code2 size={22}/></button>
        <button className="nav-icon" title="Actividades" aria-label="Actividades" onClick={()=>setTab('challenge')}><GraduationCap size={23}/></button>
      </nav>
      <div className="sidebar-bottom"><button className="nav-icon" aria-label="Configuración visual" title="Mostrar u ocultar cables" onClick={()=>setShowWires(!showWires)}><Settings2 size={21}/></button></div>
    </aside>

    <main className="main" id="contenido">
      <header className="topbar">
        <button className="mobile-menu" aria-label="Abrir o cerrar menú" aria-expanded={showMobileMenu} aria-controls="navegacion" onClick={()=>setShowMobileMenu(!showMobileMenu)}><Menu size={22}/></button>
        <div className="brand-heading"><div className="brand-kicker">APRENDE · EXPERIMENTA · CREA</div><h1>ARDUINO <span>LAB</span><small>ES</small></h1></div>
        <div className="top-right"><div className="course-chip"><Zap size={15}/> Laboratorio virtual</div><div className="progress-card"><div className="progress-meta"><b>Tu progreso</b><strong>{progress}/11</strong></div><div className="progress-track" role="progressbar" aria-label="Lecciones completadas" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={11}><div style={{width:`${progress / 11 * 100}%`}}/></div></div></div>
      </header>

      {storageError && <p role="status" className="storage-warning">El navegador no permite guardar tu avance. Puedes continuar en esta sesión.</p>}
      <div className="main-grid">
        <section id="escena" className="stage-wrap" aria-label="Escena interactiva tridimensional">
          <div className="stage-heading"><span className="eyebrow">EXPERIMENTO {lesson.number.toString().padStart(2,'0')} / 11</span><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div>
          <div className="stage-canvas"><Suspense fallback={<p className="scene-loading" role="status">Cargando la escena 3D…</p>}><ArduinoScene ledOn={ledOn} intensity={brightness} showWires={showWires} resistance={resistance} boardMode={boardMode} selectedPart={selectedPart} onSelectPart={selectPart}/></Suspense></div>
          <div className="floating-label component-label"><span className="spot"/> Arduino UNO <small>ATmega328P</small></div>
          {!boardMode && <div className="floating-label led-label"><Lightbulb size={17}/> LED <span className={`led-indicator ${ledOn ? 'on' : ''}`}/></div>}
          <div className="stage-instructions"><Info size={15}/> Arrastra para girar · Rueda o pellizco para acercar</div>
          {!boardMode && <div className="stage-actions"><button className="action-light" onClick={()=>setShowWires(!showWires)}><CircuitBoard size={16}/>{showWires ? 'Ocultar cables' : 'Mostrar cables'}</button><span className="simulation-tag"><span className={running ? 'live-dot on' : 'live-dot'}/>{running ? 'Simulación activa' : 'En espera'}</span></div>}
        </section>

        <aside className="right-column">
          <section className="information card">
            <div className="tabs" role="tablist" aria-label="Información de la lección" onKeyDown={event => {
              const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
              const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
              const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
              if (next >= 0) { event.preventDefault(); tabs[next].focus(); tabs[next].click(); }
            }}>
              <button id="tab-learn" aria-controls="lesson-panel" tabIndex={tab==='learn' ? 0 : -1} role="tab" aria-selected={tab==='learn'} className={tab==='learn' ? 'active' : ''} onClick={()=>setTab('learn')}>Aprender</button>
              <button id="tab-pins" aria-controls="lesson-panel" tabIndex={tab==='pins' ? 0 : -1} role="tab" aria-selected={tab==='pins'} className={tab==='pins' ? 'active' : ''} onClick={()=>setTab('pins')}>{boardMode ? 'Partes' : 'Conexiones'}</button>
              <button id="tab-challenge" aria-controls="lesson-panel" tabIndex={tab==='challenge' ? 0 : -1} role="tab" aria-selected={tab==='challenge'} className={tab==='challenge' ? 'active' : ''} onClick={()=>setTab('challenge')}>Reto</button>
            </div>
            <div className="information-inner" id="lesson-panel" role="tabpanel" tabIndex={0} aria-labelledby={`tab-${tab}`}>
              {tab==='learn' && <>
                <div className="section-flag"><span className="dot"/> FUNDAMENTOS DE ELECTRÓNICA</div>
                <h3>{boardMode ? 'Conoce tu Arduino UNO' : '¡Enciende tu primer LED!'}</h3>
                <p className="lead">{boardMode ? 'La placa Arduino UNO permite controlar circuitos por medio de un programa. Explora su microcontrolador, sus pines digitales y su alimentación.' : 'Un LED es un diodo que emite luz cuando circula corriente en la dirección correcta. Con Arduino podemos encenderlo y apagarlo mediante instrucciones de programación.'}</p>
                {boardMode ? boardPanel : <>
                <p className="objective"><b>Objetivo:</b> observa HIGH/LOW, ajusta tiempos y resistencia y explica cómo se protege el LED.</p>
                <div className="feature-list">
                  <div className="feature"><span className="feature-icon"><Zap size={20}/></span><div><b>Salida digital</b><p>El pin 13 alterna entre ALTO y BAJO.</p></div></div>
                  <div className="feature"><span className="feature-icon"><Activity size={20}/></span><div><b>Resistencia protectora</b><p>Limita la corriente eléctrica que recibe el LED.</p></div></div>
                  <div className="feature"><span className="feature-icon"><CircleHelp size={20}/></span><div><b>Experimenta</b><p>Cambia los tiempos y observa el circuito 3D.</p></div></div>
                </div>
                </>}
              </>}
              {tab==='pins' && (boardMode ? boardPanel : <>
                <div className="section-flag"><span className="dot"/> ESQUEMA DE CONEXIÓN</div><h3>Conecta correctamente</h3>
                <div className="pin-table"><div><b>D13</b><span>Resistencia → ánodo (+) del LED</span></div><div><b>GND</b><span>Cátodo (−) del LED</span></div><div><b>{resistance.toLocaleString('es-GT')} Ω</b><span>Resistencia en serie seleccionada</span></div></div>
                <p className="support-note">La vista es ilustrativa. Verifica polaridad, conexiones y límites de corriente antes de montar un circuito real.</p>
              </>)}
              {tab==='challenge' && <>
                <div className="section-flag"><span className="dot"/> ACTIVIDAD DE APRENDIZAJE</div><h3>Comprueba lo aprendido</h3>
                <p className="lead">{challenge.question}</p>
                <div className="answers">
                  {challenge.answers.map((text, i) => <button aria-pressed={quizAnswer===i} className={`answer ${quizAnswer===i ? 'chosen' : ''}`} onClick={()=>setQuizAnswer(i)} key={i}>{String.fromCharCode(65+i)}. {text}</button>)}
                </div>
                {quizAnswer!==null && <p role="status" className={correct ? 'correct feedback' : 'incorrect feedback'}>{correct ? `¡Correcto! ${challenge.explanation}` : 'Revisa la explicación e inténtalo de nuevo.'}</p>}
                <button className="complete-button" disabled={!canCompleteLesson(activeId, quizAnswer, hasRun, explored) || completed.includes(activeId)} onClick={finish}><CheckCircle2 size={17}/>{completed.includes(activeId) ? 'Lección completada' : 'Completar lección'}</button>
                {boardMode && explored.length < 5 && <p className="micro-note">Explora las cinco partes antes de completar la lección ({explored.length}/5).</p>}
                {!boardMode && !hasRun && <p className="micro-note">Primero ejecuta al menos una simulación.</p>}
              </>}
            </div>
          </section>

          {!boardMode && <><section className="controls card" aria-label="Controles de simulación">
            <div className="card-header"><div><SlidersHorizontal size={17}/><b>Prueba tú mismo</b></div><span className="small-flag">SIMULACIÓN GUIADA</span></div>
            <div className="controls-body">
              <label className="control-label">Tiempo encendido <b>{onMs} ms</b><input type="range" min="100" max="2000" step="100" value={onMs} onChange={e=>setOnMs(Number(e.target.value))} disabled={boardMode}/></label>
              <label className="control-label">Tiempo apagado <b>{offMs} ms</b><input type="range" min="100" max="2000" step="100" value={offMs} onChange={e=>setOffMs(Number(e.target.value))} disabled={boardMode}/></label>
              <label className="control-label">Resistencia <b>{resistance.toLocaleString('es-GT')} Ω</b><select value={resistance} onChange={e=>setResistance(Number(e.target.value))}><option value={220}>220 Ω · Brillante</option><option value={1000}>1 kΩ · Atenuado</option><option value={10000}>10 kΩ · Muy tenue</option></select></label>
              <div className="current-note"><Activity size={15}/> Corriente estimada: <strong>{current.toFixed(2)} mA</strong></div>
            </div>
          </section>

          <section className="code-card card" id="code-panel"><div className="card-header"><div><Code2 size={18}/><b>Tu código Arduino</b></div><div className="code-btns"><button title="Restablecer valores" aria-label="Restablecer valores" onClick={()=>{simulation.reset();setLogs([]);setOnMs(500);setOffMs(500);setResistance(220)}}><RotateCcw size={16}/></button><button className={`run-button ${running ? 'playing':''}`} onClick={run} disabled={boardMode} aria-label={running ? 'Detener simulación' : 'Ejecutar simulación'}>{running ? <Pause size={19} fill="currentColor"/> : <Play size={19} fill="currentColor"/>}</button></div></div>
            <pre className="code-view"><code>{code}</code></pre>
            <div className="code-footer"><span>Arduino C++ · Ejemplo parametrizado</span><span>Ejecutar <ArrowRight size={13}/></span></div>
          </section>
          </>}
        </aside>
      </div>

      <div className="bottom-section" id="lecciones">
        <div className="lessons-heading"><div><BookOpen size={19}/><h2>Ruta de aprendizaje</h2><span>11 lecciones progresivas</span></div><span className="micro-note">Selecciona una lección para explorar</span></div>
        <div className="lesson-scroll" aria-label="Lecciones disponibles">
          {lessons.map((item) => <button key={item.id} onClick={()=>changeLesson(item.id)} className={`lesson-card ${item.id===activeId ? 'active' : ''} ${item.status==='upcoming' ? 'upcoming':''}`} disabled={item.status==='upcoming'} aria-label={`${item.number}. ${item.title}${item.status==='upcoming'?' (próximamente)':''}`}>
            <span className="lesson-index">{String(item.number).padStart(2,'0')}</span><span className="lesson-text"><b>{item.title}</b><small>{item.subtitle}</small></span>{completed.includes(item.id) ? <CheckCircle2 size={17}/> : <ChevronRight size={17}/>}</button>)}
        </div>
        <div className="bottom-bar"><div className="serial"><Volume2 size={15}/><b>Monitor de eventos</b><span>Eventos de simulación guiada</span></div><div className="logs">{logs.length ? logs.slice(-3).map(l=><span key={l.id}>{l.text}</span>) : <span className="placeholder">{boardMode ? 'Explora las partes de la placa con los puntos o los botones.' : 'Ejecuta el ejemplo para ver eventos simulados.'}</span>}</div></div>
      </div>
      <footer><span>Arduino Lab ES · Prototipo educativo independiente</span><span>Simulación guiada: no compila C++, no emula Arduino ni controla hardware.</span></footer>
    </main>
  </div>;
}
