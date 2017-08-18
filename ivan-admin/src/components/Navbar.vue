<template>
  <b-navbar class="navbar-expand-md navbar-light bg-light" toggleable variant="faded" type="light" toggle-breakpoint="md">

    <b-nav-toggle @click.native="menuToggle" target="nav_collapse"></b-nav-toggle>

    <b-navbar-brand href="">
      <img src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
      NavBar
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-nav is-nav-bar>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-nav>

      <!-- Right alignd nav items -->
      <b-nav is-nav-bar class="ml-auto">
        <b-nav-item-dropdown :text="this.user.displayName ? this.user.displayName:'aaa'" right>
          <b-dropdown-item v-on:click="logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { SIGNOUT } from '@/vuex/action-types'
  import { GET_USER } from '@/vuex/getter-types'

  export default {
    name: 'Navbar',
    data () {
      return {
      }
    },
    computed: mapGetters({
      user: GET_USER
    }),
    methods: {
      logout () {
        this.$store.dispatch(SIGNOUT)
      },
      menuToggle () {
        this.$emit('toggle')
      }
    }
  }
</script>
