import { Word } from '../db/dbModels';

export interface IAnswers {
  wrong: number,
  correct: number
}

export interface IDBStatistic {
  count: number,
  answers: IAnswers
  word: typeof Word | string,
}
