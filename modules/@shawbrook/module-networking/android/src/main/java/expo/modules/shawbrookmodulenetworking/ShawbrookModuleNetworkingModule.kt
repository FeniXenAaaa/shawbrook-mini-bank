package expo.modules.shawbrookmodulenetworking

import android.content.Context
import android.util.Log
import com.shawbrook.kotlin.secure.core.SecureCore
import com.shawbrook.kotlin.secure.core.AuthState
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.runBlocking
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import org.json.JSONObject
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

data class ShawbrookAccount(
    val name: String,
    val number: String,
    val balance: String
)

class SessionExpiredException(message: String) : Exception(message)

class ShawbrookModuleNetworkingModule : Module(), KoinComponent {

    private val context: Context
        get() = requireNotNull(appContext.reactContext) { "React context is null" }

    private val secureCore: SecureCore by inject()
    private val chatHistory = mutableListOf<String>()
    private val client = OkHttpClient()

    private val chatFunctionUrl = "https://chatwithai-d7v7lwz7oa-uc.a.run.app"

    override fun definition() = ModuleDefinition {
        Name("ShawbrookModuleNetworking")

        AsyncFunction("getAccounts") {
            ensureAuthenticated()
            getMockAccounts().map { it.toMap() }
        }

        AsyncFunction("getAccount") { id: String ->
            ensureAuthenticated()
            val account = getMockAccounts().find { it.number == id }
                ?: throw Exception("Account not found: $id")
            account.toMap()
        }

        AsyncFunction("sendChatMessage") { message: String ->
            ensureAuthenticated()
            if (message.isBlank()) throw Exception("Message cannot be empty")

            chatHistory.add("You: $message")

            val reply = try {
                val aiReply = runBlocking {
                    callChatWithAI(message)
                }
                chatHistory.add("AI: $aiReply")
                aiReply
            } catch (e: Exception) {
                Log.e("ShawbrookNetworking", "Failed to call chatWithAI", e)
                val errorReply = "AI: Error fetching response"
                chatHistory.add(errorReply)
                errorReply
            }

            reply
        }

        AsyncFunction("getChatHistory") {
            chatHistory.toList()
        }
    }

    private fun callChatWithAI(message: String): String {
        val json = JSONObject().apply {
            put("data", message)
        }

        val body = RequestBody.create(
            "application/json".toMediaTypeOrNull(),
            json.toString()
        )

        val request = Request.Builder()
            .url(chatFunctionUrl)
            .post(body)
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw Exception("Unexpected response code: ${response.code}")
            }

            val responseBody = response.body?.string().orEmpty()
            Log.i("ShawbrookNetworking", "Response: $responseBody")

            val data = JSONObject(responseBody)
            return data.optString("result", "No reply from AI")
        }
    }


    private fun ensureAuthenticated() {
        val state = secureCore.getAuthenticationState()
        if (state != AuthState.AUTHENTICATED) {
            throw SessionExpiredException("Session expired or not authenticated")
        }
    }


    private fun getMockAccounts(): List<ShawbrookAccount> {
        return listOf(
            ShawbrookAccount("Personal Savings Account", "10000123", "12500.50"),
            ShawbrookAccount("Business Account", "20000999", "84500.00"),
            ShawbrookAccount("ISA Account", "30000777", "2500.75")
        )
    }

    private fun ShawbrookAccount.toMap(): Map<String, Any> {
        return mapOf(
            "name" to name,
            "number" to number,
            "balance" to balance
        )
    }
}
