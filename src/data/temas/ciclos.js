// TEMA «Modelos de ciclo de vida» — lecciones 3 a 20 (las lecciones 1 y 2 siguen en contenido.js).
// CONTENIDO DE PRUEBA escrito con conocimiento estándar (Sommerville, Guía de Scrum 2020, Manifiesto Ágil, RUP, XP, Kanban).
// El equipo debe revisarlo contra la bibliografía de la materia antes de darlo por oficial.

import { co, lec, op, ord, rel, sec, vf } from "./ayudas";

const T = "ciclos";

export const leccionesCiclos = [
  lec(T, 3, "Procesos y modelos genéricos", "Los tres grandes enfoques de proceso y por qué se combinan.", [
    sec("Una forma de organizar el trabajo", [
      "Un modelo de ciclo de vida describe cómo se organizan las actividades del desarrollo en el tiempo: qué se hace primero, qué después y cuántas veces se repite.",
      "Sommerville presenta tres modelos genéricos: cascada, desarrollo incremental e integración y configuración (reutilización). No son excluyentes: los proyectos reales los mezclan.",
    ], vf("Los proyectos reales casi siempre usan un modelo «puro», sin mezclar ideas de otros.", false,
      "Falso: en la práctica los modelos se combinan según las necesidades del proyecto.")),
    sec("Los tres modelos genéricos", [
      "Cascada: las actividades se ven como fases separadas y secuenciales. Incremental: especificación, desarrollo y validación se entrelazan y el sistema crece por versiones.",
      "Integración y configuración: el sistema se arma a partir de componentes o sistemas ya existentes que se configuran y adaptan.",
    ], rel("Relaciona el modelo con su idea central.", [
      ["Cascada", "Fases separadas una tras otra"],
      ["Incremental", "El sistema crece por versiones"],
      ["Integración y configuración", "Armar el sistema con componentes existentes"],
    ], "Cada modelo organiza las mismas actividades de manera distinta.")),
    sec("Dirigido por plan o ágil", [
      "En los procesos dirigidos por un plan todo se planifica por adelantado. En los ágiles la planificación es gradual y se ajusta al cambio.",
      "Un proyecto sensato suele ubicarse en algún punto intermedio, según qué tan estables sean los requisitos y qué tan crítico sea el sistema.",
    ], op("¿Qué condición favorece más un proceso dirigido por un plan?", ["Requisitos muy cambiantes", "Requisitos estables y un sistema crítico", "Cliente que no puede participar nunca", "Equipo sin experiencia"], 1,
      "Cuando los requisitos son estables y se necesita mucha documentación o control, el plan aporta valor.")),
  ]),

  lec(T, 4, "El modelo en cascada a detalle", "Las fases clásicas y lo que produce cada una.", [
    sec("Las fases", [
      "Sommerville describe cinco fases: análisis y definición de requisitos, diseño del sistema y del software, implementación y pruebas de unidades, integración y pruebas del sistema, y operación y mantenimiento.",
      "En principio una fase debe terminar antes de empezar la siguiente, y cada una produce documentos que se aprueban.",
    ], ord("Ordena las fases del modelo en cascada.", [
      "Análisis y definición de requisitos",
      "Diseño del sistema y del software",
      "Implementación y pruebas de unidades",
      "Integración y pruebas del sistema",
      "Operación y mantenimiento",
    ], "Cada fase alimenta a la siguiente en este orden.")),
    sec("Cuándo conviene", [
      "Es apropiado cuando los requisitos se conocen bien desde el inicio y es improbable que cambien, y cuando hace falta una planificación y una documentación muy controladas.",
      "Se usa, por ejemplo, en grandes sistemas de ingeniería donde se desarrollan partes en diferentes sitios y hay que coordinar mucho.",
    ], op("¿Cuándo conviene más la cascada?", ["Cuando los requisitos cambian cada semana", "Cuando los requisitos están claros y estables", "Cuando no hay documentación", "Cuando se quiere entregar sin probar"], 1,
      "Su orden y documentación rinden cuando los requisitos son estables.")),
    sec("El problema del cambio", [
      "Si algo cambia a mitad del proyecto, regresar a fases ya terminadas es caro porque hay que rehacer y volver a aprobar documentos.",
      "Además, el cliente suele ver el software funcionando hasta el final, cuando corregir lo que no esperaba ya cuesta mucho.",
    ], vf("En la cascada el cliente suele ver el sistema funcionando hasta etapas tardías.", true,
      "Es verdadero: ese retraso en la retroalimentación es una de sus desventajas.")),
  ]),

  lec(T, 5, "El modelo en V", "Cada fase de construcción tiene su nivel de pruebas.", [
    sec("La idea", [
      "El modelo en V es una variante de la cascada que subraya la relación entre las actividades de construcción y las de verificación y validación.",
      "Se dibuja con forma de V: del lado izquierdo se baja de los requisitos al código; del derecho se sube probando cada nivel.",
    ], vf("El modelo en V ignora las pruebas hasta el final.", false,
      "Falso: planea cada nivel de prueba desde la fase de construcción correspondiente.")),
    sec("Cada fase con su prueba", [
      "Los requisitos de usuario se comprueban con pruebas de aceptación; el diseño del sistema, con pruebas de sistema; el diseño de la arquitectura, con pruebas de integración; y el diseño detallado, con pruebas unitarias.",
      "Así, al escribir cada documento ya se piensa en cómo se comprobará.",
    ], rel("Relaciona cada nivel de prueba con lo que comprueba.", [
      ["Pruebas unitarias", "El diseño detallado de cada componente"],
      ["Pruebas de integración", "El diseño de la arquitectura"],
      ["Pruebas de sistema", "El diseño del sistema completo"],
      ["Pruebas de aceptación", "Los requisitos del usuario"],
    ], "La V empareja cada actividad de definición con una de comprobación.")),
    sec("Ventajas y límites", [
      "Ayuda a que las pruebas se planeen temprano y a que haya trazabilidad entre requisitos y pruebas.",
      "Comparte los límites de la cascada: es poco flexible ante cambios grandes y entrega el software funcionando tarde.",
    ], op("Una ventaja del modelo en V frente a la cascada simple es…", ["Elimina las pruebas", "Planea las pruebas desde la definición de cada fase", "Acepta cambios sin costo", "No necesita requisitos"], 1,
      "Relaciona desde el inicio cada fase con su nivel de prueba.")),
  ]),

  lec(T, 6, "Prototipado", "Construir algo pequeño para aprender antes de construir en serio.", [
    sec("Qué es un prototipo", [
      "Un prototipo es una versión inicial de un sistema que se usa para demostrar conceptos, probar opciones de diseño y entender mejor el problema.",
      "Puede ser tan sencillo como dibujos de pantallas en papel o tan completo como una aplicación parcial funcional.",
    ], co("Un ___ es una versión inicial que sirve para demostrar conceptos y entender mejor el problema.", ["manual", "prototipo", "contrato", "plan"], 1,
      "El prototipo permite explorar ideas antes de comprometerse con la construcción final.")),
    sec("Para qué sirve", [
      "En requisitos ayuda a que los usuarios vean lo que se propone y descubran lo que realmente necesitan. En diseño sirve para explorar soluciones y evaluar la interfaz.",
      "Muchas veces es más barato descubrir un malentendido con un prototipo que con el sistema terminado.",
    ], vf("Un prototipo puede ayudar a descubrir requisitos que el usuario no había mencionado.", true,
      "Es verdadero: al verlo y probarlo, los usuarios suelen detectar necesidades nuevas.")),
    sec("Desechable o evolutivo", [
      "Un prototipo desechable se tira después de aprender de él; no debe convertirse en el sistema final porque suele construirse rápido y sin cuidado.",
      "Uno evolutivo se va refinando hasta convertirse en el producto, por lo que debe construirse con calidad desde el principio.",
    ], rel("Relaciona el tipo de prototipo con su destino.", [
      ["Desechable", "Se descarta tras aprender de él"],
      ["Evolutivo", "Se refina hasta convertirse en el producto"],
    ], "La decisión debe tomarse desde el inicio para saber con qué calidad construirlo.")),
  ]),

  lec(T, 7, "Desarrollo incremental", "Entregar por partes y aprender de cada una.", [
    sec("La idea", [
      "En el desarrollo incremental se desarrolla una versión inicial, se muestra al usuario y se va evolucionando en varias versiones hasta tener el sistema deseado.",
      "La especificación, el desarrollo y la validación no son fases separadas: se entrelazan con retroalimentación constante.",
    ], co("En el desarrollo incremental el sistema se construye en varias ___.", ["versiones", "empresas", "reuniones sin objetivo", "bases de datos"], 0,
      "Cada versión agrega funcionalidad y recibe retroalimentación.")),
    sec("Beneficios", [
      "Reduce el costo de adaptarse a requisitos cambiantes, facilita obtener retroalimentación del cliente sobre lo ya construido y permite entregar valor útil de forma temprana.",
      "El cliente puede usar partes del sistema antes de que esté completo.",
    ], op("¿Cuál es un beneficio del desarrollo incremental?", ["Se entrega todo hasta el final", "El cliente da retroalimentación sobre partes ya construidas", "No requiere pruebas", "Elimina el diseño"], 1,
      "La retroalimentación temprana es uno de sus principales beneficios.")),
    sec("Problemas posibles", [
      "El proceso es menos visible: con versiones cortas no siempre se produce documentación para medir el avance.",
      "Con el tiempo la estructura del sistema tiende a degradarse si no se mejora el diseño; hay que dedicar esfuerzo a reorganizar el código.",
    ], vf("En el desarrollo incremental la estructura del sistema nunca se degrada.", false,
      "Falso: los cambios continuos pueden degradarla si no se refactoriza.")),
  ]),

  lec(T, 8, "El modelo en espiral", "Un proceso guiado por el análisis de riesgos.", [
    sec("Un ciclo que se repite", [
      "Propuesto por Barry Boehm, el modelo en espiral representa el proceso como una espiral: cada vuelta es una fase del desarrollo y no hay fases fijas como en la cascada.",
      "En cada vuelta el equipo revisa qué riesgos hay y decide cómo avanzar.",
    ], vf("El modelo en espiral tiene fases fijas e inamovibles como la cascada.", false,
      "Falso: sus vueltas se adaptan a lo que necesite el proyecto en cada momento.")),
    sec("Los cuatro sectores de cada vuelta", [
      "Cada vuelta tiene cuatro sectores: establecer objetivos, evaluar y reducir riesgos, desarrollar y validar, y planificar la siguiente vuelta.",
      "El análisis de riesgos es lo que distingue al modelo: se prototipa o se investiga lo que más podría fallar antes de comprometerse.",
    ], ord("Ordena los sectores de una vuelta de la espiral.", [
      "Establecer objetivos",
      "Evaluar y reducir riesgos",
      "Desarrollar y validar",
      "Planificar la siguiente vuelta",
    ], "Cada vuelta se cierra planificando la siguiente.")),
    sec("Cuándo se usa", [
      "Es útil en proyectos grandes y de alto riesgo, donde equivocarse cuesta mucho. En proyectos pequeños y sencillos puede ser excesivo por el esfuerzo de gestión que exige.",
      "Muchas ideas del espiral, como iterar y atender primero los riesgos, se encuentran hoy en otros enfoques.",
    ], op("¿Qué elemento distingue al modelo en espiral?", ["La ausencia de planeación", "El análisis explícito de riesgos en cada vuelta", "Entrega única al final", "La eliminación de pruebas"], 1,
      "El análisis de riesgos en cada vuelta es su rasgo central.")),
  ]),

  lec(T, 9, "El Proceso Unificado (RUP)", "Un proceso iterativo guiado por casos de uso.", [
    sec("Qué es", [
      "El Proceso Unificado de Rational (RUP) es un proceso de desarrollo iterativo e incremental, guiado por casos de uso y centrado en la arquitectura.",
      "Se apoya en UML para modelar el sistema y se adapta según el tamaño del proyecto.",
    ], co("RUP está guiado por ___ de uso y centrado en la arquitectura.", ["mapas", "casos", "libros", "contratos"], 1,
      "Los casos de uso orientan el desarrollo en RUP.")),
    sec("Las cuatro fases", [
      "Concepción: establecer el caso de negocio y el alcance. Elaboración: entender el dominio y construir la arquitectura. Construcción: desarrollar el sistema. Transición: pasarlo a los usuarios.",
      "Cada fase puede incluir varias iteraciones; no son lo mismo que las fases de la cascada.",
    ], ord("Ordena las fases de RUP.", ["Concepción", "Elaboración", "Construcción", "Transición"], "Concepción, elaboración, construcción y transición.")),
    sec("Fases y disciplinas", [
      "RUP también define disciplinas (como requisitos, análisis y diseño, implementación y pruebas) que se practican con distinta intensidad a lo largo de todas las fases.",
      "Por eso se dice que combina una vista en el tiempo (fases) con una vista de actividades (disciplinas).",
    ], vf("En RUP las pruebas solo se hacen en la fase final de Transición.", false,
      "Falso: las disciplinas, incluidas las pruebas, se practican a lo largo de varias fases.")),
  ]),

  lec(T, 10, "El Manifiesto Ágil", "Los cuatro valores que dieron origen al movimiento ágil.", [
    sec("Origen", [
      "En 2001 un grupo de profesionales publicó el Manifiesto para el Desarrollo Ágil de Software, como respuesta a procesos que consideraban demasiado pesados y burocráticos.",
      "No es una metodología sino un conjunto de valores y principios que orientan varias metodologías.",
    ], vf("El Manifiesto Ágil es una metodología con pasos obligatorios.", false,
      "Falso: son valores y principios; metodologías como Scrum o XP los aplican.")),
    sec("Los cuatro valores", [
      "Individuos e interacciones sobre procesos y herramientas. Software funcionando sobre documentación exhaustiva. Colaboración con el cliente sobre negociación contractual. Responder al cambio sobre seguir un plan.",
      "El manifiesto aclara que, aunque los elementos de la derecha tienen valor, se valoran más los de la izquierda.",
    ], rel("Relaciona lo que se valora más con lo que se valora menos.", [
      ["Individuos e interacciones", "Procesos y herramientas"],
      ["Software funcionando", "Documentación exhaustiva"],
      ["Colaboración con el cliente", "Negociación contractual"],
      ["Responder al cambio", "Seguir un plan"],
    ], "Se valora lo de la izquierda más que lo de la derecha, sin despreciar esto último.")),
    sec("Malentendidos frecuentes", [
      "«Ágil» no significa «sin documentación» ni «sin planeación»: significa documentar y planear lo necesario, y hacerlo de forma que se pueda ajustar.",
      "Tampoco significa ir más rápido a costa de la calidad: varias prácticas ágiles buscan justamente mantener alta la calidad técnica.",
    ], op("¿Qué significa realmente «ágil» según el manifiesto?", ["No documentar nada", "No planear", "Valorar más el software funcionando y la adaptación, sin despreciar la documentación", "Trabajar sin cliente"], 2,
      "Se prioriza lo que aporta valor y se acepta el cambio; no se prohíbe documentar ni planear.")),
  ]),

  lec(T, 11, "Los principios ágiles", "Doce ideas que bajan los valores a la práctica.", [
    sec("Entregar valor temprano", [
      "El manifiesto establece doce principios. El primero: la mayor prioridad es satisfacer al cliente mediante la entrega temprana y continua de software con valor.",
      "Otro pide entregar software funcionando con frecuencia, desde un par de semanas hasta un par de meses, con preferencia por los plazos cortos.",
    ], op("¿Cuál es la mayor prioridad según los principios ágiles?", ["Cumplir el contrato", "Satisfacer al cliente con entregas tempranas y continuas de software valioso", "Producir mucha documentación", "Reducir el equipo"], 1,
      "Ese es el primer principio del manifiesto.")),
    sec("Personas y cambio", [
      "Los requisitos cambiantes se aceptan incluso en etapas tardías: los procesos ágiles aprovechan el cambio como ventaja competitiva del cliente.",
      "Los proyectos se construyen en torno a individuos motivados, a quienes se da el entorno y el apoyo que necesitan, y se confía en que hagan el trabajo.",
    ], vf("Los principios ágiles piden rechazar los cambios de requisitos en etapas tardías.", false,
      "Falso: los aceptan, incluso tarde, porque buscan que el cliente obtenga ventaja.")),
    sec("Calidad y ritmo", [
      "El software funcionando es la medida principal de progreso. Los procesos ágiles promueven un ritmo sostenible y la atención continua a la excelencia técnica y al buen diseño.",
      "La simplicidad, el arte de maximizar el trabajo que no se hace, es esencial. Y, a intervalos regulares, el equipo reflexiona para ser más efectivo y ajusta su forma de trabajar.",
    ], rel("Relaciona el principio con su idea.", [
      ["Software funcionando", "Es la medida principal de progreso"],
      ["Ritmo sostenible", "Mantener un paso constante indefinidamente"],
      ["Simplicidad", "Maximizar el trabajo que no se hace"],
      ["Reflexión periódica", "El equipo ajusta su forma de trabajar"],
    ], "Cada principio aporta una forma de mantener valor y calidad con el tiempo.")),
  ]),

  lec(T, 12, "Scrum: roles", "Quiénes forman el equipo Scrum y qué responsabilidad tienen.", [
    sec("El Equipo Scrum", [
      "Según la Guía de Scrum 2020, el Equipo Scrum está formado por un Product Owner, un Scrum Master y Developers. Es un equipo pequeño y autogestionado: no hay jerarquías internas.",
      "Es responsable de crear en cada Sprint un incremento valioso y utilizable.",
    ], op("¿Qué roles forman el Equipo Scrum?", ["Gerente, analista y tester", "Product Owner, Scrum Master y Developers", "Cliente, usuario y proveedor", "Líder, jefe y supervisor"], 1,
      "Esos son los tres roles de la Guía de Scrum.")),
    sec("Product Owner y Scrum Master", [
      "El Product Owner maximiza el valor del producto y gestiona el Product Backlog: lo ordena, lo hace transparente y se asegura de que se entienda.",
      "El Scrum Master es responsable de que Scrum se entienda y se aplique; sirve al equipo y a la organización eliminando obstáculos y ayudando a mejorar.",
    ], rel("Relaciona el rol con su responsabilidad principal.", [
      ["Product Owner", "Maximizar el valor del producto y gestionar el Product Backlog"],
      ["Scrum Master", "Que Scrum se entienda y se aplique"],
      ["Developers", "Crear cada incremento utilizable"],
    ], "Cada rol tiene un foco distinto que complementa a los demás.")),
    sec("Lo que Scrum NO dice", [
      "Scrum no define un «jefe de proyecto» y el Scrum Master no es el jefe del equipo: no asigna tareas ni decide quién hace qué.",
      "Los Developers se organizan solos para decidir cómo convertir los elementos del Product Backlog en un incremento.",
    ], vf("El Scrum Master es el jefe que asigna las tareas al equipo.", false,
      "Falso: es un líder-servidor; el equipo se autogestiona.")),
  ]),

  lec(T, 13, "Scrum: eventos", "El ritmo de trabajo de un Sprint.", [
    sec("El Sprint", [
      "El Sprint es el corazón de Scrum: un periodo de duración fija de un mes o menos durante el cual se crea un incremento. Un Sprint nuevo comienza cuando termina el anterior.",
      "Todo el trabajo, incluida la planificación, las revisiones y la retrospectiva, ocurre dentro de Sprints.",
    ], vf("Un Sprint puede durar tres meses.", false,
      "Falso: según la Guía de Scrum, un Sprint dura un mes o menos.")),
    sec("Planificar y sincronizar", [
      "En la Planificación del Sprint se decide qué trabajo se hará y cómo, y se define el objetivo del Sprint. En el Scrum Diario, de 15 minutos, los Developers inspeccionan el avance y ajustan el plan.",
      "El Scrum Diario es para el equipo que construye, no es una reunión de reporte para los directivos.",
    ], rel("Relaciona el evento con su propósito.", [
      ["Planificación del Sprint", "Decidir qué se hará y definir el objetivo"],
      ["Scrum Diario", "Inspeccionar el avance cada día en 15 minutos"],
    ], "Estos dos eventos mantienen al equipo coordinado dentro del Sprint.")),
    sec("Inspeccionar y adaptar", [
      "En la Revisión del Sprint el Equipo Scrum y los interesados revisan el resultado y deciden próximas adaptaciones. En la Retrospectiva el equipo analiza cómo trabajó y planea mejoras.",
      "La revisión se centra en el producto; la retrospectiva, en la manera de trabajar.",
    ], op("¿Qué evento sirve para que el equipo mejore su forma de trabajar?", ["Revisión del Sprint", "Retrospectiva del Sprint", "Planificación del Sprint", "Refinamiento del cliente"], 1,
      "La retrospectiva se enfoca en el proceso y las personas.")),
  ]),

  lec(T, 14, "Scrum: artefactos", "Lo que Scrum usa para hacer visible el trabajo.", [
    sec("Product Backlog", [
      "El Product Backlog es una lista ordenada de lo que se necesita para mejorar el producto. Es la única fuente de trabajo del Equipo Scrum.",
      "Su compromiso es el Objetivo del Producto, que describe el estado futuro deseado del producto.",
    ], co("El ___ Backlog es la lista ordenada de lo que se necesita para mejorar el producto.", ["Sprint", "Product", "Daily", "Release"], 1,
      "El Product Backlog lo gestiona el Product Owner.")),
    sec("Sprint Backlog", [
      "El Sprint Backlog está formado por el Objetivo del Sprint, los elementos del Product Backlog seleccionados para el Sprint y un plan para entregar el incremento.",
      "Es un plan hecho por los Developers y para los Developers; se actualiza durante el Sprint conforme se aprende más.",
    ], vf("El Sprint Backlog no puede cambiar una vez iniciado el Sprint.", false,
      "Falso: se actualiza a lo largo del Sprint a medida que se aprende más.")),
    sec("Incremento y Definición de Terminado", [
      "Un Incremento es un paso concreto hacia el Objetivo del Producto. Cada uno se suma a los anteriores y se verifica para que todos funcionen juntos.",
      "La Definición de Terminado describe el estado del incremento cuando cumple las medidas de calidad requeridas. Si un elemento no la cumple, no se puede presentar como terminado.",
    ], rel("Relaciona el artefacto con su compromiso.", [
      ["Product Backlog", "Objetivo del Producto"],
      ["Sprint Backlog", "Objetivo del Sprint"],
      ["Incremento", "Definición de Terminado"],
    ], "Cada artefacto tiene un compromiso que le da sentido y transparencia.")),
  ]),

  lec(T, 15, "Historias de usuario", "Una forma ligera de expresar lo que el usuario necesita.", [
    sec("El formato", [
      "Una historia de usuario describe una necesidad desde el punto de vista de quien la tiene. Un formato común es: «Como [rol], quiero [algo], para [beneficio]».",
      "Es una invitación a conversar más que un contrato detallado: los detalles se afinan hablando con el usuario.",
    ], ord("Ordena las partes de una historia de usuario.", ["Como [rol]", "quiero [algo]", "para [beneficio]"], "El formato va de quién, a qué, a para qué.")),
    sec("Buenas historias: INVEST", [
      "Una regla útil es INVEST: Independiente, Negociable, Valiosa, Estimable, Pequeña y Testeable (que se pueda probar).",
      "Si una historia es demasiado grande para un Sprint, se divide en historias más pequeñas.",
    ], op("En INVEST, la «T» significa…", ["Total", "Testeable (que se pueda probar)", "Temporal", "Teórica"], 1,
      "La historia debe poder comprobarse con criterios claros.")),
    sec("Criterios de aceptación", [
      "Los criterios de aceptación dicen cuándo se considera cumplida la historia, con condiciones concretas y verificables. Por ejemplo: «El alumno ve el listado de temas en 3 segundos o menos».",
      "Así el equipo y el usuario comparten la misma idea de «terminado» antes de construir.",
    ], vf("Los criterios de aceptación sirven para saber cuándo una historia está cumplida.", true,
      "Es verdadero: son condiciones verificables que definen el cumplimiento.")),
  ]),

  lec(T, 16, "Kanban", "Visualizar el trabajo y limitar lo que está en curso.", [
    sec("El tablero", [
      "Kanban organiza el trabajo en un tablero con columnas que representan el estado de las tareas, por ejemplo: Por hacer, En curso y Hecho. Cada tarea es una tarjeta que avanza.",
      "El tablero hace visible el flujo de trabajo y muestra de un vistazo dónde se acumulan las tareas.",
    ], op("¿Para qué sirve el tablero en Kanban?", ["Para ocultar el trabajo", "Para visualizar el flujo y el estado de las tareas", "Para asignar castigos", "Para reemplazar las pruebas"], 1,
      "Hace visible el trabajo y sus cuellos de botella.")),
    sec("Limitar el trabajo en curso", [
      "Una práctica clave es limitar el trabajo en curso (WIP, work in progress): se fija un máximo de tarjetas por columna para evitar empezar mucho y terminar poco.",
      "Cuando una columna llega a su límite, hay que terminar algo antes de empezar algo nuevo.",
    ], vf("Kanban recomienda empezar la mayor cantidad posible de tareas al mismo tiempo.", false,
      "Falso: limita el trabajo en curso para terminar lo que ya se empezó.")),
    sec("Mejora continua", [
      "Otras ideas de Kanban son gestionar el flujo, hacer explícitas las políticas de trabajo y mejorar de manera continua con pequeños cambios.",
      "A diferencia de Scrum, Kanban no exige Sprints ni roles específicos: se puede añadir a un proceso existente.",
    ], rel("Relaciona Scrum y Kanban con una característica.", [
      ["Scrum", "Trabaja en Sprints de duración fija"],
      ["Kanban", "Flujo continuo con límites de trabajo en curso"],
    ], "Ambos son ágiles, pero organizan el tiempo de forma distinta.")),
  ]),

  lec(T, 17, "Programación Extrema (XP)", "Prácticas técnicas para entregar con calidad y rapidez.", [
    sec("Qué es XP", [
      "La Programación Extrema (XP, Extreme Programming) es un método ágil que lleva a un nivel «extremo» prácticas de buena ingeniería: versiones muy frecuentes, mucha comunicación y pruebas constantes.",
      "Se centra más en las prácticas técnicas de programación que en la gestión del proyecto.",
    ], co("XP es un método ___ que se centra en prácticas técnicas.", ["ágil", "secuencial", "documental", "contractual"], 0,
      "XP es uno de los métodos ágiles más conocidos.")),
    sec("Algunas prácticas", [
      "Entre las prácticas de XP están: planificación incremental con historias de usuario, entregas pequeñas, diseño simple, desarrollo guiado por pruebas, refactorización, programación en parejas y propiedad colectiva del código.",
      "También se incluyen la integración continua, el ritmo sostenible y la presencia del cliente en el equipo.",
    ], rel("Relaciona la práctica con su descripción.", [
      ["Programación en parejas", "Dos personas programan juntas en una computadora"],
      ["Refactorización", "Mejorar la estructura del código sin cambiar su comportamiento"],
      ["Desarrollo guiado por pruebas", "Escribir la prueba antes que el código"],
      ["Integración continua", "Integrar y probar los cambios con mucha frecuencia"],
    ], "Estas prácticas se refuerzan entre sí para mantener la calidad.")),
    sec("Por qué funciona", [
      "Las pruebas automáticas dan confianza para cambiar el código; la refactorización mantiene el diseño sano; la programación en parejas funciona como revisión continua.",
      "El conjunto permite cambiar el sistema con rapidez sin que se vuelva inmanejable.",
    ], op("¿Para qué sirven las pruebas automáticas en XP?", ["Para evitar programar", "Para dar confianza al cambiar el código", "Para eliminar al cliente", "Para no documentar nada"], 1,
      "Detectan de inmediato si un cambio rompió algo.")),
  ]),

  lec(T, 18, "Integración y configuración", "Construir a partir de lo que ya existe.", [
    sec("La idea", [
      "En este enfoque, también llamado desarrollo orientado a la reutilización, el sistema se arma integrando componentes o sistemas ya existentes, que se configuran y adaptan.",
      "Hoy es muy común: casi todo proyecto usa bibliotecas, frameworks, servicios en la nube o productos comerciales.",
    ], vf("Hoy la mayoría de los proyectos construye todo desde cero sin reutilizar nada.", false,
      "Falso: casi todos reutilizan bibliotecas, frameworks y servicios.")),
    sec("Las etapas", [
      "Etapas típicas: especificar requisitos, descubrir y evaluar software existente, refinar los requisitos según lo disponible, configurar el sistema y adaptar e integrar componentes.",
      "Los requisitos se refinan a la luz de lo que ya existe, porque no siempre se puede lograr exactamente todo lo deseado.",
    ], ord("Ordena las etapas de integración y configuración.", [
      "Especificar los requisitos iniciales",
      "Descubrir y evaluar software existente",
      "Refinar los requisitos",
      "Configurar el sistema",
      "Adaptar e integrar componentes",
    ], "Se evalúa lo existente antes de refinar y configurar.")),
    sec("Ventajas y riesgos", [
      "Ventajas: menor costo y menor riesgo, y entrega más rápida. Riesgos: tener que ceder en algunos requisitos y perder control sobre la evolución del componente, que depende de su proveedor.",
      "Conviene elegir componentes con buen soporte y revisar sus licencias.",
    ], op("Un riesgo de depender de componentes externos es…", ["Costo cero siempre", "Perder control sobre su evolución", "No poder probarlos nunca", "Que siempre son peores"], 1,
      "Las decisiones sobre nuevas versiones las toma su proveedor, no tu equipo.")),
  ]),

  lec(T, 19, "DevOps e integración continua", "Unir desarrollo y operación para entregar con frecuencia.", [
    sec("Qué es DevOps", [
      "DevOps combina desarrollo (Dev) y operaciones (Ops): busca que quienes construyen el software y quienes lo ejecutan colaboren para entregar cambios con rapidez y confiabilidad.",
      "Reduce la distancia entre «ya funciona en mi computadora» y «ya funciona en producción».",
    ], co("DevOps une el desarrollo con las ___ del software.", ["ventas", "operaciones", "compras", "finanzas"], 1,
      "Dev (desarrollo) y Ops (operaciones).")),
    sec("Integración continua", [
      "La integración continua consiste en integrar los cambios de todo el equipo con mucha frecuencia y verificar cada integración con una construcción y pruebas automáticas.",
      "Así los errores de integración se detectan en minutos y no semanas después.",
    ], vf("En la integración continua los cambios se integran solo una vez al final del proyecto.", false,
      "Falso: se integran con mucha frecuencia, cada vez con pruebas automáticas.")),
    sec("Entrega continua", [
      "La entrega continua extiende la idea: el software que pasa las pruebas queda siempre listo para publicarse. Una canalización (pipeline) automatiza los pasos de construir, probar y desplegar.",
      "El resultado son entregas más pequeñas, frecuentes y de menor riesgo.",
    ], ord("Ordena un pipeline sencillo.", ["Se integra el cambio al repositorio", "Se construye el sistema", "Se ejecutan las pruebas automáticas", "Se despliega a un entorno"], "Primero se construye y prueba; solo después se despliega.")),
  ]),

  lec(T, 20, "Cómo elegir un modelo", "No hay uno mejor para todo: depende del proyecto.", [
    sec("Preguntas para decidir", [
      "Para elegir un modelo conviene preguntarse: ¿qué tan estables son los requisitos? ¿Qué tan grande y crítico es el sistema? ¿Puede el cliente participar con frecuencia? ¿Qué experiencia tiene el equipo?",
      "También influyen las regulaciones y la documentación que exija el cliente o la organización.",
    ], vf("Existe un único modelo de ciclo de vida que es el mejor para cualquier proyecto.", false,
      "Falso: la elección depende de las características del proyecto.")),
    sec("Casos típicos", [
      "Requisitos estables y sistema crítico con mucha documentación: un enfoque dirigido por plan, como cascada o en V. Requisitos cambiantes y cliente disponible: un enfoque ágil, como Scrum.",
      "Proyectos con riesgos técnicos grandes: espiral o prototipos. Productos armados con piezas existentes: integración y configuración.",
    ], rel("Relaciona la situación con el modelo más adecuado.", [
      ["Requisitos muy estables y mucho control documental", "Cascada o modelo en V"],
      ["Requisitos cambiantes con cliente disponible", "Scrum u otro enfoque ágil"],
      ["Riesgos técnicos grandes y poco conocidos", "Espiral o prototipado"],
      ["Sistema armado con componentes existentes", "Integración y configuración"],
    ], "Se elige según estabilidad de requisitos, riesgo, participación del cliente y reutilización.")),
    sec("Adaptar el proceso", [
      "Tampoco hay que seguir un modelo al pie de la letra: los equipos lo adaptan y lo mejoran con lo que aprenden. Métodos como PSP y TSP proponen registrar datos reales de tiempo y defectos para decidir con evidencia.",
      "Lo importante es que el proceso sirva al proyecto, y no al revés.",
    ], op("¿Qué conviene hacer con un modelo de proceso?", ["Seguirlo sin cambios aunque no funcione", "Adaptarlo según lo que se aprende y los datos del proyecto", "Ignorarlo por completo", "Cambiar de modelo cada día"], 1,
      "El proceso se mejora con base en la experiencia y los datos reales.")),
  ]),
];

