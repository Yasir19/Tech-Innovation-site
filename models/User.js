// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');

const bcrypt = require('bcrypt');

// import our database connection from config.js
const sequelize =require('../config/connection');

// create our User Model 
class User extends Model{
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password)
    }

}

// define table columns and configration 
User.init(
    {
    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement: true,
    },
    //define name column
    username: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    //degine email column
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len:[10]
        }
    }

},
{
    hooks: {
        // set up beforeCreating lifecycle "hook" functionality
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password,10);
            return newUserData
        },
        // set up beforeupdate 
        async beforeUpdate(updateduserData) {
            updateduserData.password = await bcrypt.hash(updateduserData.password,10);
            return updateduserData
        },
    },
    // configure table option 
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName:'user'
}
);

module.exports = User;