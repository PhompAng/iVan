export const modalToggleable = {
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      okDisabled: false
    }
  },
  watch: {
    isShow: function (val) {
      if (val) {
        this.$refs.modal.show()
      } else {
        this.$refs.modal.hide()
      }
    }
  },
  methods: {
    onShow () {
    },
    hide () {
      this.okDisabled = false
      this.$emit('hide')
    }
  }
}
