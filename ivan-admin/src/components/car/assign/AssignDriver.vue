<template>
  <div>
    <div class="row list-wrapper">
      <div class="col-lg-5">
        <h4>All Drivers</h4>
        <b-list-group>
          <b-list-group-item
          v-for="driver in drivers"
          :key="driver.id"
          v-bind:class="{
            active: currentLeft != null && currentLeft.id == driver.id,
            'bg-secondary disable': driver.car != null && driver.car !== car}"
          @click="updateLeft(driver)">
            {{driver.text}}
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-lg-2 d-flex justify-content-center flex-column align-items-center">
        <b-button
          class="d-block"
          variant="outline-primary"
          @click="moveRight()"
          :disabled="selected.length >= limit">
          >>>
        </b-button>
        <b-button
          class="d-block"
          variant="outline-primary"
          @click="moveLeft()">
          <<<
        </b-button>
      </div>
      <div class="col-lg-5">
        <h4>Current Driver</h4>
        <b-list-group>
          <b-list-group-item
          v-for="driver in selected"
          :key="driver.id"
          v-bind:class="
            {active: currentRight != null && currentRight.id == driver.id}"
          @click="updateRight(driver)">
            {{driver.text}}
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
    <br>
    <create-button
        :user="this.user"
        text="Assign"
        v-on:create="assign"></create-button>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import { GET_USER } from '@/vuex/getter-types'
import { ASSIGN_DRIVER } from '@/vuex/action-types'
import CreateButton from '@/components/CreateButton'

export default {
  name: 'AssignDriver',
  props: {
    limit: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      car: '',
      currentLeft: null,
      currentRight: null,
      selected: [],
      drivers: []
    }
  },
  computed: {
    ...mapGetters({
      user: [GET_USER]
    })
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.car = this.$route.params.id
      firebase.database().ref().child('cars/' + this.$route.params.id)
      .once('value')
      .then((snapshot) => {
        firebase.database().ref().child('drivers')
        .orderByChild('school')
        .equalTo(snapshot.val().school)
        .once('value')
        .then((snapshot) => {
          snapshot.forEach((child) => {
            let driver = JSON.parse(JSON.stringify(child.val()))
            driver['id'] = child.key
            driver['text'] = driver.name.th_first + ' ' + driver.name.th_last
            if (driver.car == null) {
              this.drivers.push(driver)
            } else if (driver.car === this.car) {
              this.selected.push(driver)
            }
          })
        })
      })
    },
    updateLeft (driver) {
      if (this.selected.length >= this.limit || driver.car != null && driver.car !== this.car) {
        return
      }
      this.currentLeft = driver
      this.currentRight = null
    },
    updateRight (driver) {
      this.currentRight = driver
      this.currentLeft = null
    },
    moveRight () {
      if (this.currentLeft == null) {
        return
      }
      this.selected.push(this.currentLeft)
      this.drivers.splice(
        this.drivers.findIndex(el => el.id === this.currentLeft.id),
        1)
      this.currentLeft = null
    },
    moveLeft () {
      if (this.currentRight == null) {
        return
      }
      this.drivers.push(this.currentRight)
      this.selected.splice(
        this.selected.findIndex(el => el.id === this.currentRight.id),
        1)
      this.currentRight = null
    },
    assign () {
      this.$store.dispatch(ASSIGN_DRIVER, {
        carId: this.$route.params.id,
        selected: this.selected
      })
    }
  },
  components: {
    CreateButton
  }
}
</script>

<style scoped>
.list-wrapper {
  min-height: 300px;
}
.list-group-item.disable {
  color: #fff;
  cursor: not-allowed;
}
</style>
