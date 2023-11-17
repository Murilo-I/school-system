import e from "express";

import { getMessage, info, success } from "../helpers/message-helper.js";
import { Aluno } from "../models/Aluno.js";
import { Turma } from "../models/Turma.js";

const router = e.Router();

router.get('/', (req, res) => {
    Aluno.findAll().then((alunos) => {
        alunos = alunos.map(aluno => aluno.toJSON());
        res.render('admin/aluno/list', { alunos: alunos, message: getMessage(req) });
    });
});

router.get('/form', (req, res) => {
    Turma.findAll().then((turmas) => {
        turmas = turmas.map(turma => turma.toJSON());
        res.render('admin/aluno/form', { turmas: turmas });
    });
});

router.get('/form/:id', (req, res) => {
    Aluno.findAll({
        where: { 'id_aluno': req.params.id }
    }).then((alunos) => {
        Turma.findAll().then((turmas) => {
            turmas = turmas.map(turma => turma.toJSON());
            alunos = alunos.map(post => post.toJSON());
            res.render('admin/aluno/form', { turmas: turmas, alunos: alunos });
        });
    });
});

router.post('/save', (req, res) => {
    Aluno.create({
        matricula: req.body.matricula,
        nome: req.body.nome,
        fk_turma: req.body.fk_turma
    }).then(() => {
        req.flash(success, 'Aluno registered successfuly');
        res.redirect('/aluno');
    }).catch((error) => res.send(`There was an error trying to save aluno: ${error}`));
});

router.post('/save/:id', (req, res) => {
    Aluno.update({
        matricula: req.body.matricula,
        nome: req.body.nome,
        fk_turma: req.body.fk_turma
    },
        {
            where: { 'id_aluno': req.body.id }
        }
    ).then(() => {
        req.flash(success, 'Aluno updated successfuly');
        res.redirect('/aluno');
    }).catch((error) => res.send("This aluno doesn't exist. " + error));
});

router.delete('/delete/:id', (req, res) => {
    Aluno.destroy({
        where: { 'id_aluno': req.params.id }
    }).then(() => {
        req.flash(info, 'Aluno deleted successfuly');
        res.redirect('/aluno');
    }).catch((error) => res.send("This post doesn't exist. " + error));
});

export const aluno_route = router;