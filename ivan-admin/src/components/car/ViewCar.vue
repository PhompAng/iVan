<template>
  <div>
    <div class="row">
      <div class="col-lg-4 col-md-5">
        <b-card
        title="Information"
        :img-src="car_picture"
        img-fluid
        img-alt="image"
        img-top>
          <form>
            <div class="row">
              <div class="form-group col">
                <label>Plate Number</label>
                <input
                class="form-control"
                v-model="this.car.plate_number"
                disabled>
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Model</label>
                <input
                class="form-control"
                v-model="this.car.model"
                disabled>
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Chassis No.</label>
                <input
                class="form-control"
                v-model="this.car.chassis"
                disabled>
              </div>
            </div>
          </form>
        </b-card>
      </div>

      <div class="col-lg-8 col-md-7">
        <b-card-group deck class="mb-3">
          <b-card
          title="Driver">
            <div v-if="this.car.drivers">
              <span v-for="d in this.car.drivers" :key="d.id">
                {{d.name.en_first}} {{d.name.en_last}}
              </span>
            </div>
            <div v-else>
              <span class="text-muted">
                Not assigned
              </span>
            </div>
          </b-card>

          <b-card
          title="Teachers">
            <div v-if="this.car.teachers">
              <span v-for="t in this.car.teachers" :key="t.id">
                {{t.name.en_first}} {{t.name.en_last}}
              </span>
            </div>
            <div v-else>
              <span class="text-muted">
                Not assigned
              </span>
            </div>
          </b-card>

          <b-card
          title="Students">
            <div v-if="this.car.students">
              <span v-for="s in this.car.students" :key="s.id">
                {{s.name.en_first}} {{s.name.en_last}}
              </span>
            </div>
            <div v-else>
              <span class="text-muted">
                Not assigned
              </span>
            </div>
          </b-card>
        </b-card-group>

        <div class="row">
          <div class="col-lg-6">
            <b-card-group v-if="this.car.mobility_status">
              <b-card
                title="Mobility Status">
                  <div class="mobility-status" v-for="m in this.mobility_status" :key="m.id">
                    <p>
                      <strong>Oil level: </strong>
                      <span class="text-success">{{m.oil_level}} %</span>
                    </p>
                    <p>
                      <strong>Speed: </strong>
                      <span class="text-warning">{{m.speed}} km/h</span>
                    </p>

                    <p class="text-right text-secondary">
                      <small>
                        {{m.timestamp | time}}
                      </small>
                    </p>
                    <hr>
                  </div>
              </b-card>
            </b-card-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { DateTime } from 'luxon'

export default {
  name: 'ViewCar',
  data () {
    return {
      car_picture: ''
    }
  },
  computed: {
    car () {
      return this.$store.getters.getCar(this.$route.params.id)
    },
    mobility_status () {
      if (!this.car.mobility_status) {
        return []
      }
      let arr = []
      Object.entries(this.car.mobility_status).forEach(([key, val]) => {
        let m = JSON.parse(JSON.stringify(val))
        m['id'] = key
        arr.push(m)
      })
      arr.reverse()
      return arr
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
      firebase.storage().ref().child('cars/' + this.$route.params.id)
      .getDownloadURL()
      .then((url) => {
        this.car_picture = url
      })
      .catch((error) => {
        console.log(error)
        this.car_picture = 'http://bangkok-today.com/web/wp-content/uploads/2016/06/Untitled-1.jpg'
      })
    }
  }
}
</script>

<style scoped>
.card-image {
  width: 100%;
}
.mobility-status {
  font-weight: bold;
}
</style>
