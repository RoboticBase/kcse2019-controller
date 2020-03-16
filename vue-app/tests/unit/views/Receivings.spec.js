import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Receivings from '@/views/Receivings.vue'
import { localVue, } from '@/../tests/vueCommon.js'

jest.mock('@/api')

describe('Receivings.vue', () => {
  const store = new Vuex.Store({
    state: {
      message: '',
      variant: ''
    },
    actions: {
      postReceivingAction(context, _payload) {
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
  it('invokes a receiving', async () => {
    Object.defineProperty(global.window.HTMLMediaElement.prototype, 'play', {
      configurable: true,
      get () {
        setTimeout(() => (this.onloadeddata && this.onloadeddata()))
        return () => {}
      }
    })
    const wrapper = mount(Receivings, {localVue, store})
    expect(wrapper.attributes()).toMatchObject({class: 'receivings container'})
    const button = wrapper.find('div.receivings').find('div.touchButton').find('div.row').find('div.col-sm-12').find('button')
    button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.state.message).toEqual('test message')
    expect(store.state.variant).toEqual('success')
  })

})
