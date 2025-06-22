import { Table, Column, NotNull,Model, DataType, PrimaryKey, Default } from "sequelize-typescript";
import { paymentMethod,paymentStatus } from "../../globals/types";
@Table({
    tableName:"payment",
    modelName: "Payment",
    timestamps: true,
    paranoid:true
})

export default class Payment extends Model{
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    declare id : string

    @Column({
        type: DataType.ENUM(paymentMethod.Esewa,paymentMethod.Khalti),
    })
    declare paymentMethod : string

    @Default(paymentStatus.Unpaid)
    @Column({
        type : DataType.ENUM(paymentStatus.Paid,paymentStatus.Unpaid)
    })
    declare paymentStatus : string

    @Column({
        type:DataType.STRING
    })
    declare pidx:string
}