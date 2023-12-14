'use strict'

const global = {
  data() {
    return {}
  },
  filters: {},
  computed: {},
  methods: {
    getParent(name) {
      let p = this.$parent
      while (typeof p !== 'undefined') {
        if (p.$options.name === name) {
          return p
        } else {
          p = p.$parent
        }
      }
      return undefined
    },
    translateDuration(str) {
      const num = (str.match(/\d+/g) || [])[0]
      return num ? this.$tc(num > 1 ? 'hours' : 'hour', num) : '-'
    }
  }
}

export default global
