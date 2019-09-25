<template>
  <div class="stocks container">
    <Header/>
    <h3>在庫引当と出荷指示</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">JANコード</th>
          <th scope="col">物品名</th>
          <th scope="col">カテゴリ</th>
          <th scope="col">保管場所</th>
          <th scope="col">現在数量</th>
          <th scope="col">引当数量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in stocks" :key="stock.id">
          <td>{{ stock.code }}</td>
          <td>{{ stock.title }}</td>
          <td>{{ stock.category }}</td>
          <td>{{ stock.place }}</td>
          <td>{{ parseInt(stock.quantity) + stock.unit }}</td>
          <td class="form-group"><input type="number" class="form-control" v-model="stock.reservation"/></td>
        </tr>
      </tbody>
    </table>
    <Shipping/>
    <b-alert
      :show="dismissCountDown"
      :variant="variant"
      dismissible
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      {{ message }}
    </b-alert>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Shipping from '@/components/Shipping.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'stocks',
  data: function () {
    return {
      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  components: {
    Header,
    Shipping
  },
  created: function () {
    this.listStocksAction()
  },
  computed: {
    ...mapGetters(['stocks', 'message', 'variant'])
  },
  methods: {
    ...mapActions(['listStocksAction']),
    ...mapMutations(['updateMessage']),
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
      if (this.dismissCountDown == 0) {
        this.updateMessage({message: '', variant: ''})
      }
    }
  },
  watch: {
    message(newValue, oldValue) {
      if (newValue) {
        this.dismissCountDown = this.dismissSecs
      }
    }
  }
}
</script>
