module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        seller: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        collection: {
            allowNull: false,
            type: DataTypes.STRING
        },
        tokenId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        price: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        startTime: {
            allowNull: false,
            type: DataTypes.BIGINT
        },
        duration: {
            allowNull: false,
            type: DataTypes.BIGINT
        }
    });
    Category.associate = function (models) {
        Category.hasMany(models.project);
    };
    return Category;
};