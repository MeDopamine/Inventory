import { Model, Optional, DataTypes } from "sequelize";
import connection from "../../config/connection";

interface VendorAttributes {
    id?: number;
    namaVendor?: string | null;
    kodeVendor?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserInput extends Optional<VendorAttributes, 'id'> {}
export interface UserOutput extends Required<VendorAttributes> {}

class Vendor extends Model<VendorAttributes, UserInput> implements VendorAttributes {
    public id!: number;
    public namaVendor!: string | null;
    public kodeVendor!: string | null;
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Vendor.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        namaVendor: {
            type: DataTypes.STRING
        },
        kodeVendor: {
            type: DataTypes.STRING
        },
    },
    {
        timestamps: true,
        sequelize: connection,
        underscored: false
    }
);

export default Vendor;
