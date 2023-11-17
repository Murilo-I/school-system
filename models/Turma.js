import Sequelize from "sequelize";
import { sequelize } from "../config/DBConnect.js";

export const Turma = sequelize.define('turma', {
    id_turma: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT
    }
}, { freezeTableName: true });