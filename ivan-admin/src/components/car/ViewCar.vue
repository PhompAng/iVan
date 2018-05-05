<template>
  <div>
    <b-card
    class="mb-3"
    title="Information">
      <div class="row">
        <div class="col-5">
          <b-img v-bind:src="car_picture" fluid alt="Responsive image"/>
        </div>
        <form class="col">
          <div class="row">
            <div class="form-group col">
              <label>Plate Number</label>
              <input
              class="form-control"
              v-model="this.car.plate_number"
              disabled>
            </div>
            <div class="form-group col">
              <label>Morning</label>
              <input
              class="form-control"
              v-bind:value="this.car.time.morning.start.HH + ':' + this.car.time.morning.start.mm + ' - ' + this.car.time.morning.end.HH + ':' + this.car.time.morning.end.mm"
              disabled>
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label>Model</label>
              <input
              class="form-control"
              v-model="this.car.model"
              disabled>
            </div>
            <div class="form-group col">
              <label>Evening</label>
              <input
              class="form-control"
              v-bind:value="this.car.time.evening.start.HH + ':' + this.car.time.evening.start.mm + ' - ' + this.car.time.evening.end.HH + ':' + this.car.time.evening.end.mm"
              disabled>
            </div>
          </div>

          <div class="row">
            <div class="form-group col-6">
              <label>Chassis No.</label>
              <input
              class="form-control"
              v-model="this.car.chassis"
              disabled>
            </div>
            <div class="form-group col-6">
              <label>Brake Oil</label>
              <input
              class="form-control"
              v-model="this.maintenance.brake_oil_mileage"
              disabled>
            </div>
          </div>

          <div class="row">
            <div class="form-group col-6">
              <label>Engine Oil</label>
              <input
              class="form-control"
              v-model="this.maintenance.engine_oil_mileage"
              disabled>
            </div>
            <div class="form-group col-6">
              <label>Maintenance Date</label>
              <input
              class="form-control"
              v-model="this.maintenance.maintenance_date"
              disabled>
            </div>
          </div>
        </form>
      </div>
    </b-card>

    <b-card
    class="mb-3"
    title="Staff">
      <div v-if="this.car.drivers || this.car.teachers" class="row">
        <b-card-group deck>
          <div v-for="d in this.car.drivers" :key="d.id">
            <staff :staff="d" :path="'drivers'"></staff>
          </div>
          <div v-for="t in this.car.teachers" :key="t.id">
              <staff :staff="t" :path="'teachers'"></staff>
          </div>
        </b-card-group>
      </div>
      <div v-else>
        <p class="text-muted">
          Not assigned
        </p>
      </div>
    </b-card>

    <b-card
    title="Students">
      <div v-if="this.car.students">
        <div class="row">
          <div v-for="student of this.car.students"
            :key="student.id">
            <student :student="student"></student>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-muted">
          Not assigned
        </p>
      </div>
    </b-card>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { GET_MAINTENANCE } from '@/vuex/getter-types'
import { FETCH_MAINTENANCE } from '@/vuex/action-types'
import { DateTime } from 'luxon'
import Staff from '@/components/car/Staff'
import { mapGetters } from 'vuex'
import Student from '@/components/car/Student'

export default {
  name: 'ViewCar',
  data () {
    return {
      car_picture: ''
    }
  },
  computed: {
    ...mapGetters({
      maintenance: [GET_MAINTENANCE]
    }),
    car () {
      return this.$store.getters.getCar(this.$route.params.id)
    }
  },
  filters: {
    time (val) {
      if (!val) return ''
      return DateTime.fromMillis(val).toHTTP()
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.$store.dispatch(FETCH_MAINTENANCE, this.$route.params.id)
      firebase.storage().ref().child('cars/' + this.$route.params.id)
      .getDownloadURL()
      .then((url) => {
        this.car_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.car_picture = 'http://bangkok-today.com/web/wp-content/uploads/2016/06/Untitled-1.jpg'
      })
    },
    linkTeacher (id) {
      return '/teachers/' + id
    }
  },
  components: {
    Staff,
    Student
  }
}
</script>

<style scoped>
.card-image {
  width: 100%;
}
</style>
