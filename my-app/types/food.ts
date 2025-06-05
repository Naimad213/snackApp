export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
  food_item?: FoodItem;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export type Category = 'Burgers' | 'Pizza' | 'Salads' | 'Desserts' | 'Sides';

// Sample food items for development
export const sampleFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Burger',
    description: 'Classic beef burger with cheese and vegetables',
    price: 25.99,
    category: 'Fast Food',
    image_url: 'https://example.com/burger.jpg',
    created_at: '2024-04-01T12:00:00',
    updated_at: '2024-04-01T12:00:00',
  },
  {
    id: '2',
    name: 'Pizza',
    description: 'Margherita pizza with fresh mozzarella',
    price: 35.99,
    category: 'Italian',
    image_url: 'https://example.com/pizza.jpg',
    created_at: '2024-04-01T12:00:00',
    updated_at: '2024-04-01T12:00:00',
  },
  {
    id: '3',
    name: 'Salad',
    description: 'Fresh garden salad with vinaigrette',
    price: 18.99,
    category: 'Healthy',
    image_url: 'https://example.com/salad.jpg',
    created_at: '2024-04-01T12:00:00',
    updated_at: '2024-04-01T12:00:00',
  },
  {
    id: '4',
    name: 'Pasta',
    description: 'Spaghetti with tomato sauce',
    price: 22.99,
    category: 'Italian',
    image_url: 'https://example.com/pasta.jpg',
    created_at: '2024-04-01T12:00:00',
    updated_at: '2024-04-01T12:00:00',
  },
  {
    id: '5',
    name: 'Sandwich',
    description: 'Club sandwich with turkey and bacon',
    price: 20.99,
    category: 'Fast Food',
    image_url: 'https://example.com/sandwich.jpg',
    created_at: '2024-04-01T12:00:00',
    updated_at: '2024-04-01T12:00:00',
  },
  {
    id: '6',
    name: 'Soup',
    description: 'Cream of mushroom soup',
    price: 15.99,
    category: 'Soups',
    image_url: 'https://example.com/soup.jpg',
    created_at: '2024-04-01T12:00:00',
    updated_at: '2024-04-01T12:00:00',
  },
]; 