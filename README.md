# Arduino Lab ES

Laboratorio educativo en español para estudiantes de nivel medio. Inspirado conceptualmente en [Learn Arduino](https://learn-arduino-red.vercel.app/), con implementación original en React, TypeScript y Three.js.

## Estado: prototipo MVP
- Interfaz responsive en español y escena Arduino UNO/LED/protoboard 3D con navegación.
- Lección 1: cinco partes seleccionables en 3D y por teclado, descripción, objetivo y reto propio.
- Lección 2: parpadeo de LED mediante simulación guiada, tiempos configurables y resistencias seleccionables.
- Código Arduino C++ de ejemplo actualizado según los controles.
- Monitor de eventos simulado, retos por lección y progreso local.
- Tiempos y resistencia guardados localmente; si el almacenamiento está bloqueado, se permite continuar con un aviso.
- Catálogo de 11 lecciones: las primeras dos están disponibles y las otras nueve se presentan como próximas.

**Importante:** esto no compila C++, no simula circuitos generales y no controla hardware. La corriente calculada es aproximada. La escena muestra la continuidad D13 → resistencia → ánodo (+), y cátodo (−) → GND, con terminales separados. Es un esquema 3D simplificado: no reproduce las filas conductoras internas de una protoboard ni sustituye un diagrama de montaje físico.

## Instalar y ejecutar
Requiere Node.js 20.19+ o 22.12+.

```bash
npm ci
npm run dev
```

Abrir la dirección local que muestre Vite (por defecto `http://localhost:5173`).

```bash
npm run check
npm run test
npm run build
```

## Uso de las lecciones

En «Conoce Arduino», selecciona los puntos numerados de la placa o los botones del panel (Tab y Enter/Espacio). Explora USB, microcontrolador, entradas analógicas, pines digitales y alimentación. Responde el reto correctamente para completar la lección después de explorar las cinco partes.

En «Enciende un LED», ejecuta la simulación guiada y observa los eventos HIGH/LOW. Ajusta los tiempos de 100 a 2000 ms y la resistencia entre 220 Ω, 1 kΩ y 10 kΩ. El ejemplo C++ refleja los tiempos; no se ejecuta ni se compila. Responde el reto después de realizar la actividad para completar la lección. Restablecer detiene el temporizador y devuelve los controles a 500/500 ms y 220 Ω; conserva las lecciones completadas.

Las pestañas admiten flechas izquierda/derecha, Inicio y Fin. Hay foco visible, etiquetas de controles, alternativa a la selección 3D con teclado y aviso ante almacenamiento bloqueado. La escena usa DPR limitado y renderizado bajo demanda, con encuadre adaptado a pantallas estrechas. Las fuentes usan alternativas locales para evitar solicitudes externas.

## Pruebas de navegador

Con el servidor de desarrollo activo en otra terminal, ejecuta:

```bash
npm run test:browser
```

Requiere Chromium instalado en `/usr/bin/chromium`; usa `CHROMIUM_PATH` para indicar otra ruta. `BASE_URL` permite probar otro servidor, por ejemplo la build de producción con `npm run preview -- --port 4173 --strictPort`. `playwright-core` no descarga navegadores automáticamente. La prueba usa WebGL por software en el entorno en la nube y guarda capturas en `artifacts/browser/` (ignorado por Git).

La prueba cubre ambas lecciones, las cinco selecciones 3D, botones por teclado, pestañas y foco, HIGH/LOW, límites de tiempos, las tres resistencias, detener/restablecer/cambiar lección, requisitos de actividad de los retos, persistencia, almacenamiento inválido o bloqueado y vista móvil de 390 × 844 sin desbordamiento horizontal. Falla ante errores de ejecución o de consola de la página principal. No sustituye una auditoría completa con lector de pantalla ni pruebas en dispositivos físicos.

Consulta [la validación registrada](docs/validacion.md) para resultados y límites.

## Continuar en Codex
Abre este directorio en VS Code con la extensión Codex o súbelo a tu repositorio de GitHub y conéctalo con Codex Cloud. Codex puede leer `AGENTS.md` como guía persistente.

**Tarea lista para Codex:** copia el texto de `CODEX_TAREA_INICIAL.md` en una nueva tarea de Codex. Lee también `docs/arquitectura.md`.

## Referencia externa
En `referencias-originales/` se incluyen bundles JS y CSS proporcionados por el usuario para investigación. Esta carpeta está en `.gitignore` y no forma parte de nuestra aplicación. Antes de redistribuir código original hay que verificar autorización o licencia específica, aunque sea públicamente accesible.

## Próximas mejoras
Profundizar la validación pedagógica del montaje físico, incorporar las lecciones 3–11 y evaluar lectores de pantalla y dispositivos físicos; más adelante, editor y emulador.
