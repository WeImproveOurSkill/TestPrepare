package com.example.usersservice.utils.userDetailsImpl;

import com.example.usersservice.entiry.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

@Getter
public class UserDetailsImpl implements UserDetails, OAuth2User {

    private User user;
    private Map<String, Objects> attributes;

    public UserDetailsImpl(User user) {
        this.user = user;
    }


    public UserDetailsImpl(User user, Map<String, Objects> attributes) {
        this.user = user;
        this.attributes = attributes;
    }


    @Override
    public <A> A getAttribute(String name) {
        return attributes != null ? (A) attributes.get(name) : null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        ArrayList<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return String.valueOf(user.getRole());
            }
        });
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public String getName() {
        return user.getNickname();
    }

}
