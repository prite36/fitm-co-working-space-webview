<template>
  <div class="BookingTimeline">
    <div class="timeline">
      <p>Device Booking Timeline of {{dateNow}}</p>
      <timeline class="settimeline" :data="device"></timeline>
      <p>Room Booking Timeline  of {{dateNow}}</p>
      <timeline class="settimeline" :data="room"></timeline>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import momenTime from 'moment-timezone'

export default {
  name: 'HelloWorld',
  data () {
    return {
      bookingDevice: null,
      bookingRoom: null,
      dateNow: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD')
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
            if (this.bookingDevice[key1][key2][key3].dateStart === this.dateNow) {
              let pack = [
                this.bookingDevice[key1][key2][key3].nameTypeItem,
                this.bookingDevice[key1][key2][key3].dateStart + ' ' + this.bookingDevice[key1][key2][key3].timeStart + ' GMT+7',
                this.bookingDevice[key1][key2][key3].dateStop + ' ' + this.bookingDevice[key1][key2][key3].timeStop + ' GMT+7'
              ]
              filteredDevice.push(pack)
            } else if (this.bookingDevice[key1][key2][key3].dateStop === this.dateNow) {
              let pack = [
                this.bookingDevice[key1][key2][key3].nameTypeItem,
                this.dateNow + ' 00:00 GMT+7',
                this.bookingDevice[key1][key2][key3].dateStop + ' ' + this.bookingDevice[key1][key2][key3].timeStop + ' GMT+7'
              ]
              filteredDevice.push(pack)
            }
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
            if (this.bookingRoom[key1][key2][key3].dateStart === this.dateNow) {
              let pack = [
                this.bookingRoom[key1][key2][key3].nameTypeItem,
                this.bookingRoom[key1][key2][key3].dateStart + ' ' + this.bookingRoom[key1][key2][key3].timeStart + ' GMT+7',
                this.bookingRoom[key1][key2][key3].dateStop + ' ' + this.bookingRoom[key1][key2][key3].timeStop + ' GMT+7'
              ]
              filteredRoom.push(pack)
            } else if (this.bookingRoom[key1][key2][key3].dateStop === this.dateNow) {
              let pack = [
                this.bookingRoom[key1][key2][key3].nameTypeItem,
                this.dateNow + ' 00:00 GMT+7',
                this.bookingRoom[key1][key2][key3].dateStop + ' ' + this.bookingRoom[key1][key2][key3].timeStop + ' GMT+7'
              ]
              filteredRoom.push(pack)
            }
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
  .timeline {
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 2%;
  }
  #chart-1 {
    padding-top: 0%;
    padding-bottom: 0%;
    height: 100px;
  }
  #chart-2 {
    padding-top: 0%;
    padding-bottom: 0%;
    height: 100px;
  }
</style>
