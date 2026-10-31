package com.kuro.craft.service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.kuro.craft.exception.NotFoundException;

@Service
public class SkinService {

  private static final Pattern VALID_NAME = Pattern.compile("^[A-Za-z0-9_]{3,16}$");
  private static final Duration CACHE_TTL = Duration.ofHours(1);

  private final ConcurrentHashMap<String, CachedSkin> cache = new ConcurrentHashMap<>();
  private final RestClient restClient = RestClient.create();

  public byte[] getSkin(String name) {
    if (name == null || !VALID_NAME.matcher(name).matches()) {
      throw new NotFoundException("Skin not found");
    }

    CachedSkin cached = cache.get(name);
    if (cached != null && cached.fetchedAt().plus(CACHE_TTL).isAfter(Instant.now())) {
      return cached.data();
    }

    try {
      byte[] data = restClient.get()
          .uri("https://minotar.net/skin/{name}", name)
          .retrieve()
          .body(byte[].class);

      if (data == null || data.length == 0) {
        throw new NotFoundException("Skin not found");
      }

      cache.put(name, new CachedSkin(data, Instant.now()));
      return data;
    } catch (NotFoundException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new NotFoundException("Skin not found");
    }
  }

  private record CachedSkin(byte[] data, Instant fetchedAt) {
  }
}
