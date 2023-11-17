import Sequelize from "sequelize";

import { sequelize } from "../config/DBConnect.js";

export const Aluno = sequelize.define('aluno', {
    id_aluno: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    matricula: {
        type: Sequelize.INTEGER
    },
    nome: {
        type: Sequelize.TEXT
    },
    fk_turma: {
        type: Sequelize.INTEGER,
        references: { model: 'Turma', key: 'id_turma' },
        onDelete: 'CASCADE',
        allowNull: false
    }
}, { freezeTableName: true });