package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.service.ServiceException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.DataException;
import org.jetbrains.annotations.NotNull;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        @NotNull HttpHeaders headers,
        @NotNull HttpStatusCode status,
        @NotNull WebRequest request
    ) {
        log.warn(ex.getMessage());
        return handleExceptionInternal(ex, ex.getMessage(), headers, status, request);
    }

    @ExceptionHandler({
        ConstraintViolationException.class,
    })
    protected ResponseEntity<Object> handleGeneralException(RuntimeException e, WebRequest request) {
        log.warn(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        OptimisticLockingFailureException.class,
    })
    protected ResponseEntity<Object> handleServerError(RuntimeException e, WebRequest request) {
        log.error("2:" + e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
        DataException.class,
    })
    protected ResponseEntity<Object> handleInvalidData(RuntimeException e, WebRequest request) {
        log.error("3:" + e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
        IllegalArgumentException.class,
    })
    protected ResponseEntity<Object> handleIllegalArgument(RuntimeException e, WebRequest request) {
        log.warn("4:" + e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        ServiceException.class,
    })
    protected ResponseEntity<Object> handleServiceException(RuntimeException e, WebRequest request) {
        log.warn(this.getClass() + e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        BadCredentialsException.class,
        UsernameNotFoundException.class,
    })
    protected ResponseEntity<Object> handleBadRequest(RuntimeException e, WebRequest request) {
        log.warn("Bad request: {}", e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }
}
