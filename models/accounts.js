const { Sequelize } = require("sequelize/types");

module.exports = function(sequelize) {

    const Account = sequelize.define('account', {
        name : {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        id : {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        balance : {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        isBanned: { 
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isBank: { 
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    Account.associate = function(models) {
        Account.belongsToMany(models.Transaction, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return Account;
}