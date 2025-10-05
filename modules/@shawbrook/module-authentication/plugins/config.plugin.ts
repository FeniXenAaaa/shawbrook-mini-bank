import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import withAuthenticationActivity from "./authenticationActivity.plugin";
import withBuild from "./build.plugin";
import withKoin from "./koin.plugin";
import withSecureCore from "./secure-core.plugin";
import withPinEntryActivity from "@/modules/@shawbrook/module-authentication/plugins/pinEntryActivity.plugin";

const withExpoAuthenticationPlugins: ConfigPlugin = (config) => {
  return withPlugins(config, [
    withKoin,
    withSecureCore,
    withBuild,
    withAuthenticationActivity,
    withPinEntryActivity,
  ]);
};

export default withExpoAuthenticationPlugins;
