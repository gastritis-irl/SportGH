package edu.codespring.sportgh.exception;

public class ServiceAuthenticationException extends RuntimeException {

    public ServiceAuthenticationException(String message) {
        super(message);
    }

    public ServiceAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
