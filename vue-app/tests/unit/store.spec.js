import store from '@/store'
import { before, after } from '@/../tests/vueCommon.js'

jest.mock('@/api')

import { setBusy } from '@/api'

beforeAll(before(jest))
afterAll(after())


function clearState() {
  store.state.stocks = []
  store.state.destinations = []
  store.state.selectedDestination = ''
  store.state.message = ''
  store.state.variant = ''
}


describe('state', () => {
  it('has a default value', () => {
    expect(store.state.stocks).toEqual([])
    expect(store.state.destinations).toEqual([])
    expect(store.state.selectedDestination).toEqual('')
    expect(store.state.message).toEqual('')
    expect(store.state.variant).toEqual('')
  })
})

describe('mutation', () => {
  afterEach(() => {
    clearState()
  })
  describe('updateMessage', () => {
    const message = 'test message'
    const variant = 'test variant'
    it('updates the state of "message" and "variant"', () => {
      expect(store.state.message).toEqual('')
      expect(store.state.variant).toEqual('')
      store.commit('updateMessage', {message, variant})

      expect(store.state.message).toEqual(message)
      expect(store.state.variant).toEqual(variant)
    })
  })
  describe('listStocks', () => {
    const stocks = [{
      reservation: 0
    }]
    it('updates the stocks', () => {
      expect(store.state.stocks).toEqual([])
      store.commit('listStocks', stocks)

      expect(store.state.stocks).toEqual(stocks)
    })
  })
  describe('listDestinations', () => {
    const destinations = [{
    }]
    it('updates the destinations', () => {
      expect(store.state.destinations).toEqual([])
      store.commit('listDestinations', destinations)

      expect(store.state.destinations).toEqual(destinations)
    })
  })
  describe('setSelectedDestination', () => {
    const destination = 'test destination'
    it('set the selectedDestination', () => {
      expect(store.state.selectedDestination).toEqual('')
      store.commit('setSelectedDestination', destination)

      expect(store.state.selectedDestination).toEqual(destination)
    })
  })
})

describe('action', () => {
  afterEach(() => {
    clearState()
    setBusy(false)
  })
  describe('listStockAction', () => {
    it('dispatch the listStockAction', async () => {
      await store.dispatch('listStocksAction')
      expect(store.state.stocks).toEqual([{
        "reservation": 0
      }])
    })
  })
  describe('listDestinationsAction', () => {
    it('dispatch the listDestinationsAction', async () => {
      await store.dispatch('listDestinationsAction')
      expect(store.state.destinations).toEqual([{}])
    })
  })
  describe('postShipmentAction', () => {
    const payload = {'items': [{
      'id': '1',
      'reservation': '1'
    }]}
    const busyPayload = {'items': [
      {
        'id': '1',
        'reservation': '1'
      },
      {
        'id': '2',
        'reservation': '2'
      },
    ]}
    it('dispatch the postShipmentAction', async () => {
      expect(store.state.message).toEqual('')
      await store.dispatch('postShipmentAction', payload)
      expect(store.state.message).toEqual('配送ロボット(1)への出荷指示を行いました。出荷先: test destination name, 出荷商品: [物品名:test title, 引当数量:1]')
      expect(store.state.variant).toEqual('success')
    })
    it('dispatch the postShipmentAction when robot was busy', async () => {
      expect(store.state.message).toEqual('')
      setBusy(true)
      await store.dispatch('postShipmentAction', busyPayload)
      expect(store.state.message).toEqual('配送ロボット(1)は作業中のため、出荷指示は取り消されました。少し待ってからもう一度お試しください。')
      expect(store.state.variant).toEqual('warning')
    })
    it('dispatch the postDeliveryAction', async () => {
      expect(store.state.message).toEqual('')
      await store.dispatch('postDeliveryAction')
      expect(store.state.message).toEqual('配送ロボット(1)が配送を開始しました')
      expect(store.state.variant).toEqual('success')
    })
    it('dispatch the postDeliveryAction when robot was busy', async () => {
      expect(store.state.message).toEqual('')
      setBusy(true)
      await store.dispatch('postDeliveryAction')
      expect(store.state.message).toEqual('配送ロボット(1)は作業中のため、配送できません。少し待ってからもう一度お試しください。')
      expect(store.state.variant).toEqual('warning')
    })
    it('dispatch the postReceivingAction', async () => {
      expect(store.state.message).toEqual('')
      await store.dispatch('postReceivingAction')
      expect(store.state.message).toEqual('配送ロボット(1)が配送を完了しました')
      expect(store.state.variant).toEqual('success')
    })
    it('dispatch the postReceivingAction when robot was busy', async () => {
      expect(store.state.message).toEqual('')
      setBusy(true)
      await store.dispatch('postReceivingAction')
      expect(store.state.message).toEqual('配送ロボット(1)は作業中のため、まだ受け取れません。少し待ってからもう一度お試しください。')
      expect(store.state.variant).toEqual('warning')
    })
  })
})

describe('getter', () => {
  const message = 'getter message'
  const variant = 'getter variant'

  afterEach(() => {
    clearState()
  })

  describe('store', () => {
    it('has a message', () => {
      store.commit('updateMessage', {message, variant})
      expect(store.getters.message).toEqual(message)
    })
    it('has a variant', () => {
      store.commit('updateMessage', {message, variant})
      expect(store.getters.variant).toEqual(variant)
    })
    it('has a stocks', () => {
      expect(store.getters.stocks).toEqual([])
    })
    it('has a destinations', () => {
      expect(store.getters.destinations).toEqual([])
    })
    it('has a selectedDestination', () => {
      expect(store.getters.selectedDestination).toEqual('')
    })
  })
})
