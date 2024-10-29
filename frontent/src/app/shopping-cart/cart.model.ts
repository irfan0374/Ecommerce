export interface Product {
    id: number;
    title: string;
    price: Number; // or number, depending on your API
    image: string;
    category_name:string;
}

export interface CartItem {
    added_at: string;
    cart: number;
    product: Product; // Ensure this matches your API response
    quantity: number;
}
