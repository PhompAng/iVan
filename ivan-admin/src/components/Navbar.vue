<template>
  <b-navbar class="navbar-expand-md" toggleable variant="faded" toggle-breakpoint="md">

    <b-nav-toggle @click.native="menuToggle" target="nav_collapse"></b-nav-toggle>
<!--
    <b-navbar-brand href="">
      <img src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
      NavBar
    </b-navbar-brand> -->

    <b-collapse is-nav id="nav_collapse">
      <b-nav is-nav-bar>
        <!-- <b-nav-item href="#">Link</b-nav-item> -->
        <!-- <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
      </b-nav>

      <!-- Right alignd nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item>
          <router-link
          :to="{name: 'Notifications'}">
            <i class="ti-bell" style="font-weight: bold;"></i>
          </router-link>
        </b-nav-item>
        <b-nav-item-dropdown :text="(this.user.displayName ? this.user.displayName:'No name') + this.roleName" right>
          <b-dropdown-item v-on:click="logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

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
    computed: {
      ...mapGetters({
        user: GET_USER
      }),
      roleName: function () {
        if (this.user.role === 99) {
          return ' (Super Admin)'
        } else if (this.user.role === 75) {
          return ' (School Admin)'
        } else if (this.user.role === 60) {
          return ' (Teacher)'
        }
      }
    },
    methods: {
      logout () {
        this.$store.dispatch(SIGNOUT)
        .then(() => {
          this.$router.push('login')
        })
      },
      menuToggle () {
        this.$emit('toggle')
      },
      roleMapper (role) {

      }
    }
  }
</script>

<style scoped>
nav {
  background-color: #f4f3ef;
  border-bottom: 1px solid #DDDDDD;
}
</style>
