import Sequelize from "sequelize";

import { sequelize } from "../config/DBConnect.js";

export const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.TEXT
    },
    senha: {
        type: Sequelize.TEXT
    }
}, { freezeTableName: true });