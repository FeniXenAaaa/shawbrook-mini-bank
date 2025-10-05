export interface IShawbrookAccount {
  name: string;
  //Number should be typed as IBAN for example
  number: string;
  //Balance could be stored as bigint + multiplier column
  //To unify cross-currency operations
  balance: string;
}

export type ShawbrookModuleNetworkingModuleEvents = {
  getAccounts: () => IShawbrookAccount[];
  getAccount: (id: string) => IShawbrookAccount;
  sendChatMessage: (message: string) => Promise<string>;
};
