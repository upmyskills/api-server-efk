import { Schema } from 'mongoose';

export const categorySchema = new Schema({
  caption: { type: String, require: true },
});

export const wordSchema = new Schema({
  word: String,
  translation: String,
  audioSrc: Buffer,
  image: Buffer,
  category: { type: Schema.Types.ObjectId, ref: 'category' }
});

export const statisticSchema = new Schema({
  count: { type: Number, default: 0 },
  answers: {
    wrong: { type: Number, default: 0 },
    correct: { type: Number, default: 0 }
  },
  word: { type: Schema.Types.ObjectId, ref: 'word' }
});
