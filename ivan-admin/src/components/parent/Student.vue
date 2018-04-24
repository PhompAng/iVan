<template>
  <b-container>
    <b-card v-bind:title="student.text"
        v-bind:img-src="student_picture"
        class="student"
        img-alt="Img"
        img-top>
        <p class="card-text">
        No : {{student.no}} <br>
        Car : <b-link v-bind:href="link()">{{car.plate_number}}</b-link>
        </p>
        <b-button href="#" variant="primary">More Information</b-button>
    </b-card>
  </b-container>
</template>

<script>
import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import { GET_CARS } from '@/vuex/getter-types'

export default {
  name: 'student',
  props: ['student'],
  data () {
    return {
      student_picture: ''
    }
  },
  computed: {
    ...mapGetters({
      cars: [GET_CARS]
    }),
    car () {
      return this.cars.filter(car => car.id === this.student.car)[0]
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      firebase.storage().ref().child('students/' + this.student.id)
      .getDownloadURL()
      .then((url) => {
        this.student_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.student_picture = 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538474-user_512x512.png'
      })
    },
    link () {
      return '/cars/' + this.car.id
    }
  }
}
</script>

<style scoped>
.student {
  max-width: 20rem;
}
.map {
  width: 100%;
  height: 400px;
}
</style>
