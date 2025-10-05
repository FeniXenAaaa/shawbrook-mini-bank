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
import org.koin.core.component.KoinComponent
import java.util.concurrent.Executor
import androidx.fragment.app.FragmentActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class AuthenticationActivity : AppCompatActivity(), KoinComponent {

    private lateinit var prefs: SharedPreferences
    private val client = OkHttpClient()
    private val FIREBASE_API_KEY = "AIzaSyC4M2sT9vVzaEwt8mKjANrbpN5Ys1nYd8M"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.modal_fullscreen_layout)

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
            showLoginForm(usernameInput, passwordInput, loginButton)
        } else {
            attemptBiometricAuth(existingToken)
        }
    }

    private fun showLoginForm(usernameInput: EditText, passwordInput: EditText, loginButton: Button) {
        usernameInput.isEnabled = true
        passwordInput.isEnabled = true
        loginButton.isEnabled = true

        loginButton.setOnClickListener {
            //TODO: Validate input with valiktor or Konform (or any other validation library)
            val email = usernameInput.text.toString().trim()
            val password = passwordInput.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            CoroutineScope(Dispatchers.IO).launch {
                val token = signInWithEmailPassword(email, password)
                runOnUiThread {
                    if (token != null) {
                        prefs.edit().putString("auth_token", token).apply()
                        finishWithResult(true)
                    } else {
                        Toast.makeText(this@AuthenticationActivity, "Login failed", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    private fun attemptBiometricAuth(token: String) {
        val biometricManager = BiometricManager.from(this)
        val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)

        val isEmulator = android.os.Build.FINGERPRINT.contains("generic") ||
                android.os.Build.MODEL.contains("Emulator") ||
                android.os.Build.MODEL.contains("Android SDK built for x86")

        if (canAuthenticate != BiometricManager.BIOMETRIC_SUCCESS && !isEmulator) {
            finishWithResult(true)
            return
        }

        if (isEmulator) {
            finishWithResult(true)
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
                    finishWithResult(true)
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

    private fun finishWithResult(success: Boolean) {
        val resultIntent = Intent().apply {
            putExtra("isAuthenticated", success)
        }
        setResult(Activity.RESULT_OK, resultIntent)
        finish()
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }

    private fun signInWithEmailPassword(email: String, password: String): String? {
        //TODO: Move firebase api key to .env + app.config.ts
        return try {
            val url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$FIREBASE_API_KEY"
            val jsonBody = JSONObject().apply {
                put("email", email)
                put("password", password)
                put("returnSecureToken", true)
            }

            val body = jsonBody.toString().toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
            val request = Request.Builder().url(url).post(body).build()

            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) return null
                val responseBody = response.body?.string() ?: return null
                val jsonResponse = JSONObject(responseBody)
                jsonResponse.getString("idToken")
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
