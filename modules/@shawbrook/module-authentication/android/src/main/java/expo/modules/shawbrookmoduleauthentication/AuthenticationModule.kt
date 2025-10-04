package expo.modules.shawbrookmoduleauthentication

import android.content.Intent
import com.shawbrook.kotlin.secure.core.SecureCore
import com.shawbrook.kotlin.secure.core.AuthState
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
            sendEvent("onAuthenticationChange", mapOf("authState" to state))
        }

        // Get current authentication state
        AsyncFunction("getAuthenticationState") {
            secureCore.getAuthenticationState().name.lowercase()
        }

        // Launch full authentication flow
        AsyncFunction("initAuthentication") {
            launchAuthenticationFlow()
        }

        // Handle result from AuthenticationActivity
        OnActivityResult { _, payload ->
            val isAuthenticated = payload?.data?.getBooleanExtra("isAuthenticated", false) ?: false
            val state = if (isAuthenticated) "authenticated" else "expired"
            secureCore.setAuthentication(state)
            sendEvent("onAuthenticationChange", mapOf("authState" to state))
        }
    }

    private fun launchAuthenticationFlow() {
        val activity = appContext.currentActivity ?: return
        val intent = Intent(activity, AuthenticationActivity::class.java)
        activity.startActivityForResult(intent, AUTH_ACTIVITY_REQUEST_CODE)
        activity.overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }
}
