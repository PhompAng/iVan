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
            <label for="plate_number">Plate Number</label>
            <input name="plate_number" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('plate_number') }" v-model="form.plate_number" class="form-control" placeholder="">
            <span v-show="errors.has('plate_number')" class="text-danger">{{ errors.first('plate_number') }}</span>
          </div>
          <div class="form-group col">
            <label for="model">Model</label>
            <input name="model" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('model') }" v-model="form.model" class="form-control" placeholder="">
            <span v-show="errors.has('model')" class="text-danger">{{ errors.first('model') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="chassis">Chassis No.</label>
            <input name="chassis" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('chassis') }" v-model="form.chassis" class="form-control" placeholder="">
            <span v-show="errors.has('chassis')" class="text-danger">{{ errors.first('chassis') }}</span>
          </div>
          <div class="form-group col">
            <label for="province">Province.</label>
            <input name="province" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('province') }" v-model="form.province" class="form-control" placeholder="">
            <span v-show="errors.has('province')" class="text-danger">{{ errors.first('province') }}</span>
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
        <b-form-checkbox v-model="form.work_all_day">
          work all day
        </b-form-checkbox>
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
      this.$validator.validateAll().then((result) => {
        if (result) {
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
      })
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
