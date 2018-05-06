<template>
  <div class="BookingTimeline">
    <div class="timeline">
      <p>Device Booking Timeline of {{dateNow}} </p>
      <timeline :min="0.00" :max="24.00" :data="device"></timeline>
      <p>Room Booking Timeline  of {{dateNow}} </p>
      <timeline :min="0.00" :max="24.00" :data="room"></timeline>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import momenTime from 'moment-timezone'
import diff from 'lodash/difference'

export default {
  name: 'HelloWorld',
  data () {
    return {
      mocdata: [['name1', '2018-02-18 00:02 GMT+7', '2018-02-18 24:00 GMT+7']],
      bookingDevice: null,
      bookingRoom: null,
      dateNow: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD'),
      deviceBooked: [],
      roomBooked: [],
      allDevice: [],
      allRoom: [],
      emptyItem: []
    }
  },
  methods: {
  },
  computed: {
    device () {
      let filteredDevice = [[
        'เวลาการจอง 24 ชม.',
        this.dateNow + ' 00:00 GMT+7',
        this.dateNow + ' 24:00 GMT+7'
      ]]
      if (this.bookingDevice) {
        for (var key1 in this.bookingDevice) {
          for (var key2 in this.bookingDevice[key1]) {
            for (var key3 in this.bookingDevice[key1][key2]) {
              this.deviceBooked.push(key2)
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
      }
      return filteredDevice
    },
    room () {
      let filteredRoom = [[
        'เวลาการจอง 24 ชม.',
        this.dateNow + ' 00:00 GMT+7',
        this.dateNow + ' 24:00 GMT+7'
      ]]
      if (this.bookingRoom) {
        for (var key1 in this.bookingRoom) {
          for (var key2 in this.bookingRoom[key1]) {
            this.roomBooked.push(key2)
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
      }
      return filteredRoom
    }
  },
  watch: {
    allDevice () {
      console.log(diff(this.allDevice, this.deviceBooked))
    },
    allRoom () {
      console.log(diff(this.allRoom, this.roomBooked))
    }
  },
  mounted () {
    this.$bindAsObject('bookingDevice', firebase.database().ref('booking/device'), null, () => { delete this.bookingDevice['.key'] })
    this.$bindAsObject('bookingRoom', firebase.database().ref('booking/meetingRoom'), null, () => { delete this.bookingRoom['.key'] })
    this.$bindAsObject('listDevice', firebase.database().ref('items/device'), null, () => {
      delete this.listDevice['.key']
      this.allDevice = []
      Object.values(this.listDevice).forEach(values => {
        this.allDevice.push.apply(this.allDevice, Object.keys(values))
      })
    })
    this.$bindAsObject('listRoom', firebase.database().ref('items/meetingRoom'), null, () => {
      delete this.listRoom['.key']
      this.allRoom = []
      Object.values(this.listRoom).forEach(values => { this.allRoom.push.apply(this.allRoom, Object.keys(values)) })
    })
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
    height: 100px;
    padding-top: 0%;
    padding-bottom: 0%;
    height: 100px;
  }
  #chart-2 {
    padding-top: 0%;
    padding-bottom: 0%;
    height: 100px;
  }
  #chart-8 {
    padding-bottom: 0%;
    height: auto;
  }
</style>
