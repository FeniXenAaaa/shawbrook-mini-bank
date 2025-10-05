import { NativeModule, requireNativeModule } from 'expo';

import { IShawbrookAccount, ShawbrookModuleNetworkingModuleEvents } from './ShawbrookModuleNetworking.types';

declare class ShawbrookModuleNetworkingModule extends NativeModule<ShawbrookModuleNetworkingModuleEvents> {
  getAccounts(): Promise<IShawbrookAccount[]>;
  getAccount(id: string): Promise<IShawbrookAccount>
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ShawbrookModuleNetworkingModule>('ShawbrookModuleNetworking');
