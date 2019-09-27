# ksce2019-controller : An example business logics of RoboticBase
This repository is an example business logics of "RoboticBase-core".

## Description
"RoboticBase" is a robot management platform based on [FIWARE](http://www.fiware.org/) which enables you to manage and operate many kinds of robots and IoT devices as interactions of contexts.

This repository deploys some business logics to control an autonomous mobile robot through "RoboticBase".

This example requires the RoboticBase/core version 0.4.4 or higher.

## Requirements

* python 3.6 or higher
* node 10.16 or higher

## Evironment Variables
The API server requires some Environment Variables like below:

|Environment Variable|Summary|Default|
|:--|:--|:--|
|`LOG_LEVEL`|log level(DEBUG, INFO, WARNING, ERRRO, CRITICAL)|INFO|
|`LISTEN_PORT`|listen port of this service|3000|
|`ORION_ENDPOINT`|endpoint url of orion context broker|''|
|`FIWARE_SERVICE`|the value of 'Fiware-Service' HTTP Header|''|
|`MOBILE_ROBOT_SERVICEPATH`|the value of 'Fiware-Servicepath' HTTP Header|''|
|`MOBILE_ROBOT_TYPE`|the type specified when registering robot entity to orion|''|
|`MOBILE_ROBOT_ID`|the id specified when registering robot entity to orion|''|
|`ZAICO_TOKEN`|the authentication token of [zaico.co.jp](https://www.zaico.co.jp)|''|

## Getting started
1. compile WebUI

    ```
    $ docker run -it -v $(pwd)/vue-app:/opt/vue-app -w /opt/vue-app node:10.16-alpine /bin/ash -c 'rm -rf dist && rm -rf node_modules && npm install && npm audit fix && npm run build'
    ```
1. set the environment variables
1. start API server

    ```
    $ cd flask-app && ./main.py
    ```

## License

[Apache License 2.0](/LICENSE)

## Copyright
Copyright (c) 2019 [TIS Inc.](https://www.tis.co.jp/)
