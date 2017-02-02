[DEFAULT]
project = demo

[main]
hookdir = %(here)s/hooks/
# to update the static schema, we need to deploy the code first
restore_order = code,database,files

[files]
active = false

[databases]
names = ${db}.${schema}
use_schema = true
psql = sudo -u postgres psql
dump = sudo -u postgres pg_dump -Fc
createdb = sudo -u postgres createdb
restore_tmp = sudo -u postgres pg_restore -Fc -d

[code]
src = /var/www/vhosts/gmfusrgrp_version2-geomapfishtest/private/${instanceid}/demo_geomapfish
dest = ${deploy["code_destination"]}

[apache]
active = false

[remote_hosts]
demo_server = geomapfish-demo-tmp.infra.internal
