<template>
  <div>
    <b-table striped hover bordered
             :items="schools"
             :fields="fields">
      <template slot="id" scope="data">{{data.index + 1}}</template>
      <template slot="enName" scope="data">{{data.item.name.en}}</template>
      <template slot="thName" scope="data">{{data.item.name.th}}</template>
      <template slot="address" scope="data">
        <p>{{data.item.address.line1}}</p>
        <p>{{data.item.address.line2}}</p>
        <p>{{data.item.address.district}} {{data.item.address.city}} {{data.item.address.province}}</p>
        <p>{{data.item.address.postcode}}</p>
      </template>
      <template slot="action" scope="data">
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
      </template>
    </b-table>
    <b-btn variant="primary" @click="createSchool">Create</b-btn>
    <school-modal :showModal="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></school-modal>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_SCHOOLS } from '@/vuex/getter-types'
import { DELETE_SCHOOL, FETCH_SCHOOL } from '@/vuex/action-types'
import SchoolModal from '@/components/school/SchoolModal'
import swal from 'sweetalert'

export default {
  name: 'Schools',
  data () {
    return {
      fields: {
        id: { label: 'No.', sortable: true },
        enName: { label: 'English name', sortable: true },
        thName: { label: 'Thai name', sortable: true },
        address: { label: 'Address' },
        tel: { label: 'Telephone' },
        action: { label: 'Action' }
      },
      showModal: false,
      isCreate: true,
      form: {
        id: '',
        name: {
          th: '',
          en: ''
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
        file: null,
        tel: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOLS]
    })
  },
  methods: {
    createSchool () {
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
          this.$store.dispatch(DELETE_SCHOOL, item)
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
      this.form.id = ''
      this.form.name.th = ''
      this.form.name.en = ''
      this.form.address.line1 = ''
      this.form.address.line2 = ''
      this.form.address.district = ''
      this.form.address.city = ''
      this.form.address.province = ''
      this.form.address.postcode = ''
      this.form.location.lat = 13.7308051
      this.form.location.lng = 100.7806353
      this.form.tel = ''
      this.form.file = null
    }
  },
  components: {
    SchoolModal
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
