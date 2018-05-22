<template>
  <div>
    <div class="row">
      <div class="col">
        <b-card
          title="Information"
          class="mb-3">
          <div class="row">
            <div class="col-3">
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
                  <i class="far fa-trash"></i>
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
                  <i class="far fa-eye"></i>
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
import { GET_TEACHER_ALARM_STATUS } from '@/vuex/getter-types'
import { mapGetters } from 'vuex'
import { FETCH_TEACHER_ALARM_STATUS, DELETE_ALARM_STATUS } from '@/vuex/action-types'
import { DateTime } from 'luxon'
import swal from 'sweetalert'

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