// ---------- Preguntas adicionales de la evaluación del tema (CDU-3): de 5 a 12 ----------
export const evaluacionExtraCiclos = [
  { id: "ce6", texto: "El modelo en V relaciona cada fase de construcción con…", opciones: ["Un nivel de pruebas", "Un presupuesto", "Un cliente distinto", "Un lenguaje de programación"], correcta: 0, explicacion: "Por ejemplo: diseño detallado con pruebas unitarias y requisitos con pruebas de aceptación." },
  { id: "ce7", texto: "¿Qué distingue al modelo en espiral?", opciones: ["No tiene planeación", "El análisis de riesgos en cada vuelta", "Entrega única al final", "No usa prototipos nunca"], correcta: 1, explicacion: "Cada vuelta evalúa y reduce riesgos antes de avanzar." },
  { id: "ce8", texto: "¿Cuál de estos es un valor del Manifiesto Ágil?", opciones: ["Procesos y herramientas sobre individuos", "Software funcionando sobre documentación exhaustiva", "Negociación contractual sobre colaboración", "Seguir un plan sobre responder al cambio"], correcta: 1, explicacion: "Los otros tres están al revés: el manifiesto valora más lo contrario." },
  { id: "ce9", texto: "¿Cuánto dura como máximo un Sprint de Scrum?", opciones: ["Una semana", "Un mes", "Tres meses", "No tiene límite"], correcta: 1, explicacion: "La Guía de Scrum establece un mes o menos." },
  { id: "ce10", texto: "El Product Owner es responsable principalmente de…", opciones: ["Escribir todo el código", "Maximizar el valor del producto y gestionar el Product Backlog", "Asignar tareas al equipo", "Hacer las pruebas finales"], correcta: 1, explicacion: "Ordena y gestiona el Product Backlog para maximizar el valor." },
  { id: "ce11", texto: "En Kanban, limitar el trabajo en curso (WIP) sirve para…", opciones: ["Empezar más tareas a la vez", "Terminar lo que ya se empezó y evitar cuellos de botella", "Eliminar el tablero", "Evitar toda medición"], correcta: 1, explicacion: "Limitar el WIP favorece terminar antes de empezar." },
  { id: "ce12", texto: "¿Qué práctica de XP consiste en escribir la prueba antes que el código?", opciones: ["Refactorización", "Programación en parejas", "Desarrollo guiado por pruebas", "Propiedad colectiva"], correcta: 2, explicacion: "Es el desarrollo guiado por pruebas (TDD)." },
];

