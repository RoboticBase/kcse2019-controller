import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Stocks from '@/views/Stocks.vue'
import { localVue } from '@/../tests/vueCommon.js'

jest.mock('@/api')

describe('Stocks.vue', () => {
  const store = new Vuex.Store({
    state: {
      stocks: [],
      message: '',
      variant: '',
      destinations: []
    },
    actions: {
      listDestinationsAction(_context, _payload) {
      },
      listStocksAction(_context, _payload) {
        store.state.stocks = [
          { id: 1,
            code: "11111",
            title: "test title",
            category: "test category",
            place: "test place",
            quantity: 1,
            unit: "個",
            reservation: 1
          }
        ]
      }
    },
    mutations: {
      updateMessage(state, val) {
        state.message = val.message
        state.variant = val.variant
      }
    },
    getters: {
      stocks: (state) => state.stocks,
      message: (state) => state.message,
      variant: (state) => state.variant,
      destinations: (state) => state.destinations
    }
  })
  it('renders a template', () => {
    const wrapper = mount(Stocks, {localVue, store})
    expect(wrapper.attributes()).toMatchObject({class: 'stocks container'})
    const stockFields = wrapper.find('div.stocks').find('table.table').find('tbody').find('tr').findAll('td')
    expect(stockFields.at(0).text()).toEqual('11111')
    expect(stockFields.at(1).text()).toEqual('test title')
    expect(stockFields.at(2).text()).toEqual('test category')
    expect(stockFields.at(3).text()).toEqual('test place')
    expect(stockFields.at(4).text()).toEqual('1個')
  })
})
