#!/bin/bash

set -e

start() {
    if [[ $DATABRICKS_CONFIG_WEBPACK_MLFLOW == 'true' ]];
    then
        echo "[start] Using databricks-webpack because DATABRICKS_CONFIG_WEBPACK_MLFLOW=true"
        databricks-webpack start
    else
        craco start
    fi
}

build() {
    if [[ $DATABRICKS_CONFIG_WEBPACK_MLFLOW == 'true' ]];
    then
        echo "[build] Using databricks-webpack because DATABRICKS_CONFIG_WEBPACK_MLFLOW=true"
        databricks-webpack build
    else
        craco --max_old_space_size=8192 build
    fi
}

eval "$1"
