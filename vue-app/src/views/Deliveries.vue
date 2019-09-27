<template>
  <div class="deliveries container">
    <Header/>
    <TouchButton buttonText="配送" v-on:clickEvent="deliver"/>
    <Alert/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import TouchButton from '@/components/TouchButton.vue'
import Alert from '@/components/Alert.vue'
import { mapActions } from 'vuex'

export default {
  name: 'deliveries',
  components: {
    Header,
    TouchButton,
    Alert,
  },
  methods: {
    ...mapActions(['postDeliveryAction']),

    deliver() {
      this.postDeliveryAction()
    }
  }
}
</script>
