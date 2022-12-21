// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as Package from "../../package.json";
import { createCommandVersion } from "./createCommandVersion";
import {
    createUpdateDecorationsTrigger,
    triggerUpdateDecorations,
} from "./createUpdateDecorationsTrigger";
import { createTrace, logTrace } from "./logTrace";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(`${Package.name} ${Package.version} is now active`);

    // Global trace see in Output -> poems
    createTrace(`${Package.name}`);
    const start = Date.now();
    logTrace(`activate ${Package.name} ${Package.version}`);

    context.subscriptions.push(
        ...[
            createCommandVersion(),

            // When in a markdown file activate
            // parse markdown file loop for ```poems-haiku ``` sections and analyze the poems within applying highlighting
            ...createUpdateDecorationsTrigger(),
        ]
    );

    // slows down startup if this callback takes a while
    triggerUpdateDecorations();

    const end = Date.now();
    const time = end - start;
    logTrace(`activated in ${time} ms`);
}

// this method is called when your extension is deactivated
export function deactivate() {
    // nothing
}
