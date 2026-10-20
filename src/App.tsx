import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowRight, BookOpen, CheckCircle2, ChevronRight, CircleHelp, CircuitBoard, Code2, GraduationCap, Info, Lightbulb, Menu, Pause, Play, RotateCcw, Settings2, SlidersHorizontal, Volume2, Zap } from 'lucide-react';
import { ArduinoScene } from './components/ArduinoScene';
import { lessons } from './data/lessons';
import { generateBlinkCode, ledBrightness, ledCurrentMa } from './lib/electronics';

type ConsoleEntry = { text: string; id: number };
const STORAGE_KEY = 'arduino-lab-es-progress-v1';

function loadProgress(): string[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); const data: unknown = raw ? JSON.parse(raw) : []; return Array.isArray(data) ? data.filter((item): item is string => typeof item === 'string') : []; } catch { return []; }
}

export default function App() {
  const [activeId, setActiveId] = useState('blink');
  const [onMs, setOnMs] = useState(500);
  const [offMs, setOffMs] = useState(500);
  const [resistance, setResistance] = useState(220);
  const [running, setRunning] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  const [showWires, setShowWires] = useState(true);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [hasRun, setHasRun] = useState(false);
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
  const addLog = useCallback((message: string) => {
    setLogs((old) => [...old.slice(-7), { text: message, id: ++logId.current }]);
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); }, [completed]);
  useEffect(() => {
    if (!running || boardMode) return;
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const tick = (next: boolean) => {
      if (cancelled) return;
      setLedOn(next);
      addLog(next ? `PIN 13 → ALTO (LED encendido)` : `PIN 13 → BAJO (LED apagado)`);
      timeout = setTimeout(() => tick(!next), next ? onMs : offMs);
    };
    tick(true);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [running, onMs, offMs, boardMode, addLog]);

  function stop() { setRunning(false); setLedOn(false); }
  function run() {
    if (running) { stop(); return; }
    setLogs([]); setHasRun(true); setRunning(true); setTab('learn');
  }
  function changeLesson(id: string) {
    const target = lessons.find((l) => l.id === id);
    if (!target || target.status !== 'available') return;
    stop(); setActiveId(id); setShowMobileMenu(false); setTab('learn'); setLogs([]); setQuizAnswer(null);
  }
  function finish() {
    if (correct && hasRun && !completed.includes('blink')) setCompleted((c) => [...c, 'blink']);
  }
  const progress = completed.length;

  return <div className="shell">
    <aside className={`sidebar ${showMobileMenu ? 'open' : ''}`} aria-label="Navegación principal">
      <div className="brand-icon" title="Arduino Lab ES"><CircuitBoard size={27} strokeWidth={1.8}/></div>
      <div className="sidebar-divider"/>
      <nav aria-label="Secciones">
        <button className="nav-icon selected" title="Lecciones" aria-label="Lecciones"><BookOpen size={22}/></button>
        <button className="nav-icon" title="Laboratorio" aria-label="Laboratorio"><CircuitBoard size={22}/></button>
        <button className="nav-icon" title="Código" aria-label="Código" onClick={() => document.getElementById('code-panel')?.scrollIntoView({behavior:'smooth'})}><Code2 size={22}/></button>
        <button className="nav-icon" title="Actividades" aria-label="Actividades" onClick={()=>setTab('challenge')}><GraduationCap size={23}/></button>
      </nav>
      <div className="sidebar-bottom"><button className="nav-icon" aria-label="Configuración visual" title="Mostrar u ocultar cables" onClick={()=>setShowWires(!showWires)}><Settings2 size={21}/></button></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" aria-label="Abrir o cerrar menú" onClick={()=>setShowMobileMenu(!showMobileMenu)}><Menu size={22}/></button>
        <div className="brand-heading"><div className="brand-kicker">APRENDE · EXPERIMENTA · CREA</div><h1>ARDUINO <span>LAB</span><small>ES</small></h1></div>
        <div className="top-right"><div className="course-chip"><Zap size={15}/> Laboratorio virtual</div><div className="progress-card"><div className="progress-meta"><b>Tu progreso</b><strong>{progress}/11</strong></div><div className="progress-track"><div style={{width:`${progress / 11 * 100}%`}}/></div></div></div>
      </header>

      <div className="main-grid">
        <section className="stage-wrap" aria-label="Escena interactiva tridimensional">
          <div className="stage-heading"><span className="eyebrow">EXPERIMENTO {lesson.number.toString().padStart(2,'0')} / 11</span><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div>
          <div className="stage-canvas"><ArduinoScene ledOn={ledOn} intensity={brightness} showWires={showWires}/></div>
          <div className="floating-label component-label"><span className="spot"/> Arduino UNO <small>ATmega328P</small></div>
          <div className="floating-label led-label"><Lightbulb size={17}/> LED <span className={`led-indicator ${ledOn ? 'on' : ''}`}/></div>
          <div className="stage-instructions"><Info size={15}/> Arrastra para girar · Rueda para acercar · Clic derecho para desplazar</div>
          <div className="stage-actions"><button className="action-light" onClick={()=>setShowWires(!showWires)}><CircuitBoard size={16}/>{showWires ? 'Ocultar cables' : 'Mostrar cables'}</button><span className="simulation-tag"><span className={running ? 'live-dot on' : 'live-dot'}/>{running ? 'Simulación activa' : 'En espera'}</span></div>
        </section>

        <aside className="right-column">
          <section className="information card">
            <div className="tabs" role="tablist" aria-label="Información de la lección">
              <button role="tab" aria-selected={tab==='learn'} className={tab==='learn' ? 'active' : ''} onClick={()=>setTab('learn')}>Aprender</button>
              <button role="tab" aria-selected={tab==='pins'} className={tab==='pins' ? 'active' : ''} onClick={()=>setTab('pins')}>Conexiones</button>
              <button role="tab" aria-selected={tab==='challenge'} className={tab==='challenge' ? 'active' : ''} onClick={()=>setTab('challenge')}>Reto</button>
            </div>
            <div className="information-inner">
              {tab==='learn' && <>
                <div className="section-flag"><span className="dot"/> FUNDAMENTOS DE ELECTRÓNICA</div>
                <h3>{boardMode ? 'Conoce tu Arduino UNO' : '¡Enciende tu primer LED!'}</h3>
                <p className="lead">{boardMode ? 'La placa Arduino UNO permite controlar circuitos por medio de un programa. Explora su microcontrolador, sus pines digitales y su alimentación.' : 'Un LED es un diodo que emite luz cuando circula corriente en la dirección correcta. Con Arduino podemos encenderlo y apagarlo mediante instrucciones de programación.'}</p>
                <div className="feature-list">
                  <div className="feature"><span className="feature-icon"><Zap size={20}/></span><div><b>Salida digital</b><p>El pin 13 alterna entre ALTO y BAJO.</p></div></div>
                  <div className="feature"><span className="feature-icon"><Activity size={20}/></span><div><b>Resistencia protectora</b><p>Limita la corriente eléctrica que recibe el LED.</p></div></div>
                  <div className="feature"><span className="feature-icon"><CircleHelp size={20}/></span><div><b>Experimenta</b><p>Cambia los tiempos y observa el circuito 3D.</p></div></div>
                </div>
              </>}
              {tab==='pins' && <>
                <div className="section-flag"><span className="dot"/> ESQUEMA DE CONEXIÓN</div><h3>Conecta correctamente</h3>
                <div className="pin-table"><div><b>D13</b><span>Resistencia → ánodo (+) del LED</span></div><div><b>GND</b><span>Cátodo (−) del LED</span></div><div><b>220 Ω</b><span>Resistencia en serie</span></div></div>
                <p className="support-note">La vista es ilustrativa. Verifica polaridad, conexiones y límites de corriente antes de montar un circuito real.</p>
              </>}
              {tab==='challenge' && <>
                <div className="section-flag"><span className="dot"/> ACTIVIDAD DE APRENDIZAJE</div><h3>Comprueba lo aprendido</h3>
                <p className="lead">¿Por qué utilizamos una resistencia en serie con el LED?</p>
                <div className="answers">
                  {['Para aumentar el voltaje del pin', 'Para limitar la corriente y proteger el LED', 'Para que Arduino funcione sin energía'].map((text, i) => <button className={`answer ${quizAnswer===i ? 'chosen' : ''}`} onClick={()=>setQuizAnswer(i)} key={i}>{String.fromCharCode(65+i)}. {text}</button>)}
                </div>
                {quizAnswer!==null && <p className={correct ? 'correct feedback' : 'incorrect feedback'}>{correct ? '¡Correcto! La resistencia limita la corriente.' : 'Revisa la explicación sobre la función de la resistencia.'}</p>}
                <button className="complete-button" disabled={!correct || !hasRun || boardMode || completed.includes('blink')} onClick={finish}><CheckCircle2 size={17}/>{completed.includes('blink') ? 'Lección completada' : 'Completar lección'}</button>
                {!hasRun && <p className="micro-note">Primero ejecuta al menos una simulación.</p>}
              </>}
            </div>
          </section>

          <section className="controls card" aria-label="Controles de simulación">
            <div className="card-header"><div><SlidersHorizontal size={17}/><b>Prueba tú mismo</b></div><span className="small-flag">SIMULACIÓN GUIADA</span></div>
            <div className="controls-body">
              <label className="control-label">Tiempo encendido <b>{onMs} ms</b><input type="range" min="100" max="2000" step="100" value={onMs} onChange={e=>setOnMs(Number(e.target.value))} disabled={boardMode}/></label>
              <label className="control-label">Tiempo apagado <b>{offMs} ms</b><input type="range" min="100" max="2000" step="100" value={offMs} onChange={e=>setOffMs(Number(e.target.value))} disabled={boardMode}/></label>
              <label className="control-label">Resistencia <b>{resistance.toLocaleString('es-GT')} Ω</b><select value={resistance} onChange={e=>setResistance(Number(e.target.value))}><option value={220}>220 Ω · Brillante</option><option value={1000}>1 kΩ · Atenuado</option><option value={10000}>10 kΩ · Muy tenue</option></select></label>
              <div className="current-note"><Activity size={15}/> Corriente estimada: <strong>{current.toFixed(2)} mA</strong></div>
            </div>
          </section>

          <section className="code-card card" id="code-panel"><div className="card-header"><div><Code2 size={18}/><b>Tu código Arduino</b></div><div className="code-btns"><button title="Restablecer valores" aria-label="Restablecer valores" onClick={()=>{stop();setOnMs(500);setOffMs(500);setResistance(220)}}><RotateCcw size={16}/></button><button className={`run-button ${running ? 'playing':''}`} onClick={run} disabled={boardMode} aria-label={running ? 'Detener simulación' : 'Ejecutar simulación'}>{running ? <Pause size={19} fill="currentColor"/> : <Play size={19} fill="currentColor"/>}</button></div></div>
            <pre className="code-view"><code>{code}</code></pre>
            <div className="code-footer"><span>Arduino C++ · Ejemplo parametrizado</span><span>Ejecutar <ArrowRight size={13}/></span></div>
          </section>
        </aside>
      </div>

      <div className="bottom-section">
        <div className="lessons-heading"><div><BookOpen size={19}/><h2>Ruta de aprendizaje</h2><span>11 lecciones progresivas</span></div><span className="micro-note">Selecciona una lección para explorar</span></div>
        <div className="lesson-scroll" aria-label="Lecciones disponibles">
          {lessons.map((item) => <button key={item.id} onClick={()=>changeLesson(item.id)} className={`lesson-card ${item.id===activeId ? 'active' : ''} ${item.status==='upcoming' ? 'upcoming':''}`} disabled={item.status==='upcoming'} aria-label={`${item.number}. ${item.title}${item.status==='upcoming'?' (próximamente)':''}`}>
            <span className="lesson-index">{String(item.number).padStart(2,'0')}</span><span className="lesson-text"><b>{item.title}</b><small>{item.subtitle}</small></span>{completed.includes(item.id) ? <CheckCircle2 size={17}/> : <ChevronRight size={17}/>}</button>)}
        </div>
        <div className="bottom-bar"><div className="serial"><Volume2 size={15}/><b>Monitor de eventos</b><span>9600 baudios (demostración)</span></div><div className="logs">{logs.length ? logs.slice(-3).map(l=><span key={l.id}>{l.text}</span>) : <span className="placeholder">Ejecuta el ejemplo para ver eventos simulados.</span>}</div></div>
      </div>
      <footer><span>Arduino Lab ES · Prototipo educativo independiente</span><span>Los resultados visuales son simulados, no representan un circuito físico real.</span></footer>
    </main>
  </div>;
}
