package com.kuro.craft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

import com.kuro.craft.security.JwtFilter;
import com.kuro.craft.security.JwtService;

@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http, JwtService jwtService) throws Exception {
    PathPatternRequestMatcher.Builder patterns = PathPatternRequestMatcher.withDefaults();

    return http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .headers(h -> h.frameOptions(f -> f.sameOrigin()))
        .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
        .authorizeHttpRequests(a -> a
            .requestMatchers(patterns.matcher("/h2-console/**")).permitAll()
            .requestMatchers(patterns.matcher("/error")).permitAll()
            .requestMatchers(patterns.matcher(HttpMethod.POST, "/api/auth/login")).permitAll()
            .requestMatchers(patterns.matcher(HttpMethod.POST, "/api/actions/raw")).hasRole("ADMIN")
            .requestMatchers(patterns.matcher(HttpMethod.GET, "/api/audit")).hasRole("ADMIN")
            .requestMatchers(patterns.matcher(HttpMethod.POST, "/api/admins")).hasRole("ADMIN")
            .requestMatchers(patterns.matcher(HttpMethod.POST, "/api/actions/**")).hasAnyRole("MODERATOR", "ADMIN")
            .requestMatchers(patterns.matcher(HttpMethod.GET, "/api/**")).hasAnyRole("VIEWER", "MODERATOR", "ADMIN")
            .anyRequest().denyAll())
        .addFilterBefore(new JwtFilter(jwtService), UsernamePasswordAuthenticationFilter.class)
        .build();
  }
}
