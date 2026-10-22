// TEMA «Requisitos de software» — lecciones 3 a 20 (las lecciones 1 y 2 siguen en contenido.js).
// CONTENIDO DE PRUEBA escrito con conocimiento estándar (Sommerville, ISO/IEC/IEEE 29148, UML, MoSCoW).
// El equipo debe revisarlo contra la bibliografía de la materia antes de darlo por oficial.

import { co, lec, op, ord, rel, sec, vf } from "./ayudas";

const T = "requisitos";

export const leccionesRequisitos = [
  lec(T, 3, "La ingeniería de requisitos", "El proceso de descubrir, escribir y comprobar lo que el sistema debe hacer.", [
    sec("Qué es", [
      "La ingeniería de requisitos es el proceso de establecer los servicios que el cliente requiere de un sistema y las restricciones bajo las que opera y se desarrolla.",
      "Los requisitos son la descripción de esos servicios y restricciones. Son la base de todo el trabajo posterior: diseño, construcción y pruebas.",
    ], co("La ingeniería de ___ establece los servicios que el cliente requiere de un sistema y sus restricciones.", ["requisitos", "hardware", "ventas", "logística"], 0,
      "Los requisitos son la base de todo lo que se construye después.")),
    sec("Las actividades", [
      "Sommerville agrupa el proceso en tres actividades: elicitación y análisis (descubrir lo que los interesados necesitan), especificación (escribirlo con claridad) y validación (comprobar que es lo que realmente se quiere).",
      "No ocurren en una sola secuencia: se entrelazan y se repiten, porque al escribir se descubren dudas y al validar se corrigen requisitos.",
    ], rel("Relaciona la actividad con su propósito.", [
      ["Elicitación y análisis", "Descubrir lo que necesitan los interesados"],
      ["Especificación", "Escribir los requisitos con claridad"],
      ["Validación", "Comprobar que son lo que realmente se quiere"],
    ], "Las tres actividades se repiten y se retroalimentan durante el proyecto.")),
    sec("Gestión de requisitos", [
      "Además, los requisitos cambian durante todo el proyecto: surgen necesidades nuevas, cambian las prioridades o se descubren errores.",
      "La gestión de requisitos es el proceso de controlar esos cambios y mantener el vínculo entre los requisitos y el resto de los productos.",
    ], vf("Una vez escritos, los requisitos no cambian durante el proyecto.", false,
      "Falso: cambian con frecuencia, por eso se necesita gestionarlos.")),
  ]),

  lec(T, 4, "Requisitos de usuario y de sistema", "Dos niveles de detalle para dos tipos de lectores.", [
    sec("Requisitos de usuario", [
      "Son declaraciones, en lenguaje natural y diagramas, de los servicios que se espera que el sistema ofrezca y las restricciones con las que debe operar.",
      "Están escritos para quienes no son técnicos, como clientes y usuarios, por lo que deben ser comprensibles sin conocimientos de desarrollo.",
    ], op("¿Para quién se escriben principalmente los requisitos de usuario?", ["Solo para programadores", "Para clientes y usuarios sin conocimientos técnicos", "Para el servidor", "Para el auditor fiscal"], 1,
      "Están pensados para lectores no técnicos.")),
    sec("Requisitos de sistema", [
      "Son descripciones más detalladas de lo que el sistema debe hacer: funciones, servicios y restricciones operativas, con mayor precisión.",
      "Los escriben y leen principalmente quienes diseñan y construyen el sistema, y pueden servir como base de un contrato.",
    ], rel("Relaciona el nivel con su característica.", [
      ["Requisitos de usuario", "Descripción general, para lectores no técnicos"],
      ["Requisitos de sistema", "Descripción detallada, para quienes lo construyen"],
    ], "Ambos niveles describen lo mismo con distinto detalle y público.")),
    sec("Un ejemplo", [
      "Usuario: «El sistema debe permitir al alumno consultar los temas de la materia». Sistema: «El sistema debe mostrar la lista de temas disponibles con su nombre, descripción y avance, ordenados por su posición en el plan».",
      "El de usuario dice qué se necesita; el de sistema afina qué debe mostrarse y cómo, para poder diseñar y probar.",
    ], vf("El requisito de sistema suele ser más detallado que el de usuario.", true,
      "Es verdadero: desarrolla con precisión lo que el requisito de usuario plantea en general.")),
  ]),

  lec(T, 5, "Interesados (stakeholders)", "Las personas que influyen en el sistema o son afectadas por él.", [
    sec("Quiénes son", [
      "Un interesado es cualquier persona u organización que se ve afectada por el sistema o que influye en sus requisitos: usuarios finales, clientes, gerentes, personal de operación, reguladores, entre otros.",
      "No todos tienen el mismo interés ni el mismo poder; identificarlos pronto evita sorpresas tarde.",
    ], vf("Los únicos interesados de un sistema son quienes lo programan.", false,
      "Falso: también lo son usuarios, clientes, gerentes, reguladores y más.")),
    sec("Identificarlos", [
      "Una forma de empezar es preguntar: ¿quién usará el sistema? ¿Quién lo pagará? ¿Quién lo operará o dará soporte? ¿Quién está obligado a regularlo o auditarlo?",
      "Cada respuesta suele revelar un grupo con necesidades distintas y a veces contradictorias.",
    ], rel("Relaciona la pregunta con el tipo de interesado que revela.", [
      ["¿Quién lo usará a diario?", "Usuarios finales"],
      ["¿Quién lo paga?", "Cliente o patrocinador"],
      ["¿Quién lo mantiene funcionando?", "Operación y soporte"],
      ["¿Quién fija reglas que debe cumplir?", "Reguladores"],
    ], "Cada grupo aporta requisitos distintos.")),
    sec("Intereses en conflicto", [
      "Los interesados pueden querer cosas incompatibles: el gerente quiere reducir costos, el usuario quiere más funciones, el equipo de seguridad quiere más controles.",
      "Hay que reconocer esos conflictos y negociar; ocultarlos solo los traslada a etapas más caras.",
    ], op("Si dos interesados piden cosas incompatibles, lo mejor es…", ["Ignorar a uno sin avisar", "Reconocer el conflicto y negociar una solución", "Construir ambas sin analizar", "Cancelar el proyecto"], 1,
      "Los conflictos se resuelven negociando, no escondiéndolos.")),
  ]),

  lec(T, 6, "Elicitación: entrevistas y observación", "Dos técnicas para descubrir lo que la gente necesita.", [
    sec("La entrevista", [
      "En una entrevista se hacen preguntas a los interesados para entender sus necesidades. Pueden ser cerradas (con un conjunto predefinido de preguntas) o abiertas (sin agenda fija, con exploración libre).",
      "En la práctica se suele combinar ambas formas.",
    ], rel("Relaciona el tipo de entrevista con su descripción.", [
      ["Cerrada", "Con preguntas predefinidas"],
      ["Abierta", "Sin agenda fija, se explora libremente"],
    ], "Se combinan para tener estructura sin perder descubrimientos inesperados.")),
    sec("Entrevistar bien", [
      "Conviene escuchar más que hablar, preguntar «¿por qué?» y «¿puede darme un ejemplo?» y no suponer que se conoce el dominio del entrevistado.",
      "Los usuarios no siempre saben expresar lo que necesitan ni usan los mismos términos que el equipo técnico; hay que confirmar el significado de las palabras.",
    ], op("¿Qué conviene hacer en una entrevista de requisitos?", ["Hablar casi todo el tiempo", "Escuchar, pedir ejemplos y confirmar términos", "Suponer que ya se sabe todo", "Evitar preguntar por qué"], 1,
      "Los ejemplos y las preguntas abiertas descubren necesidades reales.")),
    sec("Observación", [
      "En la observación (a veces llamada etnografía) se mira a las personas trabajando en su entorno real. Descubre cosas que no se mencionan en una entrevista, como pasos que la gente hace por costumbre.",
      "Es muy útil para entender procesos que están muy arraigados y que las personas no saben describir con palabras.",
    ], vf("La observación puede descubrir necesidades que los usuarios no mencionan en una entrevista.", true,
      "Es verdadero: se detectan hábitos y pasos que la gente da por obvios.")),
  ]),

  lec(T, 7, "Elicitación: otras técnicas", "Cuestionarios, talleres, prototipos y análisis de documentos.", [
    sec("Cuestionarios y documentos", [
      "Los cuestionarios permiten recoger información de muchas personas en poco tiempo, aunque limitan la profundidad de las respuestas.",
      "El análisis de documentos (manuales, formatos, reglamentos) muestra cómo se trabaja y qué reglas existen, sin depender de la memoria de nadie.",
    ], op("¿Qué ventaja tiene un cuestionario?", ["Obtiene información profunda de cada persona", "Recoge información de muchas personas en poco tiempo", "Reemplaza a todas las demás técnicas", "No necesita preguntas"], 1,
      "Es eficiente con muchas personas, pero menos profundo que una entrevista.")),
    sec("Talleres y prototipos", [
      "En un taller se reúne a varios interesados con el equipo para definir requisitos de forma conjunta; ayuda a resolver diferencias en el momento.",
      "Un prototipo (incluso dibujos de pantallas) permite que los usuarios reaccionen a algo concreto, lo que suele provocar comentarios que en abstracto no surgen.",
    ], rel("Relaciona la técnica con lo que aporta.", [
      ["Taller", "Alinear a varios interesados en una sesión conjunta"],
      ["Prototipo", "Dar algo concreto sobre lo que opinar"],
      ["Cuestionario", "Recoger datos de muchas personas"],
      ["Análisis de documentos", "Conocer reglas y formatos existentes"],
    ], "Ninguna técnica sirve sola; se combinan según el caso.")),
    sec("Combinar técnicas", [
      "Una buena elicitación combina varias técnicas: se empieza con documentos y entrevistas, se verifica con observación y se valida con prototipos.",
      "Así se compensan las limitaciones de cada técnica y se reduce el riesgo de omitir algo importante.",
    ], vf("Basta una sola técnica de elicitación para obtener todos los requisitos.", false,
      "Falso: se suelen combinar varias para compensar las limitaciones de cada una.")),
  ]),

  lec(T, 8, "Historias de usuario y criterios de aceptación", "Requisitos breves y verificables, en lenguaje del usuario.", [
    sec("Historias de usuario", [
      "Una historia de usuario expresa un requisito desde el punto de vista del usuario con el formato «Como [rol], quiero [algo], para [beneficio]».",
      "Es breve a propósito: los detalles se conversan con el usuario cuando llega el momento de construirla.",
    ], ord("Ordena las partes de una historia de usuario.", ["Como [rol]", "quiero [algo]", "para [beneficio]"], "Quién, qué y para qué.")),
    sec("Criterios de aceptación", [
      "Los criterios de aceptación son condiciones que deben cumplirse para considerar terminada la historia. Se escriben de forma que se puedan comprobar con una prueba.",
      "Una forma conocida es el formato Dado–Cuando–Entonces: «Dado un alumno con sesión iniciada, cuando abre un tema, entonces ve sus lecciones».",
    ], rel("Relaciona la parte del formato con lo que expresa.", [
      ["Dado", "La situación inicial"],
      ["Cuando", "La acción que ocurre"],
      ["Entonces", "El resultado esperado"],
    ], "El formato describe una prueba en tres pasos.")),
    sec("Historias frente a requisitos tradicionales", [
      "Una historia es más corta y flexible que el clásico «el sistema deberá…». Los requisitos tradicionales suelen ser más formales y adecuados cuando hay contratos o normas que exigen más detalle.",
      "Ambos pueden convivir: por ejemplo, historias para planear y requisitos formales para auditar.",
    ], op("¿Qué suele ser una historia de usuario?", ["Un documento de 100 páginas", "Una descripción breve de una necesidad, que se conversa y se detalla después", "Un diagrama de base de datos", "Un contrato legal"], 1,
      "Es una invitación a conversar más que una especificación completa.")),
  ]),

  lec(T, 9, "Escenarios", "Contar cómo se usaría el sistema, paso a paso.", [
    sec("Qué es un escenario", [
      "Un escenario es una descripción de una forma concreta en que se podría usar el sistema, con personas y situaciones reales. Es una historia con detalle.",
      "Ayuda a que los usuarios reconozcan su propio trabajo y a que el equipo detecte pasos que olvidó.",
    ], vf("Los escenarios describen situaciones concretas de uso.", true,
      "Es verdadero: sirven para imaginar el uso real del sistema.")),
    sec("Qué contiene", [
      "Sommerville propone incluir: una descripción de la situación inicial, el flujo normal de eventos, lo que puede salir mal y cómo se maneja, información sobre otras actividades que ocurren al mismo tiempo, y el estado en que queda el sistema al terminar.",
      "Con esas partes un escenario se acerca mucho a un caso de uso.",
    ], rel("Relaciona la parte del escenario con lo que describe.", [
      ["Situación inicial", "Qué se supone antes de empezar"],
      ["Flujo normal", "La secuencia esperada de eventos"],
      ["Lo que puede salir mal", "Errores y cómo se manejan"],
      ["Estado final", "En qué queda el sistema al terminar"],
    ], "Estas partes cubren el antes, el durante, los fallos y el después.")),
    sec("Para qué se usa", [
      "Los escenarios sirven para elicitar requisitos, validarlos con los usuarios y diseñar pruebas de aceptación.",
      "Preguntar «¿y si falla?» en cada paso suele descubrir requisitos que nadie había mencionado.",
    ], op("Preguntar «¿y si falla?» en cada paso de un escenario sirve para…", ["Perder tiempo", "Descubrir requisitos de manejo de errores", "Evitar escribir requisitos", "Eliminar el flujo normal"], 1,
      "Revela excepciones y requisitos que se omiten con facilidad.")),
  ]),

  lec(T, 10, "Requisitos no funcionales: tipos", "Las propiedades y restricciones del sistema.", [
    sec("Por qué importan", [
      "Los requisitos no funcionales son restricciones sobre los servicios o funciones del sistema, como tiempo de respuesta, seguridad o estándares. A menudo se aplican al sistema completo y no a una función concreta.",
      "Un sistema puede cumplir todas sus funciones y ser inútil si es muy lento o inseguro.",
    ], vf("Un sistema que cumple todas sus funciones siempre es aceptable aunque sea muy lento.", false,
      "Falso: los requisitos no funcionales también determinan si el sistema sirve.")),
    sec("Clasificación de Sommerville", [
      "Sommerville los clasifica en tres grandes tipos: requisitos del producto (como usabilidad, eficiencia, confiabilidad, seguridad), organizacionales (del entorno de desarrollo y operación) y externos (como requisitos legales y regulatorios).",
      "Cada uno proviene de una fuente distinta: el propio producto, la organización o el exterior.",
    ], rel("Relaciona el ejemplo con el tipo de requisito no funcional.", [
      ["El tiempo de respuesta no debe superar 3 segundos", "Del producto"],
      ["Se usará el estándar de desarrollo de la empresa", "Organizacional"],
      ["Debe cumplir la ley de protección de datos", "Externo"],
    ], "Producto, organización y exterior son las tres fuentes principales.")),
    sec("Los no funcionales y la arquitectura", [
      "Los requisitos no funcionales suelen condicionar la arquitectura del sistema. Por ejemplo, un requisito de alta disponibilidad puede exigir servidores redundantes.",
      "Por eso conviene identificarlos desde el inicio y no al final del proyecto.",
    ], op("¿Por qué conviene identificar los no funcionales pronto?", ["Porque pueden condicionar la arquitectura", "Porque nunca cambian", "Porque reemplazan a los funcionales", "No conviene hacerlo pronto"], 0,
      "Cambiar la arquitectura tarde es muy costoso.")),
  ]),

  lec(T, 11, "Requisitos medibles", "Cómo convertir una intención vaga en algo verificable.", [
    sec("El problema de lo vago", [
      "Los usuarios expresan metas generales como «el sistema debe ser fácil de usar» o «rápido». Son útiles como intención, pero no se pueden comprobar.",
      "Un requisito vago causa discusiones al final: cada quien interpreta «rápido» a su manera.",
    ], op("¿Cuál de estos requisitos NO se puede verificar?", ["La búsqueda responde en menos de 2 segundos", "El sistema debe ser amigable", "Se soportan 500 usuarios simultáneos", "Cada alumno inicia sesión con una cuenta de Google"], 1,
      "«Amigable» no tiene un criterio objetivo.")),
    sec("Métricas", [
      "Para hacer verificable un requisito se le asigna una métrica: velocidad (tiempo de respuesta, transacciones por segundo), tamaño (memoria), facilidad de uso (tiempo de capacitación), confiabilidad (tasa de fallos), robustez y portabilidad.",
      "La meta «fácil de usar» puede convertirse en «un alumno nuevo completa su primera lección en menos de 5 minutos sin ayuda».",
    ], rel("Relaciona la propiedad con una métrica posible.", [
      ["Velocidad", "Tiempo de respuesta en segundos"],
      ["Facilidad de uso", "Minutos de capacitación necesarios"],
      ["Confiabilidad", "Cantidad de fallos por periodo de uso"],
      ["Tamaño", "Memoria ocupada"],
    ], "Cada propiedad se puede medir con una cifra o una condición concreta.")),
    sec("Escribir el umbral", [
      "Un buen requisito medible indica el valor y las condiciones: «La lección debe mostrarse en 3 segundos o menos con conexión de 10 Mbps».",
      "Sin las condiciones, la cifra pierde sentido: ¿en qué dispositivo? ¿Con cuántos usuarios?",
    ], vf("Basta indicar una cifra sin condiciones para que el requisito esté bien escrito.", false,
      "Falso: sin condiciones (dispositivo, carga, conexión) la cifra puede interpretarse de distintas formas.")),
  ]),

  lec(T, 12, "Redactar buenos requisitos", "Reglas prácticas para escribir sin ambigüedad.", [
    sec("Características", [
      "Un buen requisito suele ser necesario, no ambiguo, singular (una sola cosa), factible, verificable y con un identificador único. Un conjunto de requisitos debe además ser consistente y completo.",
      "Estas características se mencionan en la norma ISO/IEC/IEEE 29148.",
    ], rel("Relaciona la característica con su significado.", [
      ["Singular", "Expresa una sola cosa"],
      ["Verificable", "Se puede comprobar con una prueba"],
      ["No ambiguo", "Tiene una sola interpretación"],
      ["Factible", "Se puede lograr con los recursos disponibles"],
    ], "Cada característica evita un problema distinto.")),
    sec("Palabras que ayudan y que estorban", [
      "Es común usar «debe» para lo obligatorio y «debería» para lo deseable, y mantener ese uso en todo el documento. Conviene evitar términos vagos como «rápido», «fácil», «etc.», «adecuado» o «y/o».",
      "Cada requisito debe ser una oración con un sujeto, un verbo y una condición clara.",
    ], op("¿Cuál de estas redacciones es mejor?", ["El sistema será rápido, fácil, etc.", "El sistema debe mostrar la lista de temas en 3 segundos o menos", "El sistema debería funcionar bien", "Todo debe ser adecuado"], 1,
      "Es singular, concreto y verificable.")),
    sec("Un requisito, una idea", [
      "Un requisito como «El sistema debe registrar la lección y enviar un correo al profesor» contiene dos ideas: si una falla y la otra no, es difícil decir si se cumplió.",
      "Se separa en dos requisitos, cada uno con su identificador y su prueba.",
    ], vf("Un solo requisito debería contener varias funciones unidas con «y» para ahorrar espacio.", false,
      "Falso: cada requisito debe expresar una sola cosa para poder verificarlo y trazarlo.")),
  ]),

  lec(T, 13, "El documento de requisitos (SRS)", "Dónde se escribe y organiza la especificación.", [
    sec("Qué es", [
      "La Especificación de Requisitos de Software (SRS) es el documento oficial de lo que debe implementar el equipo de desarrollo. Incluye los requisitos de usuario y los de sistema.",
      "Lo usan muchos lectores distintos: clientes, gerentes, ingenieros de desarrollo, de pruebas y de mantenimiento.",
    ], co("El documento ___ recoge de forma oficial lo que debe implementar el equipo.", ["SRS", "SQL", "ERP", "HTML"], 0,
      "SRS es la Especificación de Requisitos de Software.")),
    sec("Contenido típico", [
      "Las estructuras varían, pero suelen incluir: introducción (propósito, alcance, definiciones), descripción general del producto, requisitos específicos (funcionales, no funcionales, interfaces) y apéndices.",
      "El estándar clásico fue IEEE 830, hoy sustituido por la norma ISO/IEC/IEEE 29148.",
    ], ord("Ordena un SRS sencillo de lo general a lo específico.", ["Introducción", "Descripción general", "Requisitos específicos", "Apéndices"], "Se avanza de la visión general a lo específico y al material de apoyo.")),
    sec("Un documento vivo", [
      "El SRS no se escribe una vez y se guarda: se revisa y se versiona porque los requisitos cambian. Cada versión debe indicar qué cambió y quién la aprobó.",
      "Un SRS desactualizado es peor que uno incompleto, porque engaña a quienes lo consultan.",
    ], vf("Un SRS debe actualizarse y versionarse cuando cambian los requisitos.", true,
      "Es verdadero: si no se mantiene, deja de ser confiable.")),
  ]),

  lec(T, 14, "Análisis y negociación", "Resolver conflictos y decidir qué se va a construir.", [
    sec("Analizar los requisitos", [
      "Después de elicitar, se analizan: se agrupan por tema, se buscan duplicados, contradicciones y omisiones, y se aclara lo ambiguo.",
      "Sommerville menciona actividades como clasificación y organización, priorización y negociación, y especificación.",
    ], op("Después de elicitar requisitos, ¿qué se hace?", ["Se guardan sin revisar", "Se analizan buscando duplicados, contradicciones y omisiones", "Se borran", "Se construyen de inmediato"], 1,
      "El análisis detecta problemas antes de construir.")),
    sec("Detectar conflictos", [
      "Dos requisitos entran en conflicto cuando no se pueden cumplir al mismo tiempo: por ejemplo, «máxima seguridad con doble verificación» y «acceso en un solo clic».",
      "El conflicto debe discutirse con los interesados para decidir qué se prioriza o cómo conciliarlos.",
    ], rel("Relaciona la situación con el problema que presenta.", [
      ["Dos requisitos que no pueden cumplirse a la vez", "Conflicto"],
      ["El mismo requisito escrito dos veces", "Duplicado"],
      ["Una función que nadie pidió explícitamente pero se necesita", "Omisión"],
    ], "Detectarlos temprano es mucho más barato que descubrirlos al probar.")),
    sec("Negociar", [
      "En la negociación se buscan acuerdos: ceder en algo para ganar en otra cosa. El equipo explica el costo y el riesgo de cada opción para que los interesados decidan con información.",
      "Es importante registrar lo acordado y quién lo aprobó.",
    ], vf("Basta imponer la decisión del equipo técnico sin explicar costos a los interesados.", false,
      "Falso: la negociación requiere información clara para decidir.")),
  ]),

  lec(T, 15, "Priorización de requisitos", "No todo se puede hacer al mismo tiempo.", [
    sec("Por qué priorizar", [
      "Casi nunca alcanzan el tiempo ni el presupuesto para todo lo que se pide. Priorizar es decidir qué es más importante para entregar primero.",
      "Sin prioridades claras, el equipo trabaja en lo urgente de cada día y pierde de vista lo valioso.",
    ], vf("Siempre hay tiempo y presupuesto para construir todos los requisitos solicitados.", false,
      "Falso: por eso es necesario priorizar.")),
    sec("MoSCoW", [
      "MoSCoW es una técnica sencilla: Must (debe tenerse), Should (debería tenerse), Could (podría tenerse) y Won't (no se hará esta vez).",
      "Los «Must» son lo imprescindible para que el producto sea útil; los «Won't» se dejan explícitamente fuera del alcance actual.",
    ], rel("Relaciona la categoría con su significado.", [
      ["Must", "Imprescindible"],
      ["Should", "Importante, pero no vital"],
      ["Could", "Deseable si hay tiempo"],
      ["Won't", "No se hará esta vez"],
    ], "MoSCoW da un lenguaje común para discutir prioridades.")),
    sec("Criterios para priorizar", [
      "Se puede considerar el valor para el usuario o el negocio, el riesgo, el costo de construirlo, la dependencia con otros requisitos y las obligaciones legales.",
      "Un requisito de alto valor y bajo costo suele ir primero; uno de alto costo y bajo valor puede esperar.",
    ], op("Un requisito de alto valor y bajo costo, en general, se debería…", ["Dejar para el final", "Hacer pronto", "Eliminar", "Ignorar"], 1,
      "Da mucho beneficio con poco esfuerzo.")),
  ]),

  lec(T, 16, "Validación de requisitos", "Comprobar que los requisitos son los correctos.", [
    sec("Qué se valida", [
      "La validación comprueba que los requisitos definen realmente el sistema que el cliente quiere. Cuesta mucho corregir un error de requisitos después de haber construido el sistema.",
      "Por eso se valida pronto y con frecuencia.",
    ], co("Corregir un error de requisitos cuesta ___ cuanto más tarde se detecta.", ["menos", "más", "lo mismo", "nada"], 1,
      "Mientras más avanzado el proyecto, más productos hay que rehacer.")),
    sec("Qué se comprueba", [
      "Sommerville menciona comprobaciones de validez (¿cumple la necesidad real?), consistencia (sin contradicciones), completitud (incluye todas las funciones y restricciones), realismo (¿es posible con la tecnología y el presupuesto?) y verificabilidad (¿se puede probar?).",
    ], rel("Relaciona la comprobación con la pregunta que responde.", [
      ["Validez", "¿Cubre la necesidad real del usuario?"],
      ["Consistencia", "¿Hay contradicciones entre requisitos?"],
      ["Completitud", "¿Falta alguna función o restricción?"],
      ["Realismo", "¿Se puede lograr con los recursos?"],
      ["Verificabilidad", "¿Se puede comprobar con una prueba?"],
    ], "Cada comprobación detecta un tipo distinto de problema.")),
    sec("Técnicas", [
      "Las técnicas principales son las revisiones de requisitos (lectura sistemática por un grupo), el prototipado (el usuario prueba un modelo) y la generación de casos de prueba (si no se puede escribir una prueba, el requisito probablemente es vago).",
      "Escribir las pruebas de aceptación al mismo tiempo que los requisitos ayuda a encontrar ambigüedades.",
    ], op("Si no se puede escribir una prueba para un requisito, probablemente…", ["Es un requisito excelente", "Es vago o ambiguo", "Es funcional", "No es necesario"], 1,
      "La dificultad para probarlo suele indicar ambigüedad.")),
  ]),

  lec(T, 17, "Cambios y trazabilidad", "Seguir el rastro de cada requisito durante el proyecto.", [
    sec("El cambio es normal", [
      "Los requisitos cambian porque cambian el negocio, la tecnología y la comprensión del problema. Intentar impedir los cambios no funciona; hay que gestionarlos.",
      "Un proceso de gestión de cambios evalúa el impacto de cada cambio propuesto antes de aceptarlo.",
    ], vf("La mejor manera de gestionar los cambios en requisitos es prohibirlos.", false,
      "Falso: son inevitables; se gestionan evaluando su impacto.")),
    sec("Evaluar un cambio", [
      "Al proponer un cambio se analiza qué requisitos, diseños, código y pruebas se afectan, cuánto costaría y qué riesgo conlleva. Con esa información se aprueba, se pospone o se rechaza.",
      "Una vez aprobado, se actualizan todos los productos afectados y se registra el cambio.",
    ], ord("Ordena el proceso de un cambio de requisitos.", ["Se propone el cambio", "Se evalúa su impacto y costo", "Se aprueba o se rechaza", "Se actualizan los productos afectados"], "Evaluar antes de decidir y actualizar todo lo afectado después.")),
    sec("Trazabilidad", [
      "La trazabilidad es la capacidad de seguir un requisito hacia atrás (a su origen) y hacia adelante (a su diseño, código y pruebas). Suele registrarse en una matriz de trazabilidad.",
      "Permite saber qué se afecta si cambia un requisito y comprobar que todo requisito tiene una prueba.",
    ], op("¿Para qué sirve una matriz de trazabilidad?", ["Para decorar el documento", "Para relacionar cada requisito con su origen, diseño, código y pruebas", "Para reemplazar las pruebas", "Para eliminar el diseño"], 1,
      "Ayuda a medir el impacto de un cambio y a verificar la cobertura de pruebas.")),
  ]),

  lec(T, 18, "Diagramas de casos de uso", "Una vista general de lo que el sistema ofrece a sus actores.", [
    sec("Elementos del diagrama", [
      "El diagrama de casos de uso de UML muestra a los actores (figuras humanas o cajas), los casos de uso (óvalos) y el límite del sistema (un rectángulo que encierra los casos de uso).",
      "Los actores se conectan con los casos de uso con los que interactúan mediante líneas de asociación.",
    ], rel("Relaciona el elemento con su representación.", [
      ["Actor", "Figura humana o caja fuera del sistema"],
      ["Caso de uso", "Óvalo dentro del límite del sistema"],
      ["Límite del sistema", "Rectángulo que contiene los casos de uso"],
    ], "El diagrama separa lo que está dentro del sistema de lo que interactúa con él.")),
    sec("Relaciones entre casos de uso", [
      "<<include>> indica que un caso de uso siempre incorpora a otro; <<extend>> indica que agrega comportamiento opcional bajo cierta condición. También puede haber generalización entre actores o entre casos de uso.",
      "Una regla práctica: si el comportamiento ocurre siempre, es include; si ocurre solo a veces, es extend.",
    ], op("Si un comportamiento ocurre solo bajo cierta condición, se modela con…", ["<<include>>", "<<extend>>", "Un actor nuevo", "Un rectángulo"], 1,
      "Extend modela comportamiento opcional o condicional.")),
    sec("Nombrar casos de uso", [
      "Un caso de uso se nombra con un verbo y un complemento desde la perspectiva del actor: «Consultar tema», «Completar lección», «Diseñar ciudad virtual».",
      "Evita nombres técnicos («Insertar registro en BD») porque describen la implementación, no el valor para el actor.",
    ], vf("Un buen nombre de caso de uso describe una acción con valor para el actor, no un detalle técnico.", true,
      "Es verdadero: se nombra desde la perspectiva del usuario.")),
  ]),

  lec(T, 19, "Especificar un caso de uso", "La plantilla que describe cada caso a detalle.", [
    sec("La plantilla", [
      "Cada caso de uso se detalla con una plantilla que suele incluir: nombre, actor, descripción, precondiciones, flujo normal, flujos alternativos, excepciones y poscondiciones.",
      "El diagrama dice qué casos hay; la plantilla dice cómo transcurre cada uno.",
    ], rel("Relaciona el campo con su contenido.", [
      ["Precondiciones", "Lo que debe cumplirse antes de empezar"],
      ["Flujo normal", "Los pasos del camino esperado"],
      ["Excepciones", "Qué ocurre cuando algo falla"],
      ["Poscondiciones", "Lo que queda al terminar"],
    ], "Cada campo responde una pregunta distinta sobre el caso de uso.")),
    sec("Escribir el flujo", [
      "El flujo normal se escribe como pasos numerados que alternan entre acciones del actor y respuestas del sistema: «1. El alumno elige un tema. 2. El sistema muestra sus lecciones».",
      "Cada paso debe ser breve, en voz activa y sin detalles de pantalla o de base de datos.",
    ], ord("Ordena este flujo normal de «Consultar lecciones».", ["El alumno elige un tema", "El sistema muestra las lecciones del tema", "El alumno elige una lección", "El sistema muestra el contenido de la lección"], "Se alternan acciones del actor y respuestas del sistema.")),
    sec("Alternativas y excepciones", [
      "Los flujos alternativos (variantes válidas) y las excepciones (fallas) se escriben indicando en qué paso del flujo normal ocurren y cómo continúa o termina el caso.",
      "Por ejemplo: «2a. Si no se pueden cargar las lecciones, el sistema muestra un error y ofrece reintentar».",
    ], op("Una excepción como «el sistema no puede cargar las lecciones» describe…", ["El camino esperado", "Un manejo de falla", "El actor", "Una precondición"], 1,
      "Las excepciones describen qué hace el sistema cuando algo falla.")),
  ]),

  lec(T, 20, "Del requisito al diseño y a las pruebas", "Cómo los requisitos alimentan el resto del proyecto.", [
    sec("De los casos de uso al diseño", [
      "Cada caso de uso puede traducirse en un diagrama de secuencia, que muestra cómo colaboran los objetos o componentes del sistema, paso a paso, para cumplir el flujo.",
      "Las clases que aparecen en esos diagramas ayudan a construir el diagrama de clases.",
    ], co("Un diagrama de ___ muestra cómo colaboran los componentes para cumplir un caso de uso.", ["secuencia", "Gantt", "organización", "red"], 0,
      "El diagrama de secuencia detalla la interacción del caso de uso.")),
    sec("De los requisitos a las pruebas", [
      "Cada requisito debe tener al menos una prueba que lo verifique. Los flujos normales, alternativos y las excepciones de un caso de uso son una buena fuente de casos de prueba.",
      "Si un requisito no tiene prueba, no se sabe si se cumplió; si una prueba no se relaciona con un requisito, tal vez sobra o falta un requisito.",
    ], rel("Relaciona la fuente con el caso de prueba que sugiere.", [
      ["Flujo normal", "Prueba del camino esperado"],
      ["Flujo alternativo", "Prueba de una variante válida"],
      ["Excepción", "Prueba del manejo de un error"],
    ], "Cada flujo del caso de uso sugiere al menos una prueba.")),
    sec("El hilo conductor", [
      "Un buen proyecto mantiene un hilo claro: necesidad, requisito, caso de uso, diseño, código y prueba. La matriz de trazabilidad registra ese hilo.",
      "Con él es posible responder con rapidez: «¿para qué existe este código?» y «¿qué se afecta si cambia este requisito?».",
    ], vf("Si cada requisito está relacionado con su diseño, código y prueba, es más fácil evaluar el impacto de un cambio.", true,
      "Es verdadero: esa relación es justo lo que permite medir el impacto de un cambio.")),
  ]),
];

