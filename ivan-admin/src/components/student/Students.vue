<template>
  <div>
    <loading :isShow="this.loading"></loading>
    <h2>Students</h2>
    <div class="row">
      <choose-schools class="col"
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>
      <b-form-group label="Search" class="col-3">
      <b-form-input v-model="filter" placeholder=""/></b-form-group>
    </div>
    <b-table striped hover bordered
             :items="students"
             :sort-compare="compare"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :fields="fields">
      <template slot="enName" slot-scope="data">{{data.item.name.en_first}} {{data.item.name.en_last}}</template>
      <template slot="thName" slot-scope="data">{{data.item.name.th_first}} {{data.item.name.th_last}}</template>
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
        <!-- <router-link v-if="data.item.car" :to="{name: 'CarAssign', params: {id: data.item.car}}">
          <b-button
          size="sm"
          variant="primary">
            Assign
          </b-button>
        </router-link> -->
      </template>
    </b-table>
    <b-col class="row justify-content-center">
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
    </b-col>
    <create-button
      :user="this.user"
      :text="'Add Student'"
      v-on:create="create"></create-button>
    <student-modal :isShow="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></student-modal>
  </div>
</template>

<script>
import mockName from '@/mocker/mockName'
import mockStudentId from '@/mocker/mockStudentId'
import { sortCompare } from '@/components/mixins/sortCompare'
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_STUDENTS, GET_USER } from '@/vuex/getter-types'
import { DELETE_STUDENT, FETCH_STUDENT, FETCH_SCHOOL, FETCH_PARENT } from '@/vuex/action-types'
import StudentModal from '@/components/student/StudentModal'
import Loading from '@/components/Loading'
import ChooseSchools from '@/components/ChooseSchools'
import CreateButton from '@/components/CreateButton'
import swal from 'sweetalert'

export default {
  name: 'Students',
  mixins: [sortCompare],
  data () {
    return {
      loading: true,
      fields: {
        no: { label: 'Student ID', sortable: true },
        enName: { label: 'English name', sortable: true },
        thName: { label: 'Thai name', sortable: true },
        action: { label: 'Action' }
      },
      currentPage: 1,
      perPage: 20,
      filter: null,
      showModal: false,
      isCreate: true,
      school: '',
      form: {
        no: '',
        name: {
          th_first: '',
          th_last: '',
          en_first: '',
          en_last: ''
        },
        school: '',
        file: null
      }
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      students: [GET_STUDENTS],
      user: [GET_USER]
    }),
    totalRows: function () {
      return this.students.length
    }
  },
  watch: {
    '$route': 'fetch',
    school: function (params) {
      this.$store.dispatch(FETCH_STUDENT, params)
      this.form.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.form.school = params[0].value
        this.$store.dispatch(FETCH_STUDENT, params[0].value)
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
      this.$store.dispatch(FETCH_PARENT, this.form.school)
      this.showModal = true
    },
    view (item, index, e) {
      this.$router.push({name: 'ViewStudent', params: {id: item.id}})
    },
    update (item, index, e) {
      this.$store.dispatch(FETCH_PARENT, this.form.school)
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
          this.$store.dispatch(DELETE_STUDENT, form)
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
      this.form.no = mockStudentId()
      this.form.name = mockName()
      // this.form.name.th_first = ''
      // this.form.name.th_last = ''
      // this.form.name.en_first = ''
      // this.form.name.en_last = ''
      this.form.parent = null
      this.form.file = null
    }
  },
  components: {
    StudentModal, Loading, CreateButton, ChooseSchools
  }
}
</script>

<style scoped>

</style>
