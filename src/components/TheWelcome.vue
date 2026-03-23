<template>
  <div id="app" class="col">
    <Histogram
      :data="selectedData"
      :width="width"
      :height="height"
      :num-bins="parseInt(bins)"
    />
    <div class="row">
      <div class="col">
        <span>Random distribution</span>
        <select v-model="selectedDistribution">
          <option v-for="k in distributions" :key="k">{{ k }}</option>
        </select>
      </div>
      <div class="col">
        <span>Sample size : {{ sampleSize }}</span>
        <input type="range" v-model="sampleSize" min="10" max="2000" />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import Histogram from "../components/icons/IconCommunity.vue";

export default {
  name: "App",
  data() {
    return {
      data: {
        normal: d3.range(0, 2000).map(d3.randomNormal()),
        logNormal: d3.range(0, 2000).map(d3.randomLogNormal()),
        bates: d3.range(0, 2000).map(d3.randomBates(10)),
        irwinHall: d3.range(0, 2000).map(d3.randomIrwinHall(10)),
        exponential: d3.range(0, 2000).map(d3.randomExponential(0.05))
      },
      width: 300,
      height: 200,
      bins: 40,
      sampleSize: 200,
      selectedDistribution: "normal"
    };
  },
  computed: {
    selectedData() {
      return this.data[this.selectedDistribution].slice(
        0,
        parseInt(this.sampleSize)
      );
    },
    distributions() {
      return Object.keys(this.data);
    }
  },
  components: {
    Histogram: Histogram
  }
};
</script>
