<template>
  <div>
    <loading :isShow="this.loading"></loading>
    <h2>Cars</h2>
    <choose-schools
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>

    <b-table striped hover bordered
             :items="cars"
             :fields="fields">
      <template slot="id" slot-scope="data">{{data.index + 1}}</template>
      <template slot="plate_number" slot-scope="data">
          {{data.item.plate_number}}
      </template>
      <template slot="model" slot-scope="data">
          {{data.item.model}}
      </template>
      <template slot="driver" slot-scope="data">
        <div v-if="data.item.drivers">
          <span v-for="d in data.item.drivers" :key="d.id">
            {{d.name.en_first}} {{d.name.en_last}}
          </span>
        </div>
        <div v-else>
          <span>
            No assigned
          </span>
        </div>
      </template>
      <template slot="action" slot-scope="data">
        <b-button size="sm" variant="success" @click.stop="view(data.item, data.index, $event.target)">
          <i class="ti-eye"></i>
          View
        </b-button>
        <b-button size="sm" variant="warning" @click.stop="update(data.item, data.index, $event.target)">
          <i class="ti-pencil"></i>
          Edit
        </b-button>
        <b-button size="sm" variant="danger" @click.stop="remove(data.item, data.index, $event.target)">
          <i class="ti-trash"></i>
          Delete
        </b-button>
        <br>
        <router-link :to="{name: 'CarAssign', params: {id: data.item.id}}">
          <b-button
          size="sm"
          variant="primary">
            Assign
          </b-button>
        </router-link>
        <router-link
          :to="{name: 'Route', params: {id: data.item.id}}">
          <b-button size="sm" variant="info">
            Route
          </b-button>
        </router-link>
      </template>
    </b-table>
    <create-button
      :user="this.user"
      v-on:create="create"></create-button>
    <car-modal :isShow="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></car-modal>
  </div>
</template>

<script>
import mockChassis from '@/mocker/mockChassis'
import mockPlate from '@/mocker/mockPlate'
import mockCar from '@/mocker/mockCar'
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_CARS, GET_USER } from '@/vuex/getter-types'
import { DELETE_CAR, FETCH_CAR, FETCH_SCHOOL } from '@/vuex/action-types'
import CarModal from '@/components/car/CarModal'
import Loading from '@/components/Loading'
import ChooseSchools from '@/components/ChooseSchools'
import CreateButton from '@/components/CreateButton'
import swal from 'sweetalert'

export default {
  name: 'Car',
  data () {
    return {
      loading: true,
      fields: {
        id: { label: 'No.', sortable: true },
        plate_number: { label: 'Plate Number', sortable: true },
        model: { label: 'Model', sortable: true },
        driver: { label: 'Driver' },
        action: { label: 'Action' }
      },
      showModal: false,
      isCreate: true,
      school: '',
      form: {
        chassis: '',
        plate_number: '',
        model: '',
        province: '',
        school: '',
        time: {
          morning: {
            start: {
              HH: '',
              mm: ''
            },
            end: {
              HH: '',
              mm: ''
            }
          },
          evening: {
            start: {
              HH: '',
              mm: ''
            },
            end: {
              HH: '',
              mm: ''
            }
          }
        },
        file: null
      }
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      cars: [GET_CARS],
      user: [GET_USER]
    })
  },
  watch: {
    '$route': 'fetch',
    school: function (params) {
      this.$store.dispatch(FETCH_CAR, params)
      this.form.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.form.school = params[0].value
        this.$store.dispatch(FETCH_CAR, params[0].value)
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
      this.$router.push({name: 'ViewCar', params: {id: item.id}})
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
          this.$store.dispatch(DELETE_CAR, form)
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
      this.form.chassis = mockChassis()
      this.form.plate_number = mockPlate()
      this.form.model = mockCar()
      this.form.province = ''
      this.form.file = null
      this.form.time.morning.start.HH = '70'
      this.form.time.morning.start.mm = '00'
      this.form.time.morning.end.HH = '11'
      this.form.time.morning.end.mm = '00'
      this.form.time.evening.start.HH = '12'
      this.form.time.evening.start.mm = '00'
      this.form.time.evening.end.HH = '23'
      this.form.time.evening.end.mm = '00'
    }
  },
  components: {
    CarModal, Loading, CreateButton, ChooseSchools
  }
}
</script>

<style scoped>

</style>
