<template>
  <div>
    <div class="row">
      <div class="col">
        <b-card
          title="Information"
          class="mb-3">
          <div class="row">
            <div class="col-5">
              <b-img v-bind:src="driver_picture" fluid alt="Responsive image"/>
            </div>
            <form class="col">
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
                <div class="form-group col">
                    <label for="email">Email</label>
                    <input type='email'
                    v-model="this.driver.email"
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
          </div>
        </b-card>
      </div>
    </div>

    <div class="row">
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
      </div>
      <div class="col">
        <b-card
        title="Alarm Status"
        v-if="this.alarm_status">
          <b-card
          no-body
          class="alarm-status mb-0"
          v-for="a in this.alarm_status"
          :key="a.id">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block variant="link" href="#" v-b-toggle="a.uid">
              {{a.timestamp | time}}
            </b-btn>
          </b-card-header>
          <b-collapse :id="a.uid" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <div class="alert alert-danger" v-if="a.isReportFalse">
                <h4 class="mb-0 d-inline">FALSE ALARM</h4>
                <b-btn size="sm" variant="danger" class="float-right" @click.stop="deleteFalse(a.uid)">
                  <i class="ti-trash"></i>
                  Delete
                </b-btn>
              </div>

              <div class="alert alert-success" v-if="a.confirm">
                <h4 class="mb-0 d-inline">CONFIRMED</h4>
              </div>

              <div class="alert alert-secondary">
                <strong>Detection: </strong>
                <span class="text-danger">{{a.detection}}</span>
                <b-btn size="sm" variant="success" class="float-right" @click.stop="view(a.uid)">
                  <i class="ti-eye"></i>
                  View
                </b-btn>
              </div>
            </b-card-body>
          </b-collapse>
          </b-card>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { GET_DRIVER_ALARM_STATUS } from '@/vuex/getter-types'
import { FETCH_DRIVER_ALARM_STATUS, DELETE_ALARM_STATUS } from '@/vuex/action-types'
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
import swal from 'sweetalert'

export default {
  name: 'ViewDriver',
  data () {
    return {
      driver_picture: '',
      fields: {
        enName: { label: 'English name', sortable: true },
        date: { label: 'Date', sortable: true }
      }
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
    },
    deleteFalse (uid) {
      swal({
        title: 'Delete ?',
        text: 'Once deleted, you will not be able to recover this imaginary file!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
      .then((value) => {
        if (value) {
          this.$store.dispatch(DELETE_ALARM_STATUS, uid)
        }
      })
    },
    view (uid) {
      this.$router.push({name: 'AlarmStatus', params: {id: uid}})
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
