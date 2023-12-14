<template>
  <div>
    <span>{{ formattedTime }}</span>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    startTime: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      intervalId: null,
      momentTime: moment(this.startTime, 'HH:mm:ss')
    }
  },
  computed: {
    formattedTime() {
      return this.momentTime.format('HH:mm:ss')
    }
  },
  created() {
    this.startTimer()
  },
  methods: {
    startTimer() {
      this.intervalId = setInterval(() => {
        this.momentTime = moment(this.momentTime).add(1, 's')
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.intervalId)
    }
  },
  beforeDestroy() {
    this.stopTimer()
  }
}
</script>
