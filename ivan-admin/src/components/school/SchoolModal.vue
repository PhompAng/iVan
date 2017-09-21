<template>
  <div>
    <b-modal id="modal"
             ref="modal"
             size="lg"
             :title="title"
             ok-title="Done"
             :no-close-on-backdrop="true"
             :ok-disabled="okDisabled"
             @ok="update"
             @shown="shown"
             v-bind:ok-only="true"
             v-on:hidden="hide">
      <form @submit.stop.prevent="handleSubmit">
        <div class="row">
          <div class="form-group col">
            <label for="nameTh">Name (Thai)</label>
            <input v-model="form.name.th" class="form-control" id="nameTh" placeholder="">
          </div>
          <div class="form-group col">
            <label for="nameEn">Name (English)</label>
            <input v-model="form.name.en" class="form-control" id="nameEn" placeholder="">
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
            <input v-model="form.tel" type="tel" class="form-control" id="tel" placeholder="">
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="file_input">File</label>
            <b-form-file id="file_input" v-model="form.file"></b-form-file>
            <span>Selected file: {{form.file && form.file.name}}</span>
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
import Vue from 'vue'
import { CREATE_SCHOOL, UPDATE_SCHOOL } from '@/vuex/action-types'
import { Typeahead, ADDRESS_FIELD } from 'vue-thailand-address-typeahead'

export default {
  name: 'SchoolModal',
  props: ['showModal', 'form', 'isCreate'],
  data () {
    return {
      addressField: ADDRESS_FIELD,
      okDisabled: false,
      marker: {
        lat: 0,
        lng: 0
      }
    }
  },
  watch: {
    showModal: function (val) {
      if (val) {
        this.$refs.modal.show()
      } else {
        this.$refs.modal.hide()
      }
    }
  },
  computed: {
    title () {
      return this.isCreate ? 'Create School' : 'Edit School'
    }
  },
  methods: {
    shown () {
      Vue.$gmapDefaultResizeBus.$emit('resize')
      this.marker.lat = this.form.location.lat
      this.marker.lng = this.form.location.lng
    },
    mapClick (e) {
      console.log('Lat: ' + e.latLng.lat() + ' and Longitude is: ' + e.latLng.lng())
      this.marker.lat = e.latLng.lat()
      this.marker.lng = e.latLng.lng()
    },
    update (e) {
      e.cancel()
      this.okDisabled = true
      this.form.location.lat = this.marker.lat
      this.form.location.lng = this.marker.lng
      if (this.isCreate) {
        this.$store.dispatch(CREATE_SCHOOL, this.form)
        .then(() => {
          this.hide()
        })
      } else {
        this.$store.dispatch(UPDATE_SCHOOL, this.form)
        .then(() => {
          this.hide()
        })
      }
    },
    hide () {
      this.okDisabled = false
      this.$emit('hide')
    },
    fillAddress (district, amphoe, province, zipcode) {
      this.form.address.district = district
      this.form.address.city = amphoe
      this.form.address.province = province
      this.form.address.postcode = zipcode
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
