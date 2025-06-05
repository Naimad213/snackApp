-- Step 1: Set schema and clean up
set search_path to public;

-- Step 2: Clean up existing objects
drop table if exists public.order_items;
drop table if exists public.orders;
drop table if exists public.food_items;
drop table if exists public.profiles;
drop table if exists public.sellers;

-- Step 3: Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text,
    full_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 4: Create food_items table
create table public.food_items (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null,
    category text not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 5: Create orders table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    status text not null default 'pending',
    total_amount decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 6: Create order_items table
create table public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    food_item_id uuid references public.food_items(id) on delete cascade not null,
    quantity integer not null default 1,
    price_at_time decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 7: Create sellers table
create table public.sellers (
    id uuid references auth.users(id) on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 8: Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.food_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.sellers enable row level security;

-- Step 9: Create profiles policies
create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Step 10: Create food items policies
create policy "Food items are viewable by everyone"
    on public.food_items for select
    using (true);

-- Step 11: Create orders policies
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Users can create their own orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

-- Step 12: Create order items policies
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

-- Step 13: Create seller policies
create policy "Sellers can view all orders"
    on public.orders for select
    using (auth.uid() in (
        select id from public.sellers
    ));

create policy "Sellers can update order status"
    on public.orders for update
    using (auth.uid() in (
        select id from public.sellers
    ))
    with check (auth.uid() in (
        select id from public.sellers
    ));

create policy "Sellers can view all order items"
    on public.order_items for select
    using (auth.uid() in (
        select id from public.sellers
    ));

-- Step 14: Create trigger for new user profiles
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
    insert into public.profiles (id, email, full_name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    );
    return new;
end;
$$;

-- Drop the trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Step 15: Insert sample data
insert into public.food_items (name, description, price, category)
values
    ('Burger', 'Classic beef burger with cheese and vegetables', 9.99, 'Main Course'),
    ('Pizza', 'Margherita pizza with fresh mozzarella', 12.99, 'Main Course'),
    ('Salad', 'Fresh garden salad with vinaigrette', 7.99, 'Appetizer'),
    ('Ice Cream', 'Vanilla ice cream with chocolate sauce', 4.99, 'Dessert');

-- Step 16: Insert sample seller
insert into public.sellers (id) 
values ('c3cc0b2f-358d-45e2-963a-1b412266bc93');

-- Step 17: Create indexes
create index if not exists idx_food_items_category on public.food_items(category);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_food_item_id on public.order_items(food_item_id);
create index if not exists idx_orders_seller_status on public.orders(status, created_at desc); 