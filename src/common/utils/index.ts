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
            ${files.map(file => `<script src="${file}"></script>`).join('\n')}
        </body>
        </html>
    `;
}
