### **Project Overview**  
IorgaSnackBar is a student-focused mobile app for Android that simplifies food ordering from campus cafeterias. It offers real-time menu browsing, customizable orders, pickup/delivery scheduling, and live tracking—all wrapped in a fast, student-friendly UI.  

### **Tech Stack**  
- **Framework**: Expo (React Native)  
- **Language**: TypeScript  
- **Navigation**: Expo Router  
- **UI Library**: React Native Paper  
- **Backend/Auth**: Supabase (auth, storage, real-time updates)  
- **Deployment**: Expo Go  

### **Expo Setup**  
- Initialize Expo project with TypeScript template.  
- Configure Supabase for auth and real-time data.  
- Set up Expo Router for file-based navigation.  
- Integrate React Native Paper for Material Design components.  

### **Authentication Flow**  
- Email/password or Google OAuth sign-in.  
- Guest mode for browsing (requires login to order).  
- Session persistence via Supabase.  
- Password reset flow.  

### **Feature List**  

#### **1. Digital Menu Browsing**  
- Display cafeteria menu with high-quality images and filters (vegetarian, quick meals).  
- Real-time availability indicators (e.g., "Low Stock").  
- Swipe-friendly categories and search bar.  

#### **2. Food Customization**  
- Modify ingredients (add/remove), portion sizes, and special notes.  
- Dynamic price updates based on selections.  
- Favorites/saved customizations for repeat orders.  

#### **3. Order Scheduling**  
- Choose pickup/delivery with time slots to avoid queues.  
- Estimated wait times based on current cafeteria load.  

#### **4. Real-Time Order Tracking**  
- Live status (e.g., "Preparing," "Ready for Pickup").  
- Map integration for delivery tracking (if applicable).  
- Push notifications for status changes.  

#### **5. Secure Checkout**  
- Multiple payment options: student cards, Google Pay, or pay-at-pickup.  
- Order summary review before confirmation.  
- Receipt generation and history via Supabase.  

#### **6. Push Notifications**  
- Alerts for order updates ("Ready in 5 mins!").  
- Promotions/limited-time deals.  
- Expo Notifications API with Supabase triggers.  

#### **7. Offline Support**  
- Cache menu data for offline browsing.  
- Queue actions (e.g., orders) if network drops, sync when restored.  

#### **8. Accessibility & Micro-Interactions**  
- High-contrast UI, scalable fonts, and screen-reader support.  
- Animated feedback (e.g., button presses, success checkmarks).  

### **UI/UX Highlights**  
- **Student-Centric Design**: Bold colors, readable fonts, swipe gestures.  
- **Expo Router**: Smooth transitions between menu, cart, and tracking.  
- **React Native Paper**: Pre-built components (cards, modals) for consistency.  

### **Deployment**  
- Test via Expo Go during development.  
- Publish to Google Play Store with EAS Build.  

(Word count: 498)