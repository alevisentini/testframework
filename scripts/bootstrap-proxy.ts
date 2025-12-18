import { setGlobalDispatcher, ProxyAgent } from "undici";

// const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const proxyUrl = process.env.HTTP_PROXY;

if (!proxyUrl) {
  throw new Error("HTTPS_PROXY or HTTP_PROXY is not defined");
}

setGlobalDispatcher(new ProxyAgent(proxyUrl));

console.log("🌐 Undici global proxy configured:", proxyUrl);
