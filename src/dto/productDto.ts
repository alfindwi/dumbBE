export interface CreateProductDto {
    image? : string
    product_name? : string
    product_desc? : string
    price? : string
    stok?: string
    categoryId : string
}

export interface UpdateProductDto {
    image? : string
    product_name? : string
    product_desc? : string
    price? : string
    stok? : string
}

