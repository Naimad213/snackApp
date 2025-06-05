-- Ensure we're in the public schema
set search_path to public;

-- Drop existing tables if they exist (in reverse order of dependencies)
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.food_items cascade;

-- Drop existing triggers if they exist
drop trigger if exists handle_updated_at on public.food_items;
drop trigger if exists handle_updated_at on public.orders;

-- Drop existing function if it exists
drop function if exists public.handle_updated_at();

-- Create food_items table
create table public.food_items (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null,
    category text not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    status text not null default 'pending',
    total_amount decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint valid_status check (status in ('pending', 'preparing', 'ready', 'delivered', 'cancelled'))
);

-- Create order_items table
create table public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    food_item_id uuid references public.food_items(id) on delete cascade not null,
    quantity integer not null check (quantity > 0),
    price_at_time decimal(10,2) not null check (price_at_time >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.food_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Create policies for food_items
create policy "Food items are viewable by everyone"
    on public.food_items for select
    using (true);

-- Create policies for orders
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Users can create their own orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own orders"
    on public.orders for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Create policies for order_items
create policy "Users can view their own order items"
    on public.order_items for select
    using (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );

create policy "Users can create their own order items"
    on public.order_items for insert
    with check (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at
    before update on public.food_items
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();

-- Insert sample food items
insert into public.food_items (name, description, price, category, image_url)
values
    ('Classic Burger', 'Juicy beef patty with fresh vegetables and special sauce', 12.99, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
    ('Cheeseburger', 'Classic burger with melted cheddar cheese', 13.99, 'Burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b'),
    ('Margherita Pizza', 'Fresh tomatoes, mozzarella, and basil', 14.99, 'Pizza', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3'),
    ('Pepperoni Pizza', 'Classic pizza topped with pepperoni slices', 16.99, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e'),
    ('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons', 8.99, 'Salads', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9'),
    ('Greek Salad', 'Fresh vegetables with feta cheese and olives', 9.99, 'Salads', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'),
    ('Chocolate Cake', 'Rich chocolate cake with ganache frosting', 6.99, 'Desserts', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'),
    ('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 7.99, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9'),
    ('French Fries', 'Crispy golden fries with sea salt', 4.99, 'Sides', 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d'),
    ('Onion Rings', 'Crispy battered onion rings', 5.99, 'Sides', 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a');

-- Create indexes for better performance
create index if not exists idx_food_items_category on public.food_items(category);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_food_item_id on public.order_items(food_item_id); 