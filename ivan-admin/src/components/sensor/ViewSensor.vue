<template>
  <div>
    <div class="col">
      <b-card
        title="Information"
        class="mb-3">
        <div class="row">
          <form class="col">
            <div class="row">
              <div class="form-group col">
                <label>Serial number</label>
                <input
                v-model="this.sensor.serial_number"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Installation Date</label>
                <input
                v-model="this.sensor.make_date"
                class="form-control"
                disabled>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Status</label>
                <input
                v-model="this.sensor.status"
                class="form-control"
                disabled>
              </div>
              <div class="form-group col">
                <label>Row</label>
                <input
                v-model="this.sensor.row"
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
import { DateTime } from 'luxon'

export default {
  name: 'ViewSensor',
  data () {
    return {
    }
  },
  computed: {
    sensor () {
      return this.$store.getters.getSensor(this.$route.params.id)
    }
  },
  filters: {
    time (val) {
      if (!val) return ''
      return DateTime.fromMillis(val).toHTTP()
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
