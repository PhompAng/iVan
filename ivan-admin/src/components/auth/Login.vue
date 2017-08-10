<template>
  <div class="login row justify-content-md-center">
    <div class="col-md-8">
      <div class="card">
        <h3 class="card-header">Login</h3>
        <div class="card-block">
          <form v-on:submit.prevent="onSubmit">
            <div class="form-group row">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <input v-model="form.email" type="email" class="form-control" id="inputEmail3" placeholder="Email">
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
              <div class="col-sm-10">
                <input v-model="form.password" type="password" class="form-control" id="inputPassword3" placeholder="Password">
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
  import * as firebase from 'firebase'
  export default {
    name: 'Login',
    data () {
      return {
        form: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      onSubmit () {
        firebase.auth()
          .signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(function () {
            let currentUser = firebase.auth().currentUser
            if (currentUser != null) {
              console.log(currentUser.getIdToken(true))
            }
          })
          .catch(function (error) {
            console.log(error.message)
          })
      }
    }
  }
</script>
