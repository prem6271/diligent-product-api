module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("product",
        {

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
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
                defaultValue: 0
            }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['name']
                }
            ]
        }
    )

    return Product

}