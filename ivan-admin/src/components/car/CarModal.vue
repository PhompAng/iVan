<template>
  <div>
    <b-modal id="carModal"
             ref="modal"
             size="lg"
             :title="this.title"
             ok-title="Done"
             :no-close-on-backdrop="true"
             :ok-disabled="okDisabled"
             v-bind:ok-only="true"
             @ok="update"
             @shown="shown"
             v-on:hidden="hide">
      <form @submit.stop.prevent="handleSubmit">
        <div class="row">
          <div class="form-group col">
            <label>Plate Number</label>
            <input v-model="form.plate_number" class="form-control" placeholder="">
          </div>
          <div class="form-group col">
            <label>Model</label>
            <input v-model="form.model" class="form-control" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label>Chassis No.</label>
            <input v-model="form.chassis" class="form-control" placeholder="">
          </div>
          <div class="form-group col">
            <label>Province.</label>
            <input v-model="form.province" class="form-control" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="file_input">Upload Photo</label>
            <b-form-file id="file_input" v-model="form.file"></b-form-file>
            <!-- <span>Selected file: {{form.file && form.file.name}}</span> -->
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <p>Morning</p>
            <div class="row">
              <div class="form-group col-6">
                <label>Start</label>
                <vue-timepicker v-model="form.time.morning.start" format="HH:mm" :minute-interval="10" hide-clear-button></vue-timepicker>
              </div>
              <div class="form-group col-6">
                <label>End</label>
                <vue-timepicker v-model="form.time.morning.end" format="HH:mm" :minute-interval="10" hide-clear-button></vue-timepicker>
              </div>
            </div>
          </div>
          <div class="col-6">
            <p>Evening</p>
            <div class="row">
              <div class="form-group col-6">
                <label>Start</label>
                <vue-timepicker v-model="form.time.evening.start" format="HH:mm" :minute-interval="10" hide-clear-button></vue-timepicker>
              </div>
              <div class="form-group col-6">
                <label>End</label>
                <vue-timepicker v-model="form.time.evening.end" format="HH:mm" :minute-interval="10" hide-clear-button></vue-timepicker>
              </div>
            </div>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { modalToggleable } from '@/components/mixins/modalToggleable'
import { CREATE_CAR, UPDATE_CAR } from '@/vuex/action-types'
import VueTimepicker from 'vue2-timepicker'

export default {
  name: 'CarModal',
  props: ['form', 'isCreate'],
  mixins: [modalToggleable],
  computed: {
    title () {
      return this.isCreate ? 'Create Car' : 'Edit Car'
    }
  },
  methods: {
    shown () {
      this.onShow()
    },
    update (e) {
      e.cancel()
      this.okDisabled = true
      if (this.isCreate) {
        this.$store.dispatch(CREATE_CAR, this.form)
        .then(() => {
          this.hide()
        })
      } else {
        this.$store.dispatch(UPDATE_CAR, this.form)
        .then(() => {
          this.hide()
        })
      }
    }
  },
  components: {
    VueTimepicker
  }

}
</script>
<style scoped>
.custom-file {
  display: block;
}
</style>
