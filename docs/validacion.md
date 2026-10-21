# Validación del MVP

Fecha: 20 de octubre de 2026. Entorno Linux en la nube con Node.js 24.19.0, npm 11.9.0 y Chromium instalado en el sistema.

## Comandos y resultados

| Comando | Resultado |
| --- | --- |
| `npm run check` | TypeScript sin errores. |
| `npm test` | 3 archivos, 10 pruebas aprobadas; ninguna omitida. |
| `npm run build` | Build de producción correcta; permanece el aviso de Vite sobre el tamaño de la escena 3D. |
| `npm run test:browser` | Recorrido completo aprobado con el servidor Vite de desarrollo activo. |
| `BASE_URL=http://127.0.0.1:4173/ npm run test:browser` | Recorrido completo aprobado sobre la build servida por Vite preview. |

Las pruebas unitarias comprueban la corriente estimada y el ejemplo C++, alternancia HIGH/LOW, tiempos independientes, arranque idempotente, detener/reiniciar, restablecer, cambios de tiempos sin temporizadores duplicados, limpieza y límites de parámetros. También comprueban los requisitos de actividad de ambas lecciones y la normalización del progreso guardado.

El recorrido de Chromium prueba las cinco selecciones ancladas en 3D y su alternativa de teclado; navegación por pestañas y foco visible; bloqueo del reto sin actividad; respuesta y finalización de cada lección; persistencia de progreso y controles; tiempos 100/2000 ms; las tres resistencias con corrientes estimadas 13.64/3.00/0.30 mA; detener, restablecer y cambiar de lección; almacenamiento corrupto y bloqueo de escritura; y controles en 390 × 844 sin desbordamiento horizontal. No se observaron errores de ejecución ni errores de consola en la página principal. Se inspeccionaron las capturas de escritorio y móvil.

Las capturas reproducibles se generan en `artifacts/browser/placa-escritorio.png`, `placa-movil.png` y `led-movil.png`. No se versionan las capturas ni las salidas de build.

## Rendimiento y límites

- El JavaScript principal de producción es de aproximadamente 249 kB (79 kB gzip), frente al bundle inicial de aproximadamente 1170 kB (328 kB gzip). La escena se descarga en un chunk separado de aproximadamente 927 kB (251 kB gzip). La separación reduce el peso de la interfaz inicial; no demuestra menor descarga total.
- La escena renderiza bajo demanda, limita el DPR a 1.65 y ajusta el encuadre a la relación de aspecto. No se midieron FPS ni se realizó una auditoría Lighthouse.
- Chromium se ejecutó sin ventana con WebGL por software. No se probaron Safari, Firefox, lectores de pantalla ni teléfonos físicos. La comprobación de teclado y etiquetas es básica; no constituye una certificación de accesibilidad.
- La continuidad del circuito se representa mediante terminales separados y cables D13 → resistencia → ánodo, con retorno desde el cátodo a GND. La protoboard y la placa están simplificadas; el modelo no permite deducir las filas conductoras ni sustituye instrucciones de montaje físico verificadas.
- Los temporizadores del navegador pueden retrasarse en segundo plano. Los estados visuales, el brillo y la corriente son didácticos, sin compilación C++, emulación AVR ni hardware.
- Las lecciones 3–11 continúan como próximas. El progreso es local al navegador, sin cuentas ni respaldo remoto.

## Mejora visual e inspección — 21 de octubre de 2026

Se sustituyó la placa esquemática por un modelo procedural propio: carcasa USB, zócalos con cavidades, microcontrolador con terminales, condensadores, cristal, componentes de superficie y serigrafía original. Se añadieron cables tubulares y más detalle en la protoboard. No se reutilizaron modelos, texturas ni bundles de la referencia.

El recorrido de navegador incluye información de LED/resistencia, hover y foco sobre el rótulo del microcontrolador, hover mediante raycasting sobre su geometría real, cierre con Escape y verificación de que el hover no registra actividad. Se conserva la selección explícita para el reto. Se inspeccionaron las capturas de la placa en escritorio y móvil. La representación continúa simplificada; no se afirma equivalencia visual ni exactitud mecánica con la referencia.
