import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlinkSimulation } from './blinkSimulation';

describe('simulación guiada LED', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });
  it('alterna HIGH/LOW con tiempos independientes, sin duplicar ciclos', () => {
    const notify = vi.fn(); const sim = new BlinkSimulation(notify);
    sim.configure(700, 300); sim.start(); sim.start();
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenLastCalledWith({ running: true, ledOn: true, hasRun: true });
    vi.advanceTimersByTime(699); expect(notify).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1); expect(notify).toHaveBeenLastCalledWith({ running: true, ledOn: false, hasRun: true });
    vi.advanceTimersByTime(300); expect(notify).toHaveBeenLastCalledWith({ running: true, ledOn: true, hasRun: true });
  });
  it('detiene, conserva actividad y permite reiniciar sin temporizadores pendientes', () => {
    const notify = vi.fn(); const sim = new BlinkSimulation(notify);
    sim.start(); sim.stop(); vi.advanceTimersByTime(5000);
    expect(notify).toHaveBeenCalledTimes(2);
    expect(notify).toHaveBeenLastCalledWith({ running: false, ledOn: false, hasRun: true });
    sim.start(); expect(vi.getTimerCount()).toBe(1);
    sim.reset(); expect(vi.getTimerCount()).toBe(0);
    expect(notify).toHaveBeenLastCalledWith({ running: false, ledOn: false, hasRun: false });
    sim.start(); vi.advanceTimersByTime(500); expect(notify).toHaveBeenLastCalledWith({ running: true, ledOn: false, hasRun: true });
  });
  it('aplica parámetros nuevos cancelando el ciclo anterior y limpia al desmontar', () => {
    const notify = vi.fn(); const sim = new BlinkSimulation(notify);
    sim.start(); vi.advanceTimersByTime(400); sim.configure(100, 2000);
    vi.advanceTimersByTime(100); expect(notify).toHaveBeenLastCalledWith({ running: true, ledOn: false, hasRun: true });
    expect(vi.getTimerCount()).toBe(1); sim.dispose(); expect(vi.getTimerCount()).toBe(0);
  });
  it('rechaza tiempos fuera del rango sin alterar el temporizador', () => {
    const sim = new BlinkSimulation(vi.fn()); sim.start();
    for (const value of [0, 99, 2001, NaN, Infinity]) expect(() => sim.configure(value, 500)).toThrow(RangeError);
    expect(vi.getTimerCount()).toBe(1);
  });
});
