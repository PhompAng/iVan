<template>
  <div>
    <b-card-group deck class="mb-3">
      <b-card header="Information" header-class="--no-bg">
        <div class="row">
          <div class="col">
            <b-img :src="this.logo" fluid alt="Responsive image" />
          </div>
          <div class="col-8">
            <h5 class="card-text">{{ school.name.th }}</h5>
            <h5 class="card-text">{{ school.name.en}}</h5>
            <p class="card-text">{{ school.address.line1}} {{ school.address.line2}} {{ school.address.district}} {{ school.address.city}} {{ school.address.province}} {{ school.address.postcode}}</p>
            <p class="card-text">{{ school.tel }}</p>
          </div>
        </div>
      </b-card>
      <b-card header="Teachers" header-class="--no-bg">
        <div class="row">
          <div class="col">
            <p class="card-text"
            v-for="teacher in teachers"
            :key="teacher.id">
              {{teacher.name.en_first}} {{teacher.name.en_last}}
            </p>
          </div>
        </div>
      </b-card>
      <b-card header="Drivers" header-class="--no-bg">
        <div class="row">
          <div class="col">
            <p class="card-text"
            v-for="driver in drivers"
            :key="driver.id">
              {{driver.name.en_first}} {{driver.name.en_last}}
            </p>
          </div>
        </div>
      </b-card>
    </b-card-group>

    <b-card-group deck class="mb-3">
      <b-card header="Location" class="--no-bg">
        <gmap-map ref="gmap" class="map" :center="this.school.location" :zoom="12">
          <gmap-marker :position="this.school.location"></gmap-marker>
        </gmap-map>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import { GET_TEACHERS, GET_DRIVERS } from '@/vuex/getter-types'
import { FETCH_TEACHER, FETCH_DRIVER } from '@/vuex/action-types'

export default {
  name: 'ViewSchool',
  data () {
    return {
      logo: ''
    }
  },
  computed: {
    ...mapGetters({
      teachers: [GET_TEACHERS],
      drives: [GET_DRIVERS]
    }),
    school () {
      return this.$store.getters.getSchool(this.$route.params.id)
    }
  },
  methods: {
    getLogo () {
      firebase.storage().ref().child('schools/' + this.$route.params.id).getDownloadURL()
      .then((url) => {
        this.logo = url
      })
    },
    fetch () {
      this.$store.dispatch(FETCH_TEACHER, this.$route.params.id)
      this.$store.dispatch(FETCH_DRIVER, this.$route.params.id)
    }
  },
  created () {
    this.getLogo()
    this.fetch()
  }
}
</script>

<style scoped>
p {
  color: #9A9A9A;
}

.map {
  width: 100%;
  height: 400px;
}
</style>
