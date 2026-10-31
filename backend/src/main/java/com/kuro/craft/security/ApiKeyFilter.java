package com.kuro.craft.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ApiKeyFilter extends OncePerRequestFilter {

  private final byte[] expectedKey;

  public ApiKeyFilter(String apiKey) {
    this.expectedKey = apiKey.getBytes(StandardCharsets.UTF_8);
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if (request.getRequestURI().startsWith("/api/bridge/")) {
      String provided = request.getHeader("X-API-Key");
      boolean matches = provided != null
          && MessageDigest.isEqual(provided.getBytes(StandardCharsets.UTF_8), expectedKey);

      if (matches) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            "bridge", null, List.of(new SimpleGrantedAuthority("ROLE_BRIDGE")));
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } else if (SecurityContextHolder.getContext().getAuthentication() == null) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }
    }

    filterChain.doFilter(request, response);
  }
}
