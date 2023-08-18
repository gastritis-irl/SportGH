package edu.codespring.sportgh.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
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

    @ExceptionHandler({
        ConstraintViolationException.class,
        IllegalArgumentException.class,
    })
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        @NotNull HttpHeaders headers,
        @NotNull HttpStatusCode status,
        @NotNull WebRequest request
    ) {
        ObjectMapper objectMapper = new ObjectMapper();

        ArrayNode jsonArray = ex.getFieldErrors().stream()
            .map(e -> objectMapper.createArrayNode()
                .add(e.getField())
                .add(e.getDefaultMessage()))
            .reduce(objectMapper.createArrayNode(), ArrayNode::add, ArrayNode::addAll);
        String jsonString = jsonArray.toString();

        return handleExceptionInternal(ex, jsonString, headers, status, request);
    }

    @ExceptionHandler({
        OptimisticLockingFailureException.class,
        DataException.class,
    })
    protected ResponseEntity<Object> handleServerError(RuntimeException e, WebRequest request) {
        log.error(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
        ServiceException.class,
    })
    protected ResponseEntity<Object> handleServiceException(RuntimeException e, WebRequest request) {
        log.warn(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        BadCredentialsException.class,
        UsernameNotFoundException.class,
    })
    protected ResponseEntity<Object> handleBadRequest(RuntimeException e, WebRequest request) {
        log.warn(e.getMessage());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }
}
