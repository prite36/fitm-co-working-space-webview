<template>
  <div class="hello">
    <div class="">
      Email <input type="text" name="email" value="" v-model="email">
      <button type="button" name="button" @click="pushdata()">Submit</button>
      <!-- User {{ $route.params.senderID }} -->

    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    pushdata: function () {
      this.email = 'a'
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
