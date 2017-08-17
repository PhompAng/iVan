<template>
  <div class="login row justify-content-md-center">
    <div class="col-md-8">
      <div class="card">
        <h3 class="card-header">Login</h3>
        <div class="card-block">
          <form v-on:submit.prevent="login">
            <div class="form-group row">
              <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <input v-model="form.email" type="email" class="form-control" id="inputEmail" placeholder="Email">
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
              <div class="col-sm-10">
                <input v-model="form.password" type="password" class="form-control" id="inputPassword" placeholder="Password">
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SIGNIN } from '@/vuex/action-types'

  export default {
    name: 'Login',
    data () {
      return {
        form: {
          email: 'user@example.com',
          password: '123456'
        }
      }
    },
    methods: {
      login () {
        this.$store.dispatch(SIGNIN, this.form)
      }
    }
  }
</script>

<style scoped>
  .login {
    position: fixed;
    left: 0;
    top: 60px;
    right: 0;
  }
</style>
