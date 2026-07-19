// js/products.js

const CATEGORIES = [
  {id:'fruits',        name:'Fruits',          emoji:'🍎'},
  {id:'vegetables',    name:'Vegetables',       emoji:'🥦'},
  {id:'dairy',         name:'Dairy',            emoji:'🥛'},
  {id:'snacks',        name:'Snacks',           emoji:'🍿'},
  {id:'beverages',     name:'Beverages',        emoji:'🧃'},
  {id:'atta-rice',     name:'Atta & Rice',      emoji:'🌾'},
  {id:'eggs-meat',     name:'Eggs & Meat',      emoji:'🥚'},
  {id:'bakery',        name:'Bakery',           emoji:'🍞'},
  {id:'personal-care', name:'Personal Care',    emoji:'🧴'},
  {id:'household',     name:'Household',        emoji:'🧹'},
  {id:'masala-dal',    name:'Masale & Dal',     emoji:'🌶️'},
  {id:'sweets',        name:'Sweet & Mithai',   emoji:'🍬'},
  {id:'grocery',       name:'Grocery Staples',  emoji:'🛒'},
  {id:'tech',          name:'Tech & Gadgets',   emoji:'💻'},
  {id:'electronics',   name:'Electronics',     emoji:'🔌'},
  {id:'clothes',       name:'Clothes',         emoji:'👕'},
  {id:'medicine',      name:'Medicine',        emoji:'💊'},
];


