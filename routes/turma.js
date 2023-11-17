import e from "express";

import { success, info, getMessage } from "../helpers/message-helper.js";
import { Turma } from "../models/Turma.js";

const router = e.Router();

router.get('/', (req, res) => {
    Turma.findAll().then((turmas) => {
        turmas = turmas.map(turma => turma.toJSON());
        res.render('admin/turma/list', { turmas: turmas, message: getMessage(req) });
    });
});

router.get('/form', (req, res) => res.render('admin/turma/form'));

router.get('/form/:id', (req, res) => {
    Turma.findAll({
        where: { 'id_turma': req.params.id }
    }).then((turmas) => {
        turmas = turmas.map(post => post.toJSON());
        res.render('admin/turma/form', { turmas: turmas });
    });
});

router.post('/save', (req, res) => {
    Turma.create({
        descricao: req.body.desc
    }).then(() => {
        req.flash(success, 'Turma registered successfuly');
        res.redirect('/turma');
    }).catch((error) => res.send(`There was an error trying to save turma: ${error}`));
});

router.post('/save/:id', (req, res) => {
    Turma.update({ descricao: req.body.desc },
        {
            where: { 'id_turma': req.body.id }
        }
    ).then(() => {
        req.flash(success, 'Turma updated successfuly');
        res.redirect('/turma');
    }).catch((error) => res.send("This turma doesn't exist. " + error));
});

router.delete('/delete/:id', (req, res) => {
    Turma.destroy({
        where: { 'id_turma': req.params.id }
    }).then(() => {
        req.flash(info, 'Turma deleted successfuly');
        res.redirect('/turma');
    }).catch((error) => res.send("This post doesn't exist. " + error));
});

export const turma_route = router;