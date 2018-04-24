<template>
  <div>
    <b-modal id="sensorModal"
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
            <label for="serial_number">Serial Number</label>
            <input name="serial_number" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('serial_number') }" v-model="form.serial_number" class="form-control" placeholder="">
            <span v-show="errors.has('serial_number')" class="text-danger">{{ errors.first('serial_number') }}</span>
          </div>
          <div class="form-group col">
            <label for="make_date">Installation Date</label>
            <input name="make_date" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('make_date') }" type="date" v-model="form.make_date" class="form-control" placeholder="">
            <span v-show="errors.has('make_date')" class="text-danger">{{ errors.first('make_date') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="status">Status</label>
            <b-form-select
            class="mb-3"
            name="status" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('status') }"
            v-model="form.status"
            :options="options"
            required></b-form-select>
            <span v-show="errors.has('status')" class="text-danger">{{ errors.first('status') }}</span>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { modalToggleable } from '@/components/mixins/modalToggleable'
import { CREATE_SENSOR, UPDATE_SENSOR } from '@/vuex/action-types'

export default {
  name: 'SensorModal',
  props: ['form', 'isCreate'],
  mixins: [modalToggleable],
  data () {
    return {
      options: [
        {value: 'normal', text: 'Normal'},
        {value: 'broken', text: 'Broken'},
        {value: 'missing', text: 'Missing'}
      ]
    }
  },
  computed: {
    title () {
      return this.isCreate ? 'Create Sensor' : 'Edit Sensor'
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
            this.$store.dispatch(CREATE_SENSOR, this.form)
            .then(() => {
              this.hide()
            })
          } else {
            this.$store.dispatch(UPDATE_SENSOR, this.form)
            .then(() => {
              this.hide()
            })
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.custom-file {
  display: block;
}
</style>
