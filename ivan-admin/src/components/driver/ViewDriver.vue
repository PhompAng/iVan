<template>
  <div>
    <div class="row">
      <div class="col-xl-3 col-lg-5 col-md-6 col-sm-12">
        <b-card
          title="Information"
          :img-src="driver_picture"
          img-fluid
          img-alt="image"
          img-top>
          <form>
            <div class="row">
              <div class="form-group col">
                <label>Firstname (Thai)</label>
                <input
                v-model="this.driver.name.th_first"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Lastname (Thai)</label>
                <input
                v-model="this.driver.name.th_last"
                class="form-control"
                disabled>
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Firstname (English)</label>
                <input
                v-model="this.driver.name.en_first"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Lastname (English)</label>
                <input
                v-model="this.driver.name.en_last"
                class="form-control"
                disabled>
              </div>
            </div>

            <div class="row">
              <div class="form-group col-6">
                  <label for="email">Email</label>
                  <input type='email'
                  v-model="this.driver.email"
                  class="form-control"
                  disabled>
              </div>
              <div class="form-group col">
                  <label for="tel">Telephone</label>
                  <input
                  v-model="this.driver.telephone"
                  type="tel"
                  class="form-control"
                  disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                  <label for="line1">Line1</label>
                  <input
                  v-model="this.driver.address.line1"
                  class="form-control"
                  disabled>
              </div>
              <div class="form-group col">
                  <label for="line2">Line2</label>
                  <input
                  v-model="this.driver.address.line2"
                  class="form-control"
                  disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>District</label>
                <input
                class="form-control"
                v-model="this.driver.address.district"
                disabled >
              </div>
              <div class="form-group col">
                <label>City</label>
                <input
                class="form-control"
                v-model="this.driver.address.city" disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Province</label>
                <input
                class="form-control"
                v-model="this.driver.address.province" disabled>
              </div>
              <div class="form-group col">
                <label>Postcode</label>
                <input
                class="form-control"
                v-model="this.driver.address.postcode" disabled>
              </div>
            </div>
          </form>
        </b-card>
      </div>

      <div class="col">
        <b-card
        class="mb-3"
        title="Location">
          <div class="row">
            <div class="form-group col">
              <gmap-map ref="gmap" class="map" :center="this.driver.location" :zoom="12">
                  <gmap-marker :position="this.driver.location"></gmap-marker>
              </gmap-map>
            </div>
          </div>
        </b-card>

        <b-card
        title="Alarm Status"
        v-if="this.alarm_status">
          <div
          class="alarm-status"
          v-for="a in this.alarm_status"
          :key="a.id">
            <p class="alert alert-danger">
              <strong>Detection: </strong>
              <span class="text-danger">{{a.detection}}</span>
            </p>

            <div
            class="alert alert-info"
            v-for="d in a.data"
            :key="d.row">
              <h5 class="text-info">Row {{d.row}}</h5>
              <div class="row">
                <div class="col">
                  <strong>Detection: </strong>
                  <span class="text-danger">{{d.detection}}</span>
                </div>
                <div class="col">
                  <p>
                    <strong>PIR: </strong>
                    <span>{{d.data.pir}}</span>
                  </p>
                  <p>
                    <strong>Ultrasonic: </strong>
                    <span>{{d.data.ultrasonic}}</span>
                  </p>
                </div>
              </div>
            </div>

            <p class="text-right text-secondary">
              <small>
                {{a.timestamp | time}}
              </small>
            </p>
            <hr>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { GET_DRIVER_ALARM_STATUS } from '@/vuex/getter-types'
import { FETCH_DRIVER_ALARM_STATUS } from '@/vuex/action-types'
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'

export default {
  name: 'ViewDriver',
  data () {
    return {
      driver_picture: ''
    }
  },
  computed: {
    ...mapGetters({
      alarm_status: [GET_DRIVER_ALARM_STATUS]
    }),
    driver () {
      return this.$store.getters.getDriver(this.$route.params.id)
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
      this.$store.dispatch(FETCH_DRIVER_ALARM_STATUS, this.$route.params.id)
      firebase.storage().ref().child('drivers/' + this.$route.params.id)
      .getDownloadURL()
      .then((url) => {
        this.driver_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.driver_picture = 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538474-user_512x512.png'
      })
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
