package com.shawbrook.kotlin.secure.core

enum class AuthState {
    NONE,           // No authentication
    AUTHENTICATED,  // Logged in
    EXPIRED         // Token expired / needs reauth
}

class SecureCore {
    @Volatile
    private var authState: AuthState = AuthState.NONE

    fun setAuthentication(state: String) {
        authState = when (state.lowercase()) {
            "authenticated" -> AuthState.AUTHENTICATED
            "expired" -> AuthState.EXPIRED
            else -> AuthState.NONE
        }
    }

    fun getAuthenticationState(): AuthState {
        return authState
    }
}
