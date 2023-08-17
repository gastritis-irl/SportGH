package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.service.ServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({
        Exception.class,
    })
    protected ResponseEntity<Object> handleGeneralException(RuntimeException e, WebRequest request) {
        log.error(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
        OptimisticLockingFailureException.class,
    })
    protected ResponseEntity<Object> handleServerError(RuntimeException e, WebRequest request) {
        log.error(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
        IllegalArgumentException.class,
    })
    protected ResponseEntity<Object> handleIllegalArgument(RuntimeException e, WebRequest request) {
        log.error(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        ServiceException.class,
    })
    protected ResponseEntity<Object> handleServiceException(RuntimeException e, WebRequest request) {
        log.error(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        BadCredentialsException.class,
        UsernameNotFoundException.class,
    })
    protected ResponseEntity<Object> handleBadRequest(RuntimeException e, WebRequest request) {
        log.info("Bad request: {}", e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }
}
