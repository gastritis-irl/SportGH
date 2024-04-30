export enum Status {
    PENDING,
    ACCEPTED,
    DECLINED
}

export interface Request {

    requestId?: number,
    createdAt?: Date,
    updatedAt?: Date,
    renterName?: string,
    productName?: string,
    productId?: number,
    requestStatus?: Status
}
