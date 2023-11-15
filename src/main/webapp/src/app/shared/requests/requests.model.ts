export enum Status {
    PENDING,
    ACCEPTED,
    DECLINED
}

export interface Request {

    requestId?: number,
    renterName?: string,
    productName?: string,
    productId?: number,
    requestStatus?: Status
}
