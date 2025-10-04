import { NativeModule, requireNativeModule } from 'expo';

import { AuthenticationModuleEvents } from './Authentication.types';

declare class AuthenticationModule extends NativeModule<AuthenticationModuleEvents> {
  isAuthenticated: boolean;
  authenticate(): Promise<boolean>;
}

export default requireNativeModule<AuthenticationModule>('AuthenticationModule');
