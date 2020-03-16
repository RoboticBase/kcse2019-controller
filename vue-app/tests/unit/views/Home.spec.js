import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Home from '@/views/Home.vue'
import { localVue, before, after } from '@/../tests/vueCommon.js'


beforeAll(before(jest))
afterAll(after())

describe('Home.vue', () => {
  const store = new Vuex.Store({
    state: {
      message: 'test message',
      variant: 'warning'
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

  it('renders a template', () => {
    const wrapper = mount(Home, {localVue, store})
    expect(wrapper.attributes()).toMatchObject({class: 'home container'})
    expect(store.state.message).toEqual('')
    expect(store.state.variant).toEqual('')

  })
})
