import { NativeModule, requireNativeModule } from 'expo';

import { AuthenticationModuleEvents } from './Authentication.types';

declare class AuthenticationModule extends NativeModule<AuthenticationModuleEvents> {
  isAuthenticated: boolean;
  authenticate(): Promise<boolean>;
  signOut(): Promise<void>;
}

export default requireNativeModule<AuthenticationModule>('AuthenticationModule');
