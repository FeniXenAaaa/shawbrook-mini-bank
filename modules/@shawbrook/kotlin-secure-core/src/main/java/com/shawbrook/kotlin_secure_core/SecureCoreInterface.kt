package com.shawbrook.kotlin.secure.core

interface SecureCoreInterface {
    fun authenticate()
    fun clearAuthentication()
    fun getAuthenticationState(callback: (Boolean) -> Unit)
    fun storeValue(key: String, value: String)
    fun getValue(key: String): String?
    fun clearValue(key: String)
    fun fetch(url: String): String
}
