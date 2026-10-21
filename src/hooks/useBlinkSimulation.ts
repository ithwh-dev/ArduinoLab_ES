import { useEffect, useRef, useState } from 'react';
import { BlinkSimulation, type BlinkState } from '../lib/blinkSimulation';

export function useBlinkSimulation(onMs: number, offMs: number, onEvent: (message: string) => void) {
  const [state, setState] = useState<BlinkState>({ running: false, ledOn: false, hasRun: false });
  const event = useRef(onEvent);
  event.current = onEvent;
  const [simulation] = useState(() => new BlinkSimulation((next) => {
    setState(next);
    if (next.running) event.current(next.ledOn ? 'PIN 13 → ALTO (HIGH, LED encendido)' : 'PIN 13 → BAJO (LOW, LED apagado)');
  }));
  useEffect(() => { simulation.configure(onMs, offMs); }, [simulation, onMs, offMs]);
  useEffect(() => () => simulation.dispose(), [simulation]);
  return { ...state, start: () => simulation.start(), stop: () => simulation.stop(), reset: () => simulation.reset() };
}
