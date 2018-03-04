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
            <label for="firstname_thai">Firstname (Thai)</label>
            <input name="firstname_thai" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('firstname_thai') }" v-model="form.name.th_first" class="form-control" placeholder="">
            <span v-show="errors.has('firstname_thai')" class="text-danger">{{ errors.first('firstname_thai') }}</span>
          </div>
          <div class="form-group col">
            <label for="lastname_thai">Lastname (Thai)</label>
            <input name="lastname_thai" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('lastname_thai') }"  v-model="form.name.th_last" class="form-control" placeholder="">
            <span v-show="errors.has('lastname_thai')" class="text-danger">{{ errors.first('lastname_thai') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="firstname_eng">Firstname (English)</label>
            <input name="firstname_eng" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('firstname_eng') }"  v-model="form.name.en_first" class="form-control" placeholder="">
            <span v-show="errors.has('firstname_eng')" class="text-danger">{{ errors.first('firstname_eng') }}</span>
          </div>
          <div class="form-group col">
            <label for="lastname_eng">Lastname (English)</label>
            <input name="lastname_eng" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('lastname_eng') }" v-model="form.name.en_last" class="form-control" placeholder="">
            <span v-show="errors.has('lastname_eng')" class="text-danger">{{ errors.first('lastname_eng') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="parent">Parent</label>
            <b-form-select
            class="mb-3"
            name="parent" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('parent') }"
            v-model="form.parent"
            :options="parents"
            required></b-form-select>
            <span v-show="errors.has('parent')" class="text-danger">{{ errors.first('parent') }}</span>
          </div>
          <div class="form-group col">
            <label for="file_input">Upload Photo</label>
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
      this.$validator.validateAll().then((result) => {
        if (result) {
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
      })
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
