<template>
  <div class="BookingTimeline">
    <timeline :data="[
      ['meet1', '2018-02-07 00:00 GMT+7', '2018-02-07 01:00 GMT+7'],
      ['meet1', '2018-02-07 02:00 GMT+7', '2018-02-07 02:45 GMT+7'],
      ['meet1', '2018-02-07 03:00 GMT+7', '2018-02-07 04:00 GMT+7'],
      ['meet1', '2018-02-07 07:30 GMT+7', '2018-02-07 07:50 GMT+7'],
      ['meet2', '2018-02-07 01:00 GMT+7', '2018-02-07 02:00 GMT+7'],
      ['meet2', '2018-02-07 02:10 GMT+7', '2018-02-07 02:45 GMT+7'],
      ['meet2', '2018-02-07 03:00 GMT+7', '2018-02-07 04:00 GMT+7'],
      ['meet2', '2018-02-07 06:30 GMT+7', '2018-02-07 07:50 GMT+7'],
      ['meet3', '2018-02-07 00:00 GMT+7', '2018-02-07 01:00 GMT+7'],
      ['meet3', '2018-02-07 02:00 GMT+7', '2018-02-07 02:45 GMT+7'],
      ['meet3', '2018-02-07 03:00 GMT+7', '2018-02-07 04:00 GMT+7'],
      ['meet3', '2018-02-07 09:30 GMT+7', '2018-02-07 10:50 GMT+7'],
    ]"></timeline>
    <timeline :data="[
      ['3DPrint1', '2018-02-07 00:00 GMT+7', '2018-02-07 24:00 GMT+7'],
      ['3DPrint2', '2018-02-07 02:00 GMT+7', '2018-02-07 10:45 GMT+7'],
      ['Lacercut1', '2018-02-07 09:00 GMT+7', '2018-02-07 15:00 GMT+7'],
      ['Lacercut1', '2018-02-07 16:10 GMT+7', '2018-02-07 20:45 GMT+7'],
    ]"></timeline>
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
