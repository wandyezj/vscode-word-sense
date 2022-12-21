import * as vscode from "vscode";
import { updateDecorations } from "./updateDecorations";

interface Throttle {
    callback: () => void;
    milliseconds: number;
    timeout: NodeJS.Timer | undefined;
}

/**
 * Triggers update 500 milliseconds after last edit if throttled.
 * This prevents continuous triggering of updateDecorations.
 */
function throttleCallback(o: Throttle) {
    if (o.timeout) {
        clearTimeout(o.timeout);
        o.timeout = undefined;
    }

    o.timeout = setTimeout(() => {
        o.callback();
    }, o.milliseconds);
}

/**
 * currently active text editor, can only edit in a single editor at a time.
 */
let activeEditor = vscode.window.activeTextEditor;

const updateDecorationsThrottle: Throttle = {
    callback: () => {
        if (activeEditor !== undefined) {
            updateDecorations(activeEditor);
        }
    },
    milliseconds: 500,
    timeout: undefined,
};

export function triggerUpdateDecorations() {
    throttleCallback(updateDecorationsThrottle);
}

/**
 * To be called once
 * @param param0
 * @returns
 */
export function createUpdateDecorationsTrigger() {
    const disposables: vscode.Disposable[] = [];

    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        },
        null,
        disposables
    );

    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        },
        null,
        disposables
    );

    return disposables;
}
