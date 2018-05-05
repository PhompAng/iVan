<template>
  <div>
    <choose-schools
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>

    <div class="row">
      <div class="col">
        <b-card-group deck class="mb-3">
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h3 class="card-title"><i class="fal fa-car"></i> Cars</h3>
              <h1 class="text-center">{{cars.length}}</h1>
            </div>
          </div>
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h3 class="card-title"><i class="fal fa-user"></i> Drivers</h3>
              <h1 class="text-center">{{drivers.length}}</h1>
            </div>
          </div>
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h3 class="card-title"><i class="fal fa-graduation-cap"></i>
 Students</h3>
              <h1 class="text-center">{{students.length}}</h1>
            </div>
          </div>
        </b-card-group>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-5">
        <b-form inline>
          <label class="mr-sm-2" for="cars">Car</label>
          <b-form-select class="mb-2 mr-sm-2 mb-sm-0"
            v-model="currentCar"
            :options="getCarIds()"
            value-field="id"
            @input="this.changeCar"></b-form-select>

          <b-btn variant="primary" @click="resetZoom">
            Reset Zoom
          </b-btn>
        </b-form>
      </div>
    </div>

    <div class="row">
      <gmap-map
           ref="map"
           :center="center"
           :zoom="15"
           style="width: 100%; height: 700px"
           class="col">
           <gmap-marker
            v-for="car in getCarIds()"
            :key="car.id"
            :position="getMarkerPosition(car.id)"
            :label="getLabel(car.id)"
            icon="/static/van_top.png"
            :clickable="false"
            :draggable="false">

           </gmap-marker>
      </gmap-map>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_USER, GET_CARS, GET_DRIVERS, GET_STUDENTS, GET_MOBILITY_STATUS } from '@/vuex/getter-types'
import { FETCH_SCHOOL, FETCH_CAR, FETCH_DRIVER, FETCH_STUDENT, FETCH_MOBILITY_STATUS } from '@/vuex/action-types'
import ChooseSchools from '@/components/ChooseSchools'

export default {
  name: 'hello',
  data () {
    return {
      center: {
        lat: 13.7308051,
        lng: 100.7806353
      },
      school: '',
      currentCar: ''
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      user: [GET_USER],
      cars: [GET_CARS],
      drivers: [GET_DRIVERS],
      students: [GET_STUDENTS],
      mobility_statuses: [GET_MOBILITY_STATUS]
    })
  },
  watch: {
    school: function (params) {
      this.$store.dispatch(FETCH_CAR, params)
      this.$store.dispatch(FETCH_DRIVER, params)
      this.$store.dispatch(FETCH_STUDENT, params)
      this.$store.dispatch(FETCH_MOBILITY_STATUS, params)
      this.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.$store.dispatch(FETCH_CAR, params[0].value)
        this.$store.dispatch(FETCH_DRIVER, params[0].value)
        this.$store.dispatch(FETCH_STUDENT, params[0].value)
        this.$store.dispatch(FETCH_MOBILITY_STATUS, params[0].value)
      }
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      if (this.user.role === 99) {
        this.$store.dispatch(FETCH_SCHOOL)
      } else {
        this.school = this.user.school
      }
    },
    getCarIds () {
      if (!this.mobility_statuses) {
        return []
      }
      let arr = []
      Object.entries(this.mobility_statuses).forEach(([key, val]) => {
        let car = this.cars.filter(c => c.id === key)[0]
        car['id'] = key
        arr.push(car)
      })
      return arr
    },
    getMarkerPosition (carId) {
      let last = this.mobility_statuses[carId].length - 1
      return {
        lat: this.mobility_statuses[carId][last].lat,
        lng: this.mobility_statuses[carId][last].lng
      }
    },
    getLabel (carId) {
      let car = this.cars.filter(c => c.id === carId)[0]
      return car.plate_number
    },
    changeCar (e) {
      let car = this.cars.filter(c => c.id === e)[0]
      let latLng = this.getMarkerPosition(car.id)
      this.$refs.map.panTo(latLng)
      this.$refs.map.$mapObject.setZoom(17)
    },
    resetZoom () {
      this.$refs.map.panTo(this.center)
      this.$refs.map.$mapObject.setZoom(15)
    }
  },
  components: {
    ChooseSchools
  }
}
</script>

<style scoped>
</style>
