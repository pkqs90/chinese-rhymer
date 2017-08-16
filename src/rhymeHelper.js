// TODO: Add more exceptions here
const removeTone = (v) => {
  const c = v.slice(-1);
  if (c >= '0' && c <= '9') {
    return [v.substr(0, v.length - 1), c];
  }
  return [v, 0];
};

const isRhymeVowel = (u0, u1) => {
  const v0 = removeTone(u0 > u1 ? u1 : u0);
  const v1 = removeTone(u0 < u1 ? u1 : u0);
  return (u0 === u1) ||
    (v0[0] === 'an' && v1[0] === 'uan' && v0[1] === v1[1]);
};

// TODO: Add more restrictions here
const isRhymeConsonant = (v0, v1) =>
  true || v0 === v1;

const isSingleWordRhyme = (pinyin0, pinyin1) => {
  const v00 = pinyin0.consonants;
  const v01 = pinyin0.compoundVowels;
  const v10 = pinyin1.consonants;
  const v11 = pinyin1.compoundVowels;
  return isRhymeVowel(v01, v11) && isRhymeConsonant(v00, v10);
};

const isRhyme = (pinyin1, pinyin2) => {
  const v0 = pinyin1[pinyin1.length - 1];
  const v1 = pinyin2[pinyin2.length - 1];
  return isSingleWordRhyme(v0, v1);
};

module.exports = {
  isRhyme,
};
