import mongoose, { Document } from "mongoose";
export interface ICart extends Document {
    productId: string;
    image: string;
    product: string;
    price: number;
    qty: number;
}
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    image?: string;
    cart: ICart[];
    addresses: string[];
    defaultAddress: number;
    disabled: boolean;
}
export declare const cartSchema: mongoose.Schema<ICart, mongoose.Model<ICart, any, any, any, any, any, ICart>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ICart, mongoose.Document<unknown, {}, ICart, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, ICart, mongoose.Document<unknown, {}, ICart, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ICart & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    productId?: mongoose.SchemaDefinitionProperty<string, ICart, mongoose.Document<unknown, {}, ICart, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ICart & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    image?: mongoose.SchemaDefinitionProperty<string, ICart, mongoose.Document<unknown, {}, ICart, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ICart & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    product?: mongoose.SchemaDefinitionProperty<string, ICart, mongoose.Document<unknown, {}, ICart, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ICart & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    price?: mongoose.SchemaDefinitionProperty<number, ICart, mongoose.Document<unknown, {}, ICart, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ICart & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    qty?: mongoose.SchemaDefinitionProperty<number, ICart, mongoose.Document<unknown, {}, ICart, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ICart & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, ICart>;
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map