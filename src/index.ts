import config from "#Config.js"
import NTFYProxy from "#NTFYProxy.js";

for (const handler of config.handlers) {
  new NTFYProxy(handler);
}
