<template>
  <div class="shipping container">
    <div class="row form-group">
      <div class="col-sm-8">
        <label for="destination">出荷先:</label>
        <select id="destination" class="form-control" @input="setSelectedDestination($event.target.value)">
          <option v-for="destination in destinations" :key="destination.id" v-bind:value="destination.id">{{ destination.name }}</option>
        </select>
      </div>
      <div class="col-sm-4 align-self-end">
        <button type="submit" class="btn btn-primary float-right" @click="shipping">出荷指示</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'shipping',
  created: function () {
    this.listDestinationsAction()
  },
  computed: {
    ...mapGetters(['stocks', 'destinations', 'selectedDestination'])
  },
  methods: {
    ...mapActions(['listDestinationsAction', 'postShipmentAction']),

    setSelectedDestination(destination) {
      this.$store.commit('setSelectedDestination', destination)
    },

    shipping() {
      let items = this.stocks.filter((stock) => stock.reservation > 0).map((stock) => {
        return {
          id: stock.id,
          reservation: stock.reservation
        }
      })

      if (items.length == 0) {
        this.$store.commit('updateMessage', {message: '引当数量を入力してください', variant: 'warning'})
        return
      }

      let dest_id = this.destinations[0].id;
      if (this.selectedDestination != '') {
        dest_id = this.selectedDestination
      }

      let payload = {
        destination_id: dest_id,
        items: items
      }
      this.postShipmentAction(payload)
    }
  }
}
</script>
