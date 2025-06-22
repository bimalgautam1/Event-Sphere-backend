// Event model
import { Table, Model, PrimaryKey, Column, DataType, ForeignKey, BelongsTo, CreatedAt } from "sequelize-typescript";


@Table({
    tableName: "events",
    modelName: "Event",
    timestamps: true,
    paranoid: true,
})

class Event extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare price: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare date: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare image_url: string;

}

export default Event;
