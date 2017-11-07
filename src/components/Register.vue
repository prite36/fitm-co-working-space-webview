<template>
  <div class="hello">
    <div class="">
      Name <input type="text" name="name" value="" v-model="name">
      Email <input type="text" name="email" value="" v-model="email">
      <button type="button" name="button" @click="postPost()">Submit</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
var config = {
  apiKey: 'AIzaSyAE2rQQye4hlRpDqAWirvyaaCExiaWA8DY',
  authDomain: 'fitm-coworkingspace.firebaseapp.com',
  databaseURL: 'https://fitm-coworkingspace.firebaseio.com',
  projectId: 'fitm-coworkingspace',
  storageBucket: 'fitm-coworkingspace.appspot.com',
  messagingSenderId: '181239315787'
}
firebase.initializeApp(config)
var db = firebase.database()
console.log(db)
export default {
  name: 'HelloWorld',
  data () {
    return {
      name: '',
      email: ''
    }
  },
  methods: {
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/externalregister`, {
        body: {
          status: this.$route.params.status,
          senderID: this.$route.params.senderID,
          name: this.name,
          email: this.email
        }
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
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
