<template>
  <div>
    <div class="col">
      <b-card
        title="Information"
        class="mb-3">
        <div class="row">
          <div class="col-5">
            <b-img v-bind:src="admin_picture" fluid alt="Responsive image"/>
          </div>
          <form class="col">
            <div class="row">
              <div class="form-group col">
                <label>Firstname (Thai)</label>
                <input
                v-model="this.admin.name.th_first"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Lastname (Thai)</label>
                <input
                v-model="this.admin.name.th_last"
                class="form-control"
                disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Firstname (English)</label>
                <input
                v-model="this.admin.name.en_first"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Lastname (English)</label>
                <input
                v-model="this.admin.name.en_last"
                class="form-control"
                disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label for="tel">Telephone</label>
                <input type='number'
                v-model="this.admin.telephone"
                class="form-control"
                disabled>
              </div>
            </div>
          </form>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { DateTime } from 'luxon'

export default {
  name: 'ViewAdmin',
  data () {
    return {
      admin_picture: ''
    }
  },
  computed: {
    admin () {
      return this.$store.getters.getAdmin(this.$route.params.id)
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
      firebase.storage().ref().child('admins/' + this.$route.params.id)
      .getDownloadURL()
      .then((url) => {
        this.admin_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.admin_picture = 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538474-user_512x512.png'
      })
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
