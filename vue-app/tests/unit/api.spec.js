import { listStocks, listDestinations, postShipment, postDelivery, postReceiving } from '@/api'
import { before, after } from '@/../tests/vueCommon.js'
import axios from 'axios'

jest.mock('axios')

beforeAll(before(jest))
afterAll(after())


describe('api', () => {
  const testMessage = 'test message'
  afterEach(() => {
    axios.get.mockClear()
    axios.post.mockClear()
  })
  describe('listStocks', () => {
    it('returns a stocks', async () => {
      axios.get.mockResolvedValue({data: [{testMessage}]})
      const data = await listStocks()
      expect(data).toEqual([{testMessage}])
    })
    it('returns a stocks when it raised error', async () => {
      axios.get.mockRejectedValue(new Error('test error'))
      const data = await listStocks()
      expect(data).toBeUndefined()
    })
  })
  describe('listDestinations', () => {
    it('returns a destinations', async () => {
      axios.get.mockResolvedValue({data: [{testMessage}]})
      const data = await listDestinations()
      expect(data).toEqual([{testMessage}])
    })
    it('returns a destinations when it raised error', async () => {
      axios.get.mockRejectedValue(new Error('test error'))
      const data = await listDestinations()
      expect(data).toBeUndefined()
    })
  })
  describe('postShipment', () => {
    it('returns data created a shipment', async () => {
      axios.post.mockResolvedValue({data: [{testMessage}]})
      const data = await postShipment()
      expect(data).toEqual({data: [{testMessage}], is_busy: false})
    })
    it('returns data created when it rejected', async () => {
      axios.post.mockRejectedValue({response: {
        data: testMessage,
        status: 423
      }})
      const data = await postShipment()
      expect(data).toEqual({data: testMessage, is_busy: true})
    })
    it('returns data created when it raised other error', async () => {
      axios.post.mockRejectedValue({response: {
        data: testMessage,
        status: 400
      }})
      const data = await postShipment()
      expect(data).toBeUndefined()
    })
  })
  describe('postDelivery', () => {
    it('returns created a delivery data', async () => {
      axios.post.mockResolvedValue({data: [{testMessage}]})
      const data = await postDelivery()
      expect(data).toEqual({data: [{testMessage}], is_busy: false})
    })
    it('returns created a delivery data when it rejected', async () => {
      axios.post.mockRejectedValue({response: {
        data: testMessage,
        status: 423
      }})
      const data = await postDelivery()
      expect(data).toEqual({data: testMessage, is_busy: true})
    })
    it('returns created a delivery data when it raised other error', async () => {
      axios.post.mockRejectedValue({response: {
        data: testMessage,
        status: 400
      }})
      const data = await postDelivery()
      expect(data).toBeUndefined()
    })
  })
  describe('postReceiving', () => {
    it('returns created a receiving data', async () => {
      axios.post.mockResolvedValue({data: [{testMessage}]})
      const data = await postReceiving()
      expect(data).toEqual({data: [{testMessage}], is_busy: false})
    })
    it('returns created a receiving data when it rejected', async () => {
      axios.post.mockRejectedValue({response: {
        data: testMessage,
        status: 423
      }})
      const data = await postReceiving()
      expect(data).toEqual({data: testMessage, is_busy: true})
    })
    it('returns created a receiving data when it raised other error', async () => {
      axios.post.mockRejectedValue({response: {
        data: testMessage,
        status: 400
      }})
      const data = await postReceiving()
      expect(data).toBeUndefined()
    })
  })
})
