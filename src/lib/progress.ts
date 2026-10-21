import { boardParts } from '../data/boardParts';
export function validProgress(data: unknown): string[] {
  return Array.isArray(data) ? [...new Set(data.filter((id): id is string => id === 'board' || id === 'blink'))] : [];
}
export function canCompleteLesson(id: string, answer: number | null, hasRun: boolean, explored: readonly string[]): boolean {
  return answer === 1 && (id === 'board' ? boardParts.every(part => explored.includes(part.id)) : id === 'blink' && hasRun);
}
