import pytest


class TestVue:

    def test_success(self, app):
        with open('./../vue-app/dist/index.html', 'r') as f:
            result = app.test_client().get('/')
            assert result.status_code == 200
            assert result.data.decode('utf-8') == f.read()
