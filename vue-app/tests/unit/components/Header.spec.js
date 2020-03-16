import { mount } from '@vue/test-utils'
import Header from '@/components/Header.vue'

import { before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('Header.vue', () => {

  it('renders a header component', () => {

    const wrapper = mount(Header)
    expect(wrapper.attributes()).toMatchObject({class: 'header container'})
    expect(wrapper.find('div.header').find('h2').text()).toEqual('配送ロボットデモ')
  })
})
