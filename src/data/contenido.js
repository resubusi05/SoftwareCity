
// CONTENIDO DE PRUEBA del Sprint 1 (Plan de iteración: "Preparar contenido de prueba del tema").
// Para agregar temas, lecciones o preguntas, edita este arreglo.

export const TEMAS = [
  {
    id: "fundamentos",
    nombre: "Fundamentos de la Ingeniería de Software",
    descripcion: "Qué es la ingeniería de software, por qué existe y cuáles son las actividades del proceso de software.",
    icono: "🏗️",
    color: "#00d4ff",
    disponible: true,
    lecciones: [
      {
        id: "fundamentos-1",
        temaId: "fundamentos",
        titulo: "¿Qué es la ingeniería de software?",
        resumen: "Definición, diferencia entre programa y software, y por qué hace falta una disciplina.",
        secciones: [
          {
            titulo: "Definición",
            parrafos: [
              "La ingeniería de software es la aplicación de un enfoque sistemático, disciplinado y medible al desarrollo, la operación y el mantenimiento del software.",
              "No se trata solo de programar: incluye entender el problema, planear el trabajo, diseñar la solución, probarla y mantenerla a lo largo del tiempo.",
            ],
          },
          {
            titulo: "Programa vs. software",
            parrafos: [
              "Un programa es un conjunto de instrucciones que una computadora ejecuta.",
              "El software es más que eso: incluye el programa, su documentación, los datos de configuración y los procedimientos necesarios para instalarlo, usarlo y mantenerlo.",
            ],
          },
          {
            titulo: "¿Por qué hace falta una disciplina?",
            parrafos: [
              "A finales de los años sesenta se habló de la \"crisis del software\": los proyectos se entregaban tarde, costaban más de lo previsto y fallaban con frecuencia.",
              "El término \"ingeniería de software\" se popularizó en la conferencia de la OTAN de 1968, precisamente para proponer que el software se construyera con métodos de ingeniería.",
            ],
          },
        ],
      },
      {
        id: "fundamentos-2",
        temaId: "fundamentos",
        titulo: "Actividades del proceso de software",
        resumen: "Las cuatro actividades que aparecen en cualquier proceso de desarrollo.",
        secciones: [
          {
            titulo: "Especificación",
            parrafos: [
              "Se define qué debe hacer el software y bajo qué restricciones debe operar.",
              "El resultado suele ser una especificación de requerimientos acordada con el cliente.",
            ],
          },
          {
            titulo: "Diseño e implementación",
            parrafos: [
              "El diseño define la estructura del software: sus componentes, interfaces y datos.",
              "La implementación convierte ese diseño en código ejecutable.",
            ],
          },
          {
            titulo: "Validación y evolución",
            parrafos: [
              "La validación comprueba que el software cumple su especificación y que satisface lo que el cliente realmente necesita.",
              "La evolución es el cambio continuo del software para adaptarse a nuevas necesidades, corregir defectos o mejorar su calidad.",
            ],
          },
        ],
      },
    ],
    evaluacion: [
      { id: "fe1", texto: "¿Cuál es la mejor descripción de la ingeniería de software?", opciones: ["Escribir código lo más rápido posible", "Aplicar un enfoque sistemático, disciplinado y medible al desarrollo, operación y mantenimiento del software", "Instalar y configurar computadoras", "Diseñar únicamente interfaces gráficas"], correcta: 1, explicacion: "Es la definición clásica de la disciplina." },
      { id: "fe2", texto: "Además del programa, ¿qué incluye el software?", opciones: ["Solo el código fuente", "Documentación, datos de configuración y procedimientos", "Únicamente el hardware", "Solo el archivo ejecutable"], correcta: 1, explicacion: "El software incluye todo lo necesario para instalarlo, usarlo y mantenerlo." },
      { id: "fe3", texto: "¿En qué evento se popularizó el término \"ingeniería de software\"?", opciones: ["Conferencia de la OTAN de 1968", "Publicación del Manifiesto Ágil en 2001", "Creación de Internet en 1990", "Lanzamiento del primer smartphone"], correcta: 0, explicacion: "La conferencia de la OTAN de 1968 propuso tratar el software con métodos de ingeniería." },
      { id: "fe4", texto: "¿Qué actividad del proceso define qué debe hacer el software y sus restricciones?", opciones: ["Evolución", "Implementación", "Especificación", "Validación"], correcta: 2, explicacion: "La especificación establece los requerimientos y restricciones." },
      { id: "fe5", texto: "¿Qué actividad comprueba que el software satisface lo que el cliente necesita?", opciones: ["Validación", "Diseño", "Especificación", "Instalación"], correcta: 0, explicacion: "Validar es confirmar que se construyó lo correcto para el cliente." },
    ],
    reto: [
      { id: "fr1", texto: "La \"crisis del software\" se refiere a proyectos que...", opciones: ["Se entregaban tarde, costaban más y fallaban", "Usaban demasiada memoria RAM", "No tenían interfaz gráfica", "Estaban escritos en ensamblador"], correcta: 0, explicacion: "Retrasos, sobrecostos y fallas motivaron la disciplina." },
      { id: "fr2", texto: "¿Cuál NO es una actividad fundamental del proceso de software?", opciones: ["Especificación", "Validación", "Evolución", "Publicidad"], correcta: 3, explicacion: "Las actividades son especificación, diseño e implementación, validación y evolución." },
      { id: "fr3", texto: "Convertir el diseño en código ejecutable es parte de...", opciones: ["La especificación", "La implementación", "La evolución", "La validación"], correcta: 1, explicacion: "La implementación produce el código a partir del diseño." },
      { id: "fr4", texto: "Cambiar el software para adaptarlo a nuevas necesidades es...", opciones: ["Evolución", "Especificación", "Diseño", "Compilación"], correcta: 0, explicacion: "La evolución mantiene útil al software con el tiempo." },
      { id: "fr5", texto: "¿Qué define el diseño de software?", opciones: ["El precio del producto", "La estructura: componentes, interfaces y datos", "El nombre de la empresa", "Los colores del logotipo"], correcta: 1, explicacion: "El diseño describe cómo está organizado el software." },
    ],
  },
  {
    id: "ciclos",
    nombre: "Modelos de ciclo de vida",
    descripcion: "Cómo se organizan las actividades del desarrollo: cascada, desarrollo incremental y Scrum.",
    icono: "🔄",
    color: "#7c3aed",
    disponible: true,
    lecciones: [
      {
        id: "ciclos-1",
        temaId: "ciclos",
        titulo: "Modelo en cascada",
        resumen: "Fases secuenciales, ventajas y desventajas.",
        secciones: [
          {
            titulo: "Fases en secuencia",
            parrafos: [
              "En el modelo en cascada, las fases se realizan una después de otra: requerimientos, diseño, implementación, pruebas, y operación y mantenimiento.",
              "Cada fase produce documentos que sirven de entrada a la siguiente.",
            ],
          },
          {
            titulo: "Ventajas",
            parrafos: [
              "Es fácil de entender y de administrar, y deja documentación clara de cada fase.",
              "Funciona bien cuando los requerimientos están claros y es poco probable que cambien.",
            ],
          },
          {
            titulo: "Desventajas",
            parrafos: [
              "Los cambios tardíos son costosos, porque obligan a regresar a fases ya terminadas.",
              "El cliente no ve software funcionando hasta muy avanzado el proyecto.",
            ],
          },
        ],
      },
      {
        id: "ciclos-2",
        temaId: "ciclos",
        titulo: "Desarrollo incremental y Scrum",
        resumen: "Entregar por partes, el Manifiesto Ágil y los elementos de Scrum.",
        secciones: [
          {
            titulo: "Desarrollo incremental",
            parrafos: [
              "El sistema se construye en incrementos: cada uno agrega funcionalidad a lo ya entregado.",
              "El cliente puede usar y opinar sobre el producto desde etapas tempranas, lo que reduce el riesgo de construir algo que no sirve.",
            ],
          },
          {
            titulo: "El Manifiesto Ágil",
            parrafos: [
              "Publicado en 2001, valora a los individuos e interacciones sobre procesos y herramientas, el software funcionando sobre la documentación extensa, la colaboración con el cliente sobre la negociación de contratos, y la respuesta al cambio sobre seguir un plan.",
            ],
          },
          {
            titulo: "Scrum",
            parrafos: [
              "Scrum organiza el trabajo en Sprints: periodos cortos al final de los cuales se entrega un incremento.",
              "Sus roles son Product Owner, Scrum Master y Developers. Sus eventos son Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective. Sus artefactos son el Product Backlog, el Sprint Backlog y el Incremento.",
            ],
          },
        ],
      },
    ],
    evaluacion: [
      { id: "ce1", texto: "En el modelo en cascada, las fases se realizan...", opciones: ["Todas al mismo tiempo", "Una después de otra", "En orden aleatorio", "Solo al final del proyecto"], correcta: 1, explicacion: "La cascada es secuencial." },
      { id: "ce2", texto: "¿Cuándo es más adecuado el modelo en cascada?", opciones: ["Cuando los requerimientos cambian cada semana", "Cuando los requerimientos están claros y estables", "Cuando no hay cliente", "Cuando no se documenta nada"], correcta: 1, explicacion: "Con requerimientos estables se aprovecha su orden y documentación." },
      { id: "ce3", texto: "Una ventaja del desarrollo incremental es que...", opciones: ["El cliente ve y usa partes del producto desde temprano", "No requiere pruebas", "Elimina la necesidad de diseñar", "Se entrega todo en una sola versión"], correcta: 0, explicacion: "Cada incremento permite retroalimentación temprana." },
      { id: "ce4", texto: "¿Cuál de estos es un rol de Scrum?", opciones: ["Analista de costos", "Product Owner", "Director general", "Tester externo"], correcta: 1, explicacion: "Los roles son Product Owner, Scrum Master y Developers." },
      { id: "ce5", texto: "¿Qué artefacto de Scrum contiene el trabajo seleccionado para el Sprint?", opciones: ["Product Backlog", "Sprint Backlog", "Manual de usuario", "Diagrama de Gantt"], correcta: 1, explicacion: "El Sprint Backlog es el trabajo planeado para el Sprint." },
    ],
    reto: [
      { id: "cr1", texto: "¿Qué valora el Manifiesto Ágil por encima de la documentación extensa?", opciones: ["Los contratos", "El software funcionando", "Las herramientas", "Seguir el plan"], correcta: 1, explicacion: "Software funcionando sobre documentación extensa." },
      { id: "cr2", texto: "¿En qué año se publicó el Manifiesto Ágil?", opciones: ["1968", "1985", "2001", "2015"], correcta: 2, explicacion: "Se publicó en 2001." },
      { id: "cr3", texto: "¿Qué evento de Scrum sirve para mejorar la forma de trabajar del equipo?", opciones: ["Sprint Retrospective", "Daily Scrum", "Sprint Planning", "Sprint Review"], correcta: 0, explicacion: "La retrospectiva analiza cómo mejorar el proceso." },
      { id: "cr4", texto: "Una desventaja del modelo en cascada es que...", opciones: ["No tiene fases", "Los cambios tardíos son costosos", "No produce documentación", "Entrega software cada semana"], correcta: 1, explicacion: "Regresar a fases terminadas cuesta caro." },
      { id: "cr5", texto: "Al final de cada Sprint se entrega...", opciones: ["Un incremento", "Solo un reporte", "El manual técnico", "Nada, se entrega al final del proyecto"], correcta: 0, explicacion: "Cada Sprint produce un incremento del producto." },
    ],
  },
  {
    id: "requisitos",
    nombre: "Requisitos de software",
    descripcion: "Requisitos funcionales y no funcionales, y cómo describir la interacción con casos de uso.",
    icono: "📋",
    color: "#00ff88",
    disponible: true,
    lecciones: [
      {
        id: "requisitos-1",
        temaId: "requisitos",
        titulo: "Funcionales y no funcionales",
        resumen: "Qué hace el sistema vs. qué tan bien lo hace, y cómo escribir buenos requisitos.",
        secciones: [
          {
            titulo: "Requisitos funcionales",
            parrafos: [
              "Describen lo que el sistema debe hacer: los servicios que ofrece y cómo responde a ciertas entradas.",
              "Ejemplo: \"El sistema debe mostrar al alumno la lista de temas disponibles\".",
            ],
          },
          {
            titulo: "Requisitos no funcionales",
            parrafos: [
              "Describen propiedades o restricciones del sistema, como desempeño, usabilidad, seguridad o compatibilidad.",
              "Ejemplo: \"El contenido de una lección se muestra en 3 segundos o menos\".",
            ],
          },
          {
            titulo: "Buenos requisitos",
            parrafos: [
              "Un buen requisito tiene un identificador único, no es ambiguo y se puede verificar con una prueba.",
              "Palabras como \"rápido\", \"fácil\" o \"amigable\" no se pueden probar; hay que expresarlas con números o condiciones concretas.",
            ],
          },
        ],
      },
      {
        id: "requisitos-2",
        temaId: "requisitos",
        titulo: "Casos de uso",
        resumen: "Actores, flujos y relaciones entre casos de uso.",
        secciones: [
          {
            titulo: "Actores y casos de uso",
            parrafos: [
              "Un actor es quien interactúa con el sistema: una persona, otro sistema o un dispositivo.",
              "Un caso de uso describe una secuencia de interacciones que produce un resultado de valor para el actor.",
            ],
          },
          {
            titulo: "Flujos",
            parrafos: [
              "El flujo normal describe el camino esperado. Los flujos alternativos describen variantes válidas, y las excepciones describen qué pasa cuando algo falla.",
              "Las precondiciones indican lo que debe cumplirse antes de empezar y las poscondiciones lo que queda al terminar.",
            ],
          },
          {
            titulo: "Include y extend",
            parrafos: [
              "Con <<include>>, un caso de uso siempre incorpora el comportamiento de otro.",
              "Con <<extend>>, un caso de uso agrega comportamiento a otro solo bajo ciertas condiciones.",
            ],
          },
        ],
      },
    ],
    evaluacion: [
      { id: "re1", texto: "\"El sistema debe registrar el intento de evaluación\" es un requisito...", opciones: ["Funcional", "No funcional", "De hardware", "Legal"], correcta: 0, explicacion: "Describe algo que el sistema hace." },
      { id: "re2", texto: "¿Cuál es un requisito no funcional?", opciones: ["El sistema debe mostrar la lista de temas", "La lección se muestra en 3 segundos o menos", "El alumno puede enviar la evaluación", "El sistema registra la recompensa"], correcta: 1, explicacion: "Es una propiedad de desempeño." },
      { id: "re3", texto: "¿Qué característica debe tener un buen requisito?", opciones: ["Ser verificable", "Ser lo más largo posible", "Usar la palabra \"amigable\"", "No tener identificador"], correcta: 0, explicacion: "Debe poder comprobarse con una prueba." },
      { id: "re4", texto: "En un caso de uso, ¿qué describe el flujo normal?", opciones: ["Los errores del sistema", "El camino esperado de la interacción", "El costo del proyecto", "La base de datos"], correcta: 1, explicacion: "Es el camino principal, sin variantes." },
      { id: "re5", texto: "La relación <<extend>> indica que un caso de uso...", opciones: ["Siempre incluye a otro", "Agrega comportamiento a otro solo bajo ciertas condiciones", "Reemplaza a otro", "No tiene actor"], correcta: 1, explicacion: "Extend es condicional; include es obligatorio." },
    ],
    reto: [
      { id: "rr1", texto: "¿Quién puede ser un actor?", opciones: ["Solo una persona", "Una persona, otro sistema o un dispositivo", "Solo el programador", "Solo la base de datos"], correcta: 1, explicacion: "Un actor es cualquier entidad externa que interactúa con el sistema." },
      { id: "rr2", texto: "¿Qué indica una precondición?", opciones: ["Lo que queda al terminar", "Lo que debe cumplirse antes de empezar", "El nombre del actor", "El error más común"], correcta: 1, explicacion: "Se verifica antes de iniciar el caso de uso." },
      { id: "rr3", texto: "\"El sistema debe ser fácil de usar\" es un requisito mal escrito porque...", opciones: ["Es demasiado corto", "No se puede verificar", "Es funcional", "No tiene actor"], correcta: 1, explicacion: "\"Fácil\" es ambiguo; no se puede probar." },
      { id: "rr4", texto: "Con <<include>>, el caso de uso base...", opciones: ["Nunca ejecuta al incluido", "Siempre incorpora el comportamiento del incluido", "Lo ejecuta solo si hay error", "Lo reemplaza"], correcta: 1, explicacion: "Include es siempre." },
      { id: "rr5", texto: "¿Qué describe una excepción en un caso de uso?", opciones: ["Qué pasa cuando algo falla", "El flujo principal", "El diseño de la pantalla", "El costo del sistema"], correcta: 0, explicacion: "Las excepciones describen el manejo de fallas." },
    ],
  },
  {
    // Tema no disponible: sirve para comprobar RF-NAV-01 (no debe listarse).
    id: "pruebas",
    nombre: "Pruebas de software",
    descripcion: "Próximamente.",
    icono: "🧪",
    color: "#f59e0b",
    disponible: false,
    lecciones: [],
    evaluacion: [],
    reto: [],
  },
];
