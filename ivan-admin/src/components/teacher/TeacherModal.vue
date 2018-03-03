<template>
  <div>
    <b-modal id="teacherModal"
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
            <label for="file_input">Upload Photo</label>
            <b-form-file id="file_input" v-model="form.file"></b-form-file>
            <!-- <span>Selected file: {{form.file && form.file.name}}</span> -->
          </div>

          <div class="form-group col">
            <label for="telephone">Telephone</label>
            <input name="telephone" v-validate="'required|decimal'" :class="{'input': true, 'is-invalid': errors.has('telephone') }" v-model="form.telephone" type="tel" class="form-control" id="tel" placeholder="">
            <span v-show="errors.has('telephone')" class="text-danger">{{ errors.first('telephone') }}</span>
          </div>
        </div>

        <div v-if="isCreate">
          <div class="row">
            <div class="form-group col-6">
              <label for="email">Email</label>
              <input type='email' v-model="form.email" class="form-control" placeholder="">
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label for="password">Password</label>
              <input v-model="form.password" type='password' class="form-control" ref="password" placeholder="">
            </div>
            <div class="form-group col">
              <label for="confirmPassword">Confirm Password</label>
              <input v-model="form.password" type='password' class="form-control" ref="confirmPassword" placeholder="">
            </div>
          </div>
        </div>

      </form>
    </b-modal>
  </div>
</template>

<script>
import { modalToggleable } from '@/components/mixins/modalToggleable'
import { CREATE_TEACHER, UPDATE_TEACHER } from '@/vuex/action-types'

export default {
  name: 'TeacherModal',
  props: ['form', 'isCreate'],
  mixins: [modalToggleable],
  computed: {
    title () {
      return this.isCreate ? 'Create Teacher' : 'Edit Teacher'
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
          let teacher = Object.assign({}, this.form)
          this.okDisabled = true
          if (this.isCreate) {
            this.$store.dispatch(CREATE_TEACHER, teacher)
            .then(() => {
              this.hide()
            })
          } else {
            this.$store.dispatch(UPDATE_TEACHER, teacher)
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
