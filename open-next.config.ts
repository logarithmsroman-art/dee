const config = {
  default: {
    runtime: "edge",
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
};

export default config;
