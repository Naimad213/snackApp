-- Step 1: Clean up existing objects
drop table if exists public.order_items;
drop table if exists public.orders;
drop table if exists public.food_items;

-- Step 2: Create food_items table
create table public.food_items (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null,
    category text not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 3: Create orders table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    status text not null default 'pending',
    total_amount decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 4: Create order_items table
create table public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    food_item_id uuid references public.food_items(id) on delete cascade not null,
    quantity integer not null default 1,
    price_at_time decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 5: Enable RLS
alter table public.food_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Step 6: Create policies
create policy "Food items are viewable by everyone"
    on public.food_items for select
    using (true);

create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Users can create their own orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

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

-- Step 7: Insert sample data
insert into public.food_items (name, description, price, category)
values
    ('Burger', 'Classic beef burger with cheese and vegetables', 9.99, 'Main Course'),
    ('Pizza', 'Margherita pizza with fresh mozzarella', 12.99, 'Main Course'),
    ('Salad', 'Fresh garden salad with vinaigrette', 7.99, 'Appetizer'),
    ('Ice Cream', 'Vanilla ice cream with chocolate sauce', 4.99, 'Dessert');

-- Step 8: Create indexes
create index if not exists idx_food_items_category on public.food_items(category);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_food_item_id on public.order_items(food_item_id); 