import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

const originalError = console.error
const originalLog = console.log

const before = (jest) => {
  return () => {
    console.error = jest.fn()
    console.log = jest.fn()
  }
}
const after = () => {
  return () => {
    console.error = originalError
    console.log = originalLog
  }
}

export { localVue, before, after }
