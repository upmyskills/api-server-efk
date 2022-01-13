import Router from 'express';
import { uploadBlobFileData } from '../shared/googleCloudHelper';
import { createWord, createCategory, getAllCategories, getCategoryByCaption, updateCategory, deleteCategory } from '../db/dbServices';
import { authenticateToken } from '../shared/authenticateToken';

const dbCategoryRouter = Router();
const dbCategory = '/db/category';

// dbCategoryRouter.use(authenticateToken);

dbCategoryRouter.get(`${dbCategory}`, async (req, res) => {
  const categories = await getAllCategories();
  res.json(categories);
});

dbCategoryRouter.post(`${dbCategory}/create`, authenticateToken, async (req, res) => {
  const { categoryCaption } = req.body;

  if (!categoryCaption) {
    res.sendStatus(404);
    return;
  }

  const queryCategory = await getCategoryByCaption(categoryCaption);

  if (!queryCategory) {
    try {
      await createCategory({ caption: categoryCaption });
      res.sendStatus(201);
    } catch (e) {
      res.status(404).json({ errorMessage: `Can't create new entry(${categoryCaption})` });
    }
  } else {
    res.json({ errorMessage: 'Category already exist!' });
  }
});

dbCategoryRouter.delete(`${dbCategory}/:categoryCaption`, authenticateToken, async (req, res) => {
  const { categoryCaption } = req.params;

  try {
    const query = await deleteCategory(categoryCaption);
    // TODO: also we need to delete all cards in this category

    if (query) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.sendStatus(500);
  }
});

dbCategoryRouter.put(`${dbCategory}/:urlCategoryCaption`, authenticateToken, async (req, res) => {
  const { urlCategoryCaption } = req.params;
  const { newCategoryCaption } = req.body;
  const categoryCaption = urlCategoryCaption.replace(/_/g, ' ');

  const query = await getCategoryByCaption(categoryCaption);
  const isCategoryExist = await getCategoryByCaption(newCategoryCaption);

  if (!query || !newCategoryCaption) {
    res.sendStatus(404);
    return;
  }

  if (isCategoryExist) {
    res.status(404).json({ errorMessage: `${newCategoryCaption} already exist. Cho0se another caption please!` });
    return;
  }

  const updatedEntry = {
    prev: query.caption,
    new: newCategoryCaption
  };

  try {
    await updateCategory(query, newCategoryCaption);
    res.json(updatedEntry);
  } catch (e) {
    console.log(e);
    res.json({ errorMessage: 'Something was wrong.' });
  }
});

// authenticateToken
dbCategoryRouter.post(`${dbCategory}/:categoryCaption/addword`, async (req, res) => {
  const { word, translation, audioSrc, image } = req.body;
  const { categoryCaption } = req.params;

  const imagePath = await uploadBlobFileData({
    filename: `${word}${new Date().getSeconds()}.jpg`,
    data: `write this line to remote file on cloud! Created at ${new Date().toString()}`
  });

  const newWord = {
    word,
    translation,
    audioSrc,
    image: imagePath,
    category: categoryCaption
  };

  try {
    await createWord(newWord);
    res.sendStatus(201);
  } catch (e) {
    console.log('ERROR:', e);
    res.status(400).json({
      errorMessage: `Can't create word in ${categoryCaption} category.`,
      error: e
    });
  }
});

export { dbCategoryRouter };
