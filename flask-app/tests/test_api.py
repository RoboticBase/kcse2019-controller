import os
import json
import importlib
import requests
from unittest import mock

import pytest
import lazy_import

from src.errors import RobotBusyError


api = lazy_import.lazy_module('src.api')
const = lazy_import.lazy_module('src.const')


@pytest.fixture
def mocked_api(mocker):
    api.orion = mocker.MagicMock()
    api.requests = mocker.MagicMock()
    yield api
    importlib.reload(api)


@pytest.fixture
def mocked_response(mocker):
    return mocker.MagicMock(spec=requests.Response)


class TestZaikoAPI:

    def test_list_success(self, app, mocked_api, mocked_response):
        mocked_response.status_code = 200
        mocked_response.json.return_value = [{}]
        mocked_response.text = '[{}]'
        mocked_api.requests.get.return_value = mocked_response
        result = app.test_client().get('/api/v1/stocks/', content_type='application/json')
        assert result.status_code == 200

    @pytest.mark.parametrize('status_code, expected_code', [(404, 404),
                                                            (500, 500),
                                                            (400, 500)])
    def test_list_errror(self, app, mocked_api, mocked_response, status_code, expected_code):
        mocked_response.status_code = status_code
        mocked_response.json.return_value = [{}]
        mocked_response.text = '[{}]'
        mocked_api.requests.get.return_value = mocked_response
        result = app.test_client().get('/api/v1/stocks/', content_type='application/json')
        assert result.json == {'message': 'can not get stock list from zaico', 'root_cause': [{}]}
        assert result.status_code == expected_code

    def test_detail_success(self, app, mocked_api, mocked_response):
        mocked_response.status_code = 200
        mocked_response.json.return_value = {}
        mocked_response.text = '{}'
        mocked_api.requests.get.return_value = mocked_response
        result = app.test_client().get('/api/v1/stocks/1/', content_type='application/json')
        assert result.status_code == 200

    @pytest.mark.parametrize('status_code, expected_code', [(404, 404),
                                                            (500, 500),
                                                            (400, 500)])
    def test_detail_errror(self, app, mocked_api, mocked_response, status_code, expected_code):
        mocked_response.status_code = status_code
        mocked_response.json.return_value = [{}]
        mocked_response.text = '[{}]'
        mocked_api.requests.get.return_value = mocked_response
        result = app.test_client().get('/api/v1/stocks/1/', content_type='application/json')
        assert result.json == {'message': 'can not get stock detail from zaico', 'root_cause': [{}]}
        assert result.status_code == expected_code


class TestDestinationAPI:

    def test_list_success(self, app, mocked_api, mocked_response):
        result = app.test_client().get('/api/v1/destinations/', content_type='application/json')
        assert result.status_code == 200
        assert result.json == [{'id': 0, 'name': '目的地'}]

    def test_detail_success(self, app, mocked_api, mocked_response):
        mocked_api.requests.get.return_value = mocked_response
        result = app.test_client().get('/api/v1/destinations/0/', content_type='application/json')

        assert result.status_code == 200

    @pytest.mark.parametrize('destination_id, message', [(1, {'message': 'destination(id=1) does not found'}),
                                                         ('test', {'message': 'can not get destination detail',
                                                                   'root_cause': "invalid literal for int() with base 10: 'test'"})])
    def test_detail_error(self, app, mocked_api, mocked_response, destination_id, message):
        result = app.test_client().get(f'/api/v1/destinations/{destination_id}/',
                                       content_type='application/json')
        assert result.json == message
        assert result.status_code == 404


