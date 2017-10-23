<template>
  <div>
    <loading :isShow="this.loading"></loading>
    <h2>Parents</h2>
    <choose-schools
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>

    <b-table striped hover bordered
             :items="parents"
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
    <create-user-button
      :user="this.user"
      v-on:create="create"></create-user-button>
    <parent-modal :isShow="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></parent-modal>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_PARENTS, GET_USER } from '@/vuex/getter-types'
import { DELETE_PARENT, FETCH_PARENT, FETCH_SCHOOL } from '@/vuex/action-types'
import ParentModal from '@/components/parent/ParentModal'
import Loading from '@/components/Loading'
import ChooseSchools from '@/components/ChooseSchools'
import CreateUserButton from '@/components/CreateUserButton'
import swal from 'sweetalert'

export default {
  name: 'Parents',
  data () {
    return {
      loading: true,
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
          th_first: 'ศุภณัฐ',
          th_last: 'สวนทวี',
          en_first: 'Supanut',
          en_last: 'Suantawee'
        },
        address: {
          line1: '',
          line2: '',
          district: '',
          city: '',
          province: '',
          postcode: ''
        },
        location: {
          lat: 13.7308051,
          lng: 100.7806353
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
      parents: [GET_PARENTS],
      user: [GET_USER]
    })
  },
  watch: {
    '$route': 'fetch',
    school: function (params) {
      this.$store.dispatch(FETCH_PARENT, params)
      this.form.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.form.school = params[0].value
        this.$store.dispatch(FETCH_PARENT, params[0].value)
        this.loading = false
      }
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      if (this.user.role === 99) {
        this.$store.dispatch(FETCH_SCHOOL)
      } else {
        this.school = this.user.school
        this.loading = false
      }
    },
    create () {
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
          this.$store.dispatch(DELETE_PARENT, form)
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
      this.form.address.line1 = ''
      this.form.address.line2 = ''
      this.form.address.district = ''
      this.form.address.city = ''
      this.form.address.province = ''
      this.form.address.postcode = ''
      this.form.location.lat = 13.7308051
      this.form.location.lng = 100.7806353
      this.form.email = ''
      this.form.password = ''
      this.form.school = ''
      this.form.telephone = ''
      this.form.file = null
    }
  },
  components: {
    ParentModal, Loading, CreateUserButton, ChooseSchools
  }
}
</script>

<style scoped>

</style>
