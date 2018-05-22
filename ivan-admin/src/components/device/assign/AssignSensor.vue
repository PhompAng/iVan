 <template>
  <div>
    <div class="row list-wrapper">
      <div class="col-lg-5">
        <h4>All Sensors</h4>
        <b-list-group>
          <b-list-group-item
          v-for="sensor in sensors"
          :key="sensor.id"
          v-bind:class="{
            active: currentLeft != null && currentLeft.id == sensor.id,
            'bg-secondary disable': sensor.device != null && sensor.device !== device}"
          @click="updateLeft(sensor)">
            {{sensor.text}}
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
        <h4>Current Sensors</h4>
        <b-list-group>
          <b-list-group-item
          v-for="sensor in selected"
          :key="sensor.id"
          v-bind:class="
            {active: currentRight != null && currentRight.id == sensor.id}"
          @click="updateRight(sensor)">
            {{sensor.text}}
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
import { ASSIGN_SENSOR } from '@/vuex/action-types'
import CreateButton from '@/components/CreateButton'
import swal from 'sweetalert'

export default {
  name: 'Assignsensor',
  props: {
    limit: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      device: '',
      currentLeft: null,
      currentRight: null,
      selected: [],
      sensors: []
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
      this.device = this.$route.params.id
      firebase.database().ref().child('devices/' + this.$route.params.id)
      .once('value')
      .then((snapshot) => {
        firebase.database().ref().child('sensors')
        .orderByChild('school')
        .equalTo(snapshot.val().school)
        .once('value')
        .then((snapshot) => {
          snapshot.forEach((child) => {
            let sensor = JSON.parse(JSON.stringify(child.val()))
            sensor['id'] = child.key
            sensor['text'] = sensor.serial_number
            if (sensor.device == null) {
              this.sensors.push(sensor)
            } else if (sensor.device === this.device) {
              this.selected.push(sensor)
            }
          })
        })
      })
    },
    updateLeft (sensor) {
      if (this.selected.length >= this.limit || sensor.device != null && sensor.device !== this.device) {
        return
      }
      this.currentLeft = sensor
      this.currentRight = null
    },
    updateRight (sensor) {
      this.currentRight = sensor
      this.currentLeft = null
    },
    moveRight () {
      if (this.currentLeft == null) {
        return
      }
      this.selected.push(this.currentLeft)
      this.sensors.splice(
        this.sensors.findIndex(el => el.id === this.currentLeft.id),
        1)
      this.currentLeft = null
    },
    moveLeft () {
      if (this.currentRight == null) {
        return
      }
      this.sensors.push(this.currentRight)
      this.selected.splice(
        this.selected.findIndex(el => el.id === this.currentRight.id),
        1)
      this.currentRight = null
    },
    assign () {
      this.$store.dispatch(ASSIGN_SENSOR, {
        deviceId: this.$route.params.id,
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
