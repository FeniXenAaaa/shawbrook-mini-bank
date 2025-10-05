import { requireNativeModule } from "expo";
import { ShawbrookModuleNetworkingModuleEvents } from "./ShawbrookModuleNetworking.types";

export default requireNativeModule<ShawbrookModuleNetworkingModuleEvents>(
  "ShawbrookModuleNetworking",
);
