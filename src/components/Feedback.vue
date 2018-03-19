<template>
  <div class="Feedback">
    <template>
      <v-parallax height="650" src="/static/doc-images/vbanner.jpg">
        <v-card color="grey lighten-4" flat>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  <div v-if="!feedbackSuccess">
                    <form @submit.prevent="validateBeforeSubmit">
                      <h3>Feedback {{$route.params.status}}</h3>

                      <v-btn  block color="primary" @click="validateBeforeSubmit()">Submit</v-btn>
                    </form>
                  </div>
                  <div v-else>
                    <v-layout justify-space-around>
                      <v-icon color="success" x-large>done</v-icon>
                    </v-layout>
                    <h3>Feedback  {{$route.params.item}} success</h3><br>
                    <h3>Please close page</h3>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <br>
        </v-card>
      </v-parallax>
    </template>
  </div>
</template>

<script>
import firebase from 'firebase'
import { Validator } from 'vee-validate'
import axios from 'axios'
export default {
  name: 'Feedback',
  data () {
    return {
      modaldate: false,
      allProfile: '',
      allState: '',
      emailsDB: [],
      feedbackSuccess: false,
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      dateOfBirth: null,
      gender: null
    }
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          // eslint-disable-next-line
          this.$nextTick().then(() => {
            this.$validator.reset()
          })
          this.postPost()
        }
      })
    },
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/externalregister`, {
        body: {

        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.feedbackSuccess = true
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#inspire {
  padding-top: 3%;
}
.field {
  margin-left: 2%;
  margin-right: 2%;
}
.label {
  font-size: 16px;
  text-align: left;
}
.registed {
  padding-top: 30%;
}
</style>
