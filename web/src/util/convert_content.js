import edjsHTML from "editorjs-html";
function convertContent(content) {
  const edjsParser = edjsHTML();
  if (content) {
    const html = edjsParser.parse(JSON.parse(content));
    content = html;
  }

  return content;
}

export default convertContent;
