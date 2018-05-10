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
      <router-link :to="{name: this.to, params: {id: this.staff.id}}">
        <b-button variant="primary">More Information</b-button>
      </router-link>
  </b-card>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'staff-card',
  props: {
    staff: {
      type: Object,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
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
    }
  }
}
</script>

<style scoped>
.staff {
  max-width: 250px;
}
.card-img-top {
  height: 250px;
  object-fit: cover;
}
</style>
