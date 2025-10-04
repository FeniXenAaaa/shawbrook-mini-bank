package expo.modules.shawbrookmoduleauthentication

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import com.shawbrook.kotlin.secure.core.SecureCore
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.util.concurrent.Executor
import androidx.fragment.app.FragmentActivity

class AuthenticationActivity : AppCompatActivity(), KoinComponent {

    private val secureCore: SecureCore by inject()
    private lateinit var prefs: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.modal_fullscreen_layout)

        // Setup encrypted preferences
        val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
        prefs = EncryptedSharedPreferences.create(
            "secure_prefs",
            masterKeyAlias,
            this,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )

        val usernameInput: EditText = findViewById(R.id.input_username)
        val passwordInput: EditText = findViewById(R.id.input_password)
        val loginButton: Button = findViewById(R.id.closeButton)

        val existingToken = prefs.getString("auth_token", null)

        if (existingToken.isNullOrEmpty()) {
            // No token stored
            secureCore.setAuthentication("none")
            showLoginForm(usernameInput, passwordInput, loginButton)
        } else {
            // Try biometric authentication
            attemptBiometricAuth(existingToken)
        }
    }

    private fun showLoginForm(usernameInput: EditText, passwordInput: EditText, loginButton: Button) {
        usernameInput.isEnabled = true
        passwordInput.isEnabled = true
        loginButton.isEnabled = true

        loginButton.setOnClickListener {
            val username = usernameInput.text.toString().trim()
            val password = passwordInput.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Store a fake token for demo purposes
            val token = "token_${username}_${System.currentTimeMillis()}"
            prefs.edit().putString("auth_token", token).apply()

            // Attempt biometric authentication
            attemptBiometricAuth(token)
        }
    }

    private fun attemptBiometricAuth(token: String) {
        val biometricManager = BiometricManager.from(this)
        val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)

        val isEmulator = android.os.Build.FINGERPRINT.contains("generic") ||
                android.os.Build.MODEL.contains("Emulator") ||
                android.os.Build.MODEL.contains("Android SDK built for x86")

        if (canAuthenticate != BiometricManager.BIOMETRIC_SUCCESS && !isEmulator) {
            // Biometric not available
            handleToken(token)
            return
        }

        if (isEmulator) {
            // Skip biometric on emulator
            handleToken(token)
            return
        }

        val executor: Executor = ContextCompat.getMainExecutor(this)
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric Authentication")
            .setSubtitle("Authenticate to access your secure data")
            .setNegativeButtonText("Cancel")
            .build()

        val biometricPrompt = BiometricPrompt(this as FragmentActivity, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    handleToken(token)
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    finishWithResult(false)
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    finishWithResult(false)
                }
            })

        biometricPrompt.authenticate(promptInfo)
    }

    private fun handleToken(token: String) {
        // Here you can add logic to check if the token is expired
        val isExpired = token.contains("expired") // Placeholder check
        secureCore.setAuthentication(if (isExpired) "expired" else "authenticated")
        finishWithResult(!isExpired)
    }

    private fun finishWithResult(success: Boolean) {
        val resultIntent = Intent().apply {
            putExtra("isAuthenticated", success)
        }
        setResult(Activity.RESULT_OK, resultIntent)
        finish()
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }
}
