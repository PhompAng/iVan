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
            <label for="name_thai">Name (Thai)</label>
            <input name="name_thai" v-validate="'required|alpha'" :class="{'input': true, 'is-invalid': errors.has('name_thai') }"  v-model="form.name.th" class="form-control" id="nameTh" placeholder="">
            <span v-show="errors.has('name_thai')" class="text-danger">{{ errors.first('name_thai') }}</span>
          </div>
          <div class="form-group col">
            <label for="name_eng">Name (English)</label>
            <input v-model="form.name.en" class="form-control" id="nameEn" placeholder="" name="name_eng" v-validate="'required|alpha'" :class="{'input': true, 'is-invalid': errors.has('name_eng') }">
            <span v-show="errors.has('name_eng')" class="text-danger">{{ errors.first('name_eng') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="line1">Line1</label>
            <input v-model="form.address.line1" class="form-control" id="line1" placeholder="" name="line1" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('line1') }">
            <span v-show="errors.has('line1')" class="text-danger">{{ errors.first('line1') }}</span>
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
            <input v-model="form.tel" type="tel" class="form-control" id="tel" placeholder="" name="tel" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('tel') }">
            <span v-show="errors.has('tel')" class="text-danger">{{ errors.first('tel') }}</span>
          </div>
        </div>

        <div class="row">
          <div class="form-group col">
            <label for="file_input">Upload Photo</label>
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
import { modalToggleable } from '@/components/mixins/modalToggleable'
import { modalMap } from '@/components/mixins/modalMap'
import { fillAddress } from '@/components/mixins/fillAddress'
import { CREATE_SCHOOL, UPDATE_SCHOOL } from '@/vuex/action-types'
import { Typeahead } from 'vue-thailand-address-typeahead'

export default {
  name: 'SchoolModal',
  mixins: [modalToggleable, modalMap, fillAddress],
  props: ['form', 'isCreate'],
  computed: {
    title () {
      return this.isCreate ? 'Create School' : 'Edit School'
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
.map {
  width: 100%;
  height: 300px;
}
.custom-file {
  display: block;
}
</style>
