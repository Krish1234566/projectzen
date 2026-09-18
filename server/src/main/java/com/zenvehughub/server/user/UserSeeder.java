package com.zenvehughub.server.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class UserSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.user.email}")
    private String seedEmail;

    @Value("${app.seed.user.password}")
    private String seedPassword;

    @Value("${app.seed.user.name}")
    private String seedName;

    public UserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }
        if (!StringUtils.hasText(seedEmail) || !StringUtils.hasText(seedPassword)) {
            log.warn("No users exist yet and SEED_USER_EMAIL/SEED_USER_PASSWORD are not set - login will be impossible until a user is created.");
            return;
        }
        userRepository.save(new User(seedEmail, passwordEncoder.encode(seedPassword), seedName));
        log.info("Seeded initial user: {}", seedEmail);
    }
}
