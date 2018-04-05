<template>
  <div>
    <div class="row">
      <div class="col-8">
        <gmap-map
                ref="map"
                :center="latLng"
                :zoom="12"
                style="width: 100%; height: 700px">
            <div
              v-if="this.showWaypoint">
              <gmap-marker
                v-for="waypoint in waypoints"
                :key="waypoint.id"
                :position="waypoint.location"
                :label="waypoint.label">
              </gmap-marker>
            </div>
          </gmap-map>
      </div>

      <div class="col">
        <b-card header="Waypoint" body-class="waypoint-body">
          <div v-if="this.time == 'morning'" class="waypoint disabled mb-2">
            <div class="index">
              <h4>A</h4>
            </div>
            <div class="address" v-if="this.driver">
              <h3>Driver</h3>
              <p>
                <span>{{ this.driver.address.line1 }}</span>
                <span>{{ this.driver.address.line2 }}</span>
              </p>
              <p>
                <span>{{ this.driver.address.district }}</span>
                <span>{{ this.driver.address.city }}</span>
                <span>{{ this.driver.address.province }}</span>
              </p>
            </div>
          </div>

          <div v-if="this.time == 'evening'" class="waypoint disabled mb-2">
            <div class="index">
              <h4>A</h4>
            </div>
            <div class="address" v-if="this.school">
              <h3>School</h3>
              <p>
                <span>{{ this.school.address.line1 }}</span>
                <span>{{ this.school.address.line2 }}</span>
              </p>
              <p>
                <span>{{ this.school.address.district }}</span>
                <span>{{ this.school.address.city }}</span>
                <span>{{ this.school.address.province }}</span>
              </p>
            </div>
          </div>

          <draggable v-if="this.car && this.car.students" v-model="car.students" @end="refresh">
            <div
              class="waypoint"
              v-for="(student, index) in this.car.students"
              :key="student.id">
              <div class="index">
                <h4>{{ index + 1 | toChar }}</h4>
              </div>
              <div class="address">
                <h3>{{ student.text }}</h3>
                <p>
                  <span>{{ student.address.line1 }}</span>
                  <span>{{ student.address.line2 }}</span>
                </p>
                <p>
                  <span>{{ student.address.district }}</span>
                  <span>{{ student.address.city }}</span>
                  <span>{{ student.address.province }}</span>
                </p>
              </div>
            </div>
          </draggable>

          <div v-if="this.time == 'evening'" class="waypoint disabled mb-2">
            <div class="index">
              <h4>{{ this.car ? this.car.students.length + 1 : 1 | toChar }}</h4>
            </div>
            <div class="address" v-if="this.driver">
              <h3>Driver</h3>
              <p>
                <span>{{ this.driver.address.line1 }}</span>
                <span>{{ this.driver.address.line2 }}</span>
              </p>
              <p>
                <span>{{ this.driver.address.district }}</span>
                <span>{{ this.driver.address.city }}</span>
                <span>{{ this.driver.address.province }}</span>
              </p>
            </div>
          </div>

          <div v-if="this.time == 'morning'" class="waypoint disabled mb-2">
            <div class="index">
              <h4>{{ this.car ? this.car.students.length + 1 : 1 | toChar }}</h4>
            </div>
            <div class="address" v-if="this.school">
              <h3>School</h3>
              <p>
                <span>{{ this.school.address.line1 }}</span>
                <span>{{ this.school.address.line2 }}</span>
              </p>
              <p>
                <span>{{ this.school.address.district }}</span>
                <span>{{ this.school.address.city }}</span>
                <span>{{ this.school.address.province }}</span>
              </p>
            </div>
          </div>

          <b-btn variant="primary" class="btn" @click="setRoute">
            Set Route
          </b-btn>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import {loaded} from 'vue2-google-maps'
import draggable from 'vuedraggable'
import * as firebase from 'firebase'
import { SET_ROUTE } from '@/vuex/action-types'
import swal from 'sweetalert'

