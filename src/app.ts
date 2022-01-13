import express from 'express';
import handlebars from 'express-handlebars';
import createError, { HttpError } from 'http-errors';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { authRouter } from './routes/authRoutes';
import { baseRoute } from './routes/cardsroutes';
import { dbCategoryRouter } from './routes/dbCategoryRoutes';
import { dbWordRouter } from './routes/dbWordRoutes';
import { dbStatisticRouter } from './routes/dbStatisticRoutes';

import { ICard } from './models';
import { statistic } from './shared/constants';

interface IStandartCard {
  linkName: string,
  cards: Array<ICard>
}

const load = async () => {
  const pathToFile = path.join(__dirname, 'shared/menu.json');
  const fileContent = fs.readFileSync(pathToFile, 'utf-8');
  const standartStatistic: Array<IStandartCard> = JSON.parse(fileContent).menuItems;

  standartStatistic.forEach((item) => {
    item.cards.map((card) => {
      statistic.set(card.word, {
        word: card.word,
        translation: card.translation,
        audioSrc: card.audioSrc,
        count: Math.floor(Math.random() * 44),
        correct: Math.floor(Math.random() * 25),
        wrong: Math.floor(Math.random() * 21)
      });
      return card;
    });
  });
};
load();

export const app = express();
// view engine setup
app.engine('handlebars', handlebars({ defaultLayout: 'categories' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
// app.set('view engine', 'jade');

app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// allow CORS middleware
app.use(cors());
// app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', `http://localhost:${port}`);
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   // Pass to next layer of middleware
//   next();
// });

// ROUTES
app.use(authRouter);
app.use(baseRoute);

app.use(dbStatisticRouter);
app.use(dbCategoryRouter);
app.use(dbWordRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`error : ${err.status}`);
  next();
});
