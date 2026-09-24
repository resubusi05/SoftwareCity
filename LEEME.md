# Software City — Sprint 1 (CDU-1, CDU-2, CDU-3)

## 1. Instalar
1. Reemplaza tu carpeta `src/` por la de este paquete.
2. Borra los componentes viejos que ya no se usan: `CityMap`, `TriviaGame`, `ProgressDashboard`,
   `SubjectDetail`, `PathView`, `TopBar`, `TriviaWheel`, `LessonView`, `ProgressView`.
3. Agrega Firebase: en `package.json`, dentro de `dependencies`, pon `"firebase": "^11.0.0"`
   (o ejecuta `pnpm add firebase`).

Sin credenciales, la app funciona en **MODO LOCAL** (guarda en el navegador). Sirve para la demo.

## 2. Conectar Firebase
1. Consola de Firebase > tu proyecto > **Firestore Database** > Crear base de datos.
2. Configuración del proyecto > Tus apps > **App web** > copia `firebaseConfig`.
3. Pégalo en `src/firebase.ts`. La barra superior cambiará de "MODO LOCAL" a "FIREBASE".
4. Firestore > Reglas (solo para la demo, sin login):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /alumnos/alumno-demo/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 3. Datos por definir (SRS)
En `src/config.ts`: `PUNTOS_RETO` (50) y `PREGUNTAS_RETO` (5).
El contenido de prueba (temas, lecciones y preguntas) está en `src/data/contenido.ts`.

## 4. Para la presentación
El botón **🧪 Simular fallas** hace que las siguientes operaciones fallen, para mostrar las
excepciones de los casos de uso (error al cargar, al guardar, al registrar la recompensa, etc.).
Apágalo y usa "Reintentar" para mostrar la recuperación.

Para empezar de cero en modo local: DevTools > Application > Local Storage > borra las claves `softwarecity:*`.
