# Software City — JavaScript (CDU-1, 2, 3, 10 y 12)

> **Versión Aero 7 (copia de SoftwareCity_Firebase_FrutigerAero).** Se quitó el fondo 3D de la cascada (`FondoCascada.jsx`) y se rehízo el aspecto
> visual al estilo Frutiger Aero de Windows Vista/7: ventanas de vidrio con barra de título (`VentanaAero` en `components/ui.jsx`), barra superior
> tipo reproductor de Windows Media, botones de gel, orbes de colores como avatares y burbujas flotando (`Burbujas` en `App.jsx`).
> Casi todo el estilo vive en `src/index.css`. La ciudad 3D (three.js) se conserva igual.
> Como la carpeta no trae `node_modules`, primero corre `npm install`.

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
Siempre se pide iniciar sesión: con Firebase es con Google; en modo local basta tu nombre (el mismo nombre recupera tu progreso).

## 2. Conectar Firebase (con inicio de sesión de Google)
1. Consola de Firebase > tu proyecto > **Firestore Database** > Crear base de datos.
2. **Authentication** > Comenzar > Método de acceso > activa **Google**. En Settings > Authorized domains debe estar `localhost` (y el dominio donde publiques).
3. Configuración del proyecto > Tus apps > **App web** > copia `firebaseConfig`.
4. Copia `.env.example` como `.env` y llena los 6 valores `VITE_FIREBASE_*` (no subas `.env` a GitHub). Reinicia `npm run dev`.
   La barra superior cambiará de "MODO LOCAL" a "FIREBASE".
5. Firestore > Reglas: copia `firestore.rules` y publícalas. Cada alumno solo lee y escribe `alumnos/{su uid}/...`.

## 3. Valores POR DEFINIR
| Qué | Dónde | Valor de relleno |
| --- | --- | --- |
| Recompensa máxima del reto | `src/config.js` → `PUNTOS_RETO` | 50 (se gana proporcional a los aciertos, RF-PRO-03) |
| Preguntas del reto | `src/config.js` → `PREGUNTAS_RETO` | 5 |
| Puntos por completar una lección (primera vez) | `src/config.js` → `PUNTOS_LECCION` | 140 |
| Puntaje para desbloquear la ciudad (TK-08) | `src/config.js` → `PUNTAJE_CIUDAD` | 200 |
| Lotes: cuántos, tamaños y posición (TK-08) | `src/data/catalogoCiudad.js` → `LOTES` | 10 lotes L1–L10 |
| Edificios: nombres, tamaños y precios (TK-08) | `src/data/catalogoCiudad.js` → `EDIFICIOS` | 7 de ejemplo, de 80 a 250 pts |
| Regla de "cabe en el lote" | `src/data/catalogoCiudad.js` → `cabeEnLote()` | mismo tamaño |
| Amigos de prueba y sus ciudades (siguen siendo de prueba: aún no hay "agregar amigo por código") | `src/data/amigosDemo.js` | A y B con ciudad, C sin ciudad |

## 4. Modelos 3D de Cinema 4D (SCS 2.4)
Mientras un edificio tenga `modelo: null` se dibuja una caja de su color. Para usar un modelo:
1. Exporta el edificio como `.glb`, comprímelo con `npx gltfjsx modelo.glb --transform` y revísalo con el glTF Validator.
2. Guárdalo en `public/modelos/` (por ejemplo `public/modelos/torre-requisitos.glb`).
3. En `EDIFICIOS` pon `modelo: "/modelos/torre-requisitos.glb"`.
La escena lo escala para que quepa en el lote. Si el archivo no existe o falla, vuelve a la caja.

## 5. Estructura de `src`
- `App.jsx`, `main.jsx`: arranque y navegación por estado.
- `config.js`, `firebase.js`: valores por definir y conexión a Firebase (Firestore y Auth).
- `components/`: pantallas del Incremento 1 (`LoginView`, `Inicio`, `TemaView`, `LeccionView`, `RetoView`, `EvaluacionView`, `Nav`, `ui`).
- `components/ciudad/`: CDU-10 (`CiudadView`, `EscenaCiudad`, `MenuEdificios`, `Tutorial`, `ControlesCamara`, `MiniCiudad`).
- `components/amigos/`: CDU-12 (`AmigosView`, `CiudadAmigoView`).
- `data/temas/`: lecciones 3 a 20 de cada tema (`fundamentos.js`, `ciclos.js`, `requisitos.js`; las lecciones 1 y 2 siguen en `contenido.js`) y `ayudas.js` (funciones `sec`, `lec`, `op`, `co`, `vf`, `ord`, `rel` para escribir lecciones con actividades).
- `components/ActividadSeccion.jsx`: actividad de práctica al final de cada sección (opción múltiple, completar, verdadero/falso, ordenar, relacionar). No bloquea ni da puntos.
- `data/`: `contenido.js`, `catalogoCiudad.js`, `amigosDemo.js` y `repositorio.js` (contenido, alumnoRepo, ciudadRepo, amigosRepo y los dos Backend).

## 6. Datos que se guardan
```
alumnos/{uid}                 { nombre, puntos, ciudadDesbloqueada, tutorialCiudadVisto }
alumnos/{uid}/progresoLecciones/{leccionId}
alumnos/{uid}/intentosEvaluacion/{autoId}
alumnos/{uid}/retos/{AAAA-MM-DD}   { ..., aciertos, total, recompensa }
alumnos/{uid}/ciudad/plano         { lotes: { L7: "torre-requisitos" }, ultimaOperacion, actualizado }
```
En modo local todo va en la clave `softwarecity:local-<nombre>` de localStorage (la sesión local en `softwarecity:sesion`). `{uid}` es el id de la cuenta de Google.

Comprar un edificio descuenta los puntos y guarda el edificio en una sola transacción (SCS 7.4). Cada compra o
movimiento lleva un `idOperacion`; si se reintenta después de una falla y el cambio sí se había guardado, no se cobra otra vez.

## 7. Para la presentación
- **🧪 Simular fallas** hace que las siguientes operaciones fallen (incluidas comprar y mover edificios: P-19).
  Apágalo y usa "Reintentar" para mostrar la recuperación.
- Para ver la ciudad sin jugar varios días: DevTools > Application > Local Storage > `softwarecity:local-<tu nombre>` y sube `puntos` (por ejemplo a 340), luego recarga.
- Para empezar de cero: borra las claves `softwarecity:*`.

## 8. Agregar o editar lecciones
Cada sección de una lección es `sec("Título", ["párrafo", ...], actividad)`. La actividad es opcional y puede ser:
`op(pregunta, opciones, indiceCorrecto, explicacion)` · `co(frase con ___, opciones, indiceCorrecto, explicacion)` · `vf(afirmacion, verdadero, explicacion)` ·
`ord(enunciado, pasosEnOrdenCorrecto, explicacion)` · `rel(enunciado, [[izquierda, derecha], ...], explicacion)`.
En `rel` las respuestas de la derecha no deben repetirse. El contenido de prueba lo escribió Claude: el equipo debe revisarlo contra la bibliografía de la materia.
Cada tema tiene 20 lecciones, una evaluación de 12 preguntas y un banco del reto de 10 (cada día salen 5 distintas, en rotación).
