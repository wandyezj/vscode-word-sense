import { getWordWithoutPunctuation } from "../src/web/getWordWithoutPunctuation";

describe("getWordWithoutPunctuation", () => {
    const tests: [string, string, string][] = [
        ["no change", "word", "word"],
        ["single punctuation", "word,", "word"],
        ["multiple punctuation", "word,,", "word"],
    ];

    tests.forEach(([name, input, expectedOutput]) => {
        test(name, () => {
            const actualOutput = getWordWithoutPunctuation(input);
            expect(actualOutput).toBe(expectedOutput);
        });
    });
});
