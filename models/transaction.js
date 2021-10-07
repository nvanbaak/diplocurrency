module.exports = function(sequelize, DataTypes) {

    const Transaction = sequelize.define('transactions', {
        senderId : {
            type: DataTypes.STRING,
            allowNull: false
        },
        receiverId : {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount : {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        reason : {
            type: DataTypes.STRING,
            allowNull: false
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