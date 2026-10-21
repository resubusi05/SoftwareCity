// CATÁLOGO DE LA CIUDAD VIRTUAL (CDU-10). Decisión TK-06: el catálogo vive en el código, como contenido.js.
//
// ⚠ POR DEFINIR (TK-08): número de lotes, tamaños, nombres de edificios y precios.
//   Todo lo de este archivo son VALORES DE RELLENO para poder construir y probar las pantallas.
//
// Coordenadas en unidades de la escena 3D: el plano va de -7.5 a 7.5 en X y en Z.
// x, z = centro del lote; ancho (X) y fondo (Z) = medidas del lote.

import { PUNTAJE_CIUDAD } from "../config";

/** CDU-10 E1: "Mi ciudad" aparece al alcanzar PUNTAJE_CIUDAD y ya no se vuelve a ocultar. */
export function ciudadDesbloqueada(alumno) {
  return !!alumno?.ciudadDesbloqueada || (alumno?.puntos ?? 0) >= PUNTAJE_CIUDAD;
}

export const TAMANO_PLANO = 15; // lado del plano (unidades)

export const TAMANOS = {
  chico: { nombre: "Chico", orden: 1 },
  mediano: { nombre: "Mediano", orden: 2 },
  grande: { nombre: "Grande", orden: 3 },
};

/** Lotes fijos del plano (decisión TK-06: lotes fijos, cada uno con su tamaño). */
export const LOTES = [
  { id: "L1", tamano: "mediano", x: -5, z: -5, ancho: 4, fondo: 4 },
  { id: "L2", tamano: "mediano", x: 0, z: -5, ancho: 4, fondo: 4 },
  { id: "L3", tamano: "chico", x: 4, z: -6, ancho: 1.8, fondo: 1.8 },
  { id: "L4", tamano: "chico", x: 6, z: -4, ancho: 1.8, fondo: 1.8 },
  { id: "L5", tamano: "grande", x: -5, z: 2.5, ancho: 4, fondo: 9 },
  { id: "L6", tamano: "mediano", x: 0, z: 0, ancho: 4, fondo: 4 },
  { id: "L7", tamano: "mediano", x: 5, z: 0, ancho: 4, fondo: 4 },
  { id: "L8", tamano: "mediano", x: 5, z: 5, ancho: 4, fondo: 4 },
  { id: "L9", tamano: "chico", x: -1, z: 4, ancho: 1.8, fondo: 1.8 },
  { id: "L10", tamano: "chico", x: 1, z: 6, ancho: 1.8, fondo: 1.8 },
];

/**
 * Edificios que se compran con puntos. Nombres, precios y alturas: DE EJEMPLO (TK-08).
 * modelo: ruta del .glb exportado de Cinema 4D dentro de /public (SCS 2.4), por ejemplo
 *         "/modelos/torre-requisitos.glb". Mientras sea null se dibuja una caja de relleno.
 */
export const EDIFICIOS = [
  { id: "kiosco-bugs", nombre: "Kiosco de Bugs", tamano: "chico", precio: 80, color: "#ff6b35", altura: 1.2, modelo: null },
  { id: "caseta-versiones", nombre: "Caseta de Versiones", tamano: "chico", precio: 90, color: "#00ff88", altura: 1.8, modelo: null },
  { id: "oficina-scrum", nombre: "Oficina Scrum", tamano: "mediano", precio: 100, color: "#7c3aed", altura: 2.6, modelo: null },
  { id: "torre-requisitos", nombre: "Torre de Requisitos", tamano: "mediano", precio: 150, color: "#00d4ff", altura: 4.5, modelo: null },
  { id: "laboratorio-pruebas", nombre: "Laboratorio de Pruebas", tamano: "mediano", precio: 180, color: "#f5c542", altura: 2.2, modelo: null },
  { id: "fabrica-codigo", nombre: "Fábrica de Código", tamano: "grande", precio: 220, color: "#3b82f6", altura: 2.4, modelo: null },
  { id: "biblioteca-documentacion", nombre: "Biblioteca de Documentación", tamano: "grande", precio: 250, color: "#ec4899", altura: 3.2, modelo: null },
];

export const buscarLote = (id) => LOTES.find((l) => l.id === id) ?? null;
export const buscarEdificio = (id) => EDIFICIOS.find((e) => e.id === id) ?? null;

/**
 * CDU-10 paso 4: un edificio "cabe" en un lote si es del mismo tamaño.
 * Si el equipo decide "igual o más chico", cambia esta única función:
 *   return TAMANOS[edificio.tamano].orden <= TAMANOS[lote.tamano].orden;
 */
export function cabeEnLote(edificio, lote) {
  return edificio.tamano === lote.tamano;
}

/** Cuántos lotes ocupados y libres tiene una ciudad ({ L7: "torre-requisitos", ... }). */
export function resumenCiudad(lotes) {
  const ocupados = LOTES.filter((l) => lotes?.[l.id]).length;
  return { ocupados, libres: LOTES.length - ocupados };
}
