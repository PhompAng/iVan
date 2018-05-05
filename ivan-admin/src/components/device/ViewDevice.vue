<template>
  <div>
    <div class="col">
      <b-card
        title="Information"
        class="mb-3">
        <div class="row">
          <form class="col">
            <div class="row">
              <div class="form-group col">
                <label>Serial Number</label>
                <input
                v-model="this.device.serial_number"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Make Date</label>
                <input
                v-model="this.device.make_date"
                class="form-control"
                disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Status</label>
                <input
                v-model="this.device.status"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Car</label>
                <input
                v-bind:value="car.plate_number"
                class="form-control"
                disabled>
              </div>
            </div>
          </form>
        </div>
      </b-card>
      <b-card
        title="Sensor">
        <b-card-group deck class="mb-3">
          <b-card
            title="Row 1">
              <b-list-group v-for="s of sensor(1)"
              :key="s.id">
                <b-list-group-item v-bind:href="link(s.id)">{{s.serial_number}}</b-list-group-item>
              </b-list-group>
              <p v-if="sensor(1).length === 0">Not assigned</p>
          </b-card>
          <b-card
            title="Row 2">
              <b-list-group v-for="s of sensor(2)"
              :key="s.id">
                <b-list-group-item v-bind:href="link(s.id)">{{s.serial_number}}</b-list-group-item>
              </b-list-group>
              <p v-if="sensor(2).length === 0">Not assigned</p>
          </b-card>
        </b-card-group>
        <b-card-group deck class="mb-3">
          <b-card
            title="Row 3">
              <b-list-group v-for="s of sensor(3)"
              :key="s.id">
                <b-list-group-item v-bind:href="link(s.id)">{{s.serial_number}}</b-list-group-item>
              </b-list-group>
              <p v-if="sensor(3).length === 0">Not assigned</p>
          </b-card>
          <b-card
          title="Row 4">
              <b-list-group v-for="s of sensor(4)"
              :key="s.id">
                <b-list-group-item v-bind:href="link(s.id)">{{s.serial_number}}</b-list-group-item>
              </b-list-group>
              <p v-if="sensor(4).length === 0">Not assigned</p>
          </b-card>
        </b-card-group>
      </b-card>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'ViewDevice',
  data () {
    return {
      admin_picture: ''
    }
  },
  computed: {
    sensors () {
      return this.$store.getters.getSensorsDevice(this.$route.params.id)
    },
    device () {
      return this.$store.getters.getDevice(this.$route.params.id)
    },
    car () {
      return this.$store.getters.getCar(this.device.car)
    }
  },
  filters: {
    time (val) {
      if (!val) return ''
      return DateTime.fromMillis(val).toHTTP()
    }
  },
  created () {
  },
  methods: {
    sensor (row) {
      return this.sensors.filter(s => s.row === row)
    },
    link (id) {
      return '/sensors/' + id
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
