 <template>
  <div>
    <div class="row list-wrapper">
      <div class="col-lg-5">
        <h4>All Teachers</h4>
        <b-list-group>
          <b-list-group-item
          v-for="teacher in teachers"
          :key="teacher.id"
          v-bind:class="{
            active: currentLeft != null && currentLeft.id == teacher.id,
            'bg-secondary disable': teacher.car != null && teacher.car !== car}"
          @click="updateLeft(teacher)">
            {{teacher.text}}
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-lg-2 d-flex justify-content-center flex-column align-items-center">
        <b-button
          class="d-block"
          variant="outline-primary"
          @click="moveRight()"
          :disabled="selected.length >= limit">
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
        <h4>Current Teachers</h4>
        <b-list-group>
          <b-list-group-item
          v-for="teacher in selected"
          :key="teacher.id"
          v-bind:class="
            {active: currentRight != null && currentRight.id == teacher.id}"
          @click="updateRight(teacher)">
            {{teacher.text}}
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
import { ASSIGN_TEACHER } from '@/vuex/action-types'
import CreateButton from '@/components/CreateButton'

export default {
  name: 'AssignTeacher',
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
      teachers: []
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
        firebase.database().ref().child('teachers')
        .orderByChild('school')
        .equalTo(snapshot.val().school)
        .once('value')
        .then((snapshot) => {
          snapshot.forEach((child) => {
            let teacher = JSON.parse(JSON.stringify(child.val()))
            teacher['id'] = child.key
            teacher['text'] = teacher.name.th_first + ' ' + teacher.name.th_last
            if (teacher.car == null) {
              this.teachers.push(teacher)
            } else if (teacher.car === this.car) {
              this.selected.push(teacher)
            }
          })
        })
      })
    },
    updateLeft (teacher) {
      if (this.selected.length >= this.limit || teacher.car != null && teacher.car !== this.car) {
        return
      }
      this.currentLeft = teacher
      this.currentRight = null
    },
    updateRight (teacher) {
      this.currentRight = teacher
      this.currentLeft = null
    },
    moveRight () {
      if (this.currentLeft == null) {
        return
      }
      this.selected.push(this.currentLeft)
      this.teachers.splice(
        this.teachers.findIndex(el => el.id === this.currentLeft.id),
        1)
      this.currentLeft = null
    },
    moveLeft () {
      if (this.currentRight == null) {
        return
      }
      this.teachers.push(this.currentRight)
      this.selected.splice(
        this.selected.findIndex(el => el.id === this.currentRight.id),
        1)
      this.currentRight = null
    },
    assign () {
      this.$store.dispatch(ASSIGN_TEACHER, {
        carId: this.$route.params.id,
        selected: this.selected
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
