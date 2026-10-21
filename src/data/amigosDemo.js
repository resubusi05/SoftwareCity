// AMIGOS DE PRUEBA (CDU-12).
// Igual que el alumno simulado (alumno-demo), en este incremento no hay inicio de sesión ni caso de uso
// para agregar amigos por código, así que la lista de amigos y sus ciudades son datos de prueba.
// Cuando exista el login con Google y el caso de uso de agregar amigo, amigosRepo leerá esto de Firestore.
//
// Casos que cubren:
//   Amigo A: ciudad con varios edificios (flujo normal)
//   Amigo B: ciudad con pocos edificios (A1: visitar a otro amigo)
//   Amigo C: todavía no tiene ciudad (E1)

export const AMIGOS_DEMO = [
  { id: "amigo-a", nombre: "Amigo A" },
  { id: "amigo-b", nombre: "Amigo B" },
  { id: "amigo-c", nombre: "Amigo C" },
];

/** Ciudad de cada amigo: { loteId: edificioId }. null = todavía no diseña su ciudad. */
export const CIUDADES_DEMO = {
  "amigo-a": {
    L1: "torre-requisitos",
    L2: "oficina-scrum",
    L3: "kiosco-bugs",
    L5: "fabrica-codigo",
    L6: "laboratorio-pruebas",
    L7: "torre-requisitos",
    L10: "caseta-versiones",
  },
  "amigo-b": {
    L6: "oficina-scrum",
    L4: "caseta-versiones",
    L5: "biblioteca-documentacion",
  },
  "amigo-c": null,
};
