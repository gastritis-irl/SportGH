package edu.codespring.sportgh.config;

import edu.codespring.sportgh.security.FirebaseAuthenticationProvider;
import edu.codespring.sportgh.security.FirebaseAuthenticationTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final FirebaseAuthenticationProvider fbAuthProvider;

    private final FirebaseAuthenticationTokenFilter fbAuthTokenFilter;

    @SuppressWarnings("PMD.SignatureDeclareThrowsException")
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
                // general restrictions
                .requestMatchers(HttpMethod.OPTIONS).permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/categories/**",
                    "/api/subcategories/**",
                    "/api/products/**",
                    "/api/images/**"
                ).permitAll()
                // users
                .requestMatchers(
                    HttpMethod.POST,
                        "/api/auth/signup",
                        "/api/auth/login"
                ).permitAll()
                .requestMatchers(
                    HttpMethod.GET, "/api/users/**"
                ).hasAnyRole("USER", "ADMIN")
                .requestMatchers(
                    HttpMethod.PUT, "/api/users/**"
                ).hasAnyRole("USER", "ADMIN")
                // products
                .requestMatchers("/api/products/**").hasAnyRole("USER", "ADMIN")
                // images
                .requestMatchers("/api/images/**").hasAnyRole("USER", "ADMIN")
                // rent
                .requestMatchers("/api/rent/**").hasAnyRole("USER", "ADMIN")
                // admin
                .requestMatchers("/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(fbAuthTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(fbAuthProvider);
    }
}
