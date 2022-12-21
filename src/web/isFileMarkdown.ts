export function isFileMarkdown(filename: string): boolean {
    const isFileMarkdown = filename.endsWith(".md");
    return isFileMarkdown;
}

// import * as vscode from "vscode";

// export function isMarkdownEditor(editor: vscode.TextEditor) {
//     return isFileMarkdown(editor.document.fileName);
// }
