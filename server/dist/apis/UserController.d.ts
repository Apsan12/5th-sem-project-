import type { Request, Response } from "express";
import { type ICart, type IUser } from "../models/User.js";
import type { MyRequest } from "../types/Request.js";
declare const UserController: {
    createUser(req: Request<{}, {}, IUser>, res: Response): Promise<void>;
    getAllUsers(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserById(req: MyRequest<{
        id: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    addToCart(req: MyRequest<{}, {}, ICart, {}>, res: Response): Promise<Response<any, Record<string, any>>>;
    removeFromCart(req: MyRequest<{
        cartId: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
    removeAllFromCart(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getUserCount(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    loginUser(req: Request<{}, {}, {
        email: string;
        password: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserProfile(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUserProfile(req: MyRequest<{}, {}, IUser>, res: Response): Promise<Response<any, Record<string, any>>>;
    addAddress(req: MyRequest<{}, {}, {
        address: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeAddress(req: MyRequest<{
        index: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    setDefaultAddress(req: MyRequest<{
        index: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
    toggleUser(req: MyRequest<{
        id: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default UserController;
//# sourceMappingURL=UserController.d.ts.map