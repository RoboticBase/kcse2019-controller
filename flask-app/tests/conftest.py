import os
import importlib

import pytest
import lazy_import


LISTEN_PORT = 'LISTEN_PORT'
ZAICO_TOKEN = 'ZAICO_TOKEN'
ORION_ENDPOINT = 'ORION_ENDPOINT'
FIWARE_SERVICE = 'FIWARE_SERVICE'
MOBILE_ROBOT_SERVICEPATH = 'MOBILE_ROBOT_SERVICEPATH'
MOBILE_ROBOT_TYPE = 'MOBILE_ROBOT_TYPE'
MOBILE_ROBOT_ID = 'MOBILE_ROBOT_ID'
ZAICO_ENDPOINT = 'ZAICO_ENDPOINT'
ORION_PATH = 'ORION_PATH'
CMD_TML = 'CMD_TML'
CMD_SHIPMENT = 'CMD_SHIPMENT'
CMD_DELIVERY = 'CMD_DELIVERY'
CMD_RECEIVING = 'CMD_RECEIVING'
VUE_TEMPLATE_FOLDER = 'VUE_TEMPLATE_FOLDER'
VUE_STATIC_FOLDER = 'VUE_STATIC_FOLDER'
SHIPMENTAPI_TOKEN = 'SHIPMENTAPI_TOKEN'


@pytest.fixture(scope='function', autouse=True)
def setup_environments():
    os.environ[ORION_ENDPOINT] = 'http://ORION_ENDPOINT'
    os.environ[FIWARE_SERVICE] = 'FIWARE_SERVICE'
    os.environ[ZAICO_TOKEN] = 'ZAICO_TOKEN'
    os.environ[ZAICO_ENDPOINT] = 'ZAICO_ENDPOINT'
    os.environ[ORION_PATH] = 'ORION_PATH'
    os.environ[CMD_TML] = '{"move": {"value": "<<CMD>>"}}'
    os.environ[CMD_SHIPMENT] = 'inventory'
    os.environ[CMD_DELIVERY] = 'destination'
    os.environ[CMD_RECEIVING] = 'home'
    os.environ[VUE_TEMPLATE_FOLDER] = '../vue-app/dist'
    os.environ[VUE_STATIC_FOLDER] = '../vue-app/dist/static'
    os.environ[SHIPMENTAPI_TOKEN] = 'SHIPMENTAPI_TOKEN'


@pytest.fixture(scope='function', autouse=True)
def teardown_enviroments():
    yield

    if ORION_ENDPOINT in os.environ:
        del os.environ[ORION_ENDPOINT]
    if FIWARE_SERVICE in os.environ:
        del os.environ[FIWARE_SERVICE]
    if ZAICO_TOKEN in os.environ:
        del os.environ[ZAICO_TOKEN]
    if ZAICO_ENDPOINT in os.environ:
        del os.environ[ZAICO_ENDPOINT]
    if ORION_PATH in os.environ:
        del os.environ[ORION_PATH]
    if CMD_SHIPMENT in os.environ:
        del os.environ[CMD_SHIPMENT]
    if CMD_DELIVERY in os.environ:
        del os.environ[CMD_DELIVERY]
    if CMD_RECEIVING in os.environ:
        del os.environ[CMD_RECEIVING]
    if VUE_TEMPLATE_FOLDER in os.environ:
        del os.environ[VUE_TEMPLATE_FOLDER]
    if VUE_STATIC_FOLDER in os.environ:
        del os.environ[VUE_STATIC_FOLDER]


@pytest.fixture
def app():
    main = lazy_import.lazy_module('main')
    yield main.app
    importlib.reload(main)
