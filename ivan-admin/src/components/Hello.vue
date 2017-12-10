<template>
  <div>
    <choose-schools
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>

    <div class="row">
      <div class="col">
        <b-card-group deck class="mb-3">
          <b-card
            title="Cars">
            <h1 class="text-center">{{cars.length}}</h1>
          </b-card>
          <b-card
            title="Drivers">
            <h1 class="text-center">{{drivers.length}}</h1>
          </b-card>
          <b-card
            title="Students">
            <h1 class="text-center">{{students.length}}</h1>
          </b-card>
        </b-card-group>
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
            v-for="car in getHasMobilityCar()"
            :key="car.id"
            :position="getMarkerPosition(car)"
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
import { GET_SCHOOL_SELECT, GET_USER, GET_CARS, GET_DRIVERS, GET_STUDENTS } from '@/vuex/getter-types'
import { FETCH_SCHOOL, FETCH_CAR, FETCH_DRIVER, FETCH_STUDENT } from '@/vuex/action-types'
import ChooseSchools from '@/components/ChooseSchools'

export default {
  name: 'hello',
  data () {
    return {
      center: {
        lat: 13.7308051,
        lng: 100.7806353
      },
      school: ''
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      user: [GET_USER],
      cars: [GET_CARS],
      drivers: [GET_DRIVERS],
      students: [GET_STUDENTS]
    })
  },
  watch: {
    school: function (params) {
      this.$store.dispatch(FETCH_CAR, params)
      this.$store.dispatch(FETCH_DRIVER, params)
      this.$store.dispatch(FETCH_STUDENT, params)
      this.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.$store.dispatch(FETCH_CAR, params[0].value)
        this.$store.dispatch(FETCH_DRIVER, params[0].value)
        this.$store.dispatch(FETCH_STUDENT, params[0].value)
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
    getHasMobilityCar () {
      return this.cars.filter(c => c.mobility_status != null)
    },
    getMarkerPosition (car) {
      let last = car.mobility_status.length - 1
      return {
        lat: car.mobility_status[last].lat,
        lng: car.mobility_status[last].lng
      }
    }
  },
  components: {
    ChooseSchools
  }
}
</script>

<style scoped>
</style>
