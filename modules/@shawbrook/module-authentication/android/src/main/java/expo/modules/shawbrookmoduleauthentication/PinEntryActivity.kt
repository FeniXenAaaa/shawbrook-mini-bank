package expo.modules.shawbrookmoduleauthentication

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.GridLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class PinEntryActivity : AppCompatActivity() {

  private val PIN_CODE = "2580"
  private var enteredPin = ""

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_pin_entry)

    val pinDisplay: TextView = findViewById(R.id.pin_display)
    val grid: GridLayout = findViewById(R.id.gridLayout) ?: return

    for (i in 0 until grid.childCount) {
      val button = grid.getChildAt(i) as Button
      button.setOnClickListener { handlePinClick(button.text.toString(), pinDisplay) }
    }
  }

  private fun handlePinClick(value: String, display: TextView) {
    when (value) {
      "OK" -> {
        if (enteredPin == PIN_CODE) {
          returnResult(true)
        } else {
          Toast.makeText(this, "Incorrect PIN", Toast.LENGTH_SHORT).show()
          enteredPin = ""
          updateDisplay(display)
        }
      }
      "⌫" -> {
        if (enteredPin.isNotEmpty()) {
          enteredPin = enteredPin.dropLast(1)
          updateDisplay(display)
        }
      }
      else -> {
        if (enteredPin.length < PIN_CODE.length) {
          enteredPin += value
          updateDisplay(display)
        }
      }
    }
  }

  private fun updateDisplay(display: TextView) {
    display.text = "●".repeat(enteredPin.length) + "○".repeat(PIN_CODE.length - enteredPin.length)
  }

  private fun returnResult(success: Boolean) {
    val resultIntent = Intent().apply {
      putExtra("pinSuccess", success)
    }
    setResult(Activity.RESULT_OK, resultIntent)
    finish()
  }
}
