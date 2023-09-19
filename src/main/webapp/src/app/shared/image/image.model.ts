export interface Image {

    id?: number;
    name?: string;
    url?: string;
    file?: File;
    imageDataUrl?: string;
    productId?: number;
    data?: Uint8Array;
    isUploaded?: boolean;
}
