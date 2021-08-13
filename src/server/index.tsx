import App from "client/App";
import express from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

let assetsImport: GenericObject;
import(process.env.RAZZLE_ASSETS_MANIFEST!).then((res) => {
  assetsImport = res.default;
});

const cssLinksFromAssets = (assets: GenericObject, entryPoint: string) =>
  (assets && assets[entryPoint]?.css?.map((asset: string) => `<link rel="stylesheet" href="${asset}">`).join("")) || "";

const jsScriptTagsFromAssets = (assets: GenericObject, entryPoint: string, extra = "") =>
  (assets && assets[entryPoint]?.js.map((asset: string) => `<script src="${asset}"${extra}></script>`).join("")) || "";

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get("/*", (req, res) => {
    const context: { url?: string } = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>,
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `
        <!doctype html>
        <html lang="">
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charset="utf-8" />
            <title>Welcome to Razzle</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${cssLinksFromAssets(assetsImport, "client")}
        </head>
        <body>
            <div id="root">${markup}</div>
            ${jsScriptTagsFromAssets(assetsImport, "client", " defer crossorigin")}
        </body>
        </html>
`,
      );
    }
  });

export default server;
