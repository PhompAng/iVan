<template>
  <div>
    <b-modal id="deviceModal"
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
            <label>Serial Number</label>
            <input v-model="form.serial_number" class="form-control" placeholder="">
          </div>
          <div class="form-group col">
            <label>Make Date</label>
            <input type="date" v-model="form.make_date" class="form-control" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label>Status</label>
            <b-form-select
            class="mb-3"
            v-model="form.status"
            :options="options"
            required></b-form-select>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { modalToggleable } from '@/components/mixins/modalToggleable'
import { CREATE_DEVICE, UPDATE_DEVICE } from '@/vuex/action-types'

export default {
  name: 'DeviceModal',
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
      return this.isCreate ? 'Create Device' : 'Edit Device'
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
        this.$store.dispatch(CREATE_DEVICE, this.form)
        .then(() => {
          this.hide()
        })
      } else {
        this.$store.dispatch(UPDATE_DEVICE, this.form)
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
