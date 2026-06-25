export type Category = {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  image: string;
};

export const categories: Category[] = [
  { slug: "cookies", name: "Cookies", icon: "🍪", blurb: "Sugar-free, slow-baked, irresistibly crisp.", image: "cookies" },
  { slug: "gluten-free", name: "Gluten Free", icon: "🌾", blurb: "Ragi, millet & buckwheat goodness.", image: "glutenfree" },
  { slug: "savouries", name: "Savouries", icon: "🥨", blurb: "Herb-spiced crackers, baked never fried.", image: "savouries" },
  { slug: "loaf-cakes", name: "Loaf Cakes", icon: "🍞", blurb: "Tea-time loaves with honest ingredients.", image: "loaf" },
  { slug: "brownies", name: "Brownies", icon: "🍫", blurb: "Fudgy, deep cocoa, zero refined sugar.", image: "brownies" },
  { slug: "celebration-cakes", name: "Celebration Cakes", icon: "🎂", blurb: "Custom cakes for your special moments.", image: "celebration" },
];

export type Product = { name: string; category: string; tags?: string[] };

export const products: Product[] = [
  // Cookies
  { name: "Butter Cookies", category: "cookies" },
  { name: "High Protein Sattu Cookies", category: "cookies", tags: ["Bestseller", "High Protein"] },
  { name: "Dates & Dry Fruits Cookies", category: "cookies" },
  { name: "Kesar Elaichi Cookies", category: "cookies" },
  { name: "Choco Chip Cookies", category: "cookies" },
  { name: "Chocolate Chunk Cookies", category: "cookies" },
  { name: "Buckwheat Cookies", category: "cookies" },
  { name: "Choco Marble Cookies", category: "cookies" },
  { name: "Pista Cookies", category: "cookies" },
  { name: "Dry Fruit Cookies", category: "cookies" },
  { name: "Dates Filled Cookies", category: "cookies", tags: ["Bestseller"] },
  { name: "Coffee Walnut Cookies", category: "cookies" },
  { name: "Coffee Cookies", category: "cookies" },
  { name: "Honey Oats Cookies", category: "cookies" },
  { name: "Caramel Filled Snickers Cookies", category: "cookies", tags: ["New"] },
  // Savouries
  { name: "Methi Masala Crackers", category: "savouries" },
  { name: "Garlic & Herbs Crackers", category: "savouries" },
  { name: "Jeera Cookies", category: "savouries" },
  // Gluten Free
  { name: "Ragi Coconut Oats Cookies", category: "gluten-free" },
  { name: "Elaichi Cookies", category: "gluten-free" },
  { name: "Rose Pista Cookies", category: "gluten-free" },
  { name: "Chocolate Orange Cookies", category: "gluten-free" },
  { name: "Ragi Chocolate Cookies", category: "gluten-free" },
  { name: "Gluten Free Chocolate Tea Cake", category: "gluten-free" },
  // Loaf Cakes
  { name: "Choco Marble Cake", category: "loaf-cakes" },
  { name: "Banana Oats Cake", category: "loaf-cakes", tags: ["Bestseller"] },
  { name: "Blueberry Cake", category: "loaf-cakes" },
  { name: "Tutti Fruity Cake", category: "loaf-cakes" },
  { name: "Vanilla Cake", category: "loaf-cakes" },
  { name: "Choco Walnut Cake", category: "loaf-cakes" },
  { name: "Chocolate Loaf Cake", category: "loaf-cakes" },
  { name: "Danish Dream Cake", category: "loaf-cakes" },
  { name: "Coffee Chocolate Cake", category: "loaf-cakes" },
  // Brownies
  { name: "Chocolate Fudge Brownies", category: "brownies", tags: ["Bestseller"] },
  { name: "Millet Brookies", category: "brownies" },
  { name: "Millet Blondies", category: "brownies" },
  { name: "Whole Wheat Brownies", category: "brownies" },
  { name: "Millet Brownies", category: "brownies" },
  // Delights
  { name: "Bombolinis", category: "delights" },
  { name: "Cinnamon Rolls", category: "delights", tags: ["Bestseller"] },
  { name: "Korean Buns", category: "delights", tags: ["New"] },
  // Celebration
  { name: "Ruby Rush Cake", category: "celebration-cakes" },
  { name: "Christmas Fruit Cake", category: "celebration-cakes" },
  { name: "Chocolate Orange Cake", category: "celebration-cakes" },
  { name: "Cloud Berry Cake", category: "celebration-cakes" },
  { name: "Blueberry Celebration Cake", category: "celebration-cakes" },
  { name: "Chocolate Walnut Cake", category: "celebration-cakes" },
  { name: "Chocolate Truffle Cake", category: "celebration-cakes" },
  { name: "Dry Fruit Cake", category: "celebration-cakes" },
  { name: "Boss Baby Theme Cake", category: "celebration-cakes" },
  { name: "Rain Forest Cake", category: "celebration-cakes" },
];

export const WHATSAPP = "https://wa.me/919999999999?text=Hi%20Shahad%20Bakes%2C%20I%27d%20like%20to%20order";
