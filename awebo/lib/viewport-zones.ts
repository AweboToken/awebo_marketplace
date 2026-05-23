/** Bottom-right quadrant of the viewport. */
export function isBottomRightQuadrant(clientX: number, clientY: number) {
  return (
    clientX >= window.innerWidth / 2 &&
    clientY >= window.innerHeight / 2
  );
}
