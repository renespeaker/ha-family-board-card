/* ------------------------------------------------------------------ */
/*  GESPIEGELTE DATEI — Zeichen für Zeichen gleich zu halten in:       */
/*    renespeaker/ha-family-board-card  src/shared/person-palette.ts   */
/*    renespeaker/ha-family-task-card   src/shared/person-palette.ts   */
/*                                                                     */
/*  Beide Karten geben derselben Person dieselbe Farbe — aber nur,     */
/*  solange diese Liste in beiden Repos übereinstimmt. `npm run        */
/*  check:shared` vergleicht sie mit der Kopie im anderen Repo und     */
/*  meldet Abweichungen (ohne die CI zu blockieren, damit eine         */
/*  beabsichtigte Änderung nicht das jeweils andere Repo lahmlegt).    */
/*                                                                     */
/*  Ändert sich hier etwas, gehört derselbe Stand in beide Repos.      */
/* ------------------------------------------------------------------ */

/** Personenfarben, in der Reihenfolge ihrer Vergabe. */
export const PERSON_PALETTE: string[] = [
  "#8B7CF6",
  "#34D399",
  "#FBBF24",
  "#FB7185",
  "#22D3EE",
  "#C084FC",
  "#A3E635",
  "#FB923C",
  "#F472B6",
  "#60A5FA",
];
