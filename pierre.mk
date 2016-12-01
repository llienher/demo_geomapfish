INSTANCE_ID = pierre
DEVELOPMENT = TRUE

VARS_FILE = vars_pierre.yaml
APACHE_VHOST = geomapfish-demo
PRINT_VERSION ?= 2

UPGRADE_MAKE_FILE = pierre.mk

include demo.mk
