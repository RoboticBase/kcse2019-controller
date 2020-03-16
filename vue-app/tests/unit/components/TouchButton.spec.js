import { mount } from '@vue/test-utils'
import TouchButton from '@/components/TouchButton.vue'

import { localVue, before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())


describe('TouchButton.vue', () => {
  it('renders an enable touch button', () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy1',
    }})
    expect(wrapper.attributes()).toMatchObject({class: 'touchButton container'})
    const button = wrapper.find('div.touchButton').find('div.form-group').find('div.col-sm-12').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    expect(button.text()).toMatch('dummy1')
  })
  it('renders an enable an audio tag', () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy1',
    }})
    const audioSource = wrapper.find('div.touchButton').find('div.form-group').find('audio[id="click_se"][preload="auto"]').find('source')
    expect(audioSource.attributes()).toMatchObject({src: "/static/sounds/se_maoudamashii_system38.mp3", type: "audio/mp3"})
  })
  it('emits the clickEvent when clicking', async () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy1',
    }})
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    expect(button.attributes().disabled).toBeUndefined()
    expect(wrapper.vm.$data.processing).toBeFalsy()

    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('clickEvent')).toBeTruthy()
    expect(wrapper.emitted('clickEvent').length).toBe(1)
  })
  it('emits the clickEvent when currentTime of click_se is undefined', async () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy1',
    }})
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    const audio = wrapper.find('div.touchButton').find('div.form-group').find('audio[id="click_se"][preload="auto"]')
    Object.defineProperty(audio.element, 'currentTime', {get () {return undefined}})

    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('clickEvent')).toBeTruthy()
    expect(wrapper.emitted('clickEvent').length).toBe(1)
  })
})
