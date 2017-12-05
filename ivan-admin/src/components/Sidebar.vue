<template>
  <div class="sidebar-nav">
    <div class="logo">
      <a href="#" class="simple-text">
        <div class="logo-img">
          <img src="../assets/logo.png" alt="">
        </div>
        iVan Admin
      </a>
    </div>
    <ul class="nav-item">
      <li>
        <router-link :to="{name: 'Dashboard'}">
          <i class="ti-panel"></i>
          <span>Dashboard</span>
        </router-link>
      </li>
      <li v-if="user.role >= 99">
        <router-link :to="{name: 'Schools'}">
          <i class="ti-home"></i>
          <span>Schools</span>
        </router-link>
      </li>
      <li>
        <a>
          <i class="ti-user"></i>
          <span>User</span>
        </a>
      </li>
      <ul class="sub">
        <li v-if="user.role >= 75">
          <router-link :to="{name: 'Admins'}">
            <span>Admins</span>
          </router-link>
        </li>
        <li v-if="user.role >= 60">
          <router-link :to="{name: 'Teachers'}">
            <span>Teachers</span>
          </router-link>
        </li>
        <li v-if="user.role >= 60">
          <router-link :to="{name: 'Drivers'}">
            <span>Drivers</span>
          </router-link>
        </li>
        <li v-if="user.role >= 60">
          <router-link :to="{name: 'Parents'}">
            <span>Parents</span>
          </router-link>
        </li>
        <li v-if="user.role >= 60">
          <router-link :to="{name: 'Students'}">
            <span>Students</span>
          </router-link>
        </li>
      </ul>
      <li v-if="user.role >= 60">
        <router-link :to="{name: 'Cars'}">
          <i class="ti-car"></i>
          <span>Cars</span>
        </router-link>
      </li>
      <li v-if="user.role >= 60">
        <router-link :to="{name: 'Sensors'}">
          <i class="ti-rss-alt"></i>
          <span>Sensors</span>
        </router-link>
      </li>
      <li v-if="user.role >= 60">
        <router-link :to="{name: 'Devices'}">
          <i class="ti-harddrive"></i>
          <span>Devices</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { GET_USER } from '@/vuex/getter-types'
import { mapGetters } from 'vuex'

export default {
  name: 'sidebar',
  computed: {
    ...mapGetters({
      user: [GET_USER]
    })
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
a {
  color: #fff;
}

a.router-link-exact-active {
  color: #42b983;
}

li {
  list-style: none;
}
li > a {
  margin-left: 5px;
  display: block;
}
li > a.router-link-exact-active {
  margin-left: 0;
  border-left: 5px solid #42b983;
}

.simple-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}

.sidebar-nav > .logo {
  padding: 15px 0;
  margin: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo-img {
  width: 40px;
  display: inline-block;
  height: 40px;
  margin-right: 5px;
}

.logo-img > img {
  width: 40px;
  height: 40px;
}

.nav-item {
  padding: 0;
}

.nav-item > li {
  display: inline-block;
  width: 100%;
  color: #fff;
}

.nav-item > li > a {
  padding: 15px 30px;
}

.nav-item > li > a > i {
  font-size: 24px;
  float: left;
  line-height: 30px;
  margin-right: 15px;
  text-align: center;
}

.nav-item > li > a > span {
  line-height: 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.sub {
  padding-left: 30px;
  background-color: #272727;
  box-shadow: inset 0 0 10px #212121;
}
.sub > li > a {
  padding: 5px 0;
}
.sub > li > a > span {
  margin-left: 35px;
}
</style>
