# Primera tarea para Codex

Actúa como desarrollador principal del proyecto Arduino Lab ES. Lee primero AGENTS.md, README.md, docs/arquitectura.md y el código existente.

## Contexto
Esta plataforma nació de estudiar la web https://learn-arduino-red.vercel.app/ y cinco bundles minificados, facilitados por el usuario. La implementación de producción debe ser propia; el concepto es un laboratorio para estudiantes de secundaria en Guatemala, con lenguaje español comprensible y escena interactiva 3D.

## Tu tarea inmediata
1. Comprueba compilación, tests y comportamiento real del MVP con `npm install`, `npm run check`, `npm test`, `npm run build`.
2. Corrige todos los problemas concretos que encuentres, sin degradar el diseño.
3. Separa la simulación LED del componente App en un hook o servicio con pruebas (estados HIGH/LOW temporizados, stop, reset, cambios de parámetros).
4. Implementa la lección 1 «Conoce Arduino» con puntos 3D seleccionables para USB, microcontrolador, entradas analógicas, pines digitales y alimentación; añade panel descriptivo, objetivo y reto en español.
5. Mejora el circuito de LED para representar conexiones D13/resistencia/ánodo y cátodo/GND con precisión visual suficiente para enseñanza. La representación actual es conceptual.
6. Prueba accesibilidad básica, vista móvil y rendimiento. Documenta límites de simulación y pruebas verificadas.

## Criterios de aceptación
- UI 100 % en español salvo identificadores técnicos (GND, HIGH, `pinMode`, etc.).
- Escena 3D interactiva sin errores de renderizado ni consola.
- Lección 1 y 2 con objetivos, controles coherentes, reto verificable y persistencia local.
- LED configurable con tiempos 100–2000 ms y resistencias de 220 Ω, 1 kΩ y 10 kΩ.
- Distinción inequívoca entre simulación guiada y compilación de programas.
- Tests y build ejecutan correctamente; informa comandos y salidas.

## No objetivos por ahora
- Cuentas, autenticación, calificaciones en servidor, ensamblado libre de circuitos, emulación AVR y edición libre de C++.

## Entrega esperada
Commits organizados, README actualizado, explicación de decisiones, capturas cuando sea posible, pruebas realizadas y siguientes tareas priorizadas.
