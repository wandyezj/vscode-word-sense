import { logTrace } from "./logTrace";
import * as vscode from "vscode";
import { allDecorationTypes, getDecorationTypeHaiku } from "./getDecorationTypeWordSense";
import { isFileMarkdown } from "./isFileMarkdown";
import { WordSenseLintType } from "./WordSenseLintType";

/**
 * Update decorations for the active editor
 * @param activeEditor
 */
export function updateDecorations(activeEditor: vscode.TextEditor) {
    const filename = activeEditor.document.fileName;
    const isMarkdown = isFileMarkdown(filename);

    // Only operate on Markdown files
    if (isMarkdown) {
        //logTrace(`updateDecorations: start ${filename}`);
        //logTrace(filename);
        const document = activeEditor.document;
        const text = document.getText();

        //logTrace(`updateDecorations: blocks [${blocks.length}]`);

        const decorationsMap = getDecorations(text, document);

        // consolidate based on decoration Type first
        const consolidatedDecorations = new Map<
            string,
            {
                decorations: vscode.DecorationOptions[];
                decorationType: vscode.TextEditorDecorationType;
            }
        >();

        // initialize consolidatedDecorations
        // important that every entry shows up
        allDecorationTypes.forEach((value) => {
            const decorationType = value.decoration;
            if (decorationType !== undefined) {
                consolidatedDecorations.set(value.uid, { decorations: [], decorationType });
            }
        });

        for (const [lintType, decorations] of decorationsMap.entries()) {
            const { decoration, uid } = getDecorationTypeHaiku(lintType);
            if (decoration === undefined) {
                continue;
            }

            if (!consolidatedDecorations.has(uid)) {
                consolidatedDecorations.set(uid, { decorations: [], decorationType: decoration });
            }

            consolidatedDecorations.get(uid)?.decorations.push(...decorations);
        }

        for (const { decorations, decorationType } of consolidatedDecorations.values()) {
            activeEditor.setDecorations(decorationType, decorations);
        }

        logTrace("Wrote Decorations");
    }
}

/**
 * Get all decorations consolidated by HaikuLintType
 * @param blocks
 * @param document
 * @returns
 */
function getDecorations(
    text: string,
    document: vscode.TextDocument
): Map<WordSenseLintType, vscode.DecorationOptions[]> {
    // generate all lints for each block

    const found = analyzeText(text);
    const lints = found.map((lint) => {
        const positionStart = document.positionAt(lint.indexStart);
        const positionEnd = document.positionAt(lint.indexEnd);

        const range = new vscode.Range(positionStart, positionEnd);
        const hoverMessage = lint.message;
        const lintType = lint.lintType;

        return {
            lintType,
            range,
            hoverMessage,
        };
    });

    // consolidate by lint type
    const map = new Map<WordSenseLintType, vscode.DecorationOptions[]>();
    lints.forEach((lint) => {
        const kind = lint.lintType;
        if (!map.has(kind)) {
            map.set(kind, []);
        }

        map.get(kind)?.push({
            range: lint.range,
            hoverMessage: lint.hoverMessage,
        });
    });

    return map;
}

function analyzeText(text: string): {
    indexStart: number;
    indexEnd: number;
    message: string;
    lintType: WordSenseLintType;
}[] {
    return [];
}
