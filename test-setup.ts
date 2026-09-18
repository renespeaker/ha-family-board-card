/* ------------------------------------------------------------------ */
/*  Browser APIs happy-dom does not implement, stubbed just enough for */
/*  the card to render. Everything here is layout, never logic.        */
/*  Runs for every test file, including the pure ones in the node      */
/*  environment - hence the guards.                                    */
/* ------------------------------------------------------------------ */

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver ??= ResizeObserverStub;

if (typeof Element !== "undefined") {
  // The card scrolls the day board / agenda into view after rendering.
  Element.prototype.scrollTo ??= function scrollTo() {};
  Element.prototype.setPointerCapture ??= function setPointerCapture() {};
}
