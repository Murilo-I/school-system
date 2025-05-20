import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

jest.unstable_mockModule('../models/Usuario.js', () => ({
    Usuario: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

const { Usuario } = await import('../models/Usuario.js');
const { auth_route } = await import('../routes/auth.js');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    req.flash = jest.fn().mockReturnValue([]);
    req.session = {};
    next();
});

app.response.render = jest.fn(function (view, options) {
    this.status(200).send(`Rendered: ${view}`);
});

app.use('/auth', auth_route);

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /auth/signup - should render signup form', async () => {
        const res = await request(app).get('/auth/signup');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Rendered: admin/auth/signup');
    });

    test('POST /auth/signup - success', async () => {
        Usuario.create.mockResolvedValue({});
        const res = await request(app)
            .post('/auth/signup')
            .type('form')
            .send({ username: 'john', email: 'john@example.com', senha: '123' });

        expect(Usuario.create).toHaveBeenCalledWith({
            username: 'john',
            email: 'john@example.com',
            senha: '123'
        });
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toBe('/auth/login');
    });

    test('POST /auth/signup - error', async () => {
        Usuario.create.mockRejectedValue(new Error('DB error'));
        const res = await request(app)
            .post('/auth/signup')
            .type('form')
            .send({ username: 'john', email: 'john@example.com', senha: '123' });

        expect(res.status).toBe(200);
        expect(res.text).toContain('Error trying to signup');
    });

    test('GET /auth/login - should render login form', async () => {
        const res = await request(app).get('/auth/login');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Rendered: admin/auth/login');
    });

    test('POST /auth/login - success', async () => {
        const fakeUser = { username: 'john', senha: '123' };
        Usuario.findOne.mockResolvedValue(fakeUser);

        const res = await request(app)
            .post('/auth/login')
            .type('form')
            .send({ username: 'john', senha: '123' });

        expect(Usuario.findOne).toHaveBeenCalledWith({ where: { username: 'john' } });
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toBe('/');
    });

    test('POST /auth/login - invalid credentials', async () => {
        const user = { username: 'john', senha: 'wrongpass' };
        Usuario.findOne.mockResolvedValue(user);

        const res = await request(app)
            .post('/auth/login')
            .type('form')
            .send({ username: 'john', senha: 'notright' });

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Rendered: admin/auth/login');
    });

    test('POST /auth/login - DB error', async () => {
        Usuario.findOne.mockRejectedValue(new Error('DB error'));

        const res = await request(app)
            .post('/auth/login')
            .type('form')
            .send({ username: 'john', senha: '123' });

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: 'Authentication error!' });
    });
});
