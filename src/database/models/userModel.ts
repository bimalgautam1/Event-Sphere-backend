import { Table, Model, PrimaryKey, Column, DataType,Unique, NotNull, Validate, IsEmail, AllowNull } from "sequelize-typescript"

@Table({
    tableName : "users",
    modelName : "User",
    timestamps : true, //automatically add createAt and updateAt fields
    paranoid: true,
})
class User extends Model{
    @PrimaryKey
    @Column({
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id:string

    @Unique
    @Column({
        type:DataType.STRING,
        allowNull : false
        
    })
    declare username:string

    @Unique
    @Column({
        type : DataType.STRING,
        allowNull : false,
        validate :{
            isEmail : true,
            
        }
    })
    declare email : string

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    declare password : string

    @Column({
        type : DataType.ENUM('organizer','attendee'),
        
        allowNull : false
    })
    declare role : string 
}
export default User