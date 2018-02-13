<template>
  <div class="BookingTimeline">
    <p>Device Booking Timeline</p>
    <timeline class="device" :data="device"></timeline>
    <p>Room Booking Timeline</p>
    <timeline class="device" :data="room"></timeline>
    {{device}}
    {{room}}
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'HelloWorld',
  data () {
    return {
      bookingDevice: null,
      bookingRoom: null
    }
  },
  methods: {
  },
  computed: {
    device () {
      let filteredDevice = []
      for (var key1 in this.bookingDevice) {
        for (var key2 in this.bookingDevice[key1]) {
          for (var key3 in this.bookingDevice[key1][key2]) {
            let pack = [
              this.bookingDevice[key1][key2][key3].nameTypeItem,
              this.bookingDevice[key1][key2][key3].dateStart + ' ' + this.bookingDevice[key1][key2][key3].timeStart + ' GMT+7',
              this.bookingDevice[key1][key2][key3].dateStop + ' ' + this.bookingDevice[key1][key2][key3].timeStop + ' GMT+7'
            ]
            filteredDevice.push(pack)
          }
        }
      }
      return filteredDevice
    },
    room () {
      let filteredRoom = []
      for (var key1 in this.bookingRoom) {
        for (var key2 in this.bookingRoom[key1]) {
          for (var key3 in this.bookingRoom[key1][key2]) {
            let pack = [
              this.bookingRoom[key1][key2][key3].nameTypeItem,
              this.bookingRoom[key1][key2][key3].dateStart + ' ' + this.bookingRoom[key1][key2][key3].timeStart + ' GMT+7',
              this.bookingRoom[key1][key2][key3].dateStop + ' ' + this.bookingRoom[key1][key2][key3].timeStop + ' GMT+7'
            ]
            filteredRoom.push(pack)
          }
        }
      }
      return filteredRoom
    }
  },
  mounted () {
    this.$bindAsObject('bookingDevice', firebase.database().ref('booking/device'), null, () => { delete this.bookingDevice['.key'] })
    this.$bindAsObject('bookingRoom', firebase.database().ref('booking/meetingroom'), null, () => { delete this.bookingRoom['.key'] })
  }
}
</script>

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
