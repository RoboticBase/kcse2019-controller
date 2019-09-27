import os
import json
from urllib.parse import urljoin

import requests

from src import const

FIWARE_SERVICE = os.environ.get(const.FIWARE_SERVICE, '')
ORION_ENDPOINT = os.environ.get(const.ORION_ENDPOINT, '') 
ORION_PATH_TPL = urljoin(ORION_ENDPOINT, const.ORION_PATH)

def patch_attr(fiware_servicepath, entity_type, entity_id, data):
    headers = {
        'Content-Type': 'application/json',
        'Fiware-Service': FIWARE_SERVICE,
    }
    headers['Fiware-Servicepath'] = fiware_servicepath

    url = ORION_PATH_TPL.replace('<<ID>>', entity_id).replace('<<TYPE>>', entity_type)

    response = requests.patch(url, headers=headers, data=data)

    if 200 <= response.status_code and response.status_code < 300:
        print(f'patch attr, url={url}, fiware_servicepath={fiware_servicepath}, data={json.dumps(json.loads(data))}')
    else:
        raise OrionError(response.text, f'OrionError({response.reason})', response.json()['description'])