class TestShipmentAPI:

    def test_post_success(self, app, mocked_api, mocked_response):
        payload = {'items': [
            {
                'id': '1',
                'reservation': '1'
            }
        ]}
        update_zaico_response = {
            'result': 'success',
            'destination': {'id': 0, 'name': '目的地'},
            'updated': []
        }
        exptected_data = {
            'delivery_robot': {
                'id': '',
                'type': ''
            },
            'destination': {
                'id': 0,
                'name': '目的地'
            },
            'result': 'success',
            'updated': []
        }
        with mock.patch('src.api.ShipmentAPI._update_zaico') as mocked_update_zaico:
            mocked_update_zaico.return_value = update_zaico_response
            result = app.test_client().post(f'/api/v1/shipments/',
                                            content_type='application/json',
                                            data=json.dumps(payload))
            assert result.status_code == 201
            assert result.json == exptected_data

    def test_post_400_error(self, app, mocked_api, mocked_response):
        payload = ''
        result = app.test_client().post(f'/api/v1/shipments/',
                                        content_type='application/json',
                                        data=json.dumps(payload))
        assert result.status_code == 400
        assert result.json == {'message': 'invalid payload'}

    # RobotBusyError is unreachable code
    def test_post_500_error(self, app, mocked_api, mocked_response):
        payload = {'items': [
            {
                'id': '1',
                'reservation': '1'
            }
        ]}
        update_zaico_response = {
            'result': 'success',
            'destination': {'id': 0, 'name': '目的地'},
            'updated': []
        }
        # OrionError is not defined on orion.py when raised error in orion_client.
        mocked_api.orion.patch_attr.side_effect = NameError
        with mock.patch('src.api.ShipmentAPI._update_zaico') as mocked_update_zaico:
            mocked_update_zaico.return_value = update_zaico_response
            result = app.test_client().post(f'/api/v1/shipments/',
                                            content_type='application/json',
                                            data=json.dumps(payload))
            assert result.status_code == 500
            assert result.json == {'message': 'exception occured when notify shipment',
                                   'root_cause': ''}

    def test_update_zaico_success(self, app, mocked_api, mocked_response, mocker):
        payload = {
            'destination_id': '0',
            'items': [{
                'id': '1',
                'reservation': '1'
            }]
        }
        mocked_response.json.return_value = {
            'quantity': 1,
            'title': 'test',
            'unit': '個',
            'category': 'test_category',
            'place': 'test_palce',
            'code': 'test_code'
        }

        expected_data = {'result': 'success',
                         'destination': {
                             'id': 0,
                             'name': '目的地'
                         },
                         'updated': [{
                             'id': '1',
                             'prev_quantity': 1,
                             'new_quantity': 0,
                             'reservation': 1,
                             'title': 'test',
                             'unit': '個',
                             'category': 'test_category',
                             'place': 'test_palce',
                             'code': 'test_code'}],
                         'delivery_robot': {'type': '',
                                            'id': ''}
                         }

        mocked_response.status_code = 200
        mocked_api.requests.get.return_value = mocked_response

        mocked_put_response = mocker.MagicMock(spec=requests.Response)
        mocked_put_response.status_code = 201
        mocked_put_response.json.return_value = {'result': 'success'}
        mocked_api.requests.put.return_value = mocked_put_response
        result = app.test_client().post(f'/api/v1/shipments/',
                                        content_type='application/json',
                                        data=json.dumps(payload))
        assert result.json == expected_data
        assert result.status_code == 201

    # Raised UnboundLocalError when aborted in _update_zaico.
    # UnboundLocalError: local variable 'zaico_res' referenced before assignment
    @pytest.mark.parametrize('status_code, expected_code', [(404, 404),
                                                            (500, 500),
                                                            (400, 500)])
    def test_update_zaico_get_error(self, app, mocked_api, mocked_response, status_code, expected_code):
        payload = {
            'destination_id': '0',
            'items': [{
                'id': '1',
                'reservation': '1'
            }]
        }
        mocked_response.json.return_value = {
        }

        mocked_response.status_code = status_code
        mocked_api.requests.get.return_value = mocked_response

        result = app.test_client().post(f'/api/v1/shipments/',
                                        content_type='application/json',
                                        data=json.dumps(payload))
        assert result.status_code == 500

    # Raised UnboundLocalError when aborted in _update_zaico.
    # UnboundLocalError: local variable 'zaico_res' referenced before assignment
    @pytest.mark.parametrize('status_code, expected_code', [(404, 404),
                                                            (500, 500),
                                                            (400, 500)])
    def test_update_zaico_put_error(self, app, mocked_api, mocked_response, status_code, expected_code, mocker):
        payload = {
            'destination_id': '0',
            'items': [{
                'id': '1',
                'reservation': '1'
            }]
        }
        mocker_get_response = mocker.MagicMock()
        mocker_get_response.status_code = 200
        mocker_get_response.json.return_value = {
            'quantity': 1,
            'title': 'test',
            'unit': '個',
            'category': 'test_category',
            'place': 'test_palce',
            'code': 'test_code'
        }

        mocked_api.requests.get.return_value = mocker_get_response

        mocked_response.status_code = status_code
        mocked_response.json.return_value = {'result': 'success'}
        mocked_api.requests.put.return_value = mocked_response

        result = app.test_client().post(f'/api/v1/shipments/',
                                        content_type='application/json',
                                        data=json.dumps(payload))
        assert result.status_code == 500

    # Raised UnboundLocalError when aborted in _update_zaico.
    # UnboundLocalError: local variable 'zaico_res' referenced before assignment
    @pytest.mark.parametrize('quantity, reservation', [(1, '2'),
                                                       (0, '1'),
                                                       (0, '1.1'),
                                                       (0.1, '1.1'),
                                                       (-2, '1'),
                                                       (-2, '-1'),
                                                       (-1, '0')])
    def test_update_zaico_quantituy_error(self, app, mocked_api, mocked_response, quantity, reservation, mocker):
        payload = {
            'destination_id': '0',
            'items': [{
                'id': '1',
                'reservation': reservation
            }]
        }
        mocked_response.json.return_value = {
            'quantity': quantity,
            'title': 'test',
            'unit': '個',
            'category': 'test_category',
            'place': 'test_palce',
            'code': 'test_code'
        }

        mocked_response.status_code = 200
        mocked_api.requests.get.return_value = mocked_response

        mocked_put_response = mocker.MagicMock(spec=requests.Response)
        mocked_put_response.status_code = 201
        mocked_put_response.json.return_value = {'result': 'success'}
        mocked_api.requests.put.return_value = mocked_put_response
        result = app.test_client().post(f'/api/v1/shipments/',
                                        content_type='application/json',
                                        data=json.dumps(payload))
        assert result.status_code == 500

    def test_compensate_zaico_success(self, app, mocked_api, mocked_response, mocker):
        payload = {
            'destination_id': '0',
            'items': [{
                'id': '1',
                'reservation': '1'
            }]
        }
        mocked_response.json.return_value = {
            'quantity': 1,
            'title': 'test',
            'unit': '個',
            'category': 'test_category',
            'place': 'test_palce',
            'code': 'test_code'
        }

        mocked_response.status_code = 200
        mocked_api.requests.get.return_value = mocked_response

        mocked_put_response = mocker.MagicMock(spec=requests.Response)
        mocked_put_response.status_code = 201
        mocked_put_response.json.return_value = {'result': 'success'}
        mocked_api.requests.put.return_value = mocked_put_response
        with mock.patch('src.api.ShipmentAPI.send_cmd') as mocked_send_cmd:
            mocked_send_cmd.side_effect = Exception
            result = app.test_client().post(f'/api/v1/shipments/',
                                            content_type='application/json',
                                            data=json.dumps(payload))
            assert result.status_code == 500
            assert result.json == {'message': 'exception occured when notify shipment',
                                   'root_cause': ''}

    def test_compensate_zaico_error(self, app, mocked_api, mocked_response, mocker):
        payload = {
            'destination_id': '0',
            'items': [{
                'id': '1',
                'reservation': '1'
            }]
        }
        update_zaico_response = {
            'result': 'success',
            'destination': {'id': 0, 'name': '目的地'},
            'updated': [{'id': 1, 'prev_quantity': 1}]
        }
        mocked_response.json.return_value = {
            'quantity': 1,
            'title': 'test',
            'unit': '個',
            'category': 'test_category',
            'place': 'test_palce',
            'code': 'test_code'
        }

        mocked_response.status_code = 200
        mocked_api.requests.get.return_value = mocked_response

        mocked_put_response = mocker.MagicMock(spec=requests.Response)
        mocked_put_response.status_code = 400
        mocked_put_response.json.return_value = {'result': 'success'}
        mocked_api.requests.put.return_value = mocked_put_response
        with mock.patch('src.api.ShipmentAPI.send_cmd') as mocked_send_cmd:
            mocked_send_cmd.side_effect = Exception
            with mock.patch('src.api.ShipmentAPI._update_zaico') as mocked_update_zaico:
                mocked_update_zaico.return_value = update_zaico_response
                result = app.test_client().post(f'/api/v1/shipments/',
                                                content_type='application/json',
                                                data=json.dumps(payload))
                assert result.status_code == 500
                assert result.json == {'message': 'exception occured when notify shipment',
                                       'root_cause': ''}

