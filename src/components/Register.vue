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
import firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyCu1lysb6zuhr9NRzYY_y34BkcPQUGudBs',
  authDomain: 'test-code-app-2-open-app-more.firebaseapp.com',
  databaseURL: 'https://test-code-app-2-open-app-more.firebaseio.com',
  projectId: 'test-code-app-2-open-app-more',
  storageBucket: 'test-code-app-2-open-app-more.appspot.com',
  messagingSenderId: '40249033052'
}
firebase.initializeApp(config)
var db = firebase.database()
export default {
  name: 'HelloWorld',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    pushdata: function () {
      db.ref('profile/').child(this.$route.params.status).child(this.$route.params.senderID).set({
        email: this.email
      })
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
