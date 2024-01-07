import { Model, Optional, DataTypes } from "sequelize";
import connection from "../../config/connection";

interface UserAttributes {
    id?: number;
    firstName?: string | null;
    lastName?: string | null;
    nik?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number;
    public firstName!: string | null;
    public lastName!: string | null;
    public nik!: number | null;
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        nik: {
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: true,
        sequelize: connection,
        underscored: false
    }
);

export default User;