export default {
  name: 'Route',
  props: {
    time: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      school: null,
      car: null,
      driver: null,
      waypoints: [],
      showWaypoint: true,
      latLng: {
        lat: 13.7308051,
        lng: 100.7806353
      },
      directionsService: null,
      directionsDisplay: null
    }
  },
  filters: {
    toChar (val) {
      return String.fromCharCode(65 + val)
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      firebase.database().ref().child('cars/' + this.$route.params.id)
      .once('value')
      .then((snapshot) => {
        this.car = snapshot.val()
        this.car['id'] = snapshot.key
        if (this.car.drivers[0].id) {
          return this.loadDriver(this.car.drivers[0].id)
        } else {
          alert('NO DRIVER!')
          return
        }
      })
      .then(() => {
        return this.loadSchool(this.car.school)
      })
      .then(() => {
        return this.init()
      })
      .then(() => {
        this.checkWaypoint()
      })
      .catch((error) => {
        console.log(error)
      })
    },
    loadDriver (driverId) {
      return new Promise((resolve, reject) => {
        firebase.database().ref().child('drivers/' + driverId)
        .once('value')
        .then((snapshot) => {
          this.driver = snapshot.val()
          this.driver['id'] = snapshot.key
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
      })
    },
    loadSchool (schoolId) {
      return new Promise((resolve, reject) => {
        firebase.database().ref().child('schools/' + schoolId)
        .once('value')
        .then((snapshot) => {
          this.school = snapshot.val()
          this.school['id'] = snapshot.key
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
      })
    },
    init () {
      const google = window.google
      return new Promise((resolve, reject) => {
        loaded.then(() => {
          this.directionsService = new google.maps.DirectionsService()
          this.directionsDisplay = new google.maps.DirectionsRenderer()
          this.directionsDisplay.setMap(this.$refs.map.$mapObject)
          resolve()
        })
      })
    },
    checkWaypoint () {
      return new Promise((resolve, reject) => {
        firebase.database().ref().child('cars/' + this.$route.params.id).child('route/').child(this.time)
        .once('value')
        .then((snapshot) => {
          if (snapshot.val() && snapshot.val().waypoints) {
            this.car.students = JSON.parse(JSON.stringify(snapshot.val().waypoints))
            this.setWaypoint()
            this.route()
          } else {
            this.setWaypoint()
          }
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
      })
    },
    setWaypoint () {
      let offset = 0

      if (this.time === 'morning') {
        offset += 1
        this.waypoints.push({
          id: this.driver.id,
          label: String.fromCharCode(65),
          stopover: true,
          location: {
            lat: this.driver.location.lat,
            lng: this.driver.location.lng
          }
        })
      }

      if (this.time === 'evening') {
        offset += 1
        this.waypoints.push({
          id: this.school.id,
          label: String.fromCharCode(65),
          stopover: true,
          location: {
            lat: this.school.location.lat,
            lng: this.school.location.lng
          }
        })
      }

      for (const student of this.car.students.values()) {
        this.waypoints.push({
          id: student.id,
          label: String.fromCharCode(65 + offset),
          stopover: true,
          location: {
            lat: student.location.lat,
            lng: student.location.lng
          }
        })
        offset += 1
      }
    },
    setWaypointVisibility (visibility) {
      this.showWaypoint = visibility
    },
    hideRoute () {
      this.directionsDisplay.setDirections({routes: []})
    },
    refresh () {
      this.hideRoute()
      this.waypoints = []
      this.setWaypoint()
      this.setWaypointVisibility(true)
    },
    setRoute () {
      this.route()
      .then(() => {
        swal({
          title: 'Complete',
          icon: 'success'
        })
      })
      .catch((error) => {
        console.log(error)
      })
    },
    route () {
      this.setWaypointVisibility(false)

      const google = window.google
      const it = this
      let wp = []
      for (let [index, waypoint] of this.waypoints.entries()) {
        if (index !== 0) {
          delete waypoint.id
          delete waypoint.label
          wp.push(waypoint)
        }
      }

      let origin
      let destination
      if (this.time === 'morning') {
        origin = this.driver.location
        destination = this.school.location
      } else {
        origin = this.school.location
        destination = this.driver.location
      }

      return new Promise((resolve, reject) => {
        it.directionsService.route({
          origin: origin,
          destination: destination,
          waypoints: wp,
          avoidTolls: true,
          avoidHighways: false,
          optimizeWaypoints: false,
          travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            response.routes[0].overview_polyline = {
              points: response.routes[0].overview_polyline
            }
            it.$store.dispatch(SET_ROUTE, {
              carId: it.car.id,
              waypoints: it.car.students,
              time: it.time,
              routes: JSON.stringify(response)
            })
            it.directionsDisplay.setDirections(response)
            resolve()
          } else {
            window.alert(status)
            reject(status)
          }
        })
      })
    }
  },
  components: {
    draggable
  }
}
</script>

<style scoped>
.waypoint-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #f9f9f9;
}
.disabled {
  cursor: not-allowed;
  color: #868e96 !important;
}
.disabled > .address {
  background-color: #EEEEEE;
}
.waypoint {
  display: flex;
  padding: 0.5em 0;
}
.index {
  background: #EA4335;
  width: 30px;
  height: 30px;
  text-align: center;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 20px;
  margin-top: 15px;
  color: #fff;
}
.address {
  flex: 1;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}
.address > h3 {
  padding: 10px;
  background: #EA4335;
  color: #fff;
  margin: -15px -15px 0 -15px;
  border-radius: 3px 3px 0 0;
}
.address > p {
  margin-bottom: 0;
}
.btn {
  margin-top: 20px;
}
</style>
