#!/bin/bash
sleep 10
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic users-service
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic questions-server
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic nginx