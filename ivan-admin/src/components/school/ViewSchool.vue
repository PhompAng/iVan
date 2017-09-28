<template>
  <div>
    <b-card-group deck class="mb-3">
      <b-card header="Information">
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
      <b-card header="Staff">
        <div class="row">
          <div class="col">
            <p class="card-text">Kris Srichure</p>
            <p class="card-text">Nanthit Atitarn</p>
            <p class="card-text">Tosanakorn Poolvaraluck</p>
            <p class="card-text">Naruesorn Saenamuang</p>
            <p class="card-text">Tadthon Singharattanapan</p>
          </div>
          <div class="col">
            <p class="card-text">Choi Punyawong</p>
            <p class="card-text">Phayao Pongsanam</p>
            <p class="card-text">Neung Kurusarttra</p>
            <p class="card-text">Yupin Suchinda</p>
            <p class="card-text">On Choi Sirishumsaeng</p>
          </div>
        </div>
      </b-card>
    </b-card-group>

    <b-card-group deck class="mb-3">
      <b-card header="Location">
        <gmap-map ref="gmap" class="map" :center="this.school.location" :zoom="12">
          <gmap-marker :position="this.school.location"></gmap-marker>
        </gmap-map>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'ViewSchool',
  data () {
    return {
      logo: ''
    }
  },
  methods: {
    getLogo () {
      firebase.storage().ref().child('schools/' + this.$route.params.id).getDownloadURL()
      .then((url) => {
        this.logo = url
      })
    }
  },
  computed: {
    school () {
      return this.$store.getters.getSchool(this.$route.params.id)
    }
  },
  created () {
    this.getLogo()
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
