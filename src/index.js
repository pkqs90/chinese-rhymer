import fs from 'fs';
import path from 'path';
import pinyin from 'pinyin';

const dataPath = path.resolve(__dirname, '../data/webdict_with_freq.txt');
const frequencyLimit = 5000;

const getSpelling = word => pinyin(word, { style: pinyin.STYLE_TONE2 });

const getConsonant = word => pinyin(word, { style: pinyin.STYLE_INITIALS });

const getCompoundVowels = word => (
  getSpelling(word).map((spellingArr, index) => {
    const spelling = spellingArr[0];
    const consonant = getConsonant(word[index])[0][0];
    return spelling.slice(consonant.length);
  })
);

let v0;

const isSingleWordRhyme = (candidateFrequency, candidateWord) => {
  const v1 = getCompoundVowels(candidateWord);
  return v0[v0.length - 1] === v1[v1.length - 1];
};

const check = (candidateFrequency, candidateWord) => (
  candidateFrequency >= frequencyLimit && isSingleWordRhyme(candidateFrequency, candidateWord)
);

const getRhyme = (word) => {
  v0 = getCompoundVowels(word);

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
