import { describe, expect, it } from 'vitest';
import { canCompleteLesson, validProgress } from './progress';
import { boardParts } from '../data/boardParts';
describe('progreso por actividad', () => {
  it('exige explorar las cinco partes y acertar el reto de placa', () => {
    const all = boardParts.map(p => p.id);
    expect(canCompleteLesson('board', 1, true, all.slice(1))).toBe(false);
    expect(canCompleteLesson('board', 0, false, all)).toBe(false);
    expect(canCompleteLesson('board', 1, false, all)).toBe(true);
  });
  it('exige una simulación y respuesta correcta para el LED', () => {
    expect(canCompleteLesson('blink', 1, false, [])).toBe(false);
    expect(canCompleteLesson('blink', 0, true, [])).toBe(false);
    expect(canCompleteLesson('blink', 1, true, [])).toBe(true);
    expect(canCompleteLesson('unknown', 1, true, [])).toBe(false);
  });
  it('descarta datos desconocidos y duplicados del almacenamiento local', () => {
    expect(validProgress(['board', 'board', 'blink', 'unknown', 7])).toEqual(['board', 'blink']);
    expect(validProgress({})).toEqual([]);
  });
});
