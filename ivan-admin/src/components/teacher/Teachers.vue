<template>
  <div>
    <loading :isShow="this.loading"></loading>
    <h2>Teachers</h2>
    <div class="row">
      <choose-schools class="col"
      :user="user"
      :school.sync="school"
      :schools="schools"></choose-schools>
      <b-form-group label="Search" class="col-3">
      <b-form-input v-model="filter" placeholder=""/></b-form-group>
    </div>
    <b-table striped hover bordered
             :items="teachers"
             :sort-compare="compare"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :fields="fields">
      <template slot="enName" slot-scope="data">{{data.item.name.en_first}} {{data.item.name.en_last}}</template>
      <template slot="thName" slot-scope="data">{{data.item.name.th_first}} {{data.item.name.th_last}}</template>
      <template slot="tel" slot-scope="data">{{data.item.telephone}}</template>
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
      :text="'Add Teacher'"
      v-on:create="create"></create-button>
    <teacher-modal :isShow="showModal" :isCreate="isCreate" :form="form" v-on:hide="clear"></teacher-modal>

  </div>
</template>

<script>
import mockName from '@/mocker/mockName'
import mockEmail from '@/mocker/mockEmail'
import mockTel from '@/mocker/mockTel'
import { mapGetters } from 'vuex'
import { GET_SCHOOL_SELECT, GET_TEACHERS, GET_USER } from '@/vuex/getter-types'
import { DELETE_TEACHER, FETCH_TEACHER, FETCH_SCHOOL } from '@/vuex/action-types'
import Loading from '@/components/Loading'
import TeacherModal from '@/components/teacher/TeacherModal'
import ChooseSchools from '@/components/ChooseSchools'
import CreateButton from '@/components/CreateButton'
import swal from 'sweetalert'

export default {
  name: 'Teachers',
  data () {
    return {
      loading: true,
      fields: {
        enName: { label: 'English name', sortable: true },
        thName: { label: 'Thai name', sortable: true },
        tel: { label: 'Telephone' },
        action: { label: 'Action' }
      },
      currentPage: 1,
      perPage: 20,
      showModal: false,
      isCreate: true,
      school: '',
      filter: null,
      form: {
        name: {
          th_first: '',
          th_last: '',
          en_first: '',
          en_last: ''
        },
        email: '',
        password: '',
        school: '',
        telephone: '',
        file: null
      }
    }
  },
  computed: {
    ...mapGetters({
      schools: [GET_SCHOOL_SELECT],
      teachers: [GET_TEACHERS],
      user: [GET_USER]
    }),
    totalRows: function () {
      return this.teachers.length
    }
  },
  watch: {
    '$route': 'fetch',
    school: function (params) {
      this.$store.dispatch(FETCH_TEACHER, params)
      this.form.school = params
    },
    schools: function (params) {
      if (params.length > 0 && this.school === '') {
        this.school = params[0].value
        this.form.school = params[0].value
        this.$store.dispatch(FETCH_TEACHER, params[0].value)
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
      this.$router.push({name: 'ViewTeacher', params: {id: item.id}})
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
          this.$store.dispatch(DELETE_TEACHER, form)
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
      this.form.name = mockName()
      this.form.email = mockEmail('teacher', this.teachers.length)
      this.form.telephone = mockTel()
      // this.form.name.th_first = ''
      // this.form.name.th_last = ''
      // this.form.name.en_first = ''
      // this.form.name.en_last = ''
      // this.form.email = ''
      this.form.password = '123456'
      // this.form.telephone = ''
      this.form.file = null
    },
    compare (a, b, key) {
      if (key === 'enName') {
        return (a.name.en_first + ' ' + a.name.en_last).localeCompare((b.name.en_first + ' ' + b.name.en_last), undefined, {
          numeric: true
        })
      } else if (key === 'thName') {
        return (a.name.th_first + ' ' + a.name.th_last).localeCompare((b.name.th_first + ' ' + b.name.th_last), undefined, {
          numeric: true
        })
      }
    }
  },
  components: {
    TeacherModal, Loading, CreateButton, ChooseSchools
  }
}
</script>

<style scoped>

</style>
