# Reglas para Codex · Arduino Lab ES

## Meta del repositorio
Construir un laboratorio virtual de electrónica para estudiantes hispanohablantes de nivel medio. Combina explicaciones pedagógicas, objetos 3D manipulables y simulación **guiada**, con futura evolución a emulación de código Arduino.

## Decisiones innegociables
- Interfaz, instrucciones, evaluaciones, avisos y documentación orientada al estudiante en español de Guatemala, con lenguaje claro y preciso. El código C++ conserva su sintaxis habitual.
- Mantener React + TypeScript + Vite y Three.js mediante React Three Fiber para el MVP.
- Separar contenido educativo, lógica de simulación, renderer 3D y presentación; no acoplarlos.
- No llamar "compilación" ni "emulación" a los efectos visuales de simulación guiada. Explicar los límites cuando corresponda.
- Priorizar accesibilidad (teclado, foco visible, labels), rendimiento (DPR limitado, carga diferida) y diseño responsive.
- No usar los bundles minificados originales como dependencia de producción; están en `referencias-originales/` solo para estudio del autor/procedencia y excluidos de Git.
- No publicar o reutilizar literalmente modelos/código de terceros sin confirmar permisos concretos de redistribución. Se permite estudiar su comportamiento para una implementación propia.

## Protocolo
1. Leer `README.md`, `docs/arquitectura.md` y `CODEX_TAREA_INICIAL.md` antes de cambios importantes.
2. Trabajar una funcionalidad por cambio y actualizar tests y documentación.
3. Ejecutar `npm run check`, `npm run test` y `npm run build` si hay acceso a dependencias.
4. Validar el comportamiento de la lección LED: alternancia HIGH/LOW, ajustes de tiempo, resistencia y progreso solo tras actividad.
5. Explicar qué se validó realmente y qué quedó pendiente; nunca afirmar que está compilado si no se pudo ejecutar.

## Alcance inicial
Dos lecciones accesibles (orientación de placa y LED) y nueve fichas de próximos módulos. Primer objetivo de Codex: completar la lección "Conoce Arduino" y perfeccionar "Enciende un LED" con pruebas de UX y compatibilidad móvil. No implementar compilador C++ completo todavía.
