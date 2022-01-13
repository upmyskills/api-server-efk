import Router = require('express');
import { statistic } from '../shared/constants';
import { IStatisticParams, ICard } from '../models';

const baseRoute = Router();

const createNewEntry = (card: ICard): void => {
  const { word, translation, image, audioSrc } = card;
  statistic.set((word as string).toLowerCase(), {
    word,
    translation,
    image,
    audioSrc,
    count: 0,
    correct: 0,
    wrong: 0
  });
};

const transformToList = (): Array<IStatisticParams> => {
  const objList = Object.fromEntries(statistic);
  const words = Object.keys(objList).map((item) => statistic.get(item));

  return words;
};

//    /api/auth
baseRoute.get('/', (req, res) => {
  res.send('<p style="font-size: xxx-large;text-align: center;">Test GET <span style="color: green;">oK</span>!</p>');
});

baseRoute.get('/checkanswer', (req, res) => {
  // word=move&correct=false
  const { word, correct } = req.query;

  if (Number(correct)) statistic.get(word).correct += 1;
  else statistic.get(word).wrong += 1;

  res.status(200);
  res.send('ok');
});

baseRoute.get('/train', (req, res) => {
  const { word, translation, image, audioSrc } = req.query;
  if (!statistic.has((word as string).toLowerCase())) {
    const card: ICard = {
      word: word as string,
      translation: translation as string,
      image: image as string,
      audioSrc: audioSrc as string
    };
    createNewEntry(card);
  }
  statistic.get(word).count += 1;

  res.status(200);
  res.send('ok');
});

baseRoute.get('/load', async (req, res) => {
  const words = transformToList();

  res.json(words);
});

baseRoute.get('/sort', async (req, res) => {
  const words = transformToList();
  const { sortBy, direction } = req.query;

  if (sortBy === 'word') {
    words.sort((a, b) => a.word.localeCompare(b.word));
  }

  if (sortBy === 'translate') {
    words.sort((a, b) => a.translation.localeCompare(b.translation));
  }

  if (sortBy === 'count') {
    words.sort((a, b) => a.count - b.count).reverse();
  }

  if (sortBy === 'correct') {
    words.sort((a, b) => a.correct - b.correct).reverse();
  }

  if (sortBy === 'wrong') {
    words.sort((a, b) => a.wrong - b.wrong).reverse();
  }

  if (sortBy === 'percent') {
    words.sort((a, b) => {
      const aPercent = ((100 / ((a.wrong + a.correct) || 1)) * a.correct);
      const bPercent = ((100 / ((b.wrong + b.correct) || 1)) * b.correct);

      return aPercent - bPercent;
    }).reverse();
  }

  if (direction === 'sort-up') {
    words.reverse();
  }

  res.json(words);
});

export { baseRoute };
