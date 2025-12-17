import { setGlobalDispatcher, ProxyAgent } from "undici";

if (process.env.HTTPS_PROXY) {
  setGlobalDispatcher(
    new ProxyAgent(process.env.HTTPS_PROXY)
  );

  console.log("🌐 Global HTTPS proxy configured:", process.env.HTTPS_PROXY);
}
