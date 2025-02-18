package com.example.be.common.domain.user.service;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.user.repository.UserRepository;
import com.example.be.common.domain.utils.oauth2.OAuth2UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Transient;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public User signupByOAuth(OAuth2UserInfo oAuth2UserInfo) {
        String email =  oAuth2UserInfo.getEmail().isEmpty()?oAuth2UserInfo.getEmail() :"not have email";
        String oauth2Id = getOauth2Id(oAuth2UserInfo);
        User user = User.builder()
                .username(oAuth2UserInfo.getName())
                .nickname(oAuth2UserInfo.getName() + oAuth2UserInfo.getProvider())
                .email(email)
                .oauth2Id(oauth2Id)
                .provider(oAuth2UserInfo.getProvider())
                .providerId(oAuth2UserInfo.getProviderId())
                .role(User.Role.COMMON)
                .password(oAuth2UserInfo.getName())
                .build();

        userRepository.save(user);
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(()->new NoSuchElementException("user not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public User findByOauth2Id(String oauth2Id) {
        return userRepository.findByOauth2Id(oauth2Id).orElseThrow(()->new NoSuchElementException("user not found"));
    }


    @Override
    @Transactional(readOnly = true)
    public boolean existByOauth2Id(String username) {
        return userRepository.existsByUsername(username);
    }

    private static String getOauth2Id(OAuth2UserInfo oAuth2UserInfo) {
        return oAuth2UserInfo.getProvider() + "_" + oAuth2UserInfo.getProviderId();
    }
}
