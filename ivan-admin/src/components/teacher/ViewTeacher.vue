<template>
  <div>
    <div class="row">
      <div class="col">
        <b-card
          title="Information"
          class="mb-3">
          <div class="row">
            <div class="col-5">
              <b-img v-bind:src="teacher_picture" fluid alt="Responsive image"/>
            </div>
            <form class="col">
              <div class="row">
                <div class="form-group col">
                  <label>Firstname (Thai)</label>
                  <input
                  v-model="this.teacher.name.th_first"
                  class="form-control"
                  disabled>
                </div>
                <div class="form-group col">
                  <label>Lastname (Thai)</label>
                  <input
                  v-model="this.teacher.name.th_last"
                  class="form-control"
                  disabled>
                </div>
              </div>
              <div class="row">
                <div class="form-group col">
                  <label>Firstname (English)</label>
                  <input
                  v-model="this.teacher.name.en_first"
                  class="form-control"
                  disabled>
                </div>
                <div class="form-group col">
                  <label>Lastname (English)</label>
                  <input
                  v-model="this.teacher.name.en_last"
                  class="form-control"
                  disabled>
                </div>
              </div>
              <div class="row">
                <div class="form-group col">
                  <label for="email">Email</label>
                  <input type='email'
                  v-model="this.teacher.email"
                  class="form-control"
                  disabled>
                </div>
                <div class="form-group col">
                    <label for="tel">Telephone</label>
                    <input
                    v-model="this.teacher.telephone"
                    type="tel"
                    class="form-control"
                    disabled>
                </div>
              </div>
            </form>
          </div>
        </b-card>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
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
import { GET_TEACHER_ALARM_STATUS } from '@/vuex/getter-types'
import { mapGetters } from 'vuex'
import { FETCH_TEACHER_ALARM_STATUS } from '@/vuex/action-types'
import { DateTime } from 'luxon'

export default {
  name: 'ViewTeacher',
  data () {
    return {
      teacher_picture: ''
    }
  },
  computed: {
    ...mapGetters({
      alarm_status: [GET_TEACHER_ALARM_STATUS]
    }),
    teacher () {
      return this.$store.getters.getTeacher(this.$route.params.id)
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
      this.$store.dispatch(FETCH_TEACHER_ALARM_STATUS, this.$route.params.id)
      firebase.storage().ref().child('teachers/' + this.$route.params.id)
      .getDownloadURL()
      .then((url) => {
        this.teacher_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.teacher_picture = 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538474-user_512x512.png'
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
