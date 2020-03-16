import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Shipping from '@/components/Shipping.vue'

import { localVue, before, after } from '@/../tests/vueCommon.js'

jest.mock('@/api')


beforeAll(before(jest))
afterAll(after())

describe('Shippment.vue', () => {
  let store = null

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        message: '',
        variant: '',
        stocks: [{id: 0, reservation: 0}, {id: 1, reservation: 1}],
        destinations: [{id: 1, name: 'test name1'},
        {id: 2, name: 'test name2'}],
        selectedDestination: ''
      },
      actions: {
        postShipmentAction(context, _payload) {
          context.commit('updateMessage', {message: 'test message', variant: 'success'})
        }
      },
      mutations: {
        updateMessage (state, params) {
          state.message = params.message
          state.variant = params.variant
        },
        setSelectedDestination (state, destination) {
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
  })

  it('renders a shippment component', () => {
    const wrapper = mount(Shipping, {localVue, store})
    const options = wrapper.find('div.shipping').find('div.form-group').find('div.col-sm-8').find('select').findAll('option')
    expect(options.at(0).text()).toEqual('test name1')
    expect(options.at(1).text()).toEqual('test name2')
  })
  it('invokes the clickEvent', async () => {
    store.state.selectedDestination = "1"
    const wrapper = mount(Shipping, {localVue, store})
    const button = wrapper.find('div.shipping').find('div.form-group').find('div.col-sm-4').find('button')

    button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.state.message).toEqual('test message')
    expect(store.state.variant).toEqual('success')
  })
  it('invokes the clickEvent when selectedDestination is empty', async () => {
    const wrapper = mount(Shipping, {localVue, store})
    const button = wrapper.find('div.shipping').find('div.form-group').find('div.col-sm-4').find('button')

    button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.state.message).toEqual('test message')
    expect(store.state.variant).toEqual('success')
  })
  it('does not invoke the clickEvent when no items', async () => {
    const wrapper = mount(Shipping, {localVue, store})
    store.state.stocks = []
    const button = wrapper.find('div.shipping').find('div.form-group').find('div.col-sm-4').find('button')

    button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.state.message).toEqual('引当数量を入力してください')
    expect(store.state.variant).toEqual('warning')
  })
  it('invokes the inputEvent', async () => {
    const wrapper = mount(Shipping, {localVue, store})
    const select = wrapper.find('div.shipping').find('div.form-group').find('div.col-sm-8').find('select')

    select.trigger('input')
    expect(store.state.selectedDestination).toEqual("1")
  })
})
