import {Table,Column, NotNull, PrimaryKey,Model, DataType, AllowNull} from 'sequelize-typescript'

@Table({
    tableName:'category',
    modelName: 'Category',
    timestamps:true,
    paranoid:true
})

class Category extends Model{
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id:string


    @AllowNull(false)
    @Column({
        type:DataType.STRING,
    })
    declare categoryName:string 
}

export default Category