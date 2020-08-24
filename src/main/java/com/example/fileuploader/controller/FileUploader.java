package com.example.fileuploader.controller;

import com.example.fileuploader.service.StorageFileNotFoundException;
import com.example.fileuploader.service.StorageService;
import org.apache.tomcat.util.http.fileupload.impl.SizeLimitExceededException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@ControllerAdvice
public class FileUploader {

    private final StorageService storageService;
    private final Logger logger = LoggerFactory.getLogger(FileUploader.class);

    public FileUploader(StorageService storageService) {this.storageService = storageService;}

    @PostMapping("/upload")
    public String uploadFile(@RequestPart(name = "file") MultipartFile file) {
        storageService.store(file);
        return "Successfully uploaded "+ file.getOriginalFilename();
    }

    @GetMapping("/uploads")
    public List<String> listFiles() {
        return storageService.loadAll()
                .map(path ->
                MvcUriComponentsBuilder
                        .fromMethodName(FileUploader.class, "getFile", path.getFileName().toString())
                        .build().toUri().toString())
                .collect(Collectors.toList());
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = this.storageService.loadAsResource(filename);
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+file.getFilename()+"\"")
                .body(file);
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFoundException(StorageFileNotFoundException e) {
        logger.error(e.getLocalizedMessage(), e);
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(MultipartException.class)
    @ResponseStatus(value = HttpStatus.PAYLOAD_TOO_LARGE)
    private ResponseEntity<?> handleSizeLimitException(MultipartException e) {
        logger.error(e.getLocalizedMessage(), e);
        return ResponseEntity.badRequest().body(e.getLocalizedMessage());
    }
}
