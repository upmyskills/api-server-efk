import Router from 'express';
import { IAnswers } from '../models';
import { Word, Statistic } from '../db';

export const dbStatisticRouter = Router();

interface INewData {
  count: number,
  answers?: IAnswers
}

/*
 *  BODY:
 *  {
 *    word: string,
 *    answer: true | false
 *  }
 */
dbStatisticRouter.put('/db/statistic', async (req, res) => {
  const { word, answer } = req.body;
  const hasAnswer = Object.keys(req.body).includes('answer');

  const wordQuery = await Word.findOne({ word });
  const wordStatistic = await Statistic.findOne({ word: wordQuery });

  const count: number = !hasAnswer ? wordStatistic.count + 1 : wordStatistic.count;
  const newData: INewData = { count };

  if (hasAnswer) {
    newData.answers = {
      correct: answer ? wordStatistic.answers.correct + 1 : wordStatistic.answers.correct,
      wrong: answer ? wordStatistic.answers.wrong : wordStatistic.answers.wrong + 1
    };
  }

  try {
    await Statistic.updateOne({ _id: wordStatistic.id }, newData);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({
      errorMessage: `Can't update "${word}" statistic`
    });
  }
});
