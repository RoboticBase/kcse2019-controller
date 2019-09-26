<template>
  <div class="home container">
    <Header/>
    <div class="row">
      <div class="col-sm"><router-link to="/stocks">在庫引当と出荷指示</router-link></div>
    </div>
    <div class="row">
      <div class="col-sm"><router-link to="/deliveries">配送</router-link></div>
    </div>
    <div class="row">
      <div class="col-sm"><router-link to="/receivings">受け取り</router-link></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'home',
  components: {
    Header
  },
  methods: {
    ...mapMutations(['updateMessage']),
  },
  mounted: function() {
    this.$store.commit('updateMessage', {message: '', variant: ''})
  }
}
</script>