// ---------- Preguntas adicionales de la evaluación del tema (CDU-3): de 5 a 12 ----------
export const evaluacionExtraRequisitos = [
  { id: "re6", texto: "Los requisitos de usuario están escritos principalmente para…", opciones: ["Lectores no técnicos como clientes y usuarios", "El compilador", "Solo el equipo de pruebas", "Los reguladores únicamente"], correcta: 0, explicacion: "Se redactan de forma comprensible para quienes no son técnicos." },
  { id: "re7", texto: "Una técnica de elicitación que consiste en mirar a las personas trabajando en su entorno es…", opciones: ["Cuestionario", "Observación", "Prototipo", "Revisión"], correcta: 1, explicacion: "La observación revela hábitos que los usuarios no mencionan." },
  { id: "re8", texto: "¿Cuál es un criterio de aceptación bien escrito?", opciones: ["El sistema debe ser bonito", "Dado un alumno con sesión, cuando abre un tema, entonces ve sus lecciones", "Debe funcionar bien", "Todo rápido"], correcta: 1, explicacion: "Describe situación, acción y resultado verificable." },
  { id: "re9", texto: "«La búsqueda responde en menos de 2 segundos» es un requisito…", opciones: ["Funcional", "No funcional medible", "Organizacional ambiguo", "Un caso de uso"], correcta: 1, explicacion: "Es una propiedad de desempeño con un umbral comprobable." },
  { id: "re10", texto: "En MoSCoW, ¿qué significa «Won't»?", opciones: ["Imprescindible", "No se hará esta vez", "Deseable", "Urgente"], correcta: 1, explicacion: "Se deja explícitamente fuera del alcance actual." },
  { id: "re11", texto: "Comprobar que no hay contradicciones entre requisitos es una validación de…", opciones: ["Consistencia", "Realismo", "Portabilidad", "Estética"], correcta: 0, explicacion: "La consistencia busca que los requisitos no se contradigan." },
  { id: "re12", texto: "La matriz de trazabilidad sirve para…", opciones: ["Relacionar cada requisito con su origen, diseño, código y pruebas", "Medir la velocidad del servidor", "Dibujar pantallas", "Reemplazar el SRS"], correcta: 0, explicacion: "Permite evaluar el impacto de un cambio y la cobertura de pruebas." },
];

