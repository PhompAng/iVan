import Vue from 'vue'

export const modalMap = {
  data () {
    return {
      marker: {
        lat: 0,
        lng: 0
      }
    }
  },
  methods: {
    mapHack () {
      Vue.$gmapDefaultResizeBus.$emit('resize')
      this.marker.lat = this.form.location.lat
      this.marker.lng = this.form.location.lng
    },
    mapClick (e) {
      console.log('Lat: ' + e.latLng.lat() + ' and Longitude is: ' + e.latLng.lng())
      this.marker.lat = e.latLng.lat()
      this.marker.lng = e.latLng.lng()
    }
  }
}
