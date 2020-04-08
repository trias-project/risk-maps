<template>
  <div id="legend" :style="styleObjectDivPrepared">
    <canvas ref="canvas" :height="canvasHeight" :width="canvasWidth" :style="styleCanvasPrepared" />
    <svg
      :height="styleDiv.height"
      :width="styleDiv.width"
      style="position: absolute; left: 0px; top: 0px;"
    >
      <g
        v-axis="{'scale': legendScale}"
        class="axis"
        :transform="`translate(${canvasWidth + 1}, ${styleDiv.margin.top})`"
      />
    </svg>
  </div>
</template>

<script lang="ts">
// Implementation heavily inspired by http://bl.ocks.org/syntagmatic/e8ccca52559796be775553b467593a9fx
import Vue from "vue";
import * as d3 from "d3";

export default Vue.extend({
  name: "ColorLegend",
  props: ["colorScale"],
  data: function() {
    return {
      styleDiv: {
        'height': 200,
        'width': 80,
        'margin': { top: 10, right: 60, bottom: 10, left: 2 }
      }
    };
  },
  directives: {
    axis(el, binding): void {
      const scaleFunction = binding.value.scale;

      const legendAxis = d3
        .axisRight<number>(scaleFunction)
        .tickSize(6)
        .ticks(8);

      legendAxis(d3.select((el as unknown) as SVGGElement));
    }
  },
  mounted: function() {
    const ctx = this.ctx;

    if (ctx != null) {
      d3.range(this.styleDiv.height).forEach(i => {
        ctx.fillStyle = this.colorScale(this.legendScale.invert(i));
        ctx.fillRect(0, i, this.canvasWidth, 1);
      });
    } else {
      // No context??
    }
  },
  computed: {
    legendScale: function(): d3.ScaleLinear<number, number> {
      return d3
        .scaleLinear()
        .range([
          1,
          this.styleDiv.height -
            this.styleDiv.margin.top -
            this.styleDiv.margin.bottom
        ])
        .domain(this.colorScale.domain());
    },
    ctx: function(): CanvasRenderingContext2D | null {
      return (this.$refs.canvas as HTMLCanvasElement).getContext("2d");
    },
    styleObjectDivPrepared: function(): object {
      return {
        display: "inline-block",
        position: "relative",
        height: this.styleDiv.height + 'px',
        width: this.styleDiv.width +  'px'
      };
    },
    styleCanvasPrepared: function(): object {
      return {
        'height': this.canvasHeight +  'px',
        'width': this.canvasWidth + 'px' ,
        'border': "1px solid #000",
        'position': "absolute",
        'top': this.styleDiv.margin.top + 'px',
        'left': this.styleDiv.margin.left + 'px'
      };
    },
    canvasWidth: function(): number {
      return (
        this.styleDiv.width -
        this.styleDiv.margin.left -
        this.styleDiv.margin.right
      );
    },
    canvasHeight: function(): number {
      return (
        this.styleDiv.height -
        this.styleDiv.margin.top -
        this.styleDiv.margin.bottom
      );
    }
  }
});
</script>