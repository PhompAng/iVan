<template>
  <div>
    <h2>Assign ({{this.device.serial_number}})</h2>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Sensor">
          <assign-sensor :limit="4"></assign-sensor>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>

</template>

<script>
import * as firebase from 'firebase'
import AssignSensor from '@/components/device/assign/AssignSensor'

export default {
  name: 'DeviceAssign',
  data () {
    return {
      device: ''
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.car = this.$route.params.id
      firebase.database().ref().child('devices/' + this.$route.params.id)
      .once('value')
      .then((snapshot) => {
        this.device = snapshot.val()
      })
    }
  },
  components: {
    AssignSensor
  }
}
</script>

<style scoped>
</style>
