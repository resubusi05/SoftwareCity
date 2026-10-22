// TEMA «Fundamentos de la Ingeniería de Software» — lecciones 3 a 20 (las lecciones 1 y 2 siguen en contenido.js).
// CONTENIDO DE PRUEBA escrito con conocimiento estándar (Sommerville, SWEBOK, ISO/IEC 25010, ISO/IEC 29110, código ACM/IEEE).
// El equipo debe revisarlo contra la bibliografía de la materia antes de darlo por oficial.
//
// Formato de cada sección: sec(titulo, [párrafos], actividad?)  — las actividades se describen en components/ActividadSeccion.jsx

import { co, lec, op, ord, rel, sec, vf } from "./ayudas";

const T = "fundamentos";

export const leccionesFundamentos = [
  lec(T, 3, "Software de producto y software a medida", "Las dos grandes clases de software según quién controla la especificación.", [
    sec("Productos genéricos", [
      "Son sistemas que se producen para venderse a cualquier cliente que quiera comprarlos. Ejemplos: procesadores de texto, hojas de cálculo o aplicaciones móviles disponibles en una tienda.",
      "La organización que desarrolla el producto es la que controla su especificación: decide qué hace, cuándo cambia y qué se incluye en cada versión.",
    ], op("¿Quién controla la especificación de un producto genérico?", ["El cliente que lo compra", "La organización que lo desarrolla", "El gobierno", "Cada usuario por separado"], 1,
      "En un producto genérico la especificación la decide quien lo desarrolla, porque el producto se vende a muchos clientes.")),
    sec("Software a medida", [
      "Es el software que encarga un cliente concreto y que se desarrolla específicamente para él: por ejemplo, un sistema de control de tráfico aéreo o un portal de trámites para un municipio.",
      "Aquí la especificación la desarrolla y controla la organización que encarga el software; el equipo de desarrollo trabaja con esa especificación.",
    ], rel("Relaciona cada ejemplo con su tipo de software.", [
      ["Procesador de texto que se vende al público", "Producto genérico"],
      ["Sistema hecho por encargo para un hospital", "Software a medida"],
      ["Sistema ERP comprado y adaptado por una empresa", "Mezcla de ambos"],
    ], "Lo que distingue a los dos primeros es quién controla la especificación: quien lo desarrolla (genérico) o el cliente que lo encarga (a medida). Comprar y adaptar un producto mezcla ambos.")),
    sec("Los límites ya no son tan claros", [
      "Hoy muchas empresas compran un producto genérico (por ejemplo, un sistema ERP) y lo adaptan a sus necesidades. Es una mezcla de ambos tipos.",
      "Por eso conviene preguntarse siempre: ¿quién define lo que el software debe hacer y quién paga por los cambios?",
    ], vf("Un sistema genérico no puede adaptarse nunca a las necesidades de una empresa.", false,
      "Es falso: es común comprar un sistema genérico y configurarlo o extenderlo para una organización.")),
  ]),

  lec(T, 4, "Atributos de un buen software", "Lo que se espera de un software además de que «haga lo que debe».", [
    sec("Más allá de la funcionalidad", [
      "Un software no es bueno solo porque cumple sus funciones. También importan atributos que describen cómo se comporta mientras las cumple.",
      "Sommerville agrupa los atributos esenciales en cuatro: mantenibilidad, confiabilidad y seguridad, eficiencia y aceptabilidad.",
    ], co("Además de la funcionalidad, un buen software debe tener atributos como mantenibilidad, ___ y seguridad, eficiencia y aceptabilidad.", ["portabilidad", "confiabilidad", "popularidad", "rapidez de venta"], 1,
      "El grupo se llama «confiabilidad y seguridad» (dependability and security).")),
    sec("Mantenibilidad y confiabilidad", [
      "Mantenibilidad: el software debe poder evolucionar para cubrir necesidades cambiantes. Es crítica porque el cambio es inevitable.",
      "Confiabilidad y seguridad: incluye fiabilidad, seguridad (security) y protección ante daños (safety). Un software confiable no causa daño físico o económico si falla, y no debe poder ser aprovechado por usuarios maliciosos.",
    ], rel("Relaciona el atributo con su idea principal.", [
      ["Mantenibilidad", "Poder evolucionar ante necesidades cambiantes"],
      ["Confiabilidad y seguridad", "No causar daño si falla y resistir usos maliciosos"],
      ["Eficiencia", "No desperdiciar recursos del sistema"],
    ], "Cada atributo responde a una pregunta distinta sobre la calidad del software.")),
    sec("Eficiencia y aceptabilidad", [
      "Eficiencia: el software no debe malgastar recursos como la memoria o el tiempo del procesador. Incluye capacidad de respuesta y tiempo de procesamiento.",
      "Aceptabilidad: debe ser aceptable para el tipo de usuario para el que se diseñó. Es decir, comprensible, usable y compatible con otros sistemas que ese usuario emplee.",
    ], op("Un sistema que los usuarios no entienden ni logran usar falla principalmente en…", ["Eficiencia", "Aceptabilidad", "Mantenibilidad", "Costo"], 1,
      "La aceptabilidad incluye que el software sea comprensible y usable para quien lo va a usar.")),
  ]),

  lec(T, 5, "Tipos de aplicaciones", "Distintas clases de sistemas requieren distintas formas de construirlos.", [
    sec("No todo el software es igual", [
      "La ingeniería de software se aplica a aplicaciones muy distintas: una app de notas no se construye con las mismas exigencias que el software de un marcapasos.",
      "Conocer el tipo de aplicación ayuda a decidir qué técnicas, qué nivel de pruebas y qué documentación hacen falta.",
    ], vf("Todas las aplicaciones de software se desarrollan exactamente con las mismas técnicas.", false,
      "Falso: el tipo de aplicación influye en el proceso, las pruebas y la documentación necesarias.")),
    sec("Algunas clases de aplicaciones", [
      "Sommerville menciona, entre otras: aplicaciones independientes (stand-alone) que corren en una computadora personal; aplicaciones interactivas basadas en transacciones, como las web; sistemas de control embebidos; sistemas de procesamiento por lotes; sistemas de entretenimiento; y sistemas de modelado y simulación.",
      "También menciona los sistemas de recolección y análisis de datos y los sistemas de sistemas, formados por varios sistemas independientes.",
    ], rel("Relaciona el ejemplo con su clase de aplicación.", [
      ["Software dentro de una lavadora", "Sistema de control embebido"],
      ["Tienda en línea", "Aplicación interactiva basada en transacciones"],
      ["Editor de fotos instalado en tu laptop", "Aplicación independiente (stand-alone)"],
      ["Videojuego", "Sistema de entretenimiento"],
    ], "Cada clase se distingue por dónde corre el software y cómo interactúa con su entorno.")),
    sec("Cuál es crítica", [
      "Algunas aplicaciones son críticas: una falla puede costar vidas o grandes pérdidas (control de un avión, equipo médico). Requieren más verificación y normas más estrictas.",
      "Otras, como un sitio de recetas, toleran fallas ocasionales. La criticidad cambia cuánto esfuerzo de calidad se justifica.",
    ], op("¿Cuál de estos sistemas necesita MÁS rigor en verificación?", ["Un blog personal", "El software de control de un equipo médico", "Un juego casual", "Una lista de pendientes"], 1,
      "Una falla en un equipo médico puede causar daño a personas, por eso el rigor debe ser mayor.")),
  ]),

  lec(T, 6, "Retos de la ingeniería de software", "Los grandes problemas que enfrenta la disciplina hoy.", [
    sec("Heterogeneidad y cambio", [
      "Heterogeneidad: el software suele correr en distintos tipos de computadoras y dispositivos, y debe convivir con sistemas ya existentes escritos hace años.",
      "Cambio de negocio y sociedad: las empresas y la sociedad cambian rápido. El software debe cambiar y entregarse en menos tiempo, sin perder calidad.",
    ], co("El reto de que un sistema deba funcionar en muchos tipos de dispositivos y convivir con sistemas antiguos se llama ___.", ["escala", "heterogeneidad", "confianza", "documentación"], 1,
      "Heterogeneidad es la diversidad de plataformas y sistemas con los que el software debe trabajar.")),
    sec("Seguridad y confianza", [
      "Seguridad y confianza: gran parte de la vida diaria depende del software y de internet, por lo que los usuarios deben poder confiar en él y estar protegidos de ataques.",
      "Un software poco seguro puede exponer datos personales o permitir fraudes, así que la seguridad no se agrega al final: se considera desde el inicio.",
    ], vf("La seguridad del software puede dejarse para después de terminar el desarrollo sin ningún riesgo.", false,
      "Falso: agregar seguridad al final es costoso y deja huecos. Debe considerarse desde el inicio.")),
    sec("Escala", [
      "Escala: el software debe desarrollarse a muy distintas escalas, desde pequeños sistemas embebidos hasta sistemas de internet que atienden a millones de personas.",
      "Una técnica que funciona para una aplicación pequeña no necesariamente sirve para un sistema enorme, y viceversa.",
    ], rel("Relaciona el reto con lo que describe.", [
      ["Heterogeneidad", "Muchas plataformas y sistemas heredados"],
      ["Cambio", "Entregar más rápido ante un entorno cambiante"],
      ["Seguridad y confianza", "Proteger a los usuarios y ganar su confianza"],
      ["Escala", "Desde sistemas diminutos hasta millones de usuarios"],
    ], "Estos cuatro retos aparecen en la mayoría de los proyectos actuales.")),
  ]),

  lec(T, 7, "Ética profesional", "El ingeniero de software tiene responsabilidades más allá de lo técnico.", [
    sec("Una responsabilidad más amplia", [
      "La ingeniería de software se hace dentro de un marco legal y social. Los ingenieros deben comportarse con honestidad y responsabilidad si quieren ser respetados como profesionales.",
      "Muchas decisiones éticas no están escritas en una ley: dependen del criterio y de los principios de cada persona.",
    ], vf("Si algo no está prohibido por la ley, entonces siempre es ético hacerlo.", false,
      "Falso: la ética va más allá de la ley. Hay conductas legales que no son profesionales.")),
    sec("Confidencialidad y competencia", [
      "Confidencialidad: respetar la información confidencial de empleadores y clientes, aunque no haya un acuerdo formal.",
      "Competencia: no aceptar trabajo que esté fuera de tu capacidad, ni presumir una competencia que no tienes.",
    ], rel("Relaciona la conducta con el principio.", [
      ["Guardar los datos privados de un cliente", "Confidencialidad"],
      ["Rechazar un trabajo que no sabes hacer", "Competencia"],
    ], "Estos principios se esperan incluso cuando no hay contrato que los exija.")),
    sec("Propiedad intelectual y mal uso", [
      "Derechos de propiedad intelectual: respetar las leyes de licencias, derechos de autor y patentes. No copiar código de terceros sin permiso.",
      "Mal uso de computadoras: no usar tus conocimientos técnicos para dañar sistemas ajenos, por ejemplo con virus o accesos no autorizados.",
    ], op("Copiar el código de otra persona en tu proyecto sin respetar su licencia viola principalmente…", ["La confidencialidad", "Los derechos de propiedad intelectual", "La competencia", "Ninguna norma"], 1,
      "Las licencias y derechos de autor protegen el trabajo de quien escribió el código.")),
  ]),

  lec(T, 8, "Código de ética ACM/IEEE", "Los principios que guían la práctica profesional.", [
    sec("Qué es el código", [
      "ACM e IEEE publicaron en conjunto el Código de Ética y Práctica Profesional de la Ingeniería de Software. Es una guía de conducta para quienes ejercen la profesión.",
      "Su idea central es que el ingeniero debe actuar siempre en el mejor interés del público, de acuerdo con su cliente y su empleador.",
    ], co("El código ACM/IEEE pide actuar en el mejor interés del ___.", ["competidor", "público", "gerente únicamente", "programador más veterano"], 1,
      "El primer principio es «Público»: se actúa en el interés público de manera consistente.")),
    sec("Los ocho principios", [
      "El código se organiza en ocho principios: Público, Cliente y empleador, Producto, Juicio, Gestión, Profesión, Colegas y Uno mismo.",
      "Por ejemplo, «Producto» pide que el software cumpla los estándares profesionales más altos posibles, y «Colegas» pide ser justo y solidario con los compañeros.",
    ], op("¿Cuántos principios tiene el código de ética ACM/IEEE?", ["4", "6", "8", "12"], 2,
      "Son ocho: Público, Cliente y empleador, Producto, Juicio, Gestión, Profesión, Colegas y Uno mismo.")),
    sec("Aplicarlo en un caso", [
      "Imagina que descubres un defecto de seguridad que podría exponer datos de miles de personas, pero tu jefe quiere entregar sin corregirlo.",
      "El principio de interés público pesa más que la prisa por entregar: lo correcto es reportar el problema por los canales adecuados y buscar corregirlo.",
    ], op("Si un defecto grave pone en riesgo a las personas usuarias y el equipo quiere ignorarlo, ¿qué principio se vuelve prioritario?", ["Entregar a tiempo", "El interés del público", "Reducir costos", "Evitar conflictos"], 1,
      "El interés del público es el primer principio y se antepone a los demás.")),
  ]),

  lec(T, 9, "Proceso y modelo de proceso", "La diferencia entre lo que se hace y su representación.", [
    sec("Qué es un proceso de software", [
      "Un proceso de software es un conjunto de actividades relacionadas que conducen a la creación de un producto de software.",
      "Existen muchos procesos distintos, pero todos incluyen, de alguna forma, especificación, diseño e implementación, validación y evolución.",
    ], co("Un proceso de software es un conjunto de ___ relacionadas que llevan a producir un producto de software.", ["herramientas", "actividades", "licencias", "computadoras"], 1,
      "El proceso se define como un conjunto de actividades relacionadas.")),
    sec("Qué es un modelo de proceso", [
      "Un modelo de proceso es una representación simplificada de un proceso, desde un punto de vista particular: por ejemplo, el orden de las actividades o los roles que participan.",
      "El modelo en cascada, el incremental y Scrum son ejemplos de modelos o enfoques de proceso. Ningún modelo es el único correcto: se elige según el proyecto.",
    ], vf("El modelo de proceso es el proceso real tal como ocurre, con todos sus detalles.", false,
      "Falso: el modelo es una representación simplificada del proceso, no el proceso mismo.")),
    sec("Dirigido por un plan y ágil", [
      "En los procesos dirigidos por un plan, todas las actividades se planifican por adelantado y el avance se mide contra ese plan.",
      "En los procesos ágiles la planificación es incremental y es más fácil cambiar el rumbo cuando cambian los requisitos. En la práctica, la mayoría de los proyectos mezclan ambos enfoques.",
    ], rel("Relaciona el enfoque con su característica.", [
      ["Dirigido por un plan", "Todo se planifica por adelantado"],
      ["Ágil", "Planificación incremental y adaptable al cambio"],
    ], "Los proyectos reales suelen combinar elementos de ambos enfoques.")),
  ]),

  lec(T, 10, "Un poco de historia", "De la «crisis del software» al enfoque actual.", [
    sec("La conferencia de 1968", [
      "En 1968 el comité de ciencia de la OTAN organizó una conferencia en Garmisch, Alemania, para discutir la llamada «crisis del software».",
      "Ahí se popularizó el término «ingeniería de software» y la idea de que el software debía construirse con la disciplina de otras ingenierías.",
    ], op("¿Qué organización patrocinó la conferencia de 1968 donde se popularizó «ingeniería de software»?", ["OTAN", "ONU", "IEEE", "Microsoft"], 0,
      "Fue una conferencia del comité de ciencia de la OTAN.")),
    sec("Del modelo en cascada a lo ágil", [
      "En 1970 Winston Royce publicó un artículo sobre la gestión de grandes sistemas de software; de ahí se popularizó el modelo en cascada, aunque el propio artículo señalaba sus riesgos.",
      "En 2001 un grupo de profesionales publicó el Manifiesto Ágil, que propone dar más valor a las personas, al software funcionando, a la colaboración con el cliente y a responder al cambio.",
    ], ord("Ordena estos hitos del más antiguo al más reciente.", [
      "Conferencia de la OTAN sobre ingeniería de software (1968)",
      "Artículo de Royce sobre grandes sistemas (1970)",
      "Manifiesto Ágil (2001)",
    ], "Primero la conferencia (1968), después el artículo de Royce (1970) y, mucho después, el Manifiesto Ágil (2001).")),
    sec("Lo que enseña esta historia", [
      "La historia muestra que los problemas de tiempo, costo y calidad no desaparecieron: se aprendió a manejarlos con mejores prácticas, estándares y herramientas.",
      "También muestra que los enfoques cambian cuando cambia el contexto; por eso conviene conocer varios modelos y no casarse con uno.",
    ], vf("Los problemas de plazos y costos desaparecieron por completo con la ingeniería de software.", false,
      "Falso: se manejan mejor, pero siguen siendo retos de los proyectos de software.")),
  ]),

  lec(T, 11, "Costos del software y costo del cambio", "Por qué conviene encontrar los errores temprano.", [
    sec("Dónde se va el dinero", [
      "En el software, el costo más importante suele ser el de las personas: sus horas de trabajo. El hardware y las licencias pesan menos en la mayoría de los proyectos.",
      "Sommerville señala que, en una distribución típica, aproximadamente 60 % del costo es de desarrollo y 40 % de pruebas, y que en el software a medida los costos de evolución suelen superar a los de desarrollo.",
    ], vf("Para sistemas que viven muchos años, los costos de evolución suelen ser menores que los de desarrollo.", false,
      "Falso: en software a medida de larga vida, la evolución suele costar más que el desarrollo inicial.")),
    sec("Corregir tarde cuesta más", [
      "Un defecto de requisitos que se descubre durante el diseño se corrige con un cambio en el documento. Si se descubre cuando el sistema ya está en uso, hay que rehacer diseño, código, pruebas y capacitación.",
      "Por eso suele ser mucho más caro corregir un defecto cuanto más tarde se detecta. Es la razón de revisar los productos intermedios y no esperar solo a las pruebas finales.",
    ], ord("Ordena de MÁS barato a MÁS caro corregir el mismo defecto de requisito según cuándo se detecta.", [
      "Al revisar el documento de requisitos",
      "Durante el diseño",
      "Durante las pruebas",
      "Con el sistema ya en uso por clientes",
    ], "Mientras más avanzado está el proyecto, más productos hay que rehacer.")),
    sec("Estimar el esfuerzo", [
      "Estimar es predecir cuánto esfuerzo, tiempo y costo tomará el trabajo. Las estimaciones tempranas son inciertas y mejoran conforme se conoce más del proyecto.",
      "Registrar el tiempo real que toma cada tarea ayuda a que las próximas estimaciones sean mejores; esa es una idea central de métodos como PSP y TSP.",
    ], op("¿Qué práctica ayuda a mejorar estimaciones futuras?", ["Olvidar cuánto tardó cada tarea", "Registrar los tiempos reales de las tareas", "Estimar solo al final", "No estimar"], 1,
      "Los datos reales de proyectos pasados son la base de mejores estimaciones.")),
  ]),

  lec(T, 12, "Roles y participantes", "Quiénes intervienen en un proyecto de software.", [
    sec("Quién pide y quién usa", [
      "El cliente es quien encarga y paga el software. Los usuarios son quienes lo usan en su trabajo diario. A veces son personas distintas y tienen necesidades diferentes.",
      "Los interesados (stakeholders) son todas las personas u organizaciones afectadas por el sistema o que influyen en él.",
    ], rel("Relaciona el rol con su descripción.", [
      ["Cliente", "Encarga y paga el software"],
      ["Usuario", "Usa el software en su trabajo"],
      ["Interesado (stakeholder)", "Cualquiera afectado por el sistema o que lo influye"],
    ], "Un mismo proyecto puede tener muchos interesados con intereses distintos.")),
    sec("Quién lo construye", [
      "En un equipo de desarrollo suelen existir roles como analista de requisitos, diseñador o arquitecto, programador, encargado de pruebas y líder o gestor del proyecto.",
      "En equipos pequeños una misma persona puede cumplir varios roles; lo importante es que cada responsabilidad esté cubierta y asignada.",
    ], vf("En un equipo pequeño, una misma persona puede cubrir más de un rol.", true,
      "Es verdadero: lo importante es que cada responsabilidad tenga dueño, no que haya una persona por rol.")),
    sec("Roles en el trabajo del equipo", [
      "Marcos como Scrum definen roles propios, por ejemplo Product Owner, Scrum Master y Developers. Los métodos de equipo, como TSP, definen roles como líder de equipo o responsable de calidad.",
      "Conocer los roles evita que un trabajo quede sin dueño y facilita saber a quién preguntar.",
    ], op("¿Para qué sirve definir roles claros?", ["Para repartir culpas", "Para que cada responsabilidad tenga un dueño", "Para evitar la comunicación", "Para trabajar más lento"], 1,
      "Los roles claros evitan tareas sin responsable y ayudan a coordinar.")),
  ]),

  lec(T, 13, "Calidad del software", "Qué significa que un software tenga calidad.", [
    sec("Calidad es más que «sin errores»", [
      "Un software de calidad no solo carece de defectos: cumple con los requisitos, es útil para sus usuarios y puede mantenerse.",
      "La calidad se planea y se construye durante todo el proceso; no se «agrega» al final con una prueba.",
    ], vf("La calidad se puede garantizar solo con una prueba final antes de entregar.", false,
      "Falso: la calidad se construye durante todo el proceso con revisiones, pruebas y buenas prácticas.")),
    sec("El modelo ISO/IEC 25010", [
      "La norma ISO/IEC 25010 define un modelo de calidad del producto. En su versión de 2011 incluye ocho características: adecuación funcional, eficiencia de desempeño, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad y portabilidad.",
      "Sirve como lista de verificación para pensar en qué aspectos de calidad importan para tu proyecto y cómo medirlos.",
    ], rel("Relaciona la característica con su idea.", [
      ["Usabilidad", "Qué tan fácil es de aprender y usar"],
      ["Seguridad", "Protección de la información y control de acceso"],
      ["Portabilidad", "Poder trasladarlo a otro entorno"],
      ["Mantenibilidad", "Facilidad para modificarlo"],
    ], "Cada característica se mide de forma distinta y se prioriza según el proyecto.")),
    sec("Aseguramiento y control de calidad", [
      "El aseguramiento de calidad se enfoca en el proceso: definir y seguir buenas prácticas para evitar defectos.",
      "El control de calidad se enfoca en el producto: revisar y probar para encontrar defectos. Un proyecto sano hace las dos cosas.",
    ], op("Revisar y probar el producto para encontrar defectos es parte de…", ["El control de calidad", "El marketing", "La contabilidad", "El diseño gráfico"], 0,
      "El control de calidad examina el producto; el aseguramiento se enfoca en el proceso.")),
  ]),

  lec(T, 14, "Gestión de proyectos de software", "Planear, organizar y dar seguimiento al trabajo.", [
    sec("Alcance, tiempo y costo", [
      "Todo proyecto tiene tres restricciones principales: alcance (qué se va a entregar), tiempo (cuándo) y costo (con cuántos recursos). La calidad se ve afectada cuando se fuerza una de ellas.",
      "Si el cliente pide más alcance en el mismo tiempo y costo, algo debe ceder: calidad, personas extras o fecha.",
    ], co("Las tres restricciones clásicas de un proyecto son alcance, tiempo y ___.", ["color", "costo", "idioma", "marca"], 1,
      "Alcance, tiempo y costo; la calidad se ve afectada cuando una de ellas se fuerza.")),
    sec("Qué hace quien gestiona", [
      "Entre las responsabilidades típicas de quien gestiona un proyecto están: planificar y calendarizar, estimar costos, dar seguimiento y revisión, seleccionar personal y reportar el avance.",
      "Un buen plan no es un documento fijo: se revisa y actualiza conforme se aprende cómo avanza el proyecto.",
    ], ord("Ordena este ciclo básico de gestión.", [
      "Planificar el trabajo",
      "Ejecutar las tareas",
      "Dar seguimiento al avance contra el plan",
      "Ajustar el plan según lo aprendido",
    ], "Planear, ejecutar, medir y ajustar es un ciclo que se repite durante el proyecto.")),
    sec("Seguimiento del avance", [
      "Para saber si el proyecto va bien se compara lo planeado contra lo real: tareas terminadas, horas usadas, defectos encontrados.",
      "Sin datos reales, «vamos bien» es solo una opinión. Medir permite detectar a tiempo los retrasos.",
    ], vf("Para saber si un proyecto va bien basta con la opinión del líder, sin datos.", false,
      "Falso: el seguimiento se basa en datos reales comparados con el plan.")),
  ]),

  lec(T, 15, "Gestión de riesgos", "Anticiparse a lo que podría salir mal.", [
    sec("Qué es un riesgo", [
      "Un riesgo es un evento posible que, si ocurre, afecta negativamente al proyecto. Todavía no ha ocurrido; por eso se puede prevenir.",
      "Si el evento ya ocurrió, deja de ser riesgo y se convierte en un problema que hay que resolver.",
    ], op("Un evento posible que todavía no ocurre y que podría afectar al proyecto es…", ["Un problema", "Un riesgo", "Un requisito", "Un entregable"], 1,
      "Un riesgo es un evento posible; cuando ocurre se vuelve un problema.")),
    sec("Las cuatro etapas", [
      "Sommerville describe cuatro etapas: identificar los riesgos, analizarlos (probabilidad e impacto), planificar qué hacer y monitorearlos durante el proyecto.",
      "Un ejemplo de riesgo es que un integrante clave se enferme o abandone el proyecto.",
    ], ord("Ordena las etapas de la gestión de riesgos.", [
      "Identificar los riesgos",
      "Analizar su probabilidad e impacto",
      "Planificar la respuesta",
      "Monitorear los riesgos",
    ], "Primero se identifica, luego se analiza, se planifica la respuesta y se monitorea.")),
    sec("Estrategias de respuesta", [
      "Para cada riesgo importante se define una estrategia: evitarlo (cambiar el plan para que no ocurra), minimizarlo (reducir su probabilidad o impacto) o preparar un plan de contingencia (qué hacer si ocurre).",
      "Los riesgos se revisan periódicamente porque cambian: aparecen nuevos y otros dejan de ser relevantes.",
    ], rel("Relaciona la estrategia con su idea.", [
      ["Evitar", "Cambiar el plan para que el riesgo no pueda ocurrir"],
      ["Minimizar", "Reducir su probabilidad o su impacto"],
      ["Contingencia", "Tener un plan para cuando ocurra"],
    ], "La estrategia depende de qué tan probable y grave sea el riesgo.")),
  ]),

  lec(T, 16, "Gestión de configuración", "Controlar versiones, cambios y entregas.", [
    sec("Por qué se necesita", [
      "En un proyecto cambian constantemente el código, los documentos y los datos. Si varias personas los modifican sin control, se pierden cambios y nadie sabe cuál es la versión buena.",
      "La gestión de configuración es el conjunto de prácticas para controlar esos cambios y mantener la integridad de los productos.",
    ], vf("La gestión de configuración sirve para controlar los cambios en código y documentos.", true,
      "Es verdadero: ese es su propósito principal.")),
    sec("Actividades principales", [
      "Sommerville menciona cuatro actividades: gestión de versiones, construcción del sistema, gestión de cambios y gestión de entregas (releases).",
      "Un sistema de control de versiones, como Git, guarda el historial de cambios y permite que varias personas trabajen en paralelo.",
    ], rel("Relaciona la actividad con su descripción.", [
      ["Gestión de versiones", "Llevar el registro de las versiones de cada producto"],
      ["Construcción del sistema", "Generar el sistema ejecutable a partir de sus componentes"],
      ["Gestión de cambios", "Controlar qué cambios se aceptan y cómo se aplican"],
      ["Gestión de entregas", "Preparar y distribuir versiones del sistema"],
    ], "Estas actividades evitan el caos cuando muchas personas modifican los mismos productos.")),
    sec("Línea base", [
      "Una línea base es un conjunto de productos revisados y aprobados que sirve como punto de partida oficial. Después de aprobarla, cualquier cambio sigue un procedimiento formal.",
      "Gracias a las líneas base se puede volver a una versión estable si un cambio causa problemas.",
    ], op("¿Para qué sirve una línea base?", ["Para borrar el historial", "Como punto de referencia aprobado al que se puede volver", "Para evitar toda revisión", "Para aumentar el alcance"], 1,
      "Es una versión oficial aprobada; los cambios posteriores siguen un control formal.")),
  ]),

  lec(T, 17, "Verificación y validación", "Dos preguntas distintas sobre la calidad del producto.", [
    sec("La diferencia clave", [
      "Verificación: ¿estamos construyendo el producto correctamente? Comprueba que el software cumple con su especificación.",
      "Validación: ¿estamos construyendo el producto correcto? Comprueba que el software hace lo que el cliente realmente necesita.",
    ], rel("Relaciona la pregunta con el concepto.", [
      ["¿Lo estamos construyendo correctamente?", "Verificación"],
      ["¿Estamos construyendo el producto correcto?", "Validación"],
    ], "Un producto puede cumplir su especificación (verificado) y aun así no resolver la necesidad real del cliente (no validado).")),
    sec("Técnicas", [
      "Las revisiones e inspecciones examinan documentos y código sin ejecutarlos. Las pruebas ejecutan el software con datos para observar si se comporta como se espera.",
      "Las inspecciones pueden encontrar defectos antes de tener un sistema ejecutable, incluso en documentos de requisitos o diseño.",
    ], vf("Las inspecciones solo se pueden hacer cuando el sistema ya está terminado y funcionando.", false,
      "Falso: pueden aplicarse a documentos y código sin ejecutar nada, desde etapas tempranas.")),
    sec("Las pruebas muestran presencia de errores", [
      "Las pruebas pueden mostrar que hay defectos, pero no demuestran que el software no tenga ninguno. Por eso se combinan con revisiones y otras técnicas.",
      "Una buena prueba es la que tiene una alta probabilidad de encontrar un defecto, no la que solo confirma que «todo funciona».",
    ], op("Si las pruebas no encuentran errores, ¿qué se puede concluir con certeza?", ["Que el software no tiene ningún defecto", "Que esas pruebas no encontraron defectos", "Que el cliente está feliz", "Que ya no hace falta revisar"], 1,
      "Una prueba sin fallas solo muestra que no encontró defectos, no que no existan.")),
  ]),

  lec(T, 18, "Mantenimiento y evolución", "Lo que ocurre después de la primera entrega.", [
    sec("El software cambia", [
      "El software no se «termina» al entregarlo: cambian las necesidades del negocio, las leyes, los dispositivos y los usuarios, y el software debe adaptarse.",
      "Por eso muchos sistemas viven años o décadas y pasan la mayor parte de su vida en mantenimiento.",
    ], vf("Una vez entregado, el software ya no requiere cambios.", false,
      "Falso: el cambio es inevitable; la mayor parte de la vida de muchos sistemas es de mantenimiento.")),
    sec("Tipos de mantenimiento", [
      "La norma ISO/IEC 14764 distingue cuatro tipos: correctivo (arreglar defectos), adaptativo (adaptarse a un nuevo entorno), perfectivo (mejorar funciones o desempeño) y preventivo (evitar problemas futuros).",
      "Identificar el tipo ayuda a estimar y priorizar el trabajo.",
    ], rel("Relaciona el cambio con el tipo de mantenimiento.", [
      ["Corregir un error que falla al guardar", "Correctivo"],
      ["Adaptar la app a una nueva versión del sistema operativo", "Adaptativo"],
      ["Agregar una función que piden los usuarios", "Perfectivo"],
      ["Reorganizar código para evitar problemas futuros", "Preventivo"],
    ], "Cada tipo responde a una causa distinta de cambio.")),
    sec("Evolución y deuda", [
      "Cada cambio apresurado que se hace sin cuidar el diseño vuelve el sistema más difícil de modificar. Esa acumulación suele llamarse deuda técnica.",
      "Dedicar tiempo a mejorar la estructura del código mantiene viva la capacidad de cambiar el sistema a un costo razonable.",
    ], op("La acumulación de cambios apresurados que dificultan modificar el sistema se conoce como…", ["Deuda técnica", "Línea base", "Prototipo", "Incremento"], 0,
      "Se llama deuda técnica porque lo que se ahorra hoy se paga con intereses después.")),
  ]),

  lec(T, 19, "Normas: ISO/IEC 29110", "Un estándar pensado para equipos muy pequeños.", [
    sec("Para qué sirve", [
      "La serie ISO/IEC 29110 contiene perfiles de ciclo de vida para entidades muy pequeñas (VSE, Very Small Entities): organizaciones, departamentos o proyectos de hasta 25 personas.",
      "Su meta es ofrecer prácticas de ingeniería de software ligeras, que los equipos pequeños puedan aplicar sin la carga de normas diseñadas para empresas grandes.",
    ], co("ISO/IEC 29110 está pensada para entidades muy ___.", ["grandes", "pequeñas", "antiguas", "extranjeras"], 1,
      "Está pensada para entidades muy pequeñas (VSE), de hasta 25 personas.")),
    sec("Perfiles", [
      "Los perfiles son grupos de prácticas que crecen en exigencia: Entrada, Básico, Intermedio y Avanzado.",
      "El Perfil de Entrada está dirigido a VSE que trabajan en proyectos pequeños (de hasta seis personas-mes de esfuerzo) y a empresas de reciente creación.",
    ], ord("Ordena los perfiles de ISO/IEC 29110 del más sencillo al más exigente.", ["Entrada", "Básico", "Intermedio", "Avanzado"], "Los perfiles van de Entrada a Avanzado, cada uno con más prácticas que el anterior.")),
    sec("Procesos del perfil Básico", [
      "El perfil Básico se organiza en dos procesos: Gestión del Proyecto e Implementación de Software.",
      "El primero se ocupa de planear y dar seguimiento al trabajo; el segundo, de los requisitos, el diseño, la construcción, las pruebas y la entrega del producto.",
    ], rel("Relaciona el proceso con lo que cubre.", [
      ["Gestión del Proyecto", "Planeación y seguimiento"],
      ["Implementación de Software", "Requisitos, diseño, construcción, pruebas y entrega"],
    ], "Juntos cubren la administración del proyecto y la construcción del producto.")),
  ]),

  lec(T, 20, "El cuerpo de conocimiento: SWEBOK", "Un mapa de las áreas de la ingeniería de software.", [
    sec("Qué es SWEBOK", [
      "SWEBOK (Software Engineering Body of Knowledge) es una guía de IEEE Computer Society que describe el conocimiento generalmente aceptado de la ingeniería de software.",
      "No enseña cada tema a fondo: organiza la disciplina en áreas de conocimiento y señala dónde profundizar.",
    ], vf("SWEBOK es un lenguaje de programación.", false,
      "Falso: es una guía que organiza las áreas de conocimiento de la ingeniería de software.")),
    sec("Áreas de conocimiento", [
      "La versión 3 (2014) tiene 15 áreas. Las que corresponden al ciclo de vida son: requisitos, diseño, construcción, pruebas, mantenimiento, gestión de configuración, gestión de la ingeniería de software, proceso, modelos y métodos, y calidad.",
      "Se agregan la práctica profesional, la economía de la ingeniería de software y tres áreas de fundamentos: computación, matemáticas e ingeniería.",
    ], op("¿Cuál de estas es un área de conocimiento de SWEBOK?", ["Requisitos de software", "Diseño de logotipos", "Contabilidad fiscal", "Redacción de contratos laborales"], 0,
      "Requisitos, diseño, construcción, pruebas y mantenimiento son áreas centrales.")),
    sec("Dónde encaja este curso", [
      "Los temas de esta app —fundamentos, ciclos de vida y requisitos— se ubican en áreas como proceso, requisitos y práctica profesional.",
      "Tener el mapa completo ayuda a saber qué falta por aprender y cómo se conectan los temas entre sí.",
    ], rel("Relaciona el tema con su área de SWEBOK.", [
      ["Levantar y especificar lo que el sistema debe hacer", "Requisitos de software"],
      ["Controlar versiones y cambios", "Gestión de configuración"],
      ["Corregir y evolucionar un sistema entregado", "Mantenimiento de software"],
    ], "Cada tema de la materia corresponde a una o más áreas del cuerpo de conocimiento.")),
  ]),
];

