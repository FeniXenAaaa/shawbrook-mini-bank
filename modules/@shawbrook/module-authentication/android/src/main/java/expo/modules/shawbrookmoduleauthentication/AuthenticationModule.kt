package expo.modules.shawbrookmoduleauthentication

import android.content.Intent
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import com.shawbrook.kotlin.secure.core.SecureCore
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

const val AUTH_ACTIVITY_REQUEST_CODE = 99

class AuthenticationModule : Module(), KoinComponent {
    private val secureCore: SecureCore by inject()

    override fun definition() = ModuleDefinition {
        Name("AuthenticationModule")
        Events("onAuthenticationChange")

        // Set authentication state: "none" | "authenticated" | "expired"
        AsyncFunction("setAuthentication") { state: String ->
            secureCore.setAuthentication(state)
            sendEvent("onAuthenticationChange", mapOf("authenticationState" to state))
        }

        // Get current authentication state
        AsyncFunction("getAuthenticationState") {
            secureCore.getAuthenticationState().name.lowercase()
        }

        // Launch full authentication flow
        AsyncFunction("initAuthentication") {
            launchAuthenticationFlow()
        }

        // Sign out: clear token, reset state, and re-init auth
        AsyncFunction("signOut") {
            clearTokenAndResetState()
            launchAuthenticationFlow()
        }

        OnActivityResult { _, payload ->
            val isAuthenticated = payload?.data?.getBooleanExtra("isAuthenticated", false) ?: false
            val state = if (isAuthenticated) "authenticated" else "expired"
            secureCore.setAuthentication(state)
            sendEvent("onAuthenticationChange", mapOf("authenticationState" to state))
        }
    }

    private fun launchAuthenticationFlow() {
        val activity = appContext.currentActivity ?: return
        val intent = Intent(activity, AuthenticationActivity::class.java)
        activity.startActivityForResult(intent, AUTH_ACTIVITY_REQUEST_CODE)
        activity.overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }

    private fun clearTokenAndResetState() {
        val activity = appContext.currentActivity ?: return

        // Clear encrypted token
        val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
        val prefs = EncryptedSharedPreferences.create(
            "secure_prefs",
            masterKeyAlias,
            activity,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
        prefs.edit().remove("auth_token").apply()

        secureCore.setAuthentication("none")
        sendEvent("onAuthenticationChange", mapOf("authenticationState" to "none"))
    }
}
