<template>
  <div v-show="this.isShow" class="lds-css ng-scope loading">
  <div class="lds-ripple">
    <div></div>
    <div></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    isShow: Boolean
  }
}
</script>

<style scoped>
@keyframes lds-ripple {
  0% {
    top: 95px;
    left: 95px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 47.5px;
    left: 47.5px;
    width: 95px;
    height: 95px;
    opacity: 0;
  }
}
@-webkit-keyframes lds-ripple {
  0% {
    top: 95px;
    left: 95px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 47.5px;
    left: 47.5px;
    width: 95px;
    height: 95px;
    opacity: 0;
  }
}
.loading {
    position: absolute;
    z-index: 999;
    top: 60px;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #fff;
}
.lds-ripple {
    position: relative;
    margin: 0 auto;
    width: 200px !important;
    height: 200px !important;
    -webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
    transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
}
.lds-ripple div {
    box-sizing: content-box;
    position: absolute;
    border-width: 5px;
    border-style: solid;
    opacity: 1;
    border-radius: 50%;
    -webkit-animation: lds-ripple 1.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    animation: lds-ripple 1.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(1) {
    border-color: #42b983;
}
.lds-ripple div:nth-child(2) {
    border-color: rgba(0%,48.23529411764716%,100%,0.605);
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
}
</style>
