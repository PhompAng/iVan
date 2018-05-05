<template>
  <b-card v-bind:title="staff.text"
      v-bind:img-src="staff_picture"
      class="staff"
      img-alt="Img"
      img-top>
      <p class="card-text">
      Telephone : {{staff.telephone}} <br>
      Email : {{staff.email}}
      </p>
      <b-button v-bind:href="link()" variant="primary">More Information</b-button>
  </b-card>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'staff',
  props: ['staff', 'path'],
  data () {
    return {
      staff_picture: ''
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      firebase.storage().ref().child(this.path + '/' + this.staff.id)
      .getDownloadURL()
      .then((url) => {
        this.staff_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.staff_picture = 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538474-user_512x512.png'
      })
    },
    link () {
      return '/' + this.path + '/' + this.staff.id
    }
  }
}
</script>

<style scoped>
.staff {
  max-width: 17rem;
}
</style>
