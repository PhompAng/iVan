<template>
  <div>
    <b-table striped hover bordered
             :items="schools"
             :fields="fields">
      <template slot="id" scope="data">{{data.index + 1}}</template>
      <template slot="enName" scope="data">{{data.item.name.en}}</template>
      <template slot="thName" scope="data">{{data.item.name.th}}</template>
      <template slot="address" scope="data">
        <p>{{data.item.address.line1}}</p>
        <p>{{data.item.address.line2}}</p>
        <p>{{data.item.address.district}} {{data.item.address.city}} {{data.item.address.province}}</p>
      </template>
      <template slot="action" scope="data">
        <b-button size="sm" variant="primary" @click.stop="location(data.item.location, data.index, $event.target)">
          <i class="ti-location-pin"></i>
          Location
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
  const schools = [
    {
      name: {
        en: 'en',
        th: 'th'
      },
      address: {
        line1: 'line1 line1 line1',
        line2: 'line2 line2',
        district: 'district 9',
        city: 'Johannesburg',
        province: 'Gauteng'
      },
      tel: '1234567890',
      location: {
        lat: 26.1216,
        lng: 28.244
      }
    },
    {
      name: {
        en: 'en111',
        th: 'th222'
      },
      address: {
        line1: 'line1 line1 line1',
        line2: 'line2 line2',
        district: 'district 9',
        city: 'Johannesburg',
        province: 'Gauteng'
      },
      tel: '1234567890',
      location: {
        lat: 26.1216,
        lng: 28.244
      }
    }
  ]
  export default {
    name: 'schools',
    data () {
      return {
        schools: schools,
        fields: {
          id: { label: 'No.', sortable: true },
          enName: { label: 'English name', sortable: true },
          thName: { label: 'Thai name', sortable: true },
          address: { label: 'Address' },
          tel: { label: 'Telephone' },
          action: { label: 'Action' }
        }
      }
    },
    methods: {
      location (location, index, e) {
        console.log(location)
      }
    }
  }
</script>

<style scoped>

</style>
