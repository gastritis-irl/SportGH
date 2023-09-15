import { Product } from "../product/product.model";

export interface User {

    id?: number;
    username?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
    products?: Product[];
    imageId?: number;
    role?: string;
}
