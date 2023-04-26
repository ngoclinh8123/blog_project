function cleanEditorJS() {
  const editorBlock = document.querySelector("#editorjs");
  if (editorBlock) {
    const codexBlockRedundant = editorBlock.querySelector(".codex-editor");

    if (codexBlockRedundant) {
      editorBlock.removeChild(codexBlockRedundant);
    }
    const codexRedactor = document.querySelector(".codex-editor__redactor");
    console.log(codexRedactor);
  }
}
export { cleanEditorJS };
