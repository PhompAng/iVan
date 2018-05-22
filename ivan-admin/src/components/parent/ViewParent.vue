<template>
  <div>
    <div class="col">
      <b-card
        title="Information"
        class="mb-3">
        <div class="row">
          <div class="col-3">
            <b-img v-bind:src="parent_picture" fluid alt="Responsive image"/>
          </div>
          <form class="col">
            <div class="row">
              <div class="form-group col">
                <label>Firstname (Thai)</label>
                <input
                v-model="this.parent.name.th_first"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Lastname (Thai)</label>
                <input
                v-model="this.parent.name.th_last"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                  <label for="email">Email</label>
                  <input type='email'
                  v-model="this.parent.email"
                  class="form-control"
                  disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Firstname (English)</label>
                <input
                v-model="this.parent.name.en_first"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Lastname (English)</label>
                <input
                v-model="this.parent.name.en_last"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                  <label for="tel">Telephone</label>
                  <input
                  v-model="this.parent.telephone"
                  type="tel"
                  class="form-control"
                  disabled>
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                  <label for="line1">Line1</label>
                  <input
                  v-model="this.parent.address.line1"
                  class="form-control"
                  disabled>
              </div>
              <div class="form-group col">
                  <label for="line2">Line2</label>
                  <input
                  v-model="this.parent.address.line2"
                  class="form-control"
                  disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>District</label>
                <input
                class="form-control"
                v-model="this.parent.address.district"
                disabled >
              </div>
              <div class="form-group col">
                <label>City</label>
                <input
                class="form-control"
                v-model="this.parent.address.city" disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Province</label>
                <input
                class="form-control"
                v-model="this.parent.address.province" disabled>
              </div>
              <div class="form-group col">
                <label>Postcode</label>
                <input
                class="form-control"
                v-model="this.parent.address.postcode" disabled>
              </div>
            </div>
          </form>
        </div>
      </b-card>

      <b-card
      class="mb-3"
      title="Student">
        <div v-if="this.filterStudent.length !== 0" class="row">
          <div class="col">
            <b-card-group deck>
              <student-card v-for="student of filterStudent"
              :key="student.id" :student="student"></student-card>
            </b-card-group>
          </div>
        </div>
        <div v-else>
          <p class="text-muted">
            No Student
          </p>
        </div>
      </b-card>

      <b-card
      class="mb-3"
      title="Location">
        <div class="row">
          <div class="col">
            <gmap-map ref="gmap" class="map" :center="this.parent.location" :zoom="12">
                <gmap-marker :position="this.parent.location"></gmap-marker>
            </gmap-map>
          </div>
        </div>
      </b-card>

    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
import { GET_STUDENTS } from '@/vuex/getter-types'
import StudentCard from '@/components/car/StudentCard'

export default {
  name: 'ViewParent',
  data () {
    return {
      parent_picture: '',
      fields: {
        enName: { label: 'English name', sortable: true },
        date: { label: 'Date', sortable: true }
      }
    }
  },
  computed: {
    ...mapGetters({
      students: [GET_STUDENTS]
    }),
    parent () {
      return this.$store.getters.getParent(this.$route.params.id)
    },
    filterStudent () {
      return this.students.filter(student => student.parent === this.$route.params.id)
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
      firebase.storage().ref().child('parents/' + this.$route.params.id)
      .getDownloadURL()
      .then((url) => {
        this.parent_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.parent_picture = 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538474-user_512x512.png'
      })
    }
  },
  components: {
    StudentCard
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
