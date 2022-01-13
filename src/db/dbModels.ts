import mongoose from 'mongoose';
import { categorySchema, wordSchema, statisticSchema } from './schemas';

export const Category = mongoose.model('category', categorySchema);
// Category.createCollection();

export const Word = mongoose.model('word', wordSchema);
// Word.createCollection();

export const Statistic = mongoose.model('statistic', statisticSchema);
// Statistic.createCollection();

// const animals = new Category({ caption: 'animals'});
// Category.create({ caption: 'animals' }, (err, obj) => console.log(err, obj));

// const wordFrog = new Word({
//   word: 'frog',
//   translation: 'лягушка',
//   audioSrc: 'pathToMP3',
//   image: 'pathToImage',
// });
// wordFrog.save();

// const findCategory = async (caption: string) => {
//   const category = await Category.find();

//   console.log('category:', category);
// }
