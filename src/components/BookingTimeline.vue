<template>
  <div class="BookingTimeline">
    <timeline :data="[['Washington', '1789-04-29', '1797-03-03'],['Adams', '1797-03-03', '1801-03-03']]"></timeline>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      email: '',
      name: '',
      phone: '',
      url: ''
    }
  },
  methods: {
    validateForm (scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          // eslint-disable-next-line
          alert('Form Submitted!')
        }
      })
    }
  }
  // computed: {
  //   name () {
  //     return `${this.first_name} ${this.last_name}`
  //   }
  // }
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
