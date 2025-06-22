import { Table, Model, PrimaryKey, Column, DataType,Default,Unique, NotNull, Validate, IsEmail, AllowNull } from "sequelize-typescript"
import User from "./userModel"
import Event from "./eventModel"
import { paymentMethod, paymentStatus } from "../../globals/types"

@Table({
    tableName : "usereventregister",
    modelName : "UserEventRegister",
    timestamps : true, //automatically add createAt and updateAt fields
    paranoid: true,
})
class UserEventRegister extends Model{
   
    @PrimaryKey
    @Column({
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id:string

    @Column({
        type:DataType.UUID,
        allowNull : false,
        references: {
            model: User,
            key: "id",
          },     
    })
    declare userId : string

    @Column({
        type : DataType.ENUM("attended","registered"),
        defaultValue:"registered"
    })
    declare userStatus : string

    @PrimaryKey
    @Column({
        type:DataType.UUID,
        allowNull : false,
        references: {
            model: Event,
            key: "id",
          },     
    })
    declare eventId : string
    
    
}
export default UserEventRegister