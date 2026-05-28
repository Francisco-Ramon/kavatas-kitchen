export interface Meal {
  id: string;
  title: string;
  description: string;
  category: 'Kenyan' | 'Fast Food' | 'Drinks' | 'Specials' | 'Chef';
  priceKES: number;
  discountPriceKES?: number;
  offerText?: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  ingredients: string[];
  isFeatured?: boolean;
  preparationTime: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'All Masterpieces' },
  { id: 'Kenyan', name: 'Kenyan Heritage' },
  { id: 'Fast Food', name: 'Gourmet Fast Food' },
  { id: 'Drinks', name: 'Elixirs & Chai' },
  { id: 'Specials', name: 'Daily Specials' },
  { id: 'Chef', name: "Chef's Signatures" }
];

export const MEALS: Meal[] = [
  {
    id: 'm1',
    title: 'Swahili Pilau Luxe',
    description: 'Fragrant Basmati rice cooked in a rich blend of traditional Swahili spices, served with tender slow-braised beef and fresh kachumbari.',
    category: 'Kenyan',
    priceKES: 950,
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 148,
    ingredients: ['Basmati Rice', 'Organic Beef', 'Cardamom', 'Cloves', 'Cinnamon', 'Kachumbari'],
    isFeatured: true,
    preparationTime: '30 mins'
  },
  {
    id: 'm2',
    title: 'Flame-Grilled Nyama Choma',
    description: 'Prime cuts of local beef seasoned with organic sea salt, slow-grilled over dry white oak coals, served with hot ugali and sautéed garlic sukuma wiki.',
    category: 'Kenyan',
    priceKES: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 210,
    ingredients: ['Oak-smoked Beef', 'Ugali', 'Sukuma Wiki', 'Traditional Salt', 'Chili dip'],
    isFeatured: true,
    preparationTime: '40 mins'
  },
  {
    id: 'm3',
    title: "Kavata's Special Mukimo",
    description: 'Hand-mashed potatoes, sweet organic corn, green peas, and fresh pumpkin leaves, infused with raw garlic butter, accompanied by aromatic rich beef stew.',
    category: 'Kenyan',
    priceKES: 850,
    imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 95,
    ingredients: ['Mashed Potatoes', 'Sweet Corn', 'Green Peas', 'Pumpkin Leaves', 'Garlic Butter', 'Stew'],
    preparationTime: '25 mins'
  },
  {
    id: 'm4',
    title: 'Crispy Tilapia Wet Fry',
    description: 'Fresh whole lake tilapia fried to golden perfection, then simmered in a dense, rich gravy of ripe tomatoes, bell peppers, ginger, and fresh coriander.',
    category: 'Kenyan',
    priceKES: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 167,
    ingredients: ['Whole Tilapia', 'Rich Tomato Gravy', 'Ginger', 'Bell Peppers', 'Fresh Coriander'],
    isFeatured: true,
    preparationTime: '35 mins'
  },
  {
    id: 'm5',
    title: 'The Safari Luxury Burger',
    description: 'Double wagyu beef patties, melted vintage cheddar, caramelized balsamic onions, crispy smoked bacon, and house black truffle sauce in a toasted gold-dusted brioche bun.',
    category: 'Fast Food',
    priceKES: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 184,
    ingredients: ['Double Wagyu Patties', 'Vintage Cheddar', 'Balsamic Onions', 'Truffle Sauce', 'Gold dust'],
    preparationTime: '20 mins'
  },
  {
    id: 'm6',
    title: 'Spiced Piri Piri Wings',
    description: 'Crispy chicken wings tossed in our secret home-grown habanero and lemon piri piri glaze, served with fresh herb cucumber dipping cream.',
    category: 'Fast Food',
    priceKES: 900,
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 112,
    ingredients: ['Chicken Wings', 'Habanero Piri Piri Glaze', 'Lemon', 'Cucumber Herb Cream'],
    preparationTime: '15 mins'
  },
  {
    id: 'm7',
    title: 'Hibiscus Gold Infusion',
    description: 'Chilled organic hibiscus tea infused with wild mint leaves, fresh ginger, and raw highland honey, finished with a beautiful floating 24k gold leaf.',
    category: 'Drinks',
    priceKES: 450,
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 78,
    ingredients: ['Hibiscus Tea', 'Wild Mint', 'Ginger Extract', 'Highland Honey', '24k Gold Leaf'],
    preparationTime: '5 mins'
  },
  {
    id: 'm8',
    title: "Kavata's Signature Spiced Chai",
    description: 'A slow-simmered rich Kenyan black tea, perfectly blended with freshly crushed cardamom, ginger root, cloves, sweet cinnamon, and creamy whole milk.',
    category: 'Drinks',
    priceKES: 350,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 135,
    ingredients: ['Kenyan Tea Leaves', 'Whole Milk', 'Crushed Ginger', 'Cardamom', 'Cinnamon'],
    preparationTime: '10 mins'
  },
  {
    id: 'm9',
    title: 'Mombasa Lobster Thermidor',
    description: 'Wild coastal lobster tail baked in a rich, velvety cognac, mustard, and aged gruyère cheese sauce, topped with light, buttery herb crust.',
    category: 'Chef',
    priceKES: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 54,
    ingredients: ['Coastal Lobster Tail', 'Cognac Velouté', 'Mustard', 'Gruyère Cheese', 'Herb Crust'],
    isFeatured: true,
    preparationTime: '45 mins'
  },
  {
    id: 'm10',
    title: 'Slow-Roasted Goat Leg (Mbuzi)',
    description: 'A whole prime leg of local goat, marinated for 24 hours in wild garlic and rosemary, slow-roasted for 6 hours until butter-tender, finished with rich red wine reduction.',
    category: 'Specials',
    priceKES: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 89,
    ingredients: ['Local Goat Leg', 'Wild Garlic', 'Fresh Rosemary', 'Red Wine Glaze', 'Roasted Root Veg'],
    preparationTime: '60 mins'
  }
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Wanjiku Kamau',
    role: 'Luxury Connoisseur & Food Blogger',
    content: "Kavata's Kitchen is not just food, it's an absolute spiritual experience. The Pilau Luxe tasted exactly like high-end coastal weddings, and the delivery arrived in customized luxury insulated thermal packages. Incredible!",
    rating: 5,
    category: 'Delicious 😋'
  },
  {
    id: 't2',
    name: 'David Omondi',
    role: 'Senior Tech Lead, Nairobi',
    content: 'The Safari Luxury Burger blew my mind, and the real-time tracking combined with WhatsApp location coordination made it the most seamless delivery I have ever experienced in Kenya. Highly recommended.',
    rating: 5,
    category: 'Fast Delivery 🚀'
  },
  {
    id: 't3',
    name: 'Amina Yusuf',
    role: 'Diplomatic Mission Coordinator',
    content: "The Lobster Thermidor is competitive with Michelin-starred dining in Paris. Kavata's hands-on touch and warm personal call upon delivery make you feel truly valued and respected. This is African luxury at its best.",
    rating: 5,
    category: 'Friendly Service ❤️'
  },
  {
    id: 't4',
    name: 'Michael Mwangi',
    role: 'Wellness Coach',
    content: 'Knowing that every ingredient is freshly sourced from local organic farms makes a huge difference. The Hibiscus Gold drink is refreshing and feels extremely elegant with the gold flake.',
    rating: 5,
    category: 'Fresh Food 🌿'
  }
];
