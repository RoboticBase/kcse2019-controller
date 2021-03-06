import Vue from 'vue'
import Vuex from 'vuex'
import { listStocks, listDestinations, postShipment, postDelivery, postReceiving } from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    stocks: [],
    destinations: [],
    selectedDestination: '',
    message: '',
    variant: ''
  },
  actions: {
    listStocksAction(context) {
      listStocks().then(data => {
        let stocks = data.map((elem) => {
            elem.reservation = 0
            return elem
        })
        context.commit('listStocks', stocks)
      })
    },

    listDestinationsAction(context) {
      listDestinations().then(data => {
        context.commit('listDestinations', data)
      })
    },

    postShipmentAction(context, payload) {
      postShipment(payload).then(res => {
        if (res.is_busy) {
          let message = '配送ロボット(' + res.data.robot_id + ')は作業中のため、出荷指示は取り消されました。少し待ってからもう一度お試しください。'
          context.commit('updateMessage', {message: message, variant: 'warning'})
          context.dispatch('listStocksAction')
        }
        else {
          let itemStr = res.data.updated.reduce((acc, current) => {
            return acc + '[物品名:' + current.title + ', 引当数量:' + current.reservation + ']'
          }, '')
          let message = '配送ロボット(' + res.data.delivery_robot.id + ')への出荷指示を行いました。出荷先: ' + res.data.destination.name + ', 出荷商品: ' + itemStr
          context.commit('updateMessage', {message: message, variant: 'success'})
          context.dispatch('listStocksAction')
        }
      })
    },

    postDeliveryAction(context) {
      postDelivery().then(res => {
        if (res.is_busy) {
          let message = '配送ロボット(' + res.data.robot_id + ')は作業中のため、配送できません。少し待ってからもう一度お試しください。'
          context.commit('updateMessage', {message: message, variant: 'warning'})
        }
        else {
          let message = '配送ロボット(' + res.data.delivery_robot.id + ')が配送を開始しました'
          context.commit('updateMessage', {message: message, variant: 'success'})
        }
      })
    },

    postReceivingAction(context) {
      postReceiving().then(res => {
        if (res.is_busy) {
          let message = '配送ロボット(' + res.data.robot_id + ')は作業中のため、まだ受け取れません。少し待ってからもう一度お試しください。'
          context.commit('updateMessage', {message: message, variant: 'warning'})
        }
        else {
          let message = '配送ロボット(' + res.data.delivery_robot.id + ')が配送を完了しました'
          context.commit('updateMessage', {message: message, variant: 'success'})
        }
      })
    },

  },
  mutations: {
    listStocks(state, stocks) {
      state.stocks = stocks
    },

    listDestinations(state, destinations) {
      state.destinations = destinations
    },

    updateMessage(state, val) {
      state.message = val.message
      state.variant = val.variant
    },

    setSelectedDestination(state, destination) {
      state.selectedDestination = destination
    }
  },
  getters: {
    stocks: (state) => state.stocks,
    destinations: (state) => state.destinations,
    message: (state) => state.message,
    variant: (state) => state.variant,
    selectedDestination: (state) => state.selectedDestination
  }
})

export default store