// ---------- Preguntas adicionales del banco del reto del día (CDU-2): de 5 a 10 ----------
export const retoExtraRequisitos = [
  { id: "rq6", texto: "¿Cuál es la forma típica de una historia de usuario?", opciones: ["Como [rol], quiero [algo], para [beneficio]", "El sistema deberá, etc.", "SELECT * FROM historias", "Pantalla 1, pantalla 2"], correcta: 0, explicacion: "Quién, qué y para qué." },
  { id: "rq7", texto: "Un requisito que dice «y/o, etc.» tiene el problema de ser…", opciones: ["Demasiado corto", "Ambiguo", "Funcional", "Medible"], correcta: 1, explicacion: "Las expresiones vagas admiten varias interpretaciones." },
  { id: "rq8", texto: "El rectángulo que encierra los casos de uso en un diagrama representa…", opciones: ["El actor", "El límite del sistema", "Una excepción", "Una base de datos"], correcta: 1, explicacion: "Separa lo que está dentro del sistema de sus actores." },
  { id: "rq9", texto: "Un requisito como «protección de datos personales según la ley» es de tipo…", opciones: ["Externo", "Del producto", "Organizacional", "De usuario final"], correcta: 0, explicacion: "Proviene de normas externas a la organización." },
  { id: "rq10", texto: "Escribir pruebas de aceptación junto con los requisitos ayuda a…", opciones: ["Detectar ambigüedades", "Ocultar errores", "Quitar el diseño", "Evitar al cliente"], correcta: 0, explicacion: "Si no se puede escribir la prueba, el requisito probablemente es vago." },
];
