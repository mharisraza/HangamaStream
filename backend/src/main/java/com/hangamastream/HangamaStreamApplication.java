package com.hangamastream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HangamaStreamApplication {

	@Value("${hangama.stream.origins}")
    private String[] allowedOrigins;

	public static void main(String[] args) {
		SpringApplication.run(HangamaStreamApplication.class, args);
	}

}
