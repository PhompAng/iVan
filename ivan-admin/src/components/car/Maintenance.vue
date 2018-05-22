<template>
  <div>
    <div class="row">
      <div class="col">
        <b-card
        title="Maintenance">
          <form @submit.stop.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group col">
                <label for="engine_oil_mileage">Engine Oil Mileage</label>
                <input name="engine_oil_mileage" type="number" class="form-control" v-model="form.engine_oil_mileage" placeholder="10000" required>
              </div>
              <div class="form-group col">
                <label for="brake_oil_mileage">Brake Oil Mileage</label>
                <input name="brake_oil_mileage" type="number" class="form-control" v-model="form.brake_oil_mileage" placeholder="10000" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label for="maintenance_date">Maintenance Date</label>
                <input name="maintenance_date" type="date" class="form-control" v-model="form.maintenance_date" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
          </form>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { PUSH_MAINTENANCE } from '@/vuex/action-types'
import swal from 'sweetalert'

export default {
  name: 'Maintenance',
  data () {
    return {
      form: {
        engine_oil_mileage: null,
        brake_oil_mileage: null,
        maintenance_date: '',
        carId: ''
      }
    }
  },
  created () {
    this.form.carId = this.$route.params.id
  },
  methods: {
    handleSubmit (e) {
      this.$store.dispatch(PUSH_MAINTENANCE, this.form)
      .then(() => {
        swal('Success!', {
          icon: 'success'
        })
      })
      .catch((error) => {
        swal('Error: ' + error, {
          icon: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