const INITIAL_PRODUCTS = [
  // ─────────────────────────── Fruits ───────────────────────────
  { id: 1001, name: 'Premium Bananas',    emoji: '🍌', category: 'fruits', price:  29, originalPrice:  40, weight: '500g',  stock: 150, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1002, name: 'Washington Apples', emoji: '🍎', category: 'fruits', price:  89, originalPrice: 120, weight: '1kg',   stock: 200, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1003, name: 'Alphonso Mangoes',  emoji: '🥭', category: 'fruits', price: 149, originalPrice: 200, weight: '1kg',   stock:  50, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1004, name: 'Green Grapes',      emoji: '🍇', category: 'fruits', price:  79, originalPrice: 100, weight: '500g',  stock:  80, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1005, name: 'Kiran Watermelon',  emoji: '🍉', category: 'fruits', price:  59, originalPrice:  80, weight: '1pc',   stock: 100, badge: 'NEW',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 1006, name: 'Papaya',            emoji: '🍈', category: 'fruits', price:  45, originalPrice:  60, weight: '1pc',   stock:  60, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1007, name: 'Pomegranate',       emoji: '💖', category: 'fruits', price:  99, originalPrice: 130, weight: '500g',  stock:  75, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1008, name: 'Nagpur Oranges',    emoji: '🍊', category: 'fruits', price:  69, originalPrice:  90, weight: '1kg',   stock:  90, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1009, name: 'Strawberries',      emoji: '🍓', category: 'fruits', price: 129, originalPrice: 180, weight: '200g',  stock:  40, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1010, name: 'Zespri Kiwi',       emoji: '🥝', category: 'fruits', price: 149, originalPrice: 199, weight: '3pcs',  stock: 120, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Vegetables ───────────────────────────
  { id: 1011, name: 'Hybrid Tomatoes',  emoji: '🍅', category: 'vegetables', price:  30, originalPrice:  45, weight: '1kg',  stock: 300, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1012, name: 'Red Onions',       emoji: '🧅', category: 'vegetables', price:  25, originalPrice:  35, weight: '1kg',  stock: 500, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1013, name: 'Potatoes',         emoji: '🥔', category: 'vegetables', price:  22, originalPrice:  30, weight: '1kg',  stock: 400, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1014, name: 'Fresh Spinach',    emoji: '🥬', category: 'vegetables', price:  20, originalPrice:  30, weight: '250g', stock: 100, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1015, name: 'Capsicum',         emoji: '🫑', category: 'vegetables', price:  35, originalPrice:  50, weight: '500g', stock: 150, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1016, name: 'Carrot',           emoji: '🥕', category: 'vegetables', price:  30, originalPrice:  45, weight: '500g', stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1017, name: 'Cauliflower',      emoji: '🥦', category: 'vegetables', price:  40, originalPrice:  55, weight: '1pc',  stock:  90, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1018, name: 'Broccoli',         emoji: '🥦', category: 'vegetables', price:  55, originalPrice:  80, weight: '1pc',  stock:  70, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1019, name: 'Cucumber',         emoji: '🥒', category: 'vegetables', price:  25, originalPrice:  35, weight: '500g', stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1020, name: 'Green Peas',       emoji: '🫛', category: 'vegetables', price:  45, originalPrice:  60, weight: '500g', stock: 120, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Dairy ───────────────────────────
  { id: 1021, name: 'Amul Taaza Milk',  emoji: '🥛', category: 'dairy', price:  32, originalPrice:  34, weight: '500ml', stock: 500, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1022, name: 'Amul Masti Curd', emoji: '🍶', category: 'dairy', price:  45, originalPrice:  50, weight: '400g',  stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1023, name: 'Malai Paneer',    emoji: '🧀', category: 'dairy', price:  89, originalPrice: 105, weight: '200g',  stock: 150, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1024, name: 'Amul Butter',     emoji: '🧈', category: 'dairy', price:  55, originalPrice:  58, weight: '100g',  stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1025, name: 'Cheese Cubes',    emoji: '🧀', category: 'dairy', price:  99, originalPrice: 110, weight: '200g',  stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1026, name: 'Pure Cow Ghee',   emoji: '🫙', category: 'dairy', price: 299, originalPrice: 350, weight: '500ml', stock: 120, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1027, name: 'Amul Lassi',      emoji: '🧃', category: 'dairy', price:  25, originalPrice:  28, weight: '250ml', stock: 400, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1028, name: 'Fresh Cream',     emoji: '🥛', category: 'dairy', price:  45, originalPrice:  52, weight: '250ml', stock: 100, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1029, name: 'Firm Tofu',       emoji: '🧊', category: 'dairy', price:  89, originalPrice: 110, weight: '200g',  stock:  80, badge: 'NEW', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1030, name: 'Condensed Milk',  emoji: '🥫', category: 'dairy', price:  65, originalPrice:  75, weight: '200g',  stock: 150, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Snacks ───────────────────────────
  { id: 1031, name: "Lay's Classic",      emoji: '🥔', category: 'snacks', price:  20, originalPrice:  20, weight: '50g',  stock: 500, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1032, name: 'Kurkure Masala',    emoji: '🌶️', category: 'snacks', price:  20, originalPrice:  20, weight: '50g',  stock: 450, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1033, name: 'Haldiram Bhujia',   emoji: '🥣', category: 'snacks', price:  55, originalPrice:  60, weight: '200g', stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1034, name: 'Maggi 2-Min',       emoji: '🍜', category: 'snacks', price:  14, originalPrice:  14, weight: '70g',  stock: 800, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1035, name: 'Top Ramen',         emoji: '🍜', category: 'snacks', price:  14, originalPrice:  14, weight: '70g',  stock: 400, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1036, name: 'Act II Popcorn',    emoji: '🍿', category: 'snacks', price:  35, originalPrice:  40, weight: '100g', stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1037, name: 'Doritos Nachos',    emoji: '🔺', category: 'snacks', price:  49, originalPrice:  55, weight: '90g',  stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1038, name: 'Digestive Biscuits',emoji: '🍪', category: 'snacks', price:  55, originalPrice:  65, weight: '250g', stock: 350, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1039, name: 'Oreo Vanilla',      emoji: '🍪', category: 'snacks', price:  35, originalPrice:  40, weight: '120g', stock: 400, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1040, name: 'Pringles Original', emoji: '🥔', category: 'snacks', price: 149, originalPrice: 165, weight: '110g', stock: 150, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Beverages ───────────────────────────
  { id: 1041, name: 'Sprite',          emoji: '🍋', category: 'beverages', price:  40, originalPrice:  45, weight: '750ml', stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1042, name: 'Coca Cola',       emoji: '🥤', category: 'beverages', price:  40, originalPrice:  45, weight: '750ml', stock: 350, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1043, name: 'Thumbs Up',       emoji: '⚡', category: 'beverages', price:  40, originalPrice:  45, weight: '750ml', stock: 400, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1044, name: 'Limca',           emoji: '🍋', category: 'beverages', price:  35, originalPrice:  40, weight: '750ml', stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1045, name: 'Maaza',           emoji: '🥭', category: 'beverages', price:  35, originalPrice:  40, weight: '600ml', stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1046, name: 'Red Bull',        emoji: '🔋', category: 'beverages', price: 125, originalPrice: 135, weight: '250ml', stock: 150, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1047, name: 'Tropicana Mixed', emoji: '🧃', category: 'beverages', price:  65, originalPrice:  75, weight: '1L',    stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Atta & Rice ───────────────────────────
  { id: 1048, name: 'Aashirvaad Atta',    emoji: '🌾', category: 'atta-rice', price: 280, originalPrice: 320, weight: '5kg', stock: 150, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1049, name: 'Fortune Atta',       emoji: '🌾', category: 'atta-rice', price: 260, originalPrice: 300, weight: '5kg', stock: 100, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1050, name: 'India Gate Basmati', emoji: '🍚', category: 'atta-rice', price: 120, originalPrice: 150, weight: '1kg', stock: 250, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1051, name: 'Sona Masoori',       emoji: '🍚', category: 'atta-rice', price:  95, originalPrice: 110, weight: '1kg', stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1052, name: 'Thick Poha',         emoji: '🥣', category: 'atta-rice', price:  45, originalPrice:  55, weight: '500g',stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1053, name: 'Suji/Rava',          emoji: '🥣', category: 'atta-rice', price:  35, originalPrice:  45, weight: '500g',stock: 220, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Eggs & Meat ───────────────────────────
  { id: 1054, name: 'White Eggs',       emoji: '🥚', category: 'eggs-meat', price:  72, originalPrice:  85, weight: '12pcs', stock: 300, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1055, name: 'Brown Eggs',       emoji: '🥚', category: 'eggs-meat', price:  89, originalPrice: 100, weight: '6pcs',  stock: 150, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1056, name: 'Chicken Breast',   emoji: '🍗', category: 'eggs-meat', price: 199, originalPrice: 240, weight: '500g',  stock: 100, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1057, name: 'Curry Cut Chicken',emoji: '🍗', category: 'eggs-meat', price: 179, originalPrice: 220, weight: '500g',  stock: 120, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1058, name: 'Basa Fish Fillet', emoji: '🐟', category: 'eggs-meat', price: 249, originalPrice: 300, weight: '500g',  stock:  80, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Bakery ───────────────────────────
  { id: 1059, name: 'White Bread',     emoji: '🍞', category: 'bakery', price:  45, originalPrice:  50, weight: '400g', stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1060, name: 'Ladi Pav',        emoji: '🥐', category: 'bakery', price:  30, originalPrice:  35, weight: '6pcs', stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1061, name: 'Burger Buns',     emoji: '🍔', category: 'bakery', price:  35, originalPrice:  40, weight: '4pcs', stock: 150, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1062, name: 'Suji Rusk',       emoji: '🥖', category: 'bakery', price:  55, originalPrice:  65, weight: '200g', stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1063, name: 'Choco Cake Slice',emoji: '🍰', category: 'bakery', price:  49, originalPrice:  60, weight: '1pc',  stock: 100, badge: 'NEW', viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Personal Care ───────────────────────────
  { id: 1064, name: 'Dove Soap',        emoji: '🧼', category: 'personal-care', price:  45, originalPrice:  52, weight: '1pc',   stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1065, name: 'Head & Shoulders', emoji: '🧴', category: 'personal-care', price: 199, originalPrice: 220, weight: '340ml', stock: 150, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1066, name: 'Colgate Strong',   emoji: '🪥', category: 'personal-care', price:  55, originalPrice:  65, weight: '100g',  stock: 400, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1067, name: 'Dettol Liquid',    emoji: '🩸', category: 'personal-care', price:  89, originalPrice: 105, weight: '250ml', stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1068, name: 'Gillette Guard',   emoji: '🪒', category: 'personal-care', price: 149, originalPrice: 180, weight: '1pc',   stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1069, name: 'Nivea Soft Cream', emoji: '🧴', category: 'personal-care', price: 129, originalPrice: 150, weight: '100ml', stock: 120, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Household ───────────────────────────
  { id: 1070, name: 'Surf Excel Matic', emoji: '🧺', category: 'household', price: 199, originalPrice: 230, weight: '1kg',   stock: 200, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 1071, name: 'Vim Dishwash Gel', emoji: '🧽', category: 'household', price:  79, originalPrice:  90, weight: '250ml', stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1072, name: 'Harpic Toilet',    emoji: '🚽', category: 'household', price:  99, originalPrice: 115, weight: '500ml', stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1073, name: 'Colin Glass',      emoji: '🪟', category: 'household', price:  89, originalPrice: 100, weight: '500ml', stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1074, name: 'Odonil Block',     emoji: '🌸', category: 'household', price:  55, originalPrice:  65, weight: '1pc',   stock: 220, badge: '',     viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Masale & Dal ───────────────────────────
  { id: 1075, name: 'Toor Dal',              emoji: '🫘', category: 'masala-dal', price:  90, originalPrice: 110, weight: '500g', stock: 350, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1076, name: 'Chana Dal',             emoji: '🫘', category: 'masala-dal', price:  85, originalPrice: 100, weight: '500g', stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1077, name: 'MDH Chana Masala',      emoji: '🌶️', category: 'masala-dal', price:  75, originalPrice:  85, weight: '100g', stock: 400, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1078, name: 'Everest Garam Masala',  emoji: '🌶️', category: 'masala-dal', price:  65, originalPrice:  75, weight: '100g', stock: 450, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1079, name: 'Turmeric Powder',       emoji: '🟡', category: 'masala-dal', price:  45, originalPrice:  55, weight: '100g', stock: 500, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 1080, name: 'Rajma',                 emoji: '🫘', category: 'masala-dal', price:  95, originalPrice: 115, weight: '500g', stock: 250, badge: 'NEW', viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Sweet & Mithai ───────────────────────────
  { id: 1081, name: 'Haldiram Kaju Katli', emoji: '🍬', category: 'sweets', price: 299, originalPrice: 350, weight: '250g', stock: 100, badge: 'HOT',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 1082, name: 'Gulab Jamun Tin',     emoji: '🧆', category: 'sweets', price:  89, originalPrice: 110, weight: '500g', stock: 150, badge: '',      viewers: Math.floor(Math.random()*45)+5 },
  { id: 1083, name: 'Rasgulla Tin',        emoji: '⚪', category: 'sweets', price:  75, originalPrice:  95, weight: '500g', stock: 180, badge: '',      viewers: Math.floor(Math.random()*45)+5 },
  { id: 1084, name: 'Fresh Jalebi',        emoji: '🥨', category: 'sweets', price:  55, originalPrice:  70, weight: '250g', stock:  80, badge: '',      viewers: Math.floor(Math.random()*45)+5 },
  { id: 1085, name: 'Motichoor Ladoo',     emoji: '🟠', category: 'sweets', price:  99, originalPrice: 120, weight: '250g', stock: 120, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Grocery Staples (NEW) ───────────────────────────
  { id: 2001, name: 'Fortune Sunflower Oil', emoji: '🛢️', category: 'grocery', price: 145, originalPrice: 175, weight: '1L',   stock: 300, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 2002, name: 'Saffola Gold Oil',      emoji: '🛢️', category: 'grocery', price: 165, originalPrice: 195, weight: '1L',   stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2003, name: 'Tata Salt',             emoji: '🧂', category: 'grocery', price:  22, originalPrice:  25, weight: '1kg',  stock: 600, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2004, name: 'Sugar (Crystal)',       emoji: '🍬', category: 'grocery', price:  45, originalPrice:  55, weight: '1kg',  stock: 500, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2005, name: 'Tata Tea Gold',         emoji: '☕', category: 'grocery', price: 105, originalPrice: 120, weight: '250g', stock: 400, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
  { id: 2006, name: 'Nescafe Classic',       emoji: '☕', category: 'grocery', price: 189, originalPrice: 215, weight: '50g',  stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2007, name: 'Kissan Mixed Jam',      emoji: '🍓', category: 'grocery', price:  99, originalPrice: 115, weight: '200g', stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2008, name: 'Kissan Tomato Ketchup', emoji: '🍅', category: 'grocery', price:  85, originalPrice:  99, weight: '500g', stock: 220, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 2009, name: 'Borges Olive Oil',      emoji: '🫒', category: 'grocery', price: 499, originalPrice: 599, weight: '500ml',stock: 100, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2010, name: 'Honey (Dabur)',         emoji: '🍯', category: 'grocery', price: 139, originalPrice: 160, weight: '250g', stock: 150, badge: 'NEW', viewers: Math.floor(Math.random()*45)+5 },
  { id: 2011, name: 'Patanjali Desi Ghee',   emoji: '🫙', category: 'grocery', price: 275, originalPrice: 320, weight: '500ml',stock: 130, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2012, name: 'Amul Dark Chocolate',   emoji: '🍫', category: 'grocery', price:  55, originalPrice:  65, weight: '150g', stock: 350, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2013, name: 'Moong Dal',             emoji: '🫘', category: 'grocery', price:  99, originalPrice: 120, weight: '500g', stock: 280, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2014, name: 'Masoor Dal',            emoji: '🫘', category: 'grocery', price:  85, originalPrice: 100, weight: '500g', stock: 260, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 2015, name: 'Heinz Mayonnaise',      emoji: '🥣', category: 'grocery', price: 149, originalPrice: 175, weight: '400g', stock: 120, badge: 'NEW', viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Tech & Gadgets (NEW) ───────────────────────────
  { id: 3001, name: 'boAt Airdopes 141',      emoji: '🎧', category: 'tech', price:  999, originalPrice: 1499, weight: '1pc',   stock: 150, badge: 'HOT',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 3002, name: 'Noise Buds VS104',       emoji: '🎧', category: 'tech', price:  799, originalPrice: 1299, weight: '1pc',   stock: 120, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 3003, name: 'boAt Rockerz 255',       emoji: '🎵', category: 'tech', price: 1299, originalPrice: 1999, weight: '1pc',   stock:  80, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 3004, name: 'Portronics USB-C Cable', emoji: '🔌', category: 'tech', price:  299, originalPrice:  449, weight: '1m',    stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 3005, name: 'Ambrane 20000mAh',       emoji: '🔋', category: 'tech', price: 1499, originalPrice: 2199, weight: '1pc',   stock:  90, badge: 'HOT',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 3006, name: 'Mi 20W Fast Charger',    emoji: '⚡', category: 'tech', price:  499, originalPrice:  699, weight: '1pc',   stock: 200, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 3007, name: 'Redmi Smart Band 2',     emoji: '⌚', category: 'tech', price: 2099, originalPrice: 2799, weight: '1pc',   stock:  60, badge: 'NEW',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 3008, name: 'Ant Esports MK3200',     emoji: '⌨️', category: 'tech', price: 1199, originalPrice: 1799, weight: '1pc',   stock:  70, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 3009, name: 'ZEBRONICS Zeb-Comfort',  emoji: '🖱️', category: 'tech', price:  349, originalPrice:  499, weight: '1pc',   stock: 150, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 3010, name: 'TP-Link USB Wi-Fi',      emoji: '📶', category: 'tech', price:  599, originalPrice:  799, weight: '1pc',   stock: 100, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 3011, name: 'HP 16GB Pen Drive',      emoji: '💾', category: 'tech', price:  299, originalPrice:  449, weight: '1pc',   stock: 250, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 3012, name: 'Screen Cleaning Kit',    emoji: '🖥️', category: 'tech', price:  199, originalPrice:  299, weight: '1pc',   stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 3013, name: 'Syska LED Bulb 9W',      emoji: '💡', category: 'tech', price:   89, originalPrice:  129, weight: '1pc',   stock: 400, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 3014, name: 'Philips Extension Cord', emoji: '🔌', category: 'tech', price:  599, originalPrice:  799, weight: '1pc',   stock: 130, badge: 'HOT',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 3015, name: 'JBL Go 3 Speaker',       emoji: '🔊', category: 'tech', price: 2999, originalPrice: 3999, weight: '1pc',   stock:  50, badge: 'NEW',  viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Electronics ───────────────────────────
  { id: 4001, name: 'LED Bulb 12W',           emoji: '💡', category: 'electronics', price:  99, originalPrice: 149, weight: '1pc',  stock: 300, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 4002, name: 'Extension Board 4-Socket', emoji: '🔌', category: 'electronics', price: 349, originalPrice: 499, weight: '1pc', stock: 150, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 4003, name: 'USB Type-C Charger 22W', emoji: '⚡', category: 'electronics', price: 599, originalPrice: 799, weight: '1pc',  stock: 200, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 4004, name: 'Wired Earphones',        emoji: '🎧', category: 'electronics', price: 199, originalPrice: 299, weight: '1pc',  stock: 250, badge: 'HOT',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 4005, name: 'Table Fan 12-inch',      emoji: '🌀', category: 'electronics', price: 899, originalPrice: 1199, weight: '1pc', stock:  60, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 4006, name: 'Torch Light Rechargeable', emoji: '🔦', category: 'electronics', price: 249, originalPrice: 349, weight: '1pc', stock: 120, badge: 'NEW', viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Clothes ───────────────────────────
  { id: 5001, name: 'Men Cotton T-Shirt',     emoji: '👕', category: 'clothes', price: 299, originalPrice: 499, weight: '1pc',  stock: 200, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 5002, name: 'Women Kurti',            emoji: '👗', category: 'clothes', price: 449, originalPrice: 699, weight: '1pc',  stock: 150, badge: 'NEW',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 5003, name: 'Kids T-Shirt',           emoji: '👶', category: 'clothes', price: 199, originalPrice: 299, weight: '1pc',  stock: 180, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 5004, name: 'Men Formal Shirt',       emoji: '👔', category: 'clothes', price: 599, originalPrice: 899, weight: '1pc',  stock: 100, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 5005, name: 'Cotton Socks Pack of 3', emoji: '🧦', category: 'clothes', price: 149, originalPrice: 199, weight: '1set', stock: 300, badge: 'HOT',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 5006, name: 'Denim Jeans',            emoji: '👖', category: 'clothes', price: 899, originalPrice: 1299, weight: '1pc', stock:  90, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },

  // ─────────────────────────── Medicine ───────────────────────────
  { id: 6001, name: 'Paracetamol 500mg (10 tab)', emoji: '💊', category: 'medicine', price:  25, originalPrice:  35, weight: '10tab', stock: 500, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 6002, name: 'ORS Powder Sachet',      emoji: '🧃', category: 'medicine', price:  20, originalPrice:  30, weight: '1pc',  stock: 400, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 6003, name: 'Antiseptic Liquid 100ml', emoji: '🧴', category: 'medicine', price:  65, originalPrice:  85, weight: '100ml', stock: 200, badge: 'SALE', viewers: Math.floor(Math.random()*45)+5 },
  { id: 6004, name: 'Cotton Bandage Roll',    emoji: '🩹', category: 'medicine', price:  35, originalPrice:  50, weight: '1pc',  stock: 250, badge: '',     viewers: Math.floor(Math.random()*45)+5 },
  { id: 6005, name: 'Digital Thermometer',    emoji: '🌡️', category: 'medicine', price: 199, originalPrice: 299, weight: '1pc', stock: 100, badge: 'NEW',  viewers: Math.floor(Math.random()*45)+5 },
  { id: 6006, name: 'Multivitamin Tablets',   emoji: '💊', category: 'medicine', price: 149, originalPrice: 199, weight: '30tab', stock: 150, badge: 'HOT', viewers: Math.floor(Math.random()*45)+5 },
];

let PRODUCTS = [...INITIAL_PRODUCTS];
const COMBOS = [
  { id: 'c1', name: 'Breakfast Bundle 🌅',   items: [1001, 1021, 1041], totalPrice:  99, originalPrice:  121, emoji: '🌅' },
  { id: 'c2', name: 'Snack Party Pack 🎉',   items: [1031, 1032, 1036], totalPrice:  69, originalPrice:   80, emoji: '🎉' },
  { id: 'c3', name: 'Healthy Bowl 🥗',        items: [1014, 1015, 1017], totalPrice:  89, originalPrice:  115, emoji: '🥗' },
  { id: 'c4', name: 'Weekend Feast 🍗',       items: [1053, 1054, 1003], totalPrice: 499, originalPrice:  609, emoji: '🍗' },
  { id: 'c5', name: 'Tech Starter Kit 💻',   items: [3004, 3006, 3011], totalPrice: 999, originalPrice: 1347, emoji: '💻' },
  { id: 'c6', name: 'Kitchen Essentials 🍳', items: [2001, 2003, 2004], totalPrice: 199, originalPrice:  255, emoji: '🍳' },
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

function getUnsplashUrl(p) {
  const imageMap = {
    // ── Household ──────────────────────────────────────────────────────
    'Surf Excel':        'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&h=200&fit=crop',
    'Vim':               'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop',
    'Harpic':            'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200&h=200&fit=crop',
    'Colin':             'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop',
    'Odonil':            'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=200&h=200&fit=crop',

    // ── Dairy ──────────────────────────────────────────────────────────
    'Milk':              'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop',
    'Curd':              'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
    'Paneer':            'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&h=200&fit=crop',
    'Butter':            'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&h=200&fit=crop',
    'Cheese':            'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=200&fit=crop',
    'Ghee':              'https://images.unsplash.com/photo-1626197031507-c17099753214?w=200&h=200&fit=crop',
    'Lassi':             'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop',
    'Cream':             'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
    'Tofu':              'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=200&h=200&fit=crop',
    'Condensed':         'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',

    // ── Fruits ─────────────────────────────────────────────────────────
    'Banana':            'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop',
    'Apple':             'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop',
    'Mango':             'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop',
    'Grapes':            'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop',
    'Watermelon':        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
    'Papaya':            'https://images.unsplash.com/photo-1524345377868-a5d9aad2a97f?w=200&h=200&fit=crop',
    'Pomegranate':       'https://images.unsplash.com/photo-1541704328070-20bf4601ae3e?w=200&h=200&fit=crop',
    'Orange':            'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop',
    'Strawberr':         'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
    'Kiwi':              'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=200&h=200&fit=crop',

    // ── Vegetables ─────────────────────────────────────────────────────
    'Tomato':            'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=200&h=200&fit=crop',
    'Onion':             'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=200&h=200&fit=crop',
    'Potato':            'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop',
    'Spinach':           'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop',
    'Capsicum':          'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop',
    'Carrot':            'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop',
    'Cauliflower':       'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=200&h=200&fit=crop',
    'Broccoli':          'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop',
    'Cucumber':          'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=200&h=200&fit=crop',
    'Peas':              'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200&h=200&fit=crop',

    // ── Snacks ─────────────────────────────────────────────────────────
    "Lay's":             'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',
    'Kurkure':           'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop',
    'Bhujia':            'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop',
    'Maggi':             'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
    'Ramen':             'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
    'Popcorn':           'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=200&h=200&fit=crop',
    'Doritos':           'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop',
    'Digestive':         'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop',
    'Oreo':              'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop',
    'Pringles':          'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',

    // ── Beverages ──────────────────────────────────────────────────────
    'Sprite':            'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200&h=200&fit=crop',
    'Coca Cola':         'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop',
    'Thumbs':            'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?w=200&h=200&fit=crop',
    'Limca':             'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200&h=200&fit=crop',
    'Maaza':             'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop',
    'Red Bull':          'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=200&h=200&fit=crop',
    'Tropicana':         'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop',

    // ── Atta & Rice ────────────────────────────────────────────────────
    'Atta':              'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop',
    'Basmati':           'https://images.unsplash.com/photo-1536304993881-ff86e0c9b9b5?w=200&h=200&fit=crop',
    'Sona Masoori':      'https://images.unsplash.com/photo-1536304993881-ff86e0c9b9b5?w=200&h=200&fit=crop',
    'Poha':              'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop',
    'Suji':              'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop',

    // ── Eggs & Meat ────────────────────────────────────────────────────
    'Egg':               'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop',
    'Chicken':           'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop',
    'Fish':              'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200&h=200&fit=crop',

    // ── Bakery ─────────────────────────────────────────────────────────
    'Bread':             'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    'Pav':               'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    'Bun':               'https://images.unsplash.com/photo-1620921568790-c1cf8984a4c3?w=200&h=200&fit=crop',
    'Rusk':              'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop',
    'Cake':              'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',

    // ── Personal Care ──────────────────────────────────────────────────
    'Dove':              'https://images.unsplash.com/photo-1631390519301-fd8d5f5a6a04?w=200&h=200&fit=crop',
    'Head & Shoulders':  'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=200&h=200&fit=crop',
    'Colgate':           'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=200&h=200&fit=crop',
    'Dettol':            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
    'Gillette':          'https://images.unsplash.com/photo-1631390519301-fd8d5f5a6a04?w=200&h=200&fit=crop',
    'Nivea':             'https://images.unsplash.com/photo-1556228724-586b1dc92459?w=200&h=200&fit=crop',

    // ── Masale & Dal ───────────────────────────────────────────────────
    'Toor Dal':          'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop',
    'Chana Dal':         'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop',
    'MDH':               'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
    'Everest':           'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
    'Turmeric':          'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=200&h=200&fit=crop',
    'Rajma':             'https://images.unsplash.com/photo-1584279636695-116d4cc3f20d?w=200&h=200&fit=crop',
    'Moong':             'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop',
    'Masoor':            'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop',

    // ── Sweets ─────────────────────────────────────────────────────────
    'Kaju Katli':        'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=200&h=200&fit=crop',
    'Gulab Jamun':       'https://images.unsplash.com/photo-1601303516534-bf4e28b05a0b?w=200&h=200&fit=crop',
    'Rasgulla':          'https://images.unsplash.com/photo-1601303516534-bf4e28b05a0b?w=200&h=200&fit=crop',
    'Jalebi':            'https://images.unsplash.com/photo-1601303516534-bf4e28b05a0b?w=200&h=200&fit=crop',
    'Ladoo':             'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=200&h=200&fit=crop',

    // ── Grocery Staples ────────────────────────────────────────────────
    'Sunflower Oil':     'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
    'Saffola':           'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
    'Fortune':           'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
    'Tata Salt':         'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=200&h=200&fit=crop',
    'Salt':              'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=200&h=200&fit=crop',
    'Sugar':             'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop',
    'Tata Tea':          'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200&h=200&fit=crop',
    'Tea':               'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200&h=200&fit=crop',
    'Nescafe':           'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
    'Coffee':            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
    'Kissan':            'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&h=200&fit=crop',
    'Jam':               'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&h=200&fit=crop',
    'Ketchup':           'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=200&h=200&fit=crop',
    'Olive Oil':         'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
    'Honey':             'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
    'Patanjali':         'https://images.unsplash.com/photo-1626197031507-c17099753214?w=200&h=200&fit=crop',
    'Chocolate':         'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=200&h=200&fit=crop',
    'Mayonnaise':        'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200&h=200&fit=crop',
    'Heinz':             'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200&h=200&fit=crop',

    // ── Tech & Gadgets ─────────────────────────────────────────────────
    'boAt':              'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    'Airdopes':          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    'Noise':             'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    'Buds':              'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    'Rockerz':           'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    'USB-C':             'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=200&h=200&fit=crop',
    'Cable':             'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=200&h=200&fit=crop',
    'Ambrane':           'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop',
    'Power Bank':        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop',
    'Charger':           'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop',
    'Smart Band':        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop',
    'Redmi':             'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop',
    'Keyboard':          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop',
    'MK3200':            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop',
    'Mouse':             'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
    'ZEBRONICS':         'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
    'Wi-Fi':             'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=200&h=200&fit=crop',
    'TP-Link':           'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=200&h=200&fit=crop',
    'Pen Drive':         'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=200&h=200&fit=crop',
    'HP 16GB':           'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=200&h=200&fit=crop',
    'Cleaning Kit':      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    'LED Bulb':          'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop',
    'Syska':             'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop',
    'Extension':         'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=200&h=200&fit=crop',
    'Philips':           'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop',
    'JBL':               'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop',
    'Speaker':           'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop',
  };

  // Match by product name keyword
  for (const [key, url] of Object.entries(imageMap)) {
    if (p.name.includes(key)) return url;
  }

  // Category fallback with relevant images
  const categoryFallback = {
    'fruits':        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop',
    'vegetables':    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=200&h=200&fit=crop',
    'dairy':         'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop',
    'snacks':        'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',
    'atta-rice':     'https://images.unsplash.com/photo-1536304993881-ff86e0c9b9b5?w=200&h=200&fit=crop',
    'beverages':     'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop',
    'eggs-meat':     'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=200&h=200&fit=crop',
    'bakery':        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    'household':     'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&h=200&fit=crop',
    'personal-care': 'https://images.unsplash.com/photo-1584305574647-0cc449a2bb9f?w=200&h=200&fit=crop',
    'masala-dal':    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
    'sweets':        'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=200&h=200&fit=crop',
    'grocery':       'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    'tech':          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop',
  };

  return categoryFallback[p.category] ??
    `https://placehold.co/200x200/2E7D32/white?text=${encodeURIComponent(p.name.split(' ')[0])}`;
}

async function initProducts() {
  if (!window.db || !window.fs) {
    window.addEventListener('firebaseReady', initProducts);
    return;
  }

  const { collection, getDocs, setDoc, doc, onSnapshot } = window.fs;
  const productsRef = collection(window.db, "products");

  // Seed if empty
  const snapshot = await getDocs(productsRef);
  if (snapshot.empty) {
    console.log("Seeding products to Firestore...");
    for (const p of INITIAL_PRODUCTS) {
      await setDoc(doc(productsRef, p.id.toString()), p);
    }
  }

  // Listen for changes
  onSnapshot(productsRef, (snapshot) => {
    PRODUCTS = snapshot.docs.map(doc => {
      const data = doc.data();
      if (data.stock > 0 && data.stock < 5 && (!data.badge || data.badge === 'HOT' || data.badge === 'SALE' || data.badge === 'NEW')) {
        data.badge = `Only ${data.stock} left!`;
      } else if (data.stock >= 5 && data.badge && data.badge.includes('left!')) {
        data.badge = '';
      }
      return data;
    });
    // Re-render
    if (typeof renderCategories === 'function') renderCategories();
    if (typeof renderCombos === 'function') renderCombos();
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
  });
}

initProducts();
