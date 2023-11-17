import e from "express";

import { danger, getMessage, success } from '../helpers/message-helper.js';
import { Usuario } from "../models/Usuario.js";

const router = e.Router();

router.get('/signup', (req, res) => res.render('admin/auth/signup', {
    message: getMessage(req)
}));

router.post('/signup', (req, res) => {
    Usuario.create({
        username: req.body.username,
        email: req.body.email,
        senha: req.body.senha
    }).then(() => {
        req.flash(success, 'Sign up successful');
        res.redirect("/auth/login");
    }).catch((error) => res.send('Error trying to signup: ' + error));
});

router.get('/login', (req, res) => res.render('admin/auth/login', {
    message: getMessage(req)
}));

router.post('/login', async (req, res) => {
    const { username, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { username } });
        if (usuario && usuario.senha === senha) {
            req.session.usuario = usuario;
            const returnTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            req.flash(success, 'Login successful');
            res.redirect(returnTo);
        } else {
            req.flash(danger, 'Invalid credentials!');
            res.render('admin/auth/login', { message: getMessage(req) });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Authentication error!' });
    }
});

export const auth_route = router;