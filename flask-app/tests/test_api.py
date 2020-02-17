import json
import importlib
import requests
from unittest import mock

import pytest
import lazy_import


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
        with mock.patch('src.api.ShipmentAPI._update_zaico') as mocked_update_zaico:
            mocked_update_zaico.return_value = update_zaico_response
            result = app.test_client().post(f'/api/v1/shipments/',
                                            content_type='application/json',
                                            data=json.dumps(payload))
        assert result.status_code == 201

    def test_zaico_update_success(self, app, mocked_api, mocked_response):
        mocked_response.json.return_value = {
            'quantity': 1,
            'title': 'test',
            'unit': '個',
            'category': 'test_category',
            'place': 'test_palce',
            'code': 'test_code'
        }
        mocked_response.status = 200
        mocked_api.requests.get.return_value = mocked_response
