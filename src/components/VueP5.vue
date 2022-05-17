<template>
  <div id="p5-canvas" class="p5-canvas"></div>
</template>

<script>
import P5 from 'p5';

export default {
  name: "vuep5",
  props: [
    'c'
  ],
  data () {
    return {
      color: [0, 255, 0],
      p5: null,
      isLoading: true,
      isPinch: false,
      touching: false,
    }
  },
  methods: {
    loading() {
      // console.log("loading")
      this.isLoading = true;
    },
    finishedLoading() {
      this.isLoading = false
      // console.log("finished loading")
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

      p5.touchStarted = (e) => {
        if(e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          if(e.touches.length == 1) {
            t.$emit('mousePressed', p5)
          } else if(e.touches.length > 1) {
            t.$emit('pinchStart', e.touches)
            t.isPinch = true
          }
        }
      }
      p5.touchMoved = (e) => {
        if(e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          if(e.touches.length > 1) {
            t.$emit('pinchScale', e.touches)
          }
        }
      }
      p5.touchEnded = (e) => {
        //if(e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          if(e.touches.length == 0) {
            if(t.isPinch) {
              t.$emit('mouseReleased', p5);
            } else {
              t.isPinch = false
            }
          } else if(e.touches.length == 1) {
            t.$emit('pinchStop', e.touches[0])
          }
        //}
      }

      p5.mousePressed = (e) => {
        if(e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          t.$emit('mousePressed', p5);
          t.touching = true
        }
      }

      p5.mouseReleased = (e) => {
        if(t.touching || e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          t.$emit('mouseReleased', p5);
          t.touching = false
        }
      }

      p5.keyReleased = (e) => {
        if(e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          t.$emit('keyReleased', p5);
        }
      }
      window.addEventListener("wheel", function(e) {
        // console.log('scroll')
        if(e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          // console.log('here')
          e.preventDefault();
          t.$emit('scroll', e);
        }
      }, { passive: false });
      p5.mouseDragged = (e) => {
        if(e.target.classList.contains(t.c)) { // only pass event if scroll is on top of canvas
          t.$emit('mouseDragged', p5);
        }
      }
      document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
        return false;
      });
      document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
        return false;
      });
    }
    // NOTE: Use p5 as an instance mode
    new P5(script, 'p5-canvas')
  }
}
</script>

<style>
</style>