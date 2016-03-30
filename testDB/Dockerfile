FROM camptocamp/postgis:9.5
MAINTAINER Camptocamp "info@camptocamp.com"

ENV POSTGRES_USER www-data
ENV POSTGRES_DB xmy
ADD *.sql *.csv *.sh /docker-entrypoint-initdb.d/
