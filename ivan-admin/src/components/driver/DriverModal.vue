<template>
  <div>
    <b-modal id="driverModal"
             ref="modal"
             size="lg"
             :title="this.title"
             ok-title="Done"
             :no-close-on-backdrop="true"
             :ok-disabled="okDisabled"
             v-bind:ok-only="true"
             @ok="update"
             @shown="shown"
             v-on:hidden="hide">
      <form @submit.stop.prevent="handleSubmit">
        <div class="row">
          <div class="form-group col">
            <label for="firstname_thai">Firstname (Thai)</label>
            <input name="firstname_thai" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('firstname_thai') }" v-model="form.name.th_first" class="form-control" placeholder="">
            <span v-show="errors.has('firstname_thai')" class="text-danger">{{ errors.first('firstname_thai') }}</span>
          </div>
          <div class="form-group col">
            <label for="lastname_thai">Lastname (Thai)</label>
            <input name="lastname_thai" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('lastname_thai') }"  v-model="form.name.th_last" class="form-control" placeholder="">
            <span v-show="errors.has('lastname_thai')" class="text-danger">{{ errors.first('lastname_thai') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="firstname_eng">Firstname (English)</label>
            <input name="firstname_eng" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('firstname_eng') }"  v-model="form.name.en_first" class="form-control" placeholder="">
            <span v-show="errors.has('firstname_eng')" class="text-danger">{{ errors.first('firstname_eng') }}</span>
          </div>
          <div class="form-group col">
            <label for="lastname_eng">Lastname (English)</label>
            <input name="lastname_eng" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('lastname_eng') }" v-model="form.name.en_last" class="form-control" placeholder="">
            <span v-show="errors.has('lastname_eng')" class="text-danger">{{ errors.first('lastname_eng') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="file_input">Upload Photo</label>
            <b-form-file id="file_input" v-model="form.file"></b-form-file>
            <!-- <span>Selected file: {{form.file && form.file.name}}</span> -->
          </div>
          <div class="form-group col">
              <label for="telephone">Telephone</label>
              <input name="telephone" v-validate="'required|decimal'" :class="{'input': true, 'is-invalid': errors.has('telephone') }" v-model="form.telephone" type="tel" class="form-control" id="tel" placeholder="">
              <span v-show="errors.has('telephone')" class="text-danger">{{ errors.first('telephone') }}</span>
            </div>
        </div>
        <div class="row">
          <div class="form-group col-6">
            <label for="license">Driver's license</label>
            <input name="license" v-model="form.license" type="number" class="form-control" placeholder="">
          </div>
        </div>
        <div v-if="isCreate">
            <div class="row">
                <div class="form-group col-6">
                    <label for="email">Email</label>
                    <input type='email' v-model="form.email" class="form-control" placeholder="">
                </div>
            </div>
            <div class="row">
                <div class="form-group col">
                    <label for="password">Password</label>
                    <input v-model="form.password" type='password' class="form-control" ref="password" placeholder="">
                </div>
                <div class="form-group col">
                    <label for="confirmPassword">Confirm Password</label>
                    <input v-model="form.password" type='password' class="form-control" ref="confirmPassword" placeholder="">
                </div>
            </div>
        </div>
        <p>Home Address</p>
        <div class="row">
            <div class="form-group col">
                <label for="line1">Line1</label>
                <input v-model="form.home_address.line1" class="form-control" id="line1" placeholder="">
            </div>
            <div class="form-group col">
                <label for="line2">Line2</label>
                <input v-model="form.home_address.line2" class="form-control" id="line2" placeholder="">
            </div>
        </div>
        <div class="row">
            <typeahead class="form-group col" :label="this.addressField.district.name" :type="this.addressField.district.type" :query="this.form.home_address.district" v-on:fillAddress="fillHomeAddress" />
            <typeahead class="form-group col" :label="this.addressField.city.name" :type="this.addressField.city.type" :query="this.form.home_address.city" v-on:fillAddress="fillHomeAddress" />
        </div>
        <div class="row">
            <typeahead class="form-group col" :label="this.addressField.province.name" :type="this.addressField.province.type" :query="this.form.home_address.province" v-on:fillAddress="fillHomeAddress" />
            <typeahead class="form-group col" :label="this.addressField.postcode.name" :type="this.addressField.postcode.type" :query="this.form.home_address.postcode" v-on:fillAddress="fillHomeAddress" />
        </div>
        <p>Address</p>
        <div class="row">
            <div class="form-group col">
                <label for="line1">Line1</label>
                <input v-model="form.address.line1" class="form-control" id="line1" placeholder="">
            </div>
            <div class="form-group col">
                <label for="line2">Line2</label>
                <input v-model="form.address.line2" class="form-control" id="line2" placeholder="">
            </div>
        </div>
        <div class="row">
            <typeahead class="form-group col" :label="this.addressField.district.name" :type="this.addressField.district.type" :query="this.form.address.district" v-on:fillAddress="fillAddress" />
            <typeahead class="form-group col" :label="this.addressField.city.name" :type="this.addressField.city.type" :query="this.form.address.city" v-on:fillAddress="fillAddress" />
        </div>
        <div class="row">
            <typeahead class="form-group col" :label="this.addressField.province.name" :type="this.addressField.province.type" :query="this.form.address.province" v-on:fillAddress="fillAddress" />
            <typeahead class="form-group col" :label="this.addressField.postcode.name" :type="this.addressField.postcode.type" :query="this.form.address.postcode" v-on:fillAddress="fillAddress" />
        </div>
        <div class="row">
            <div class="form-group col">
                <label>Location</label>
                <gmap-map ref="gmap" class="map" :center="this.form.location" :zoom="12" @click="mapClick">
                    <gmap-marker :position="this.marker"></gmap-marker>
                </gmap-map>
            </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { modalToggleable } from '@/components/mixins/modalToggleable'
import { modalMap } from '@/components/mixins/modalMap'
import { fillAddress } from '@/components/mixins/fillAddress'
import { CREATE_DRIVER, UPDATE_DRIVER } from '@/vuex/action-types'
import { Typeahead } from 'vue-thailand-address-typeahead'

export default {
  name: 'DriverModal',
  props: ['form', 'isCreate'],
  mixins: [modalToggleable, modalMap, fillAddress],
  computed: {
    title () {
      return this.isCreate ? 'Create Driver' : 'Edit Driver'
    }
  },
  methods: {
    shown () {
      this.onShow()
      this.mapHack()
    },
    update (e) {
      e.cancel()
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.form.location.lat = this.marker.lat
          this.form.location.lng = this.marker.lng
          this.okDisabled = true
          if (this.isCreate) {
            this.$store.dispatch(CREATE_DRIVER, this.form)
            .then(() => {
              this.hide()
            })
          } else {
            this.$store.dispatch(UPDATE_DRIVER, this.form)
            .then(() => {
              this.hide()
            })
          }
        }
      })
    }
  },
  components: {
    Typeahead
  }
}
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
.map {
  width: 100%;
  height: 300px;
}
.custom-file {
  display: block;
}
</style>