class TestDeliveryAPI:

    def test_post_success(self, app, mocked_api, mocked_response):
        result = app.test_client().post(f'/api/v1/deliveries/',
                                        content_type='application/json')
        assert result.status_code == 201
        assert result.json == {'delivery_robot': {'id': '', 'type': ''}}

    def test_post_error(self, app, mocked_api, mocked_response):
        mocked_api.orion.patch_attr.side_effect = NameError
        result = app.test_client().post(f'/api/v1/deliveries/',
                                        content_type='application/json')
        # OrionError is not defined on orion.py when raised error in orion_client.
        assert result.status_code == 500


class TestReceiveAPI:

    def test_post_success(self, app, mocked_api, mocked_response):
        result = app.test_client().post(f'/api/v1/receivings/',
                                        content_type='application/json')
        assert result.status_code == 201
        assert result.json == {'delivery_robot': {'id': '', 'type': ''}}

    def test_post_error(self, app, mocked_api, mocked_response):
        mocked_api.orion.patch_attr.side_effect = NameError
        result = app.test_client().post(f'/api/v1/deliveries/',
                                        content_type='application/json')
        # OrionError is not defined on orion.py when raised error in orion_client.
        assert result.status_code == 500


class TestRBMixin:

    def test_rb_headers_success(self, app, mocked_api):
        rb_mixin = api.RBMixin()
        # AttributeError: module 'src.const' has no attribute 'SHIPMENTAPI_TOKEN'
        SHIPMENTAPI_TOKEN = 'SHIPMENTAPI_TOKEN'
        const.SHIPMENTAPI_TOKEN = SHIPMENTAPI_TOKEN
        importlib.reload(const)
        assert rb_mixin.rb_headers == {'Content-Type': 'application/json',
                                       'Authorization': 'Bearer SHIPMENTAPI_TOKEN'}
