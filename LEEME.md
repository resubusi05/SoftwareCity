# Software City — JavaScript (CDU-1, 2, 3, 10 y 12)

Versión en JavaScript (JSX) según el SCS v0.1 (sección 2.6). Incluye el Incremento 1 (CDU-1, CDU-2 y CDU-3)
y la ciudad virtual del Incremento 2 (CDU-10 Diseñar ciudad virtual y CDU-12 Visitar ciudad de amigo),
armada a partir de los wireframes v0.1 (P-01 a P-22).

## 1. Instalar y correr
```
npm install
npm run dev
```
Abre el link que imprime Vite (normalmente http://localhost:5173).

Sin credenciales, la app funciona en **MODO LOCAL** (guarda en el navegador). Sirve para la demo.

## 2. Conectar Firebase
1. Consola de Firebase > tu proyecto > **Firestore Database** > Crear base de datos.
2. Configuración del proyecto > Tus apps > **App web** > copia `firebaseConfig`.
3. Pégalo en `src/firebase.js`. La barra superior cambiará de "MODO LOCAL" a "FIREBASE".
4. Firestore > Reglas: copia `firestore.rules` (solo para la demo, sin login).

## 3. Valores POR DEFINIR
| Qué | Dónde | Valor de relleno |
| --- | --- | --- |
| Recompensa máxima del reto | `src/config.js` → `PUNTOS_RETO` | 50 (se gana proporcional a los aciertos, RF-PRO-03) |
| Preguntas del reto | `src/config.js` → `PREGUNTAS_RETO` | 5 |
| Puntaje para desbloquear la ciudad (TK-08) | `src/config.js` → `PUNTAJE_CIUDAD` | 200 |
| Lotes: cuántos, tamaños y posición (TK-08) | `src/data/catalogoCiudad.js` → `LOTES` | 10 lotes L1–L10 |
| Edificios: nombres, tamaños y precios (TK-08) | `src/data/catalogoCiudad.js` → `EDIFICIOS` | 7 de ejemplo, de 80 a 250 pts |
| Regla de "cabe en el lote" | `src/data/catalogoCiudad.js` → `cabeEnLote()` | mismo tamaño |
| Amigos de prueba y sus ciudades | `src/data/amigosDemo.js` | A y B con ciudad, C sin ciudad |

## 4. Modelos 3D de Cinema 4D (SCS 2.4)
Mientras un edificio tenga `modelo: null` se dibuja una caja de su color. Para usar un modelo:
1. Exporta el edificio como `.glb`, comprímelo con `npx gltfjsx modelo.glb --transform` y revísalo con el glTF Validator.
2. Guárdalo en `public/modelos/` (por ejemplo `public/modelos/torre-requisitos.glb`).
3. En `EDIFICIOS` pon `modelo: "/modelos/torre-requisitos.glb"`.
La escena lo escala para que quepa en el lote. Si el archivo no existe o falla, vuelve a la caja.

## 5. Estructura de `src`
- `App.jsx`, `main.jsx`: arranque y navegación por estado.
- `config.js`, `firebase.js`: valores por definir y conexión a Firebase.
- `components/`: pantallas del Incremento 1 (`Inicio`, `TemaView`, `LeccionView`, `RetoView`, `EvaluacionView`, `Nav`, `ui`).
- `components/ciudad/`: CDU-10 (`CiudadView`, `EscenaCiudad`, `MenuEdificios`, `Tutorial`, `ControlesCamara`, `MiniCiudad`).
- `components/amigos/`: CDU-12 (`AmigosView`, `CiudadAmigoView`).
- `data/`: `contenido.js`, `catalogoCiudad.js`, `amigosDemo.js` y `repositorio.js` (contenido, alumnoRepo, ciudadRepo, amigosRepo y los dos Backend).

## 6. Datos que se guardan
```
alumnos/{alumnoId}                 { nombre, puntos, ciudadDesbloqueada, tutorialCiudadVisto }
alumnos/{alumnoId}/progresoLecciones/{leccionId}
alumnos/{alumnoId}/intentosEvaluacion/{autoId}
alumnos/{alumnoId}/retos/{AAAA-MM-DD}   { ..., aciertos, total, recompensa }
alumnos/{alumnoId}/ciudad/plano         { lotes: { L7: "torre-requisitos" }, ultimaOperacion, actualizado }
```
En modo local todo va en la clave `softwarecity:alumno-demo` de localStorage.

Comprar un edificio descuenta los puntos y guarda el edificio en una sola transacción (SCS 7.4). Cada compra o
movimiento lleva un `idOperacion`; si se reintenta después de una falla y el cambio sí se había guardado, no se cobra otra vez.

## 7. Para la presentación
- **🧪 Simular fallas** hace que las siguientes operaciones fallen (incluidas comprar y mover edificios: P-19).
  Apágalo y usa "Reintentar" para mostrar la recuperación.
- Para ver la ciudad sin jugar varios días: DevTools > Application > Local Storage > `softwarecity:alumno-demo` y sube `puntos` (por ejemplo a 340), luego recarga.
- Para empezar de cero: borra las claves `softwarecity:*`.
