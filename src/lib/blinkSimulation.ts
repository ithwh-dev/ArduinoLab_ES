export type BlinkState = { running: boolean; ledOn: boolean; hasRun: boolean };

/** Temporizador de la simulación guiada; no interpreta código C++. */
export class BlinkSimulation {
  private timer?: ReturnType<typeof setTimeout>;
  private onMs = 500;
  private offMs = 500;
  private state: BlinkState = { running: false, ledOn: false, hasRun: false };

  constructor(private readonly notify: (state: BlinkState) => void) {}

  private publish(state: BlinkState) { this.state = state; this.notify({ ...state }); }
  private clear() { clearTimeout(this.timer); this.timer = undefined; }
  private tick = (ledOn: boolean) => {
    this.publish({ running: true, ledOn, hasRun: true });
    this.timer = setTimeout(() => this.tick(!ledOn), ledOn ? this.onMs : this.offMs);
  };
  start() { if (!this.state.running) this.tick(true); }
  stop() { this.clear(); this.publish({ ...this.state, running: false, ledOn: false }); }
  reset() { this.clear(); this.onMs = this.offMs = 500; this.publish({ running: false, ledOn: false, hasRun: false }); }
  configure(onMs: number, offMs: number) {
    for (const duration of [onMs, offMs]) {
      if (!Number.isFinite(duration) || duration < 100 || duration > 2000) throw new RangeError('Los tiempos deben estar entre 100 y 2000 ms.');
    }
    this.onMs = onMs; this.offMs = offMs;
    // Al cambiar tiempos, inicia un nuevo ciclo ALTO y cancela el anterior.
    if (this.state.running) { this.clear(); this.tick(true); }
  }
  dispose() { this.clear(); }
}
