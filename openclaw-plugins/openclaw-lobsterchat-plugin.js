/*
* put in plugins folder than install it into openclaw
* openclaw plugins install ./path/to/your-plugin
*/

const myChannel = {
  id: "myapp",
  meta: { label: "MyApp", selectionLabel: "MyApp", docsPath: "/channels/myapp", blurb: "local app channel" },
  capabilities: { chatTypes: ["direct"] },
  config: {
    listAccountIds: (cfg) => Object.keys(cfg.channels?.myapp?.accounts ?? {}),
    resolveAccount: (cfg, accountId) => cfg.channels?.myapp?.accounts?.[accountId ?? "default"] ?? { accountId },
  },
  outbound: {
    deliveryMode: "direct",
    sendText: async ({ text, to, account }) => {
      // POST to http://localhost:3000/openclaw/deliver (your server)
      return { ok: true };
    },
  },
};

export default function (api) {
  api.registerChannel({ plugin: myChannel });
}