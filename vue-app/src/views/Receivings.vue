<template>
  <div class="receivings container">
    <Header/>
    <TouchButton buttonText="受け取り" v-on:clickEvent="receive"/>
    <Alert/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import TouchButton from '@/components/TouchButton.vue'
import Alert from '@/components/Alert.vue'
import { mapActions } from 'vuex'

export default {
  name: 'receivings',
  components: {
    Header,
    TouchButton,
    Alert,
  },
  methods: {
    ...mapActions(['postReceivingAction']),

    receive() {
      this.postReceivingAction()
    }
  }
}
</script>
