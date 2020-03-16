const deliveryEndpoint = '/api/v1/deliveries/'
const receivingEndpoint = '/api/v1/receivings/'

let isBusy = false;

export function setBusy(flag) {
  isBusy = flag

}

const stocks = [
  {}
]
const destinations = [
  {}
]

export function listStocks() {
  try {
    return new Promise(resolve => {
      resolve(stocks)
    })
  } catch (error) {
    // eslint-disable-next-line
    console.log('error:' + error)
  }
}

export function listDestinations() {
  try {
    return new Promise(resolve => {
      resolve(destinations)
    })
  } catch (error) {
    // eslint-disable-next-line
    console.log('error:' + error)
  }
}

export function postShipment(payload) {
  try {
    return new Promise(resolve => {
      resolve({
        data: {
          robot_id: '1',
          delivery_robot: {
            id: '1'
          },
          updated: [
            {
              title: 'test title',
              reservation: '1'
            }
          ],
          destination: {
            name: 'test destination name'
          }
        },
        is_busy: isBusy
      })
    })
  } catch (error) {
    if (error.response.status == 423) {
      return {data: error.response.data, is_busy: true}
    }
    // eslint-disable-next-line
    console.log('error:' + error)
  }
}

function postDeliveryOrReceiving(endpoint) {
  try {
    return new Promise(resolve => {
      resolve({
        is_busy: isBusy,
        data: {
          robot_id: 1,
          delivery_robot: {
            id: 1
          }
        }
      })
    })
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
