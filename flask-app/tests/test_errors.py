import importlib

from flask import jsonify, abort

import pytest
import lazy_import


@pytest.fixture
def errors(mocker):
    errors = lazy_import.lazy_module('src.errors')
    errors.logger = mocker.MagicMock()
    yield errors
    importlib.reload(errors)


class DummyException(Exception):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.description = {'msg': args[0]}


class TestException:

    def test_robot_busy_error(self, mocker, app, errors):
        robot_busy_error = errors.RobotBusyError(status_code=500,
                                                 robot_id='robot_id')
        assert robot_busy_error.status_code == 500
        assert robot_busy_error.robot_id == 'robot_id'

    def test_rb_error(self, mocker, app, errors):
        robot_busy_error = errors.RBError(status_code=500)
        assert robot_busy_error.status_code == 500


class TestErrorHandler:

    def test_success(self, mocker, app, errors):
        app.register_blueprint(errors.app)

        @app.route('/')
        def test():
            return jsonify({'result': 'success'})
        response = app.test_client().get('/')
        assert response.status_code == 200
        assert response.json == {'result': 'success'}
        assert errors.logger.error.call_count == 0
        assert errors.logger.warning.call_count == 0

    @pytest.mark.parametrize('exception, expected_json', [
        (Exception(), {}),
        (DummyException('test'), {'msg': 'test'}),
        (NotImplementedError('test'), {}),
    ])
    def test_exception(self, app, errors, exception, expected_json):
        app.register_blueprint(errors.app)

        @app.route('/')
        def test():
            raise exception

        response = app.test_client().get('/')
        assert response.status_code == 500
        assert response.json == expected_json

    @pytest.mark.parametrize('status_code, description, expected_json', [
        (
            400, {'msg': 'status_code==400'}, {'msg': 'status_code==400'},
        ),
        (
            401, {'msg': 'status_code==401'}, {'msg': 'status_code==401'},
        ),
        (
            403, {'msg': 'status_code==403'}, {'msg': 'status_code==403'},
        ),
        (
            404, {'msg': 'status_code==404'}, {'msg': 'status_code==404'},
        ),
        (
            405, {'msg': 'status_code==405'}, 'The method is not allowed for the requested URL.',
        ),
    ])
    def test_abort_error(self, app, errors, status_code, description, expected_json):
        app.register_blueprint(errors.app)

        @app.route('/')
        def test():
            abort(status_code, description)

        response = app.test_client().get('/')
        assert response.status_code == status_code
        assert response.json == expected_json
