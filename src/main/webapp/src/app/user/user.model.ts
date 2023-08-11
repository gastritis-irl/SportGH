export interface User {

    id?: number;
    uuid?: string;
    username?: string;
    email?: string;
    password?: string;
    role: string, enum: 'USER', default: 'USER';
}
