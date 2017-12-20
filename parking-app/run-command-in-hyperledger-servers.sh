#!/bin/bash

#for FIELDS in `docker ps --format "table {{.Names}}\t{{.ID}}"`; do
for DOCKER_NAME in `docker ps --format "table {{.Names}}" | tail -n +2`; do
	#echo $FIELDS
	#DOCKER_NAME=`echo $FIELDS | awk '{Print $1;}'`
	#DOCKER_ID=`echo $FIELDS | awk '{Print $2;}'`

	echo "Executing command in $DOCKER_NAME" #($DOCKER_ID)

	docker exec -i -t $DOCKER_NAME $@
done
