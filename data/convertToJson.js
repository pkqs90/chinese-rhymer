import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(__dirname, './webdict_with_freq.txt');

const contents = fs.readFileSync(dataPath, 'utf8').toString().split('\n');

const result = {};

contents.forEach((line) => {
  const [candidateWord, candidateFrequencyStr] = line.split(' ');
  const candidateFrequency = parseInt(candidateFrequencyStr, 10);
  result[candidateWord] = candidateFrequency;
});

const json = JSON.stringify(result);

fs.writeFileSync('webdict_with_freq.json', json, 'utf8');
