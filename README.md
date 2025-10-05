# Welcome to Shawbrook Mini Banking App

## Features

1. **Biometric Authentication**  
   On app launch, the system checks for an existing token in secure storage. If a token exists, the app requests biometric authentication. After 3 unsuccessful attempts, it falls back to a hardcoded PIN code.  
   If no token is present, the login form is displayed (Firebase authentication).

2. **Dashboard with Account List**
  - Account name (e.g., "Savings")
  - Account number
  - Balance

3. **Account Details Page**

4. **Chat Widget on Each Page**  
   Chat communication is handled by a native Networking Module. It sends messages to a Firebase Function for input sanitization, then forwards them to Gen Kit.  
   Chat history is stored in memory on the native side.

5. **Theme Support**  
   Dark and light modes can be switched from the side menu.

6. **Code Quality**  
   ESLint and Prettier are configured for consistent coding standards.

## Native Modules

### Secure Core

A native-only module that underpins all sensitive operations.  
It tracks the current authentication state and ensures secure handling of sensitive data.

### Authentication Module

Responsible for displaying the PIN Entry screen, login form, and biometric prompts.  
All sensitive operations are executed within this module, without JavaScript involvement.

### Networking Module

Handles all network requests.  
It verifies the Secure Core authentication state before performing any network operations.

### Things to improve

Things that are good to implement but too big in scope of this demo:
1. AI Chat should be using Sockets for real-time LLM answers
2. Firebase endppints and keys should be taken from .env during build
3. Some components (for example, drawer) could be moved to own folders or split better
4. AsyncStorage access (for example, to get latest Theme settings) should be routed through custom Storage Module

## Diagrams

HLD:

![HLD](https://res.cloudinary.com/dst53uohh/image/upload/v1759701193/hld.drawio_o39fcp.png "HLD")

LLD:

![LLD](https://res.cloudinary.com/dst53uohh/image/upload/v1759701193/lld.drawio_pdy7v3.png "LLD")

## Video

(Biometrics can't be screen recorded, 31-42 seconds)
[Watch the demo video](https://res.cloudinary.com/dst53uohh/video/upload/v1759702829/video_2025-10-06_00-17-58_lderbt.mp4)
