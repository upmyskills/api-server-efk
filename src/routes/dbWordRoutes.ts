import { Router } from 'express';
import { authenticateToken } from '../shared/authenticateToken';
import { deleteWord, getAllWords, getCategoryByCaption, getOneWord, getWordsFromCategory, updateWord } from '../db/dbServices';
import { IWordObj } from '../models';

export const dbWordRouter = Router();

// PUBLIC ROUTES
dbWordRouter.get('/db/:category/words', async (req, res) => {
  const { category } = req.params;
  const queryCategory = await getCategoryByCaption(category);

  if (!queryCategory) {
    res.status(404).json({
      errorMessage: `Category "${category}" is not exist!`
    });
    return;
  }

  const wordsInCategory = await getWordsFromCategory(queryCategory);

  res.json(wordsInCategory);
});

dbWordRouter.get('/db/word', async (req, res) => {
  const words: Array<IWordObj> = await getAllWords();

  res.json(words);
});

// PRIVATE ROUTES
dbWordRouter.get('/db/word/:word', authenticateToken, async (req, res) => {
  const { word } = req.params;
  const oneWord: IWordObj = await getOneWord(word);

  if (!oneWord) {
    res.status(404).json({
      errorMessage: `Word '${word}' is not exist here.`
    });
    return;
  }

  res.json(oneWord);
});

dbWordRouter.put('/db/word/:word', authenticateToken, async (req, res) => {
  const { word } = req.params;
  const prevWord = await getOneWord(word);

  if (!prevWord) {
    res.sendStatus(404);
    return;
  }

  const newWord: IWordObj = {
    word: req.body.word || prevWord.word,
    translation: req.body.translation || prevWord.translation,
    audioSrc: req.body.audioSrc || prevWord.audioSrc,
    image: req.body.image || prevWord.image,
    category: req.body.category || prevWord.category
  };

  const updatedWord = {
    prev: prevWord,
    newWord
  };

  try {
    await updateWord(prevWord, newWord);
    res.json(updatedWord);
  } catch (e) {
    console.log(e);
    res.json({ errorMessage: 'Something was wrong.' });
  }
});

dbWordRouter.delete('/db/word/:word', authenticateToken, async (req, res) => {
  const { word } = req.params;
  try {
    const isDeleted = await deleteWord(word);
    res.sendStatus(isDeleted ? 200 : 404);
} catch (e) {
    res.status(400).json({
      errorMessage: 'Something was wrong!'
    });
  }
});
