import axios from 'axios'

const stockEndpoint = '/api/v1/stocks/'
const destinationEndpoint = '/api/v1/destinations/'
const shipmentEndpoint = '/api/v1/shipments/'
const deliveryEndpoint = '/api/v1/deliveries/'
const receivingEndpoint = '/api/v1/receivings/'

export async function listStocks() {
  try {
    const res = await axios.get(stockEndpoint)
    return res.data
  } catch (error) {
    // eslint-disable-next-line
    console.log('error:' + error)
  }
}

export async function listDestinations() {
  try {
    const res = await axios.get(destinationEndpoint)
    return res.data
  } catch (error) {
    // eslint-disable-next-line
    console.log('error:' + error)
  }
}

export async function postShipment(payload) {
  try {
    const res = await axios.post(shipmentEndpoint, payload)
    return {data: res.data, is_busy: false}
  } catch (error) {
    if (error.response.status == 423) {
      return {data: error.response.data, is_busy: true}
    }
    // eslint-disable-next-line
    console.log('error:' + error)
  }
}

async function postDeliveryOrReceiving(endpoint) {
  try {
    const res = await axios.post(endpoint, {})
    return {data: res.data, is_busy: false}
  } catch (error) {
    if (error.response.status == 423) {
      return {data: error.response.data, is_busy: true}
    }
    // eslint-disable-next-line
    console.log('error:' + error)
  }
}

export function postDelivery() {
    return postDeliveryOrReceiving(deliveryEndpoint)
}

export function postReceiving() {
    return postDeliveryOrReceiving(receivingEndpoint)
}
