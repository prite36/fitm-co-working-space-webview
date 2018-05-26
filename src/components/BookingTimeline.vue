<template>
  <div class="BookingTimeline">
    <div class="timeline">
      <p>Device Booking Timeline of {{dateNow}}</p>
      <timeline :min="0.00" :max="24.00" :data="filteredDevices" :colors="colorsDevices" :height="devicesTLHeight"></timeline>
      <p>Room Booking Timeline  of {{dateNow}}</p>
      <timeline :min="0.00" :max="24.00" :data="filteredRooms" :colors="colorsRooms" :height="roomsTLHeight" ></timeline>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import Moment from 'moment'
import momenTime from 'moment-timezone'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment) // eslint-disable-line
// import diff from 'lodash/difference'

export default {
  name: 'HelloWorld',
  data () {
    return {
      bookingDevices: null,
      bookingRooms: null,
      dateNow: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD'),
      filteredDevices: [],
      filteredRooms: [],
      colorsDevices: [],
      colorsRooms: []
    }
  },
  methods: {
    queryTimeline (bookingData, list, filtered, colors) {
      let defaultColors = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395']
      filtered.push(
        [
          'เวลาการจอง 24 ชม.',
          momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD 00:00 Z'),
          momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD 24:00 Z')
        ]
      )
      // ใส่สีขาว
      colors.push('#ffffff')
      for (var typeItem in list) {
        for (var nametypeItem in list[typeItem]) {
          if (bookingData[typeItem] && bookingData[typeItem][nametypeItem]) {
            console.log(`pass ${nametypeItem}`)
            // ถ้า bookong ของ nametypeItem มีค่า
            Object.values(bookingData[typeItem][nametypeItem]).forEach(values => {
              const range1 = moment.range(
                momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD 00:00 Z'),
                momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD 24:00 Z')
              )
              const range2 = moment.range(
                `${values.dateStart} ${values.timeStart}`,
                `${values.dateStop} ${values.timeStop}`
              )
              if (range1.overlaps(range2, { adjacent: false })) {
                // ถ้าชาวงเวลาจอง อยู่ภายในวันนี้ เข้าเงื่อนไข
                let rangeIntersect = range1.intersect(range2)
                // ใช้ในการหาว่า ช่วงเวลา booking นี้ อยู่ภายในวันนั้นหรือไม่ ใช้ intersect ใช้ในการหาช่วงที่ตัดกัน
                filtered.push([
                  nametypeItem,
                  rangeIntersect.start.format('YYYY-MM-DD HH:mm Z'),
                  rangeIntersect.end.format('YYYY-MM-DD HH:mm Z')
                ])
                colors.push(defaultColors[Math.floor(Math.random() * defaultColors.length)])
              }
            })
          } else {
            console.log(`fail ${nametypeItem}`)
            // ถ้า ไม่มี booking ของ  nametypeItem นี้ ให้กำหนดเวลาอัติโนมัติ
            filtered.push([
              nametypeItem,
              momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD 00:00 Z'),
              momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD 24:00 Z')
            ])
            // ใส่สีขาว
            colors.push('#ffffff')
          }
        }
      }
    }
  },
  watch: {
    bookingDevices () {
      delete this.bookingDevices['.key']
      this.filteredDevices = []
      this.colorsDevices = []
      this.queryTimeline(this.bookingDevices, this.listDevices, this.filteredDevices, this.colorsDevices)
    },
    bookingRooms () {
      delete this.bookingRooms['.key']
      this.filteredRooms = []
      this.colorsRooms = []
      this.queryTimeline(this.bookingRooms, this.listRooms, this.filteredRooms, this.colorsRooms)
    }
  },
  mounted () {
    this.$bindAsObject('listDevices', firebase.database().ref('items/device'), null, () => {
      delete this.listDevices['.key']
      this.$bindAsObject('bookingDevices', firebase.database().ref('booking/device'))
    })
    this.$bindAsObject('listRooms', firebase.database().ref('items/meetingRoom'), null, () => {
      delete this.listRooms['.key']
      this.$bindAsObject('bookingRooms', firebase.database().ref('booking/meetingRoom'))
    })
  },
  computed: {
    roomsTLHeight () {
      console.log(`${(this.colorsRooms.length * 50) + 41}px`)
      return `${(this.colorsRooms.length * 50) + 41}px`
    },
    devicesTLHeight () {
      return `${(this.colorsDevices.length * 50) + 41}px`
    }
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
  .defs {
    height: auto;
    width: auto;
  }
</style>
