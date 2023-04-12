package com.hangamastream.exceptions;

public class ResourceNotFound extends RuntimeException {

    String resourceName;
    String fieldValue;

    public ResourceNotFound(String resourceName, String fieldValue) {
        super(String.format("%s not found with %s", resourceName, fieldValue));
        this.resourceName = resourceName;
        this.fieldValue = fieldValue;
    }
    
}
