<template>
  <b-btn variant="primary" @click="create" v-if="this.user.role >= 75">
    {{ this.text ? this.text : "Create" }}
  </b-btn>
</template>

<script>
export default {
  name: 'CreateUserButton',
  props: {
    user: {
      type: Object,
      required: true
    },
    text: {
      type: String,
      required: false
    }
  },
  methods: {
    create () {
      this.$emit('create')
    }
  }
}
</script>
