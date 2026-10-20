/** Modelos didácticos aproximados: NO sustituyen cálculos y mediciones de laboratorio. */
export function ledCurrentMa(voltage = 5, ledDrop = 2, resistance = 220): number {
  if (resistance <= 0) return 0;
  return Math.max(0, ((voltage - ledDrop) / resistance) * 1000);
}
export function ledBrightness(resistance: number): number {
  // Curva visual ilustrativa, no modelo fotométrico.
  return Math.min(1, Math.max(0.06, ledCurrentMa(5, 2, resistance) / 13.64));
}
export function generateBlinkCode(onMs: number, offMs: number): string {
  return `const int LED = 13;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED, HIGH);\n  delay(${onMs});\n  digitalWrite(LED, LOW);\n  delay(${offMs});\n}`;
}
