module.exports = function(sequelize, DataTypes) {

    const Account = sequelize.define('account', {
        name : {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        accountId : {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        balance : {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isBanned: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isBank: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        outputChannel: {
            type: DataTypes.STRING,
            defaultValue: null
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