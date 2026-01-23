<template>
  <div class="logo-loader">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <mask id="clipping">
          <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
          <polygon points="25,25 75,25 50,75" fill="white"></polygon>
          <polygon points="50,25 75,75 25,75" fill="white"></polygon>
          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
        </mask>
      </defs>
    </svg>
    <div class="box"></div>
  </div>
</template>

<script setup lang="ts">
// No props needed for now, can be added if size customization is required
</script>

<style scoped>
.logo-loader {
  --color-one: #5F9598;
  --color-two: #1D546D;
  --color-three: #5f959880;
  --color-four: #1d546d80;
  --color-five: #5f959840;
  --time-animation: 2s;
  --size: 1;
  position: relative;
  border-radius: 50%;
  transform: scale(var(--size));
  box-shadow:
    0 0 25px 0 var(--color-three),
    0 20px 50px 0 var(--color-four);
  animation: colorize calc(var(--time-animation) * 3) ease-in-out infinite;
}

.logo-loader::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border-top: solid 1px var(--color-one);
  border-bottom: solid 1px var(--color-two);
  background: linear-gradient(180deg, var(--color-five), var(--color-four));
  box-shadow:
    inset 0 10px 10px 0 var(--color-three),
    inset 0 -10px 10px 0 var(--color-four);
}

.logo-loader .box {
  width: 100px;
  height: 100px;
  background: linear-gradient(
    180deg,
    var(--color-one) 30%,
    var(--color-two) 70%
  );
  mask: url(#clipping);
  -webkit-mask: url(#clipping);
}

.logo-loader svg {
  position: absolute;
}

.logo-loader svg #clipping {
  filter: contrast(15);
  animation: roundness calc(var(--time-animation) / 2) linear infinite;
}

.logo-loader svg #clipping polygon {
  filter: blur(7px);
}

.logo-loader svg #clipping polygon:nth-child(1) {
  transform-origin: 75% 25%;
  transform: rotate(90deg);
}

.logo-loader svg #clipping polygon:nth-child(2) {
  transform-origin: 50% 50%;
  animation: rotation var(--time-animation) linear infinite reverse;
}

.logo-loader svg #clipping polygon:nth-child(3) {
  transform-origin: 50% 60%;
  animation: rotation var(--time-animation) linear infinite;
  animation-delay: calc(var(--time-animation) / -3);
}

.logo-loader svg #clipping polygon:nth-child(4) {
  transform-origin: 40% 40%;
  animation: rotation var(--time-animation) linear infinite reverse;
}

.logo-loader svg #clipping polygon:nth-child(5) {
  transform-origin: 40% 40%;
  animation: rotation var(--time-animation) linear infinite reverse;
  animation-delay: calc(var(--time-animation) / -2);
}

.logo-loader svg #clipping polygon:nth-child(6) {
  transform-origin: 60% 40%;
  animation: rotation var(--time-animation) linear infinite;
}

.logo-loader svg #clipping polygon:nth-child(7) {
  transform-origin: 60% 40%;
  animation: rotation var(--time-animation) linear infinite;
  animation-delay: calc(var(--time-animation) / -1.5);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes roundness {
  0% {
    filter: contrast(15);
  }
  20% {
    filter: contrast(3);
  }
  40% {
    filter: contrast(3);
  }
  60% {
    filter: contrast(15);
  }
  100% {
    filter: contrast(15);
  }
}

@keyframes colorize {
  0% {
    filter: hue-rotate(0deg);
  }
  20% {
    filter: hue-rotate(-15deg);
  }
  40% {
    filter: hue-rotate(-30deg);
  }
  60% {
    filter: hue-rotate(-45deg);
  }
  80% {
    filter: hue-rotate(-22deg);
  }
  100% {
    filter: hue-rotate(0deg);
  }
}
</style>
