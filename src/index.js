import pinyin from 'pinyin';

const getSpelling = word => pinyin(word, { style: pinyin.STYLE_TONE2 });

const getConsonant = word => pinyin(word, { style: pinyin.STYLE_INITIALS });

const getCompoundVowels = word => (
  getSpelling(word).map((spellingArr, index) => {
    const spelling = spellingArr[0];
    const consonant = getConsonant(word[index])[0][0];
    return spelling.slice(consonant.length);
  })
);

const getRhyme = (word) => {
  const spellings = getSpelling(word);
  const consonants = getConsonant(word);
  const compoundVowels = getCompoundVowels(word);

  return {
    spellings,
    consonants,
    compoundVowels,
  };
};

console.log(getRhyme('上班儿时间划划水'));

module.exports = getRhyme;
