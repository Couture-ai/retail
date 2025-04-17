# Stage 1: Local Build 
FROM python:3.10.0-slim-buster as builder

ENV PYTHONUNBUFFERED=1
ENV SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL=True

WORKDIR /server

COPY ./app/requirements.txt /server/requirements.txt
COPY ./app   /server/app

RUN apt-get update && \
    apt-get install build-essential gcc -y && \
    pip install --default-timeout=200 --prefix=/install \
    -r requirements.txt && \
    #Clean up apt cache
    rm -rf /var/lib/apt/lists/* 

# Stage 2: final lean build
FROM python:3.10.0-slim-buster

COPY --from=builder /install /usr/local


WORKDIR /server

COPY ./entrypoint.sh /server/


RUN chmod 777 /server/entrypoint.sh

EXPOSE 8499

ENTRYPOINT [ "./entrypoint.sh" ]
# CMD ["tail", "-f", "/dev/null"]
