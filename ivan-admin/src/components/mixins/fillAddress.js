import { ADDRESS_FIELD } from 'vue-thailand-address-typeahead'

export const fillAddress = {
  data () {
    return {
      addressField: ADDRESS_FIELD
    }
  },
  methods: {
    fillAddress (district, amphoe, province, zipcode) {
      this.form.address.district = district
      this.form.address.city = amphoe
      this.form.address.province = province
      this.form.address.postcode = zipcode
    },
    fillHomeAddress (district, amphoe, province, zipcode) {
      this.form.home_address.district = district
      this.form.home_address.city = amphoe
      this.form.home_address.province = province
      this.form.home_address.postcode = zipcode
    }
  }
}
