<template>
  <b-container>
    <b-card v-bind:title="student.text"
        v-bind:img-src="student_picture"
        class="student"
        img-alt="Img"
        img-top>
        <p class="card-text">
        No : {{student.no}} <br>
        </p>
        <b-button v-bind:href="linkStudent()" variant="primary">More Information</b-button>
    </b-card>
  </b-container>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'student',
  props: ['student'],
  data () {
    return {
      student_picture: ''
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
    linkStudent () {
      return '/students/' + this.student.id
    }
  }
}
</script>

<style scoped>
.student {
  max-width: 17rem;
}
</style>
