const { Sequelize } = require("sequelize/types");

module.exports = function(sequelize) {

    const Transaction = sequelize.define('transactions', {
        Payer : {
            type: Sequelize.Accounts,
        },
        id : {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        balance : {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        isBanned: { 
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        isBank: { 
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    })

    Transaction.associate = function(models) {
        Transaction.belongsToMany(models.Account, {
            foreignKey: {
                allowNull: false
            }
        })};
        
    return Transaction;
}