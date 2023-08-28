package edu.codespring.sportgh.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import edu.codespring.sportgh.exception.ServiceAuthenticationException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.DataException;
import org.jetbrains.annotations.NotNull;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.sql.DataTruncation;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;


@Slf4j
@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({
        ConstraintViolationException.class,
        IllegalArgumentException.class,
        DataTruncation.class,
        SQLException.class,
    })
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        @NotNull HttpHeaders headers,
        @NotNull HttpStatusCode status,
        @NotNull WebRequest request
    ) {
        log.warn(ex.getMessage());
        ObjectMapper objectMapper = new ObjectMapper();

        ArrayNode jsonArray = ex.getFieldErrors().stream()
            .map(e -> objectMapper.createArrayNode()
                .add(e.getField())
                .add(e.getDefaultMessage()))
            .reduce(objectMapper.createArrayNode(), ArrayNode::add, ArrayNode::addAll);
        String jsonString = jsonArray.toString();

        return handleExceptionInternal(ex, jsonString, headers, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        SQLIntegrityConstraintViolationException.class,
    })
    protected ResponseEntity<Object> handleIntegrityConstraintViolation(SQLException e, WebRequest request) {
        int errorCode = e.getErrorCode();

        if (errorCode == 1451) {    // Error code: cannot delete because of a foreign key
            return handleExceptionInternal(e, "Cannot delete item: delete sub items first",
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
        }
        if (errorCode == 1062) {    // Error code: duplicate entry
            return handleExceptionInternal(e, "Item with this name already exists",
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
        }

        log.error(e.toString());
        return handleExceptionInternal(e, "There was a database error, please retry",
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
        OptimisticLockingFailureException.class,
        DataException.class,
        UnsupportedOperationException.class,
    })
    protected ResponseEntity<Object> handleServerError(RuntimeException e, WebRequest request) {
        log.error(e.toString());
        return handleExceptionInternal(e, "There was a server error, please retry",
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
        ServiceAuthenticationException.class,
    })
    protected ResponseEntity<Object> handleBadRequest(RuntimeException e, WebRequest request) {
        log.warn(e.toString());
        return handleExceptionInternal(e, e.getMessage(),
            new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({
        Exception.class,
    })
    protected ResponseEntity<Object> handleException(RuntimeException e, WebRequest request) {
        log.error("Unexpected exception", e);
        return handleExceptionInternal(e, "There was a server error, please retry",
            new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }
}
