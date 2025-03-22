package com.example.be.common.domain.utils.userDetatils;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username == null || username.isEmpty()) {
            log.error("사용자 이름이 null 또는 빈 문자열입니다.");
            throw new UsernameNotFoundException("사용자 이름이 제공되지 않았습니다.");
        }

        Optional<User> byUsername = userRepository.findByUsername(username);
        if (byUsername.isPresent()) {
            return new UserDetailsImpl(byUsername.get());
        }
        
        log.warn("사용자를 찾을 수 없습니다: {}", username);
        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
