<template>
  <div>
    <loading :isShow="this.loading"></loading>
    <h2>Cars</h2>
    <div class="row">
      <choose-schools class="col"
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>
      <b-form-group label="Search" class="col-3">
      <b-form-input v-model="filter" placeholder=""/></b-form-group>
    </div>
    <b-table striped hover bordered
             :items="cars"
             :sort-compare="compare"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :fields="fields">
      <template slot="plate_number" slot-scope="data">
          {{data.item.plate_number}}
      </template>
      <template slot="model" slot-scope="data">
          {{data.item.model}}
      </template>
      <template slot="star" slot-scope="data">
          <span v-if="data.item.star">
            {{data.item.star | toFixed }} <i class="fal fa-star"></i>
          </span>
          <span v-else>-</span>
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
          <i class="far fa-eye"></i>
          View
        </b-button>
        <b-button size="sm" variant="warning" @click.stop="update(data.item, data.index, $event.target)">
          <i class="far fa-edit"></i>
          Edit
        </b-button>
        <b-button size="sm" variant="danger" @click.stop="remove(data.item, data.index, $event.target)">
          <i class="far fa-trash"></i>
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
          :to="{name: 'ManageRoute', params: {id: data.item.id}}">
          <b-button size="sm" variant="info">
            Route
          </b-button>
        </router-link>
        <router-link
          :to="{name: 'Maintenance', params: {id: data.item.id}}">
          <b-button size="sm" variant="secondary">
            Maintenance
          </b-button>
        </router-link>
        <a :href="getLiveUrl(data.item)" target="_blank">
          <b-button size="sm" variant="outline-primary">
            Live
          </b-button>
        </a>
      </template>
    </b-table>
    <b-col class="row justify-content-center">
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
    </b-col>
    <create-button
      :user="this.user"
      :text="'Add Car'"
      v-on:create="create"></create-button>
    <car-modal :isShow="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></car-modal>
  </div>
</template>

<script>
import mockChassis from '@/mocker/mockChassis'
import mockPlate from '@/mocker/mockPlate'
import mockCar from '@/mocker/mockCar'
import { sortCompare } from '@/components/mixins/sortCompare'
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
  mixins: [sortCompare],
  data () {
    return {
      loading: true,
      fields: {
        plate_number: { label: 'Plate Number', sortable: true },
        model: { label: 'Model', sortable: true },
        star: { label: 'Star' },
        driver: { label: 'Driver' },
        action: { label: 'Action' }
      },
      currentPage: 1,
      perPage: 20,
      filter: null,
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
          },
          work_all_day: false
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
    }),
    totalRows: function () {
      return this.cars.length
    }
  },
  filters: {
    toFixed (val) {
      return val.toFixed(2)
    }
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
      this.work_all_day = false
      this.isCreate = true
      this.form.chassis = mockChassis()
      this.form.plate_number = mockPlate()
      this.form.model = mockCar()
      this.form.province = ''
      this.form.file = null
      this.form.time.morning.start.HH = '07'
      this.form.time.morning.start.mm = '00'
      this.form.time.morning.end.HH = '11'
      this.form.time.morning.end.mm = '00'
      this.form.time.evening.start.HH = '12'
      this.form.time.evening.start.mm = '00'
      this.form.time.evening.end.HH = '23'
      this.form.time.evening.end.mm = '00'
    },
    getLiveUrl (data) {
      return 'https://media-ivan.meranote.in.th/player/' + data.id
    }
  },
  components: {
    CarModal, Loading, CreateButton, ChooseSchools
  }
}
</script>

<style scoped>

</style>
