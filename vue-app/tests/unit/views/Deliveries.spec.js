import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Deliveries from '@/views/Deliveries.vue'
import { localVue, before, after } from '@/../tests/vueCommon.js'

jest.mock('@/api')

describe('Deliveries.vue', () => {
  const store = new Vuex.Store({
    state: {
      message: '',
      variant: ''
    },
    actions: {
      postDeliveryAction(context, payload) {
        context.commit('updateMessage', {message: 'test message', variant: 'success'})
      }
    },
    mutations: {
      updateMessage(state, val) {
        state.message = val.message
        state.variant = val.variant
      }
    },
    getters: {
      message: (state) => state.message,
      variant: (state) => state.variant,
    }
  })
  it('invokes a deliver', async () => {
    Object.defineProperty(global.window.HTMLMediaElement.prototype, 'play', {
      configurable: true,
      get () {
        setTimeout(() => (this.onloadeddata && this.onloadeddata()))
        return () => {}
      }
    })
    const wrapper = mount(Deliveries, {localVue, store})
    expect(wrapper.attributes()).toMatchObject({class: 'deliveries container'})
    const button = wrapper.find('div.deliveries').find('div.touchButton').find('div.row').find('div.col-sm-12').find('button')
    button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.state.message).toEqual('test message')
    expect(store.state.variant).toEqual('success')
  })

})
