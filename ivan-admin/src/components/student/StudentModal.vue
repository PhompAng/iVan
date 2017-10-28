<template>
  <div>
    <b-modal id="studentModal"
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
          <div class="form-group col-6">
            <label>Student's ID</label>
            <b-form-input type="number" v-model="form.no" class="form-control" placeholder=""></b-form-input>
          </div>
        </div>
        <div class="row">
          <div class="form-group col">
            <label>Firstname (Thai)</label>
            <input v-model="form.name.th_first" class="form-control" placeholder="">
          </div>
          <div class="form-group col">
            <label>Lastname (Thai)</label>
            <input v-model="form.name.th_last" class="form-control" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label>Firstname (English)</label>
            <input v-model="form.name.en_first" class="form-control" placeholder="">
          </div>
          <div class="form-group col">
            <label>Lastname (English)</label>
            <input v-model="form.name.en_last" class="form-control" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="Parent">Parent</label>
            <b-form-select
            class="mb-3"
            v-model="form.parent"
            :options="parents"
            value-field="id"></b-form-select>
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
import { CREATE_STUDENT, UPDATE_STUDENT } from '@/vuex/action-types'
import { GET_PARENTS } from '@/vuex/getter-types'
import { mapGetters } from 'vuex'

export default {
  name: 'StudentModal',
  props: ['form', 'isCreate'],
  mixins: [modalToggleable],
  computed: {
    ...mapGetters({
      parents: [GET_PARENTS]
    }),
    title () {
      return this.isCreate ? 'Create Student' : 'Edit Student'
    }
  },
  methods: {
    shown () {
      this.onShow()
    },
    update (e) {
      e.cancel()
      if (this.form.parent == null || this.form.parent === '') {
        return
      }
      this.okDisabled = true
      if (this.isCreate) {
        this.$store.dispatch(CREATE_STUDENT, this.form)
        .then(() => {
          this.hide()
        })
      } else {
        this.$store.dispatch(UPDATE_STUDENT, this.form)
        .then(() => {
          this.hide()
        })
      }
    }
  }
}
</script>
<style scoped>
.map {
  width: 100%;
  height: 300px;
}
.custom-file {
  display: block;
}
</style>