// ---------- Preguntas adicionales de la evaluación del tema (CDU-3): de 5 a 12 ----------
export const evaluacionExtraFundamentos = [
  { id: "fe6", texto: "En un producto genérico, ¿quién controla la especificación?", opciones: ["El cliente final", "La organización que lo desarrolla", "Cada usuario", "Un tercero ajeno"], correcta: 1, explicacion: "En el software genérico la especificación la controla quien lo desarrolla." },
  { id: "fe7", texto: "¿Cuál NO es uno de los atributos esenciales de un buen software según Sommerville?", opciones: ["Mantenibilidad", "Eficiencia", "Aceptabilidad", "Popularidad en redes"], correcta: 3, explicacion: "Los atributos son mantenibilidad, confiabilidad y seguridad, eficiencia y aceptabilidad." },
  { id: "fe8", texto: "Mantener en secreto la información de un cliente corresponde al principio de…", opciones: ["Competencia", "Confidencialidad", "Propiedad intelectual", "Mal uso de computadoras"], correcta: 1, explicacion: "La confidencialidad exige respetar la información de clientes y empleadores." },
  { id: "fe9", texto: "Un modelo de proceso es…", opciones: ["El proceso real, con todos sus detalles", "Una representación simplificada de un proceso", "Una herramienta de programación", "Un tipo de contrato"], correcta: 1, explicacion: "Es una abstracción del proceso desde un punto de vista particular." },
  { id: "fe10", texto: "Generalmente, corregir un defecto de requisitos…", opciones: ["Cuesta lo mismo en cualquier etapa", "Cuesta más cuanto más tarde se detecta", "Cuesta menos cuando el sistema ya está en uso", "No se puede corregir"], correcta: 1, explicacion: "Mientras más avanzado el proyecto, más productos hay que rehacer." },
  { id: "fe11", texto: "«¿Estamos construyendo el producto correcto?» es la pregunta de…", opciones: ["Verificación", "Validación", "Compilación", "Mantenimiento"], correcta: 1, explicacion: "La validación comprueba que el software satisface la necesidad real del cliente." },
  { id: "fe12", texto: "Adaptar una aplicación a una nueva versión del sistema operativo es mantenimiento…", opciones: ["Correctivo", "Adaptativo", "Perfectivo", "Preventivo"], correcta: 1, explicacion: "El mantenimiento adaptativo ajusta el software a cambios del entorno." },
];

