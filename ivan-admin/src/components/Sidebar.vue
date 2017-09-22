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
      <li>
        <router-link :to="{name: 'Schools'}">
          <i class="ti-home"></i>
          <span>Schools</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'Admins'}">
          <i class="ti-user"></i>
          <span>Admins</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
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

.simple-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}

.sidebar-nav>.logo {
  padding: 15px 0;
  margin: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo-img {
  width: 40px;
  display: inline-block;
  height: 40px;
  margin-left: 0px;
  margin-right: 5px;
}

.logo-img>img {
  width: 40px;
  height: 40px;
}

.nav-item {
  list-style: none;
  padding: 0;
  margin-top: 15px;
  margin-bottom: 0;
}

.nav-item>li {
  display: inline-block;
  width: 100%;
  color: #fff;
}

.nav-item>li>a {
  margin: 5px 0;
  padding: 10px 30px;
  display: block;
}

.nav-item>li>a.router-link-exact-active {
  border-left: 5px solid #fff;
  padding-left: 25px;
}

.nav-item>li>a>i {
  font-size: 24px;
  float: left;
  line-height: 30px;
  margin-right: 15px;
  text-align: center;
}

.nav-item>li>a>span {
  line-height: 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
