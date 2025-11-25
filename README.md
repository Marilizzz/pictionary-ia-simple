"# pictionary-ia-simple" 
# Pictionary IA – Versión Simple (Proyecto Integrador)

![Banner del proyecto](https://via.placeholder.com/1200x400.png?text=Pictionary+IA+-+Dibuja+y+la+IA+completa+o+adivina)  
**Juego web estilo Pictionary con inteligencia artificial en tiempo real – 100% frontend**

Live Demo → https://tu-proyecto.vercel.app  
(Deploy en Vercel – siempre disponible)

## Descripción del proyecto

Aplicación web donde el usuario dibuja una palabra asignada aleatoriamente en dos modos distintos:

- **Modo Timed (30 segundos)** → La IA completa automáticamente el dibujo usando **Stable Diffusion Inpainting** (Replicate)
- **Modo Libre** → El usuario termina cuando quiera y la IA adivina qué dibujó usando **BLIP** (Hugging Face)

Todo el código está en una sola aplicación React + Vite – sin backend, sin base de datos, sin complicaciones.

## Características implementadas (MVP completo)

- Lienzo profesional con `react-konva`
- Más de 200 palabras en español
- Temporizador preciso (setTimeout + useEffect)
- Captura automática del canvas como base64
- Integración directa con dos modelos de IA reales
- Interfaz limpia y responsive
- Botón “Jugar de nuevo” y “Limpiar lienzo”

## Tecnologías utilizadas

| Tecnología            | Uso                                                  |
|-----------------------|------------------------------------------------------|
| React 18 + Vite       | Estructura y rendimiento                             |
| react-konva + konva   | Lienzo de dibujo profesional (soporta touch)         |
| Replicate API         | Stable Diffusion Inpainting (completado de dibujos)  |
| Hugging Face Inference| BLIP – reconocimiento de dibujos hechos a mano       |

## Lógica del proyecto (razonamiento técnico)

1. **Por qué todo en frontend**  
   → El objetivo era tener el MVP funcional lo más rápido posible y que cualquier profesor o compañero pudiera probarlo con un simple `npm run dev`. Al evitar backend se elimina configuración de servidor, CORS complejos y problemas de hosting.

2. **Elección de react-konva**  
   → HTML5 Canvas puro funciona, pero `react-konva` permite manejar líneas como componentes, redibujar solo lo necesario y exportar fácilmente a base64 con `stageRef.current.toDataURL()`.

3. **Polling manual a Replicate**  
   → Replicate no tiene webhooks gratuitos. La solución más simple y efectiva es hacer polling cada segundo hasta que `status === "succeeded"`.

4. **Uso de BLIP en lugar de CLIP**  
   → BLIP genera descripciones completas (“a drawing of a cat”) y es más preciso con dibujos infantiles que los modelos CLIP tradicionales.

## Problemas encontrados y soluciones aplicadas

| Problema                                   | Causa                                         | Solución implementada                                      |
|--------------------------------------------|-----------------------------------------------|-------------------------------------------------------------|
| CORS al llamar directamente a Replicate/HF| Navegador bloquea peticiones                 | (En esta versión simple) se usan tokens en frontend. En producción se recomienda backend proxy |
| Latencia alta al completar dibujo          | Stable Diffusion necesita ~6-12 segundos     | Se muestra mensaje “La IA está trabajando…” + spinner       |
| El modelo no entendía algunos dibujos     | Dibujos muy abstractos o poco detallados      | Se eligen solo palabras fáciles y se acepta que la IA falle (forma parte de la gracia) |
| Canvas no respondía bien en móviles        | Eventos de ratón en lugar de touch            | `react-konva` ya maneja touch events nativamente            |
| Tokens de API visibles en el código        | No hay backend                                | Documentado como “pendiente para versión 2”                 |

## Posibles mejoras futuras (ya pensadas)

| Mejora                                | Motivo                                                  | Estado actual |
|---------------------------------------|---------------------------------------------------------|--------------|
| Backend proxy (Node.js/Express)       | Ocultar tokens y evitar límite de 10MB en frontend      | Versión 2 lista |
| Colores y grosor de lápiz             | Experiencia de dibujo más rica                          | Versión 2 lista |
| Sistema de puntuación                 | Gamificación                                            | Fácil de añadir |
| Multijugador en tiempo real           | Jugar con amigos                                        | Requiere WebSocket |
| Guardar mejores dibujos en galería    | Portafolio de partidas                                  | LocalStorage o Firebase |
| Modelos de IA más potentes/locales    | Mejor precisión y menor costo                           | Investigando |

## Cómo ejecutar el proyecto

```bash
git clone https://github.com/Marilizzz/pictionary-ia-simple.git
cd pictionary-ia-simple
npm install