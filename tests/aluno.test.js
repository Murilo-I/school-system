import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

jest.unstable_mockModule('../models/Aluno.js', () => ({
    Aluno: {
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

jest.unstable_mockModule('../models/Turma.js', () => ({
    Turma: {
        findAll: jest.fn()
    }
}));

const { Aluno } = await import('../models/Aluno.js');
const { Turma } = await import('../models/Turma.js');
const { aluno_route } = await import('../routes/aluno.js');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    req.flash = jest.fn((type) => {
        if (type === 'alert-success') return ['Aluno saved successfully'];
        return [];
    });
    next();
});
app.response.render = function (view, options) {
    this.status(200).send(`Rendered: ${view}`);
};

app.use('/aluno', aluno_route);

describe('Aluno Routes (ESM)', () => {
    afterEach(() => jest.clearAllMocks());

    test('GET /aluno should render list of alunos', async () => {
        Aluno.findAll.mockResolvedValue([{ toJSON: () => ({ id_aluno: 1, nome: 'Ana' }) }]);

        const res = await request(app).get('/aluno');
        expect(res.statusCode).toBe(200);
        expect(Aluno.findAll).toHaveBeenCalled();
    });

    test('GET /aluno/form should render form with turmas', async () => {
        Turma.findAll.mockResolvedValue([{ toJSON: () => ({ id_turma: 1, descricao: 'Turma A' }) }]);

        const res = await request(app).get('/aluno/form');
        expect(res.statusCode).toBe(200);
        expect(Turma.findAll).toHaveBeenCalled();
    });

    test('POST /aluno/save should create a new aluno', async () => {
        Aluno.create.mockImplementation((data) => {
            console.log('Received in Aluno.create:', data);
            return Promise.resolve(data);
        });


        const res = await request(app).post('/aluno/save').type('form').send({
            matricula: 456,
            nome: 'Beatriz',
            fk_turma: 2
        });

        expect(res.statusCode).toBe(302);
        expect(Aluno.create).toHaveBeenCalledWith({
            matricula: "456",
            nome: 'Beatriz',
            fk_turma: "2"
        });
    });

    test('POST /aluno/save/:id should update an aluno', async () => {
        Aluno.update.mockResolvedValue([1]);

        const res = await request(app).post('/aluno/save/2').type('form').send({
            id: 2,
            matricula: 789,
            nome: 'Carlos',
            fk_turma: 3
        });

        expect(res.statusCode).toBe(302);
        expect(Aluno.update).toHaveBeenCalledWith(
            { matricula: "789", nome: 'Carlos', fk_turma: "3" },
            { where: { id_aluno: "2" } }
        );
    });

    test('DELETE /aluno/delete/:id should delete an aluno', async () => {
        Aluno.destroy.mockResolvedValue(1);

        const res = await request(app).delete('/aluno/delete/3');
        expect(res.statusCode).toBe(302);
        expect(Aluno.destroy).toHaveBeenCalledWith({ where: { id_aluno: '3' } });
    });
});
