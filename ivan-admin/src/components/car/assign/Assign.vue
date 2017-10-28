<template>
  <div>
    <h2>Assign ({{this.car.plate_number}})</h2>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Driver">
          <assign-driver :limit="1"></assign-driver>
        </b-tab>
        <b-tab title="Teacher">
          <assign-teacher :limit="2"></assign-teacher>
        </b-tab>
        <b-tab title="Student">
          <assign-student :limit="10"></assign-student>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>

</template>

<script>
import * as firebase from 'firebase'
import { GET_DRIVERS } from '@/vuex/getter-types'
import { mapGetters } from 'vuex'
import AssignDriver from '@/components/car/assign/AssignDriver'
import AssignTeacher from '@/components/car/assign/AssignTeacher'
import AssignStudent from '@/components/car/assign/AssignStudent'

export default {
  name: 'Assign',
  data () {
    return {
      car: ''
    }
  },
  computed: {
    ...mapGetters({
      drivers: [GET_DRIVERS]
    })
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.car = this.$route.params.id
      firebase.database().ref().child('cars/' + this.$route.params.id)
      .once('value')
      .then((snapshot) => {
        this.car = snapshot.val()
      })
    }
  },
  components: {
    AssignDriver, AssignTeacher, AssignStudent
  }
}
</script>

<style scoped>
.card-header {
  border-bottom-style: solid;
  background-color: #000;
}
</style>
