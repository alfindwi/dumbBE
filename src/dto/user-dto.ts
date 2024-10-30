export interface UpdateUserDTO {
    name?: string;
    email?: string;
    image?: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE';
    address?: string;
}
