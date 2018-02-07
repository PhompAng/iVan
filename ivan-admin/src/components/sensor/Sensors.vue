<template>
  <div>
    <loading :isShow="this.loading"></loading>
    <h2>Sensors</h2>
    <choose-schools
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>
    <div class="row justify-content-end">
      <b-form-group horizontal label="Search" class="col-3">
      <b-form-input v-model="filter" placeholder="" /></b-form-group>
    </div>
    <b-table striped hover bordered
             :items="sensors"
             :filter="filter"
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
        <!-- <router-link v-if="data.item.device" :to="{name: 'DeviceAssign', params: {id: data.item.device}}">
          <b-button
          size="sm"
          variant="primary">
            Assign
          </b-button>
        </router-link> -->
      </template>
    </b-table>
    <create-button
      :user="this.user"
      v-on:create="create"></create-button>
    <sensor-modal :isShow="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></sensor-modal>
  </div>
</template>

<script>
import mockChassis from '@/mocker/mockChassis'
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_SENSORS, GET_USER } from '@/vuex/getter-types'
import { DELETE_SENSOR, FETCH_SENSOR, FETCH_SCHOOL } from '@/vuex/action-types'
import Loading from '@/components/Loading'
import ChooseSchools from '@/components/ChooseSchools'
import CreateButton from '@/components/CreateButton'
import SensorModal from '@/components/sensor/SensorModal'
import swal from 'sweetalert'

export default {
  name: 'Sensor',
  data () {
    return {
      loading: true,
      fields: {
        id: { label: 'No.', sortable: true },
        serial_number: { label: 'Serial Number', sortable: true },
        make_date: { label: 'Make Date', sortable: true },
        status: { label: 'Status' },
        action: { label: 'Action' }
      },
      filter: null,
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
      sensors: [GET_SENSORS],
      user: [GET_USER]
    })
  },
  watch: {
    '$route': 'fetch',
    school: function (params) {
      this.$store.dispatch(FETCH_SENSOR, params)
      this.form.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.form.school = params[0].value
        this.$store.dispatch(FETCH_SENSOR, params[0].value)
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
      // this.$router.push({name: 'ViewSensor', params: {id: item.id}})
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
          this.$store.dispatch(DELETE_SENSOR, form)
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
    Loading, CreateButton, ChooseSchools, SensorModal
  }
}
</script>

<style scoped>

</style>
