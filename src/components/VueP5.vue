<template>
  <div id="p5-canvas" class="p5-canvas"></div>
</template>

<script>
import P5 from 'p5';

export default {
  name: "vuep5",
  data () {
    return {
      color: [0, 255, 0],
      p5: null,
      isLoading: true
    }
  },
  methods: {
    loading() {
      console.log("loading")
      this.isLoading = true;
    },
    finishedLoading() {
      this.isLoading = false
      console.log("finished loading")
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
        
        if(t.isLoading) {
          t.$emit('loading', p5);
        } else {
          t.$emit('draw', p5);
        }  
      }

      p5.mousePressed = (e) => {
        if(e.path[0].classList.contains('p5Canvas')) { // only pass event if scroll is on top of canvas
          t.$emit('mousePressed', p5);
        }
      }

      p5.mouseReleased = (e) => {
        if(e.path[0].classList.contains('p5Canvas')) { // only pass event if scroll is on top of canvas
          t.$emit('mouseReleased', p5);
        }
      }

      p5.keyReleased = (e) => {
        if(e.path[0].classList.contains('p5Canvas')) { // only pass event if scroll is on top of canvas
          t.$emit('keyReleased', p5);
        }
      }
      window.addEventListener("wheel", function(e) {
        if(e.path[0].classList.contains('p5Canvas')) { // only pass event if scroll is on top of canvas
          t.$emit('scroll', e); 
        }
      });
      p5.mouseDragged = (e) => {
        if(e.path[0].classList.contains('p5Canvas')) { // only pass event if scroll is on top of canvas
          t.$emit('mouseDragged', p5);
        }
      }
    }
    // NOTE: Use p5 as an instance mode
    new P5(script, 'p5-canvas')
  }
}
</script>

<style>
</style>