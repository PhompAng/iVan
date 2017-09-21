<template>
  <div>
    <b-modal id="adminModal"
             ref="modal"
             size="lg"
             :title="this.title"
             ok-title="Done"
             :no-close-on-backdrop="true"
             :no-close-on-esc="true"
             :ok-disabled="okDisabled"
             v-bind:ok-only="true"
             @ok="update"
             v-on:hidden="hide">
      <form @submit.stop.prevent="handleSubmit">
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
            <label for="school">School</label>
            <b-form-select v-model="form.school" :options="schools" class="mb-3"></b-form-select>
          </div>
          <div class="form-group col">
            <label for="file_input">File</label>
            <b-form-file id="file_input" v-model="form.file"></b-form-file>
            <!-- <span>Selected file: {{form.file && form.file.name}}</span> -->
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
import { CREATE_ADMIN, UPDATE_ADMIN } from '@/vuex/action-types'
import { GET_SCHOOL_SELECT } from '@/vuex/getter-types'
import { mapGetters } from 'vuex'
export default {
  name: 'AdminsModal',
  props: ['showModal', 'form', 'isCreate'],
  data () {
    return {
      okDisabled: false
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT]
    }),
    title () {
      return this.isCreate ? 'Create Admin' : 'Edit Admin'
    }
  },
  watch: {
    showModal: function (val) {
      if (val) {
        this.$refs.modal.show()
      } else {
        this.$refs.modal.hide()
      }
    }
  },
  methods: {
    hide () {
      this.okDisabled = false
      this.$emit('hide')
    },
    update (e) {
      e.cancel()
      this.okDisabled = true
      if (this.isCreate) {
        this.$store.dispatch(CREATE_ADMIN, this.form)
        .then(() => {
          this.hide()
        })
      } else {
        this.$store.dispatch(UPDATE_ADMIN, this.form)
        .then(() => {
          this.hide()
        })
      }
    }
  },
  components: {
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
