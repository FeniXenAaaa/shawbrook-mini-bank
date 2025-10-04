export type AuthenticationModuleEvents = {
  onAuthenticationChange: (params: AuthenticationModulePayload) => void;
};

export type AuthenticationModulePayload = {
  authenticationState: "none" | "authenticated" | "expired";
};
