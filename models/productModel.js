module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("product", {

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT
        },
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        deleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })

    return Product

}