import json
import importlib
import requests
from unittest.mock import call

import pytest
import lazy_import


orion = lazy_import.lazy_module('src.orion')
const = lazy_import.lazy_module('src.const')


@pytest.fixture
def mocked_requests(mocker):
    orion.requests = mocker.MagicMock()
    yield orion.requests


@pytest.fixture
def mocked_response(mocker):
    return mocker.MagicMock(spec=requests.Response)


class TestOrionClient:

    @pytest.mark.parametrize('payload', [
                {'msg': 'dummy'},
                {'test': {'nested': [1, 2.0, '3']}},
                {},
                [1, 1.2e-2, 'a', True, {'a': 'b'}, None],
                [],
                'dummy',
                1,
                0.5,
                True,
                None,
                tuple([1, 2]),
            ])
    def test_success(self, mocked_requests, mocked_response, payload):
        importlib.reload(const)
        importlib.reload(orion)
        mocked_response.status_code = 201
        mocked_requests.patch.return_value = mocked_response
        orion.requests = mocked_requests

        fiware_servicepath = '/'
        fiware_service = 'FIWARE_SERVICE'
        entity_type = 'dummy_type'
        entity_id = 'dummy_id'
        orion.patch_attr(fiware_servicepath, entity_type, entity_id, json.dumps(payload))
        endpoint = f'http://ORION_ENDPOINT/v2/entities/{entity_id}/attrs?type={entity_type}'
        headers = {
            'Content-Type': 'application/json',
            'Fiware-Service': fiware_service,
            'Fiware-Servicepath': fiware_servicepath,
        }
        assert mocked_requests.get.call_count == 0
        assert mocked_requests.post.call_count == 0
        assert mocked_requests.put.call_count == 0
        assert mocked_requests.patch.call_count == 1
        assert mocked_requests.delete.call_count == 0
        assert mocked_requests.patch.call_args == call(endpoint, headers=headers, data=json.dumps(payload))

    @pytest.mark.parametrize('status_code', [0, 199, 300, 400])
    @pytest.mark.parametrize('payload', [
                {'msg': 'dummy'},
                {'test': {'nested': [1, 2.0, '3']}},
                {},
                [1, 1.2e-2, 'a', True, {'a': 'b'}, None],
                [],
                'dummy',
                1,
                0.5,
                True,
                None,
                tuple([1, 2]),
            ])
    def test_error(self, mocked_requests, mocked_response, payload, status_code):
        importlib.reload(const)
        importlib.reload(orion)
        importlib.reload(const)
        importlib.reload(orion)
        mocked_response.status_code = status_code
        mocked_response.reason = "test reson"
        mocked_response.text = "test text"
        mocked_response.json.return_value = {'description': 'test description'}
        mocked_requests.patch.return_value = mocked_response
        orion.requests = mocked_requests

        fiware_servicepath = '/'
        fiware_service = 'FIWARE_SERVICE'
        entity_type = 'dummy_type'
        entity_id = 'dummy_id'
        # Raise OrionError
        with pytest.raises(Exception):
            orion.patch_attr(fiware_servicepath, entity_type, entity_id, json.dumps(payload))
        endpoint = f'http://ORION_ENDPOINT/v2/entities/{entity_id}/attrs?type={entity_type}'
        headers = {
            'Content-Type': 'application/json',
            'Fiware-Service': fiware_service,
            'Fiware-Servicepath': fiware_servicepath,
        }
        assert mocked_requests.get.call_count == 0
        assert mocked_requests.post.call_count == 0
        assert mocked_requests.put.call_count == 0
        assert mocked_requests.patch.call_count == 1
        assert mocked_requests.delete.call_count == 0
        assert mocked_requests.patch.call_args == call(endpoint, headers=headers, data=json.dumps(payload))
