package com.shawbrook.kotlin.secure.core

enum class AuthState {
    NONE,           // No authentication
    AUTHENTICATED,  // Logged in
    EXPIRED         // Token expired / needs reauth
}

class SecureCore {

    // Simple in-memory auth state
    @Volatile
    private var authState: AuthState = AuthState.NONE

    // Set authentication state manually
    fun setAuthentication(state: String) {
        authState = when (state.lowercase()) {
            "authenticated" -> AuthState.AUTHENTICATED
            "expired" -> AuthState.EXPIRED
            else -> AuthState.NONE
        }
    }

    // Return current authentication state
    fun getAuthenticationState(): AuthState {
        return authState
    }
}
