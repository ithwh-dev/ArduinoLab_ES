# Arquitectura y estudio de referencia

## Visión
Implementación independiente de Arduino Lab ES: React TS renderiza la UI, React Three Fiber administra la escena 3D y las funciones didácticas viven fuera de la representación gráfica. En el MVP la simulación LED es guiada (temporizadores del navegador, no interpretación de C++).

## Archivos del sitio analizado
Proporcionados por el usuario en la conversación:

- `index-DUxJjXqx.js`: catálogo de 11 lecciones, código parametrizado, navegación, UI, persistencia local.
- `index-DM35LHSX.css`: estilos basados en lienzo fijo de 1672 × 941 y escalado de viewport.
- `stage-btHE6-0n.js`: clase `BoardStage`; escenas, cámara, objetos seleccionables, comportamiento de simulación.
- `kit-Ce41oYCW.js`: motor Three.js más funciones geométricas y utilidades de modelos.
- `thumbs-gagaX1E4.js`: generación de PNG en tiempo de ejecución mediante render target y `canvas`.

Estos ficheros son **bundles de producción, no código fuente original editable**. Se incluyen en `referencias-originales/` solo como referencia local para el propietario de la copia; esa carpeta está ignorada por Git.

## Módulos de nuestro MVP
- `src/data/lessons.ts`: metadatos de 11 unidades en español.
- `src/lib/electronics.ts`: estimación de corriente, brillo ilustrativo y generador de ejemplo C++.
- `src/components/ArduinoScene.tsx`: escena propia con geometrías primitivas y cámara manipulable.
- `src/App.tsx`: estado de simulación guiada, paneles, progreso, cuestionario y monitor didáctico.
- `src/styles.css`: diseño responsive.

## Comportamiento y límites
- El botón Ejecutar inicia una animación temporizada de estado HIGH/LOW.
- La corriente estimada con V=5, Vf≈2: I=(5−2)/R; el brillo es meramente visual.
- Las conexiones 3D iniciales son conceptuales; hay que validarlas antes de enseñar polaridad y cableado exacto.
- No hay compilación, conexión a dispositivo, simulación general de electrónica ni emulación AVR.
- `localStorage` guarda el progreso. No identifica estudiantes ni habilita seguimiento docente remoto.

## Hoja de ruta
1. MVP corregido, lecciones 1 y 2 funcionales; tests, UX y móviles.
2. Completar lecciones 3–11 con escenarios guiados, objetivos y rúbricas.
3. Abstraer grafo eléctrico y conexiones, validar circuitos seguros.
4. Integrar editor, compilación de AVR y emulación (evaluar AVR8js).
5. Panel académico, registro de estudiantes y respaldo de avances.
