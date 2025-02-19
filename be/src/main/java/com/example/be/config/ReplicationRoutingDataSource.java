package com.example.be.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class ReplicationRoutingDataSource extends AbstractRoutingDataSource {

    private static final ThreadLocal<String> currentDataSource = new ThreadLocal<>();

    public static void setCurrentDataSource(String key) {
        currentDataSource.set(key);
    }

    @Override
    protected Object determineCurrentLookupKey() {
        return currentDataSource.get();
    }
}
