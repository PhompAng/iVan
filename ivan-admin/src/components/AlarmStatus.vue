<template>
  <div>
    <div class="col">
      <b-card
      title="Alarm Status">
        <div class="row">
          <div class="col-5">
            <b-img :src="staticMap(this.alarm_status.location)" fluid></b-img>
          </div>
          <div class="col">
            <div class="alert alert-danger" v-if="this.alarm_status.isReportFalse">
              <h4 class="mb-0 d-inline">FALSE ALARM</h4>
              <b-btn size="sm" variant="danger" class="float-right" @click.stop="deleteFalse(this.alarm_status.uid)">
                <i class="far fa-trash"></i>
                Delete
              </b-btn>
            </div>

            <div class="alert alert-success" v-if="this.alarm_status.confirm">
              <h4 class="mb-0 d-inline">CONFIRMED</h4>
              <br>
              <strong>Reporter: </strong>
              <span>{{this.alarm_status.confirm.reporter.fullName}} ({{this.alarm_status.confirm.reporter.role | role}})</span>
              <br>
              <strong>Report time: </strong>
              <span>{{this.alarm_status.confirm.timestamp | time}}</span>
              <br>
              <strong>Report location: </strong>
              <span>{{this.alarm_status.confirm.reportLocation.lat}}, {{this.alarm_status.confirm.reportLocation.lng}}</span>
            </div>

            <p>{{this.alarm_status.timestamp | time}}</p>
            <div class="alert alert-secondary">
              <strong>Detection: </strong>
              <span class="text-danger">{{this.alarm_status.detection}}</span>

            </div>
            <div
            class="alert alert-info"
            v-for="d in this.alarm_status.data"
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
            <hr>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { GET_ALARM_STATUS } from '@/vuex/getter-types'
import { FETCH_ALARM_STATUS, DELETE_ALARM_STATUS } from '@/vuex/action-types'
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
import swal from 'sweetalert'

export default {
  name: 'AlarmStatus',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      alarm_status: [GET_ALARM_STATUS]
    })
  },
  filters: {
    time (val) {
      if (!val) return ''
      return DateTime.fromMillis(val).toHTTP()
    },
    role (val) {
      if (!val) return ''
      if (val === 75) return 'ADMIN'
      if (val === 50) return 'DRIVER'
      if (val === 99) return 'GOD'
      if (val === 60) return 'TEACHER'
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.$store.dispatch(FETCH_ALARM_STATUS, this.$route.params.id)
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
    staticMap (location) {
      if (location != null) {
        return 'http://maps.google.com/maps/api/staticmap?markers=' + location.lat + ',' + location.lng + '&zoom=17&size=800x600&sensor=false&scale=2&key=AIzaSyA6kKThlimCYp3zUDeb99R0-inhVwxTmLE'
      } else {
        return 'http://maps.google.com/maps/api/staticmap?markers=0,0&zoom=17&size=800x600&sensor=false&scale=2&key=AIzaSyA6kKThlimCYp3zUDeb99R0-inhVwxTmLE'
      }
    }
  }
}
</script>

<style>

</style>
