<template>
  <div class="hello">
    <button type="button" name="button" @click="test()">TEST</button>
  </div>
</template>

<script>
import Moment from 'moment'
// import momenTime from 'moment-timezone'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    test () {
      let format = 'YYYY-MM-DD HH:mm'
      let start = moment('2017-11-12 23:30', format).add(1, 'h')
      console.log('show time ' + moment(start).format(format))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
