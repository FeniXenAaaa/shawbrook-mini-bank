import { AuthenticationModulePayload } from "@/modules/@shawbrook/module-authentication/src/Authentication.types";
import AuthenticationModule from "@/modules/@shawbrook/module-authentication/src/AuthenticationModule";

export function addAuthenticationListener(
  listener: (event: AuthenticationModulePayload) => void,
) {
  return AuthenticationModule.addListener("onAuthenticationChange", listener);
}

export function authenticate() {
  return AuthenticationModule.initAuthentication();
}

export function getAuthenticationState() {
  return AuthenticationModule.getAuthenticationState();
}

export function signOut() {
  return AuthenticationModule.signOut();
}
