<template>
  <div>
    <loading :isShow="this.loading"></loading>
    <h2>Devices</h2>
    <choose-schools
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>

    <b-table striped hover bordered
             :items="devices"
             :fields="fields">
      <template slot="id" slot-scope="data">{{data.index + 1}}</template>
      <template slot="serial_number" slot-scope="data">
          {{data.item.serial_number}}
      </template>
      <template slot="make_date" slot-scope="data">
          {{data.item.make_date}}
      </template>
      <template slot="status" slot-scope="data">
        {{data.item.status}}
      </template>
      <template slot="sensors" slot-scope="data">
        <div v-if="data.item.sensors">
          <p v-for="s in data.item.sensors" :key="s.id">
            {{s.serial_number}}
          </p>
        </div>
        <div v-else>
          <p class="text-muted">
            Not assigned
          </p>
        </div>
      </template>
      <template slot="action" slot-scope="data">
        <!-- <b-button size="sm" variant="success" @click.stop="view(data.item, data.index, $event.target)">
          <i class="ti-eye"></i>
          View
        </b-button> -->
        <b-button size="sm" variant="warning" @click.stop="update(data.item, data.index, $event.target)">
          <i class="ti-pencil"></i>
          Edit
        </b-button>
        <b-button size="sm" variant="danger" @click.stop="remove(data.item, data.index, $event.target)">
          <i class="ti-trash"></i>
          Delete
        </b-button>
        <br>
        <router-link :to="{name: 'DeviceAssign', params: {id: data.item.id}}">
          <b-button
          size="sm"
          variant="primary">
            Assign
          </b-button>
        </router-link>
      </template>
    </b-table>
    <create-button
      :user="this.user"
      v-on:create="create"></create-button>
    <device-modal :isShow="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></device-modal>
  </div>
</template>

<script>
import mockChassis from '@/mocker/mockChassis'
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_DEVICES, GET_USER } from '@/vuex/getter-types'
import { DELETE_DEVICE, FETCH_DEVICE, FETCH_SCHOOL } from '@/vuex/action-types'
import Loading from '@/components/Loading'
import ChooseSchools from '@/components/ChooseSchools'
import CreateButton from '@/components/CreateButton'
import DeviceModal from '@/components/device/DeviceModal'
import swal from 'sweetalert'

export default {
  name: 'Device',
  data () {
    return {
      loading: true,
      fields: {
        id: { label: 'No.', sortable: true },
        serial_number: { label: 'Serial Number', sortable: true },
        make_date: { label: 'Make Date', sortable: true },
        status: { label: 'Status' },
        sensors: { label: 'Sensors' },
        action: { label: 'Action' }
      },
      showModal: false,
      isCreate: true,
      school: '',
      form: {
        serial_number: '',
        make_date: '',
        status: '',
        school: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      devices: [GET_DEVICES],
      user: [GET_USER]
    })
  },
  watch: {
    '$route': 'fetch',
    school: function (params) {
      this.$store.dispatch(FETCH_DEVICE, params)
      this.form.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.form.school = params[0].value
        this.$store.dispatch(FETCH_DEVICE, params[0].value)
        this.loading = false
      }
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.clear()
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
      // this.$router.push({name: 'Viewdevice', params: {id: item.id}})
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
          this.$store.dispatch(DELETE_DEVICE, form)
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
      this.form.serial_number = mockChassis()
      this.form.make_date = '2017-12-12'
      this.form.status = 'normal'
    }
  },
  components: {
    Loading, CreateButton, ChooseSchools, DeviceModal
  }
}
</script>

<style scoped>

</style>
