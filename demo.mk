ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_demo.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

VISIBLE_WEB_HOST ?= testgmf.sig.cloud.camptocamp.net

DEPLOY_BRANCH_DIR ?= /var/www/vhosts/$(APACHE_VHOST)/private/deploybranch
GIT_REMOTE_URL ?= git@github.com:camptocamp/demo.git
DEPLOY_BRANCH_BASE_URL ?= $(VISIBLE_PROTOCOL)://$(VISIBLE_HOST)
DEPLOY_BRANCH_MAKEFILE ?= demo.mk

PRINT_VERSION ?= 2
APACHE_VHOST ?= gmfusrgrp_version2-geomapfishtest

PRINT_REQUIREMENT += print/WEB-INF/classes/mapfish-spring-application-context-override.xml

CGXP_INTERFACES = desktop edit routing
NGEO_INTERFACES = mobile

include CONST_Makefile
