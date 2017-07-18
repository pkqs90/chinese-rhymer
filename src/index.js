import fs from 'fs';
import path from 'path';
import pinyin from 'pinyin';

import { isRhyme } from './rhymeHelper';

const dataPath = path.resolve(__dirname, '../data/webdict_with_freq.txt');
const frequencyLimit = 5000;

// This returns an array of array of spellings (because of multi-sounded words)
const getSpelling = word => pinyin(word, { style: pinyin.STYLE_TONE2 });

// This returns an array of array of consonants (because of multi-sounded words)
const getConsonant = word => pinyin(word, { style: pinyin.STYLE_INITIALS });

// This returns an array of compound vowels.
const getCompoundVowels = word => (
  getSpelling(word).map((spellingArr, index) => {
    const spelling = spellingArr[0];
    const consonant = getConsonant(word[index])[0][0];
    return spelling.slice(consonant.length);
  })
);

const getPinyin = word => (
  word.split('').map(cur => ({
    consonants: getConsonant(cur)[0][0],
    compoundVowels: getCompoundVowels(cur)[0],
  }))
);

let v0;

const check = (candidateFrequency, candidateWord) => (
  candidateFrequency >= frequencyLimit && isRhyme(v0, getPinyin(candidateWord))
);

const getRhyme = (word) => {
  v0 = getPinyin(word);

  const contents = fs.readFileSync(dataPath, 'utf8').toString().split('\n');
  const resultArr = [];

  contents.forEach((line) => {
    const [candidateWord, candidateFrequencyStr] = line.split(' ');
    const candidateFrequency = parseInt(candidateFrequencyStr, 10);
    if (check(candidateFrequency, candidateWord)) {
      resultArr.push({
        frequency: candidateFrequency,
        word: candidateWord,
      });
    }
  });

  resultArr.sort((a, b) => (b.frequency - a.frequency));

  return resultArr.reduce((acc, cur) => acc.concat([cur.word]), []);
};

module.exports = getRhyme;
