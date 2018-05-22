<template>
  <div>
    <h2>Manage Route</h2>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Morning">
          <route time="morning"></route>
        </b-tab>
        <b-tab title="Evening">
          <route time="evening"></route>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Route from '@/components/car/Route'

export default {
  name: 'ManageRoute',
  components: {
    Route
  }
}
</script>
