export default class GridSection {
  constructor(p5, x, y, sectionSize, s, gridXX) {
    this.position = {
      x: x,
      y: y
    }
    this.s = s
    this.gridXX = gridXX
    this.p5 = p5
    this.ss = sectionSize
    this.pixels = []
  }
  setPixel(i, pixel) {
    this.pixels[i] = pixel
  }
  draw() {
    for (const key in this.pixels) {
      if (Object.hasOwnProperty.call(this.pixels, key)) { 
        const color = this.pixels[key];

        const x = key % this.gridXX;
        const y = Math.floor(key / this.gridXX);

        // only render if in bounding box
        this.drawPixel(x * this.s, + y * this.s, color)
      }
    }
  }
  drawPixel(x,y, c) {
    this.p5.strokeWeight(0)
    this.p5.fill(c)
    this.p5.square(x, y, this.s)
  }
}