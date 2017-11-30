<template>
  <div>
    <b-modal id="driverModal"
             ref="modal"
             size="lg"
             :title="this.title"
             ok-title="Done"
             :no-close-on-backdrop="true"
             :no-close-on-esc="true"
             :ok-disabled="okDisabled"
             v-bind:ok-only="true"
             @ok="update"
             @shown="shown"
             v-on:hidden="hide">
      <form @submit.stop.prevent="handleSubmit">
        <div class="row">
          <div class="form-group col">
            <label>Firstname (Thai)</label>
            <input v-model="form.name.th_first" class="form-control" placeholder="">
          </div>
          <div class="form-group col">
            <label>Lastname (Thai)</label>
            <input v-model="form.name.th_last" class="form-control" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label>Firstname (English)</label>
            <input v-model="form.name.en_first" class="form-control" placeholder="">
          </div>
          <div class="form-group col">
            <label>Lastname (English)</label>
            <input v-model="form.name.en_last" class="form-control" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="file_input">File</label>
            <b-form-file id="file_input" v-model="form.file"></b-form-file>
            <!-- <span>Selected file: {{form.file && form.file.name}}</span> -->
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
            <typeahead class="form-group col" :label="this.addressField.province.name" :type="this.addressField.province.type" :query="this.form.address.province" v-on:fillAddress="fillAddress" />
        </div>
        <div class="row">
            <typeahead class="form-group col" :label="this.addressField.postcode.name" :type="this.addressField.postcode.type" :query="this.form.address.postcode" v-on:fillAddress="fillAddress" />
            <div class="form-group col">
                <label for="tel">Telephone</label>
                <input v-model="form.telephone" type="tel" class="form-control" id="tel" placeholder="">
            </div>
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
  },
  components: {
    Typeahead
  }
}
</script>
<style scoped>
.map {
  width: 100%;
  height: 300px;
}
.custom-file {
  display: block;
}
</style>
