#!/bin/bash
set -e


if [ "$1"="server" ];
then
    echo "Starting server"
    cd app
    uvicorn main:app --host 0.0.0.0 --port ${APP_PORT} --workers ${UVICORN_WORKERS}
else
    exec "$@"
fi