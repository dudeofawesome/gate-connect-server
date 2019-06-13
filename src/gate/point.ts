// TODO: figure out a better place for this

export class Point {
  constructor(public x: number, public y: number) {}

  toString() {
    return `${this.x},${this.y}`;
  }
}
