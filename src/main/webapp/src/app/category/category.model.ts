export interface Category {
    
    id?: number;
    name?: string;
    description?: string;
    imageId?: number;
    imageDataUrl?: string;  // New field for holding the base64 encoded image data
}
