enum Status {
    PENDING,
    ACCEPTED,
    DECLINED
}

export interface Request {

    renterName?: string,
    productName?: string,
    productId?: number,
    requestStatus?: Status
}
