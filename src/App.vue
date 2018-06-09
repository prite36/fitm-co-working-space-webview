<template>
  <div id="app">
    <v-app>
    <router-view :appID="appID"></router-view>
  </v-app>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      appID: 170341890182672
    }
  }
}
</script>
<style lang="stylus">
  @import './styles/main'
</style>
<style lang="scss">
  @import './styles/font.scss';
</style>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #F5F5F5;
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
</style>
