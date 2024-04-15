const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({
  timeout: 10000, // Timeout in Millisekunden
});
const app = express();

var cors = require("cors");
app.use(cors());

proxy.on("proxyReq", function (proxyReq, req, res, options) {
  console.log("Proxying request to:", options.target);
});

app.use("/", (req, res) => {
  proxy.web(req, res, { target: "http://192.168.188.48" }); // Ziel-IP-Adresse deines ESP32
});

app.listen(3000, () => {
  console.log("Proxy server running on port 3000");
});
