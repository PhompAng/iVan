<template>
  <div>
    <h2>Manage Route</h2>
    <div class="row">
      <div class="col-8">
        <b-card header="Route">
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
        </b-card>
      </div>

      <div class="col">
        <b-card header="Waypoint" body-class="waypoint-body">
          <ul class="list-unstyled">
            <b-card class="disabled bg-light mb-2">
              <div class="index">
                <h3>A: School</h3>
              </div>
              <div class="address" v-if="this.school">
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
            </b-card>

            <div v-if="this.car && this.car.students">
              <draggable v-model="car.students" @end="refresh">
                <b-card
                  class="waypoint"
                  v-for="(student, index) in this.car.students"
                  :key="student.id">
                  <div class="index">
                    <h3>{{ index + 1 | toChar}}: {{ student.text }}</h3>
                  </div>
                  <div class="address">
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
                </b-card>
              </draggable>
            </div>
          </ul>

          <b-btn variant="primary" @click="setRoute">
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
  data () {
    return {
      school: null,
      car: null,
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
        firebase.database().ref().child('schools/' + snapshot.val().school)
        .once('value')
        .then((snapshot) => {
          this.school = snapshot.val()
          this.school['id'] = snapshot.key
          this.checkWaypoint()
          this.init()
        })
      })
    },
    init () {
      const google = window.google
      loaded.then(() => {
        this.directionsService = new google.maps.DirectionsService()
        this.directionsDisplay = new google.maps.DirectionsRenderer()
        this.directionsDisplay.setMap(this.$refs.map.$mapObject)
      })
    },
    checkWaypoint () {
      firebase.database().ref().child('route/' + this.$route.params.id)
      .once('value')
      .then((snapshot) => {
        if (snapshot.val() && snapshot.val().waypoints) {
          this.car.students = JSON.parse(JSON.stringify(snapshot.val().waypoints))
          this.setWaypoint()
          this.route()
        } else {
          this.setWaypoint()
        }
      })
    },
    setWaypoint () {
      this.waypoints.push({
        id: this.school.id,
        label: String.fromCharCode(65),
        stopover: true,
        location: {
          lat: this.school.location.lat,
          lng: this.school.location.lng
        }
      })
      for (const [index, student] of this.car.students.entries()) {
        this.waypoints.push({
          id: student.id,
          label: String.fromCharCode(65 + index + 1),
          stopover: true,
          location: {
            lat: student.location.lat,
            lng: student.location.lng
          }
        })
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
      swal({
        title: 'Complete',
        icon: 'success'
      })
      this.route()
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
      it.directionsService.route({
        origin: this.school.location,
        destination: this.school.location,
        waypoints: wp,
        avoidTolls: true,
        avoidHighways: false,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
      }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(response)
          it.$store.dispatch(SET_ROUTE, {
            carId: it.car.id,
            waypoints: it.car.students,
            routes: JSON.stringify(response)
          })
          it.directionsDisplay.setDirections(response)
        } else {
          window.alert(status)
        }
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
}
.card-body {
  flex-direction: column;
  align-items: stretch;
}
.card-body > ul {
  width: 100%;
}
.waypoint:first-child {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.waypoint:not(:first-child):not(:last-child) {
  border-radius: 0;
}
.waypoint:last-child {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.disabled {
  cursor: not-allowed;
  color: #868e96 !important;
}
.index {
}
.address {
}
.address > p {
  margin-bottom: 0;
}
</style>
