# Arduino Lab ES

Laboratorio educativo en español para estudiantes de nivel medio. Inspirado conceptualmente en [Learn Arduino](https://learn-arduino-red.vercel.app/), con implementación original en React, TypeScript y Three.js.

## Estado: prototipo MVP
- Interfaz responsive en español y escena Arduino UNO/LED/protoboard 3D con navegación.
- Lección 2: parpadeo de LED mediante simulación guiada, tiempos configurables y resistencias seleccionables.
- Código Arduino C++ de ejemplo actualizado según los controles.
- Monitor de eventos simulado, evaluación rápida y progreso local.
- Catálogo de 11 lecciones (solo 1 y 2 son seleccionables; la lección 1 aún requiere completar interacciones y reto propios).

**Importante:** esto no compila C++, no simula circuitos generales y no controla hardware. La corriente calculada es aproximada y la vista 3D inicial es conceptual.

## Instalar y ejecutar
Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
npm run dev
```

Abrir la dirección local que muestre Vite (por defecto `http://localhost:5173`).

```bash
npm run check
npm run test
npm run build
```

## Continuar en Codex
Abre este directorio en VS Code con la extensión Codex o súbelo a tu repositorio de GitHub y conéctalo con Codex Cloud. Codex puede leer `AGENTS.md` como guía persistente.

**Tarea lista para Codex:** copia el texto de `CODEX_TAREA_INICIAL.md` en una nueva tarea de Codex. Lee también `docs/arquitectura.md`.

## Referencia externa
En `referencias-originales/` se incluyen bundles JS y CSS proporcionados por el usuario para investigación. Esta carpeta está en `.gitignore` y no forma parte de nuestra aplicación. Antes de redistribuir código original hay que verificar autorización o licencia específica, aunque sea públicamente accesible.

## Próximas mejoras
Pines realmente seleccionables, circuito educativo validado, retos por lección, persistencia de configuración y progresión didáctica; más adelante editor y emulador.
