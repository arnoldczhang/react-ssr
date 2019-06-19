import { CO } from "../types";

export function htmlTemplate(
  reactDom: string,
  reduxState: CO,
  helmetData: CO,
  files: Array<string>,
) {
  const ssr = Math.random() > 0.5;
  console.log("ssr", ssr);
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            ${helmetData.title.toString()}
            ${helmetData.meta.toString()}
            <title>React SSR</title>
        </head>
        
        <body>
            <div id="app">${ssr ? reactDom : ""}</div>
            <script>
                window.REDUX_DATA = ${JSON.stringify(reduxState)}
                window.__SSR__ = ${ssr};
            </script>
            <script src="${files[0] || './runtime.js'}"></script>
            <script src="${files[1] || './vendors.js'}"></script>
            <script src="${files[2] || './app.js'}"></script>
        </body>
        </html>
    `;
}
