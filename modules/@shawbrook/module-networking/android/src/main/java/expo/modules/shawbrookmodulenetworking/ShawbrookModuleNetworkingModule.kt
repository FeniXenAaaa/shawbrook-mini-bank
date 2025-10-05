package expo.modules.shawbrookmodulenetworking

import com.shawbrook.kotlin.secure.core.SecureCore
import com.shawbrook.kotlin.secure.core.AuthState
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

data class ShawbrookAccount(
    val name: String,
    val number: String,
    val balance: String
)

class SessionExpiredException(message: String) : Exception(message)

class ShawbrookModuleNetworkingModule : Module(), KoinComponent {
    private val secureCore: SecureCore by inject()

    override fun definition() = ModuleDefinition {
        Name("ShawbrookModuleNetworking")

        AsyncFunction("getAccounts") {
            ensureAuthenticated()
            getMockAccounts().map { account ->
                mapOf(
                    "name" to account.name,
                    "number" to account.number,
                    "balance" to account.balance
                )
            }
        }

        AsyncFunction("getAccount") { id: String ->
            ensureAuthenticated()
            val account = getMockAccounts().find { it.number == id }
                ?: throw Exception("Account not found: $id")
            mapOf(
                "name" to account.name,
                "number" to account.number,
                "balance" to account.balance
            )
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

