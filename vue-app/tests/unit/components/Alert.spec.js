import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Alert from '@/components/Alert.vue'

import { localVue, before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('Alert.vue', () => {
  let store = null

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        message: '',
        variant: '',
      },
      mutations: {
        updateMessage (state, params) {
          state.message = params.message
          state.variant = params.variant
        },
      },
      getters: {
        message: (state) => state.message,
        variant: (state) => state.variant,
      }
    })
  })

  it('renders an empty div tag when no alert exists', () => {
    const wrapper = mount(Alert, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'alert container'})
    expect(wrapper.html()).toMatch('<div class="alert container">\n  <!---->\n</div>')
  })

  it('renders an alert component when an alert exists, and dismisses after timeout', async () => {
    const wrapper = mount(Alert, {store, localVue})
    wrapper.vm.$data.dismissSecs = 1
    expect(wrapper.attributes()).toMatchObject({class: 'alert container'})
    expect(wrapper.html()).toMatch('<div class="alert container">\n  <!---->\n</div>')
    store.commit('updateMessage', {message: 'test message', variant: 'warning'})

    await wrapper.vm.$nextTick()
    const alert = wrapper.find('div.alert.alert-dismissible.alert-warning[role="alert"][aria-live="polite"][aria-atomic="true"]')
    expect(alert.exists()).toBeTruthy()
    expect(alert.find('button.close[aria-label="Close"]').html()).toMatch('<button type="button" aria-label="Close" class="close">×</button>')
    expect(alert.text()).toContain('test message')

    await new Promise(resolve => setTimeout(resolve, 1100))
    expect(wrapper.find('div.alert.alert-dismissible.alert-warning[role="alert"][aria-live="polite"][aria-atomic="true"]').exists()).toBeFalsy()
    expect(wrapper.html()).toMatch('<div class="alert container">\n  <!---->\n</div>')
  })

})
