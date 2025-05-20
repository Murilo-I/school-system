import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

jest.unstable_mockModule('../models/Turma.js', () => ({
    Turma: {
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

const { Turma } = await import('../models/Turma.js');
const { turma_route } = await import('../routes/turma.js');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    req.flash = jest.fn().mockReturnValue([]);
    next();
});

app.response.render = jest.fn(function (view, options) {
    this.status(200).send(`Rendered: ${view}`);
});

app.use('/turma', turma_route);

describe('Turma Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /turma - list turmas', async () => {
        Turma.findAll.mockResolvedValue([
            { toJSON: () => ({ id_turma: 1, descricao: '1º Ano' }) }
        ]);

        const res = await request(app).get('/turma');

        expect(res.status).toBe(200);
        expect(res.text).toContain('Rendered: admin/turma/list');
        expect(Turma.findAll).toHaveBeenCalled();
    });

    test('GET /turma/form - new turma form', async () => {
        const res = await request(app).get('/turma/form');

        expect(res.status).toBe(200);
        expect(res.text).toContain('Rendered: admin/turma/form');
    });

    test('GET /turma/form/:id - edit form', async () => {
        Turma.findAll.mockResolvedValue([
            { toJSON: () => ({ id_turma: 1, descricao: '1º Ano' }) }
        ]);

        const res = await request(app).get('/turma/form/1');

        expect(res.status).toBe(200);
        expect(res.text).toContain('Rendered: admin/turma/form');
        expect(Turma.findAll).toHaveBeenCalledWith({ where: { id_turma: '1' } });
    });

    test('POST /turma/save - create turma', async () => {
        Turma.create.mockResolvedValue({});

        const res = await request(app)
            .post('/turma/save')
            .type('form')
            .send({ desc: '2º Ano' });

        expect(Turma.create).toHaveBeenCalledWith({ descricao: '2º Ano' });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/turma');
    });

    test('POST /turma/save/:id - update turma', async () => {
        Turma.update.mockResolvedValue([1]);

        const res = await request(app)
            .post('/turma/save/1')
            .type('form')
            .send({ id: 1, desc: 'Atualizado' });

        expect(Turma.update).toHaveBeenCalledWith(
            { descricao: 'Atualizado' },
            { where: { id_turma: "1" } }
        );

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/turma');
    });

    test('DELETE /turma/delete/:id - delete turma', async () => {
        Turma.destroy.mockResolvedValue(1);

        const res = await request(app).delete('/turma/delete/1');

        expect(Turma.destroy).toHaveBeenCalledWith({ where: { id_turma: '1' } });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/turma');
    });
});

