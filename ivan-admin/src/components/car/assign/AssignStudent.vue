 <template>
  <div>
    <div class="row list-wrapper">
      <div class="col-lg-5">
        <h4>All Students</h4>
        <b-list-group>
          <b-list-group-item
          v-for="student in students"
          :key="student.id"
          v-bind:class="{
            active: currentLeft != null && currentLeft.id == student.id,
            'bg-secondary disable': student.car != null && student.car !== car}"
          @click="updateLeft(student)">
            {{student.text}}
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-lg-2 d-flex justify-content-center flex-column align-items-center">
        <b-button
          class="d-block"
          variant="outline-primary"
          @click="moveRight()">
          >>>
        </b-button>
        <b-button
          class="d-block"
          variant="outline-primary"
          @click="moveLeft()">
          <<<
        </b-button>
      </div>
      <div class="col-lg-5">
        <h4>Current Students</h4>
        <b-list-group>
          <b-list-group-item
          v-for="student in selected"
          :key="student.id"
          v-bind:class="
            {active: currentRight != null && currentRight.id == student.id}"
          @click="updateRight(student)">
            {{student.text}}
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
    <create-button
        :user="this.user"
        text="Assign"
        v-on:create="assign"></create-button>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import { GET_USER } from '@/vuex/getter-types'
import { ASSIGN_STUDENT } from '@/vuex/action-types'
import CreateButton from '@/components/CreateButton'
import swal from 'sweetalert'

export default {
  name: 'AssignStudent',
  props: {
    limit: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      car: '',
      currentLeft: null,
      currentRight: null,
      selected: [],
      students: []
    }
  },
  computed: {
    ...mapGetters({
      user: [GET_USER]
    })
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.car = this.$route.params.id
      firebase.database().ref().child('cars/' + this.$route.params.id)
      .once('value')
      .then((snapshot) => {
        firebase.database().ref().child('students')
        .orderByChild('school')
        .equalTo(snapshot.val().school)
        .once('value')
        .then((snapshot) => {
          snapshot.forEach((child) => {
            let student = JSON.parse(JSON.stringify(child.val()))
            student['id'] = child.key
            student['text'] = student.name.th_first + ' ' + student.name.th_last
            if (student.car == null) {
              this.students.push(student)
            } else if (student.car === this.car) {
              this.selected.push(student)
            }
          })
        })
      })
    },
    updateLeft (student) {
      if (student.car != null && student.car !== this.car) {
        return
      }
      this.currentLeft = student
      this.currentRight = null
    },
    updateRight (student) {
      this.currentRight = student
      this.currentLeft = null
    },
    moveRight () {
      if (this.currentLeft == null) {
        return
      }
      if (this.currentLeft.length >= this.limit) {
        swal({
          title: 'WARNING!!',
          text: 'Passenger Limit Exceed!',
          icon: 'warning'
        })
      }
      this.selected.push(this.currentLeft)
      this.students.splice(
        this.students.findIndex(el => el.id === this.currentLeft.id),
        1)
      this.currentLeft = null
    },
    moveLeft () {
      if (this.currentRight == null) {
        return
      }
      this.students.push(this.currentRight)
      this.selected.splice(
        this.selected.findIndex(el => el.id === this.currentRight.id),
        1)
      this.currentRight = null
    },
    assign () {
      this.$store.dispatch(ASSIGN_STUDENT, {
        carId: this.$route.params.id,
        selected: this.selected
      })
      .then(() => {
        swal('Success!', {
          icon: 'success'
        })
      })
    }
  },
  components: {
    CreateButton
  }
}
</script>

<style scoped>
.list-wrapper {
  min-height: 300px;
}
.list-group-item.disable {
  color: #fff;
  cursor: not-allowed;
}
</style>
