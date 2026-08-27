import type { Request, Response } from "express";
import { type IProduct } from "../models/Product.js";
import type { MyRequest } from "../types/Request.js";
declare const ProductController: {
    createProduct(req: MyRequest<{}, {}, IProduct>, res: Response): Promise<Response<any, Record<string, any>>>;
    getVisibleProductById(req: MyRequest<{
        id: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
    getProductById(req: MyRequest<{
        id: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllVisibleProducts(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllProducts(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProductCount(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    searchProduct(req: Request<{}, {}, {}, {
        q: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProduct(req: MyRequest<{}, {}, IProduct>, res: Response): Promise<Response<any, Record<string, any>>>;
    toggleProduct(req: MyRequest<{
        prodId: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default ProductController;
//# sourceMappingURL=ProductController.d.ts.map