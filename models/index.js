const accountBuilder = require("./account.js");
const transactionBuilder = require("./transaction.js");

module.exports = function(sequelize, DataTypes) {

    const account = accountBuilder(sequelize, DataTypes);
    const transaction = transactionBuilder(sequelize, DataTypes);

    const db = {
        Accounts : account,
        Transactions : transaction
    }

    return db;
}