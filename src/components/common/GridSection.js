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
    this.pPixels = []
    this.tpPixels = []

    this.hPixels = []
    this.thPixels = []

    this.img = p5.createImage(this.ss, this.ss)
    this.offset = {
      x: x * sectionSize,
      y: y * sectionSize
    }
    this.pos = {
      x: 0,
      y: 0
    }
  }
  setPixel(i, c) {
    this.pixels[i] = c
  }
  draw() {
    this.p5.strokeWeight(0)
    this.img.loadPixels();
    for (const key in this.pixels) {
      if (Object.hasOwnProperty.call(this.pixels, key)) { 
        const color = this.pixels[key];

        const x =  (key % this.gridXX) - this.offset.x
        const y =  Math.floor(key / this.gridXX) - this.offset.y

        // only render if in bounding box
        //this.drawPixel(x * this.s, + y * this.s, color)
        this.img.set(x, y, [this.p5.red(color), this.p5.green(color), this.p5.blue(color), 255]);
      }
    }
    this.img.updatePixels();
    //console.log(this.offset.x, this.offset.y)
    this.p5.image(this.img, this.offset.x, this.offset.y)
  }
  updatePosition() {
    this.pos = {
      x: this.offset.x,
      y: this.offset.y
    }
    this.p5.fill("#ffffff")
    this.p5.rect(this.pos.x, this.pos.y, 100, 100);
    this.p5.image(this.img, this.pos.x, this.pos.y)
  }
  drawPixel(x, y, c) {
    let i = x + (this.gridXX * y)
    this.pixels[i] = c
    this.draw()
  }
}