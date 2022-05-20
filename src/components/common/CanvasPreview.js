export default class CanvasPreview {
  constructor(p5, pixels, width, height) {
    this.p5 = p5
    this.image = null
    this.canvas = null
    this.width = width
    this.height = height
    this.data = pixels
  }
      
  start() {
    return this.createImage(this.data)
  }
  createImage(data) {
    this.image = this.p5.createImage(this.width, this.height)
    this.image.loadPixels()
    for (const key in data) {
      if(key < this.width * this.height && key >= 0) {
        const x =  key % this.width
        const y =  Math.floor(key / this.width)
        const color = data[key]
        this.image.set(x, y, [this.p5.red(color), this.p5.green(color), this.p5.blue(color), 255]);
      }
    }
    this.image.updatePixels();
    return this.image
  }

}