<template>
  <div class="Booking">
    Please Select {{$route.params.item}}

    <div v-if="$route.params.item === 'device'">
     <div class="" v-for="(item, key) in items">
       Type Item = {{key}}
        <div class="" v-for="(childItem, key) in item">
          <v-btn color="primary">{{key}}</v-btn>
        </div>
     </div>
     </div>

     <div v-if="$route.params.item === 'meetingroom'">
      <div class="" v-for="(item, key) in items">
        Type Room = {{key}}
        <v-btn color="primary">{{key}}</v-btn>
      </div>
      </div>

  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
export default {
  name: 'Register',
  data () {
    return {
      db: firebase.database(),
      items: ''
    }
  },
  mounted () {
    let vm = this
    this.$bindAsObject('items', vm.db.ref('items').child(vm.$route.params.item))
  },
  methods: {
    push () {
      this.$firebaseRefs.data.push({
        text: '55585'
      })
    },
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/externalregister`, {
        body: {
          status: this.$route.params.status,
          senderID: this.$route.params.senderID,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          birtday: this.birtday,
          gender: this.gender
        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.regSuccess = true
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  watch: {
    items: function () {
      delete this.items['.key']
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.field {
  margin-left: 2%;
  margin-right: 2%;
}
.label {
  font-size: 16px;
  text-align: left;
}
</style>
