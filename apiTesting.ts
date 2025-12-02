// @ts-nocheck

const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");

// Proxy corporativo
const proxy = "http://10.4.7.240:3128";
const agent = new HttpsProxyAgent(proxy);

async function obtenerUsuarios() {
  const respuesta = await fetch("https://jsonplaceholder.typicode.com/users", {
    agent,
    timeout: 15000,
  });

  const data = await respuesta.json();
  console.log(data);
}

obtenerUsuarios().catch(console.error);
