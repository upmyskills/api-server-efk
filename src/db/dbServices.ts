import { Category, Word, Statistic } from '.';

interface IWordObj {
  word: string,
  translation: string,
  audioSrc: string,
  image: string,
  category?: string
}

interface ICategoryObj {
  caption: string,
}

//  category section

export const getAllCategories = async (): Promise<Array<ICategoryObj>> => {
  const query = await Category.find().sort([['caption', 1]]);

  return query;
};

export const getCategoryByCaption = async (caption: string): Promise<ICategoryObj> => {
  const query = await Category.findOne({ caption });

  return query;
};

export const updateCategory = async (currentCategory: ICategoryObj, newCategoryCaption: string): Promise<boolean> => {
  const { caption } = currentCategory;

  const query = await Category.updateOne({ caption }, { caption: newCategoryCaption });

  return query.nModified;
};

export const createCategory = async (categoryObj: ICategoryObj): Promise<void> => {
  const { caption } = categoryObj;
  const category = await Category.create({
    caption
  });

  return category;
};

export const deleteCategory = async (categoryCaption: string): Promise<boolean> => {
  const query = await Category.deleteOne({ caption: categoryCaption });
  return query.deletedCount;
};

export const createWord = async (wordObj: IWordObj): Promise<IWordObj | null> => {
  const { word, translation, audioSrc, image, category } = wordObj;
  const categoryQuery = await Category.findOne({ caption: category });

  if (categoryQuery) {
    const engWord: IWordObj = await Word.create({
      word,
      translation,
      audioSrc,
      image,
      category: categoryQuery
    });

    await Statistic.create({
      word: engWord,
    });

    return engWord;
  }

  return null;
};

//  word section
export const getWordsFromCategory = async (category: ICategoryObj): Promise<Array<IWordObj>> => {
  const query: Array<IWordObj> = await Word.find({ category });

  return query;
};

export const getAllWords = async (): Promise<Array<IWordObj>> => {
  const query: Array<IWordObj> = await Word.find().sort([['word', 1]]);
  return query;
};

export const getOneWord = async (word: string): Promise<IWordObj> => {
  const query : IWordObj = await Word.findOne({ word });
  return query;
};

export const updateWord = async (prev: IWordObj, newWord: IWordObj): Promise<boolean> => {
  const { word } = prev;
  const query = await Word.updateOne({ word }, newWord);

  return query.nModified;
};

export const deleteWord = async (word: string): Promise<boolean> => {
  const query = await Word.deleteOne({ word });

  return query.deletedCount;
};