// ---------- Preguntas adicionales del banco del reto del día (CDU-2): de 5 a 10 ----------
export const retoExtraFundamentos = [
  { id: "fr6", texto: "¿Cuántos principios tiene el código de ética ACM/IEEE?", opciones: ["Cuatro", "Seis", "Ocho", "Doce"], correcta: 2, explicacion: "Son ocho principios, desde «Público» hasta «Uno mismo»." },
  { id: "fr7", texto: "Un riesgo es…", opciones: ["Un problema que ya ocurrió", "Un evento posible que podría afectar al proyecto", "Un requisito funcional", "Un entregable"], correcta: 1, explicacion: "Cuando ocurre, el riesgo se convierte en un problema." },
  { id: "fr8", texto: "¿Para qué sirve el control de versiones?", opciones: ["Para registrar y controlar los cambios en código y documentos", "Para diseñar pantallas", "Para vender el software", "Para evitar escribir código"], correcta: 0, explicacion: "Permite conocer el historial y trabajar en paralelo sin perder cambios." },
  { id: "fr9", texto: "¿Para quién está pensada la serie ISO/IEC 29110?", opciones: ["Grandes corporaciones", "Entidades muy pequeñas (VSE)", "Solo universidades", "Fabricantes de hardware"], correcta: 1, explicacion: "Está dirigida a entidades de hasta 25 personas." },
  { id: "fr10", texto: "Reorganizar código para evitar problemas futuros es mantenimiento…", opciones: ["Correctivo", "Adaptativo", "Perfectivo", "Preventivo"], correcta: 3, explicacion: "El mantenimiento preventivo busca evitar fallas o dificultades futuras." },
];
