"use strict";
var firstWordCz = { language: 'cz', word: 'pes', article: 'ten', genus: 'Ma' };
var firstWordNl = { language: 'nl', word: 'hond', article: 'de', genus: '' };
var secondWordCz = { language: 'cz', word: 'kočka', article: 'ta', genus: 'F' };
var secondWordNl = { language: 'nl', word: 'kat', article: 'de', genus: '' };
exports.WORDS = [
    { cz: firstWordCz, nl: firstWordNl, tpe: 'noun', categories: ['dieren', 'zoogdieren', 'huisdieren'] },
    { cz: secondWordCz, nl: secondWordNl, tpe: 'noun', categories: ['dieren', 'zoogdieren', 'huisdieren'] }
];
//# sourceMappingURL=words.js.map