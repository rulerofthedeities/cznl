"use strict";
var firstWordSrc = { language: 'cz', word: 'pes', article: 'ten', genus: 'Ma' };
var firstWordTgt = { language: 'nl', word: 'hond', article: 'de', genus: '' };
var secondWordSrc = { language: 'cz', word: 'kočka', article: 'ta', genus: 'F' };
var secondWordTgt = { language: 'nl', word: 'kat', article: 'de', genus: '' };
exports.WORDS = [
    { src: firstWordSrc, tgt: firstWordTgt, categories: ['dieren', 'zoogdieren', 'huisdieren'] },
    { src: secondWordSrc, tgt: secondWordTgt, categories: ['dieren', 'zoogdieren', 'huisdieren'] }
];
//# sourceMappingURL=words.js.map