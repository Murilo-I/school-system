import Sequalize from 'sequelize';

export const sequelize = new Sequalize('escola', 'root', 'toor', {
    host: "localhost",
    port: "3306",
    dialect: "mysql"
}); 