import { describe, expect, it } from 'vitest';
import { generateBlinkCode, ledBrightness, ledCurrentMa } from './electronics';

describe('electrónica didáctica', () => {
  it('estima la corriente con una resistencia de 220 Ω', () => {
    expect(ledCurrentMa()).toBeCloseTo(13.636, 2);
  });
  it('una resistencia mayor reduce el brillo ilustrativo', () => {
    expect(ledBrightness(1000)).toBeLessThan(ledBrightness(220));
  });
  it('inyecta los tiempos configurados en el ejemplo', () => {
    const code = generateBlinkCode(700, 300);
    expect(code).toContain('delay(700);');
    expect(code).toContain('delay(300);');
  });
});
