import _ from 'lodash';
import pinyin from 'pinyin';
import { isRhyme } from './rhymeHelper';

const webdictWithFreq = require('../data/webdict_with_freq.json');

const defaultMinFrequency = 5000;
const defaultMaxFrequency = Number.MAX_SAFE_INTEGER;

// This returns an array of array of spellings (because of multi-sounded words)
// getSpelling('你好') => [ [ 'ni3' ], [ 'hao3' ] ]
const getSpelling = word => pinyin(word, { style: pinyin.STYLE_TONE2 });

// This returns an array of array of consonants (because of multi-sounded words)
// getConsonant('你好') => [ [ 'n' ], [ 'h' ] ]
const getConsonant = word => pinyin(word, { style: pinyin.STYLE_INITIALS });

// This returns an array of compound vowels.
// getConsonant('你好') => [ 'i3', 'ao3' ]
const getCompoundVowels = word => (
  getSpelling(word).map((spellingArr, index) => {
    const spelling = spellingArr[0];
    const consonant = getConsonant(word[index])[0][0];
    return spelling.slice(consonant.length);
  })
);

// This returns an array of pinyin.
// [ { consonants: 'n', compoundVowels: 'i3' },
//   { consonants: 'h', compoundVowels: 'ao3' } ]
const getPinyin = word => (
  word.split('').map(cur => ({
    consonants: getConsonant(cur)[0][0],
    compoundVowels: getCompoundVowels(cur)[0],
  }))
);

let pinyin0;

// Checks whether candidate word returns an array of pinyin.
const check = (candidateFrequency, candidateWord, minFrequency, maxFrequency) => (
  candidateFrequency >= minFrequency &&
  candidateFrequency <= maxFrequency &&
  isRhyme(pinyin0, getPinyin(candidateWord))
);

// This returns the rhymes for the given word.
// [ { word: '好', frequency: 2180925 },
//   { word: '少', frequency: 509309 },
//   { word: '不少', frequency: 400942 },
//   { word: '找', frequency: 387910 }, ...]
const getRhyme = (word, options = {}) => {
  const { minFrequency = defaultMinFrequency, maxFrequency = defaultMaxFrequency } = options;

  pinyin0 = getPinyin(word);

  const resultArr = _.reduce(webdictWithFreq, (acc, candidateFrequency, candidateWord) =>
    (check(candidateFrequency, candidateWord, minFrequency, maxFrequency) ?
      acc.concat([{ candidateWord, candidateFrequency }]) : acc)
  , []);

  // Sort by candidateFrequency from high to low
  resultArr.sort((a, b) => (b.candidateFrequency - a.candidateFrequency));

  return resultArr.reduce((acc, cur) => acc.concat([{
    word: cur.candidateWord,
    frequency: cur.candidateFrequency,
  }]), []);
};

module.exports = getRhyme;