// ---------- Preguntas adicionales del banco del reto del día (CDU-2): de 5 a 10 ----------
export const retoExtraCiclos = [
  { id: "cr6", texto: "¿Qué evento de Scrum es una reunión diaria de 15 minutos?", opciones: ["Retrospectiva", "Scrum Diario", "Revisión del Sprint", "Planificación"], correcta: 1, explicacion: "El Scrum Diario dura 15 minutos y es para los Developers." },
  { id: "cr7", texto: "En una historia de usuario «Como [rol], quiero [algo], para [___]» falta…", opciones: ["Beneficio", "Presupuesto", "Contrato", "Lenguaje"], correcta: 0, explicacion: "Se cierra con el beneficio que obtiene quien la pide." },
  { id: "cr8", texto: "Un prototipo desechable…", opciones: ["Se convierte en el producto final", "Se descarta tras aprender de él", "Es lo mismo que el sistema", "No sirve para nada"], correcta: 1, explicacion: "Sirve para aprender y se tira." },
  { id: "cr9", texto: "¿Cuál es la última fase de RUP?", opciones: ["Concepción", "Elaboración", "Construcción", "Transición"], correcta: 3, explicacion: "Concepción, elaboración, construcción y transición." },
  { id: "cr10", texto: "La integración continua consiste en…", opciones: ["Integrar los cambios con mucha frecuencia con pruebas automáticas", "Integrar solo al final", "Evitar las pruebas", "Programar de noche"], correcta: 0, explicacion: "Cada integración se verifica con construcción y pruebas automáticas." },
];
