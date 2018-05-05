<template>
  <div>
    <h2>Notifications</h2>
    <choose-schools
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>

    <ul class="list-unstyled">
      <b-media
        class="notification p-3 border border-top-0"
        v-for="notification in notifications"
        :key="notification.id"
        @click="alarmStatus(notification.uid)"
        tag="li">
        <i slot="aside" class="fal fa-bell"></i>
        <h5 class="text-danger">ALERT!!</h5>
        {{notification.text}}
        <div class=" timestamp">
          <span class="text-secondary">{{notification.timestamp | time}}</span>
        </div>
      </b-media>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_NOTIFICATIONS, GET_USER } from '@/vuex/getter-types'
import { FETCH_NOTIFICATION, FETCH_SCHOOL } from '@/vuex/action-types'
import ChooseSchools from '@/components/ChooseSchools'
import { DateTime } from 'luxon'

export default {
  name: 'Notifications',
  data () {
    return {
      school: ''
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      notifications: [GET_NOTIFICATIONS],
      user: [GET_USER]
    })
  },
  watch: {
    school: function (params) {
      this.$store.dispatch(FETCH_NOTIFICATION, params)
      this.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.$store.dispatch(FETCH_NOTIFICATION, params[0].value)
      }
    }
  },
  filters: {
    time (val) {
      if (!val) return ''
      return DateTime.fromMillis(val).toLocaleString(DateTime.DATETIME_MED)
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
    alarmStatus (uid) {
      this.$router.push({name: 'AlarmStatus', params: {id: uid}})
    }
  },
  components: {
    ChooseSchools
  }
}
</script>

<style scoped>
.notification {
  background: #fff;
  cursor: pointer;
}
.notification-icon {
  font-size: 3em;
  width: 50px;
  height: 50px;
}
.media-body {
  position: relative;
}
.timestamp {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
