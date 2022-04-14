<template>
  <div id="p5-canvas"></div>
</template>

<script>
import P5 from 'p5';

export default {
  name: "vuep5",
  data () {
    return {
      color: [0, 255, 0],
      p5: null
    }
  },
  methods: {
    something() {
      this.$emit('something', this.p5);
    }
  },
  mounted() {   
    const t = this;
    const script = function (p5) {
      t.p5 = p5;
      // NOTE: Set up is here   
      p5.setup = () => {     
        t.$emit('setup', p5);  
      }     
      // NOTE: Draw is here
      p5.draw = () => {    
        t.$emit('draw', p5);
      }

      p5.mousePressed = () => {
        t.$emit('mousePressed', p5);
      }

      p5.mouseReleased = () => {
        t.$emit('mouseReleased', p5);
      }

      p5.keyReleased = () => {
        t.$emit('keyReleased', p5);
      }
      window.addEventListener("wheel", function(e) {
        t.$emit('scroll', e);
      });
      p5.mouseDragged = () => {
        t.$emit('mouseDragged', p5);
      }
    }
    // NOTE: Use p5 as an instance mode
    new P5(script, 'p5-canvas')
  }
}
</script>

<style>
</style>