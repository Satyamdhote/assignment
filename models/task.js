const Sequelize = require('sequelize');

const taskModel = (sequelize) => {
    const { DataTypes } = Sequelize;
    return sequelize.define("task", {
        title: {
            type: DataTypes.TEXT,
        },
        description: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.ENUM('open', 'inprogress', 'completed'),
            defaultValue: 'open',
        },
        createdAt: {
            type :DataTypes.DATEONLY,  
            allowNull: true,
        },
        updatedAt: {
            type :DataTypes.DATEONLY,  
            allowNull: true,
        }
    })
}

module.exports = taskModel;
