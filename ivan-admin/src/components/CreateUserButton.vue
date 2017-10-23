<template>
  <b-btn variant="primary" @click="create" v-if="this.user.role >= 75">Create</b-btn>
</template>

<script>
export default {
  name: 'CreateUserButton',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    create () {
      this.$emit('create')
    }
  }
}
</script>
