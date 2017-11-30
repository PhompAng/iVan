<template>
  <div id="app">
    <div id="sidebar-wrapper" v-show="this.user.displayName">
      <sidebar></sidebar>
    </div>
    <div id="page-wrapper">
      <div class="container-fluid p-0">
        <div class="row no-gutters">
          <div class="col-12">
            <navbar v-on:toggle="menuToggle" v-show="this.user.displayName"></navbar>
            <div class="main">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { mapGetters } from 'vuex'
import { GET_USER } from '@/vuex/getter-types'

export default {
  name: 'app',
  components: {
    Navbar, Sidebar
  },
  computed: mapGetters({
    user: GET_USER
  }),
  methods: {
    menuToggle () {
      $('#app').toggleClass('toggled')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
#page-wrapper {
  background-color: #f4f3ef;
}
.main {
  padding: 15px;
}
</style>
