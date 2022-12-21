import * as vscode from "vscode";
import * as Package from "../../package.json";

export function createCommandVersion() {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("word-sense.version", () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage(`${Package.name} ${Package.version}`);
    });
    return disposable;
}
