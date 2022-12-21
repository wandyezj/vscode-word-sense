import * as vscode from "vscode";
import { WordSenseLintType } from "./WordSenseLintType";

/**
 * just shows hover text
 */
const decorationNone = {
    uid: "none",
    decoration: vscode.window.createTextEditorDecorationType({
        //textDecoration: "none",
    }),
};

const decorationUnderlineWavyYellow = {
    uid: "underline wavy yellow",
    decoration: vscode.window.createTextEditorDecorationType({
        textDecoration: "underline wavy yellow",
    }),
};

const decorationUnderlineYellow = {
    uid: "underline yellow",
    decoration: vscode.window.createTextEditorDecorationType({
        textDecoration: "underline yellow",
    }),
};

const decorationUndefined = {
    uid: "undefined",
    decoration: undefined,
};

export interface DecorationType {
    decoration: vscode.TextEditorDecorationType | undefined;
    uid: string;
}

const lintToDecorationType = new Map<WordSenseLintType, DecorationType>([
    [WordSenseLintType.Warn, decorationUnderlineWavyYellow],
]);

export const allDecorationTypes = Array.from(lintToDecorationType.values()).filter(
    (value, index, array) => array.indexOf(value) === index
);

const decorationDefault = decorationUnderlineWavyYellow;

export function getDecorationTypeHaiku(type: WordSenseLintType): DecorationType {
    const decorationType = lintToDecorationType.get(type);

    if (decorationType === undefined) {
        return decorationDefault;
    }

    return decorationType;
}
