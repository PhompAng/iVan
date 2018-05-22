<template>
  <b-card v-bind:title="student.text"
        v-bind:img-src="student_picture"
        class="student"
        img-alt="Img"
        img-top>
        <p class="card-text">
        No : {{student.no}} <br>
        Car : <router-link :to="{name: 'ViewCar', params: {id: this.student.car}}">{{car_plate_number}}</router-link>
        </p>
        <router-link :to="{name: 'ViewStudent', params: {id: this.student.id}}">
          <b-button variant="primary">More Information</b-button>
        </router-link>
    </b-card>
</template>

<script>
import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import { GET_CARS } from '@/vuex/getter-types'

export default {
  name: 'student-card',
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      student_picture: ''
    }
  },
  computed: {
    ...mapGetters({
      cars: [GET_CARS]
    }),
    car_plate_number () {
      let car = this.cars.filter(car => car.id === this.student.car)
      if (car.length !== 0) {
        return car[0].plate_number
      } else {
        return 'undefined'
      }
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
    }
  }
}
</script>

<style scoped>
.student {
  max-width: 250px;
}
.card-img-top {
  height: 250px;
  object-fit: cover;
}
</style>
