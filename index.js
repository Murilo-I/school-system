import bodyParser from "body-parser";
import { config } from "dotenv";
import e from "express";
import flash from "express-flash";
import handlebars from "express-handlebars";
import session from "express-session";

import { isAuthenticated } from "./config/AuthConfig.js";
import { checkTurmaAluno } from "./helpers/handlebars-helper.js";
import { aluno_route } from "./routes/aluno.js";
import { auth_route } from "./routes/auth.js";
import { turma_route } from "./routes/turma.js";

config();
const app = e();

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main', helpers: { checkTurmaAluno } }));
app.set('view engine', 'handlebars');

app.use(session({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1200000 }
}));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', e.static('public'));

app.use('/auth', auth_route);
app.use('/aluno', isAuthenticated, aluno_route);
app.use('/turma', isAuthenticated, turma_route);
app.use('/home', (req, res) => res.render('home'));

app.listen(3015, () => console.log("server up!"));