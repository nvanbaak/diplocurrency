const { Sequelize } = require("sequelize/types");

module.exports = function(sequelize) {

    const Transaction = sequelize.define('transactions', {
        senderId : {
            type: Sequelize.STRING,
            allowNull: false
        },
        receiverId : {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount : {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
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