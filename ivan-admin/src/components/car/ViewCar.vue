<template>
  <div>
    <b-card
    class="mb-3"
    title="Information">
      <div class="row">
        <div class="col-3">
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
        <div class="col">
          <b-card-group deck>
            <staff-card v-for="d in this.car.drivers"
            :key="d.id"
            :staff="d"
            path="drivers"
            to="ViewDriver"></staff-card>
            <staff-card v-for="t in this.car.teachers"
            :key="t.id"
            :staff="t"
            path="teachers"
            to="ViewTeacher"></staff-card>
          </b-card-group>
        </div>
      </div>
      <div v-else>
        <p class="text-muted">
          Not assigned
        </p>
      </div>
    </b-card>

    <b-card
    class="mb-3"
    title="Students">
      <div v-if="this.car.students" class="row">
        <div class="col">
          <b-card-group deck>
            <student-card v-for="student of this.car.students"
            :key="student.id" :student="student"></student-card>
          </b-card-group>
        </div>
      </div>
      <div v-else>
        <p class="text-muted">
          Not assigned
        </p>
      </div>
    </b-card>

    <b-card
    title="Mobility Status">
      <b-table striped hover bordered
      :items="this.mobility_status"
      :fields="fields">
        <template slot="speed" slot-scope="data">
          {{ data.item.speed }} km/h
        </template>
        <template slot="speed_exceed" slot-scope="data">
          {{ data.item.speed_exceed }}
        </template>
        <template slot="oil_level" slot-scope="data">
          {{ data.item.oil_level }} %
        </template>
        <template slot="mileage" slot-scope="data">
          {{ data.item.mileage }} km.
        </template>
        <template slot="engine_oil_mileage" slot-scope="data">
          {{ data.item.engine_oil_mileage }} km.
        </template>
        <template slot="brake_oil_mileage" slot-scope="data">
          {{ data.item.brake_oil_mileage }} km.
        </template>
        <template slot="timestamp" slot-scope="data">
          {{ data.item.timestamp | time }}
        </template>
        <template slot="map" slot-scope="data">
          <b-button size="sm" variant="primary" @click.stop="map(data.item, data.index, $event.target)">
            <i class="far fa-map"></i>
          </b-button>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { GET_MAINTENANCE } from '@/vuex/getter-types'
import { FETCH_MAINTENANCE } from '@/vuex/action-types'
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
import StaffCard from '@/components/car/StaffCard'
import StudentCard from '@/components/car/StudentCard'

export default {
  name: 'ViewCar',
  data () {
    return {
      car_picture: '',
      fields: {
        speed: { label: 'Speed' },
        speed_exceed: { label: 'Speed Exceed Count' },
        oil_level: { label: 'Oil Level' },
        mileage: { label: 'Mileage' },
        engine_oil_mileage: { label: 'Engine Oil Mileage' },
        brake_oil_mileage: { label: 'Brake Oil Mileage' },
        timestamp: { label: 'Timestamp' },
        map: { label: 'Map' }
      }
    }
  },
  computed: {
    ...mapGetters({
      maintenance: [GET_MAINTENANCE]
    }),
    car () {
      return this.$store.getters.getCar(this.$route.params.id)
    },
    mobility_status () {
      return this.$store.getters.getCarMobilityStatus(this.$route.params.id)
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
    map (item, index, e) {
      let mapUrl = this.staticMap(item.lat, item.lng)
      window.open(mapUrl, '_blank')
    },
    staticMap (lat, lng) {
      if (location != null) {
        return 'http://maps.google.com/maps/api/staticmap?markers=' + lat + ',' + lng + '&zoom=17&size=800x600&sensor=false&scale=2&key=AIzaSyA6kKThlimCYp3zUDeb99R0-inhVwxTmLE'
      } else {
        return 'http://maps.google.com/maps/api/staticmap?markers=0,0&zoom=17&size=800x600&sensor=false&scale=2&key=AIzaSyA6kKThlimCYp3zUDeb99R0-inhVwxTmLE'
      }
    }
  },
  components: {
    StaffCard,
    StudentCard
  }
}
</script>

<style scoped>
.card-image {
  width: 100%;
}
.card-deck {
  flex-wrap: nowrap;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}
</style>
