<template>
  <div>
    <b-modal id="carModal"
             ref="modal"
             size="lg"
             :title="this.title"
             ok-title="Done"
             :no-close-on-backdrop="true"
             :no-close-on-esc="true"
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
            <label for="file_input">File</label>
            <b-form-file id="file_input" v-model="form.file"></b-form-file>
            <!-- <span>Selected file: {{form.file && form.file.name}}</span> -->
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { modalToggleable } from '@/components/mixins/modalToggleable'
import { CREATE_CAR, UPDATE_CAR } from '@/vuex/action-types'

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
  }
}
</script>
<style scoped>
.custom-file {
  display: block;
}
</style>
