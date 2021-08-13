import express from "express";

// eslint-disable-next-line @typescript-eslint/no-var-requires
let app = require("./server").default;

if (module.hot) {
  module.hot.accept("./server", async function () {
    console.log("🔁  HMR Reloading `./server`...");
    try {
      const updatedApp = await import("./server");
      app = updatedApp.default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info("✅  Server-side HMR Enabled!");
}

const port = process.env.PORT || 3000;

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(port, function () {
    console.log(`🚀 Started on port ${port}`);
  });
