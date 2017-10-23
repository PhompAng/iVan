<template>
  <div class="row" v-if="this.user.role == 99">
    <div class="form-group col-5">
      <label for="school">School</label>
      <b-form-select class="mb-3"
        v-model="this.school"
        :options="schools"
        @input="this.update"></b-form-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseSchools',
  props: {
    user: {
      type: Object,
      required: true
    },
    school: {
      type: String
    },
    schools: {
      type: Array,
      required: true
    }
  },
  methods: {
    update (e) {
      this.$emit('update:school', e)
    }
  }
}
</script>
