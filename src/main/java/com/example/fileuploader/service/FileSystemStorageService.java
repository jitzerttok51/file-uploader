package com.example.fileuploader.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.stream.Stream;

@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation;
    private final Logger logger = LoggerFactory.getLogger(FileSystemStorageService.class);

    @Autowired
    public FileSystemStorageService(StorageProperties storageProperties) {
        this.rootLocation = Paths.get(storageProperties.getLocation());
    }

    @Override
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.rootLocation);
            logger.info("Root location {} created", this.rootLocation);
        } catch (IOException e) {
            logger.error(e.getLocalizedMessage(), e);
            throw new StorageException("Could not initialize storage", e);
        }
    }

    @Override
    public void store(MultipartFile file) {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        logger.info("Soring file "+ filename);
        if(file.isEmpty()) {
            throw new StorageException("Cannot store empty file "+ filename);
        }

        if(filename.contains("..")) {
            throw new StorageException("Cannot store file with relative path " + filename);
        }

        try(var is = file.getInputStream()) {
            Files.copy(is, rootLocation.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            logger.error(e.getLocalizedMessage(), e);
            throw new StorageException("File "+ filename + " cannot be stored due to exception ", e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            logger.info("Getting all files");
            return Files
                    .walk(this.rootLocation, 1)
                    .filter(path->!this.rootLocation.equals(path))
                    .map(this.rootLocation::relativize);
        } catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }
    }

    @Override
    public Path load(String filename) {
        logger.info("Loading file "+ filename);
        return this.rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        logger.info("Loading file as resource"+ filename);
        Path file = load(filename);
        try {
            Resource resource = new UrlResource(file.toUri());
            if(resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("Cannot read file "+filename);
            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Cannot read file "+filename, e);
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(this.rootLocation.toFile());
    }
}
