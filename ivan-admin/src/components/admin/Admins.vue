<template>
  <div>
    <div class="row">
      <div class="form-group col-3">
        <label for="school">School</label>
        <b-form-select v-model="school" :options="schools" class="mb-3"></b-form-select>
      </div>
    </div>

    <b-table striped hover bordered
             :items="admins"
             :fields="fields">
      <template slot="id" scope="data">{{data.index + 1}}</template>
      <template slot="enName" scope="data">{{data.item.name.en_first}} {{data.item.name.en_last}}</template>
      <template slot="thName" scope="data">{{data.item.name.th_first}} {{data.item.name.th_last}}</template>
      <template slot="tel" scope="data">{{data.item.telephone}}</template>
      <template slot="action" scope="data">
        <b-button size="sm" variant="warning" @click.stop="update(data.item, data.index, $event.target)">
          <i class="ti-pencil"></i>
          Edit
        </b-button>
        <b-button size="sm" variant="danger" @click.stop="remove(data.item, data.index, $event.target)">
          <i class="ti-trash"></i>
          Delete
        </b-button>
      </template>
    </b-table>
    <b-btn variant="primary" @click="createAdmin">Create</b-btn>
    <admin-modal :showModal="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></admin-modal>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_ADMINS } from '@/vuex/getter-types'
import { DELETE_ADMIN, FETCH_ADMIN, FETCH_SCHOOL } from '@/vuex/action-types'
import AdminModal from '@/components/admin/AdminModal'
import swal from 'sweetalert'

export default {
  name: 'Admins',
  data () {
    return {
      fields: {
        id: { label: 'No.', sortable: true },
        enName: { label: 'English name', sortable: true },
        thName: { label: 'Thai name', sortable: true },
        tel: { label: 'Telephone' },
        action: { label: 'Action' }
      },
      showModal: false,
      isCreate: true,
      school: '',
      form: {
        name: {
          th_first: 'ฟ้าค',
          th_last: 'เรื่องกุ',
          en_first: 'what the',
          en_last: 'fuck'
        },
        email: 'aaaaaa@fuck.co.th',
        password: '123465',
        school: '',
        telephone: '0896728777',
        file: null
      }
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      admins: [GET_ADMINS]
    })
  },
  watch: {
    school: function (params) {
      // this.admins = this.$store.getters.getSchoolAdmins(params)
      this.$store.dispatch(FETCH_ADMIN, params)
      this.form.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.form.school = params[0].value
        this.$store.dispatch(FETCH_ADMIN, params[0].value)
      }
    }
  },
  methods: {
    createAdmin () {
      this.showModal = true
    },
    view (item, index, e) {
      this.$router.push({name: 'ViewSchool', params: {id: item.id}})
    },
    update (item, index, e) {
      let form = JSON.parse(JSON.stringify(item))
      this.form = form
      this.isCreate = false
      this.showModal = true
    },
    remove (item, index, e) {
      swal({
        title: 'Delete ?',
        text: 'Once deleted, you will not be able to recover this imaginary file!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
      .then((value) => {
        if (value) {
          let form = JSON.parse(JSON.stringify(item))
          this.$store.dispatch(DELETE_ADMIN, form)
          .then(() => {
            swal('Delete Success!', {
              icon: 'success'
            })
          })
          .catch((error) => {
            swal({
              title: 'Error!',
              text: error,
              icon: 'warning'
            })
          })
        }
      })
    },
    clear () {
      this.showModal = false
      this.isCreate = true
      this.form.name.th_first = ''
      this.form.name.th_last = ''
      this.form.name.en_first = ''
      this.form.name.en_last = ''
      this.form.email = ''
      this.form.password = ''
      this.form.school = ''
      this.form.telephone = ''
      this.form.file = null
    }
  },
  components: {
    AdminModal
  },
  beforeRouteEnter (to, form, next) {
    next(vm => {
      vm.$store.dispatch(FETCH_SCHOOL)
    })
  }
}
</script>

<style scoped>

</style>
