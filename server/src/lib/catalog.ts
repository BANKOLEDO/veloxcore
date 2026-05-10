export interface CatalogItem {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  price?: string
  metadata?: Record<string, string>
}

const catalog: CatalogItem[] = [
  {
    id: "food-001",
    title: "Chef's Special Jollof Rice",
    category: "Nigerian Food",
    description: "Smoky party-style Jollof rice made with premium long-grain parboiled rice, fresh tomato blend, onions, and our secret spice mix. Served with fried plantains and your choice of chicken or beef.",
    tags: ["jollof", "rice", "party food", "nigerian cuisine", "comfort food"],
    price: "\u20A63,500",
    metadata: { spiceLevel: "Medium", servingSize: "Large Party Pack", origin: "Nigeria" },
  },
  {
    id: "food-002",
    title: "Mama Put's Egusi Soup & Pounded Yam",
    category: "Nigerian Food",
    description: "Rich ground melon seed (egusi) soup cooked with leafy greens, assorted meat, smoked fish, and locust bean seasoning. Served with smooth, hand-pounded yam (iyan).",
    tags: ["egusi", "pounded yam", "swallow", "traditional", "soup"],
    price: "\u20A62,800",
    metadata: { spiceLevel: "Mild", servingSize: "Regular", origin: "South-Western Nigeria" },
  },
  {
    id: "food-003",
    title: "Suya Express \u2014 Spicy Grilled Beef",
    category: "Nigerian Food",
    description: "Tender thinly-sliced beef marinated in ground groundnut cake, ginger, garlic, and our signature suya pepper mix \u2014 roasted over open flame. Served with sliced onions, tomatoes, and fresh pepper.",
    tags: ["suya", "grilled", "street food", "spicy", "northern nigerian"],
    price: "\u20A62,500",
    metadata: { spiceLevel: "Hot", servingSize: "Standard Stick Pack", origin: "Northern Nigeria" },
  },
  {
    id: "food-004",
    title: "Ofada Rice & Ayamase Stew (Designer Stew)",
    category: "Nigerian Food",
    description: "Unpolished locally-grown Ofada rice served with Ayamase \u2014 a flavour-packed greenish stew made from roasted scotch bonnet peppers, palm oil, assorted meat, and traditional spices.",
    tags: ["ofada", "ayamase", "designer stew", "local rice", "western nigerian"],
    price: "\u20A63,200",
    metadata: { spiceLevel: "Hot", servingSize: "Large", origin: "South-Western Nigeria" },
  },
  {
    id: "food-005",
    title: "Abula Special (Amala, Ewedu & Gbegiri)",
    category: "Nigerian Food",
    description: "Smooth yam flour swallow (amala) served with two signature soups \u2014 Ewedu (jute leaf) and Gbegiri (honey bean). The ultimate Yoruba comfort meal.",
    tags: ["amala", "ewedu", "gbegiri", "abula", "yoruba"],
    price: "\u20A62,200",
    metadata: { spiceLevel: "Mild", servingSize: "Regular", origin: "South-Western Nigeria" },
  },
  {
    id: "movie-001",
    title: "The Wedding Party",
    category: "Nollywood Movies",
    description: "A romantic comedy following the chaos and laughter that ensues when two Nigerian families from different backgrounds are brought together by their children's wedding. Starring Banky W, Adesua Etomi, and Richard Mofe-Damijo.",
    tags: ["comedy", "romance", "wedding", "family", "nollywood"],
    price: "\u20A61,500 (rent) / \u20A63,500 (buy)",
    metadata: { year: "2016", director: "Kemi Adetiba", duration: "108 min", rating: "7.2/10" },
  },
  {
    id: "movie-002",
    title: "King of Boys",
    category: "Nollywood Movies",
    description: "A gripping crime thriller about Alhaja Eniola Salami, a powerful businesswoman and political godmother navigating the treacherous underworld of Lagos politics and organised crime.",
    tags: ["crime", "thriller", "politics", "lagos", "drama"],
    price: "\u20A61,500 (rent) / \u20A64,000 (buy)",
    metadata: { year: "2018", director: "Kemi Adetiba", duration: "151 min", rating: "7.5/10" },
  },
  {
    id: "movie-003",
    title: "Blood Sisters",
    category: "Nollywood Movies",
    description: "A thriller about two friends whose lives spiral into danger after a bride-to-be goes missing on the eve of her wedding to a wealthy man with dark secrets.",
    tags: ["thriller", "suspense", "friendship", "netflix nollywood"],
    price: "\u20A61,500 (rent) / \u20A63,500 (buy)",
    metadata: { year: "2022", director: "Bioma Maxwell", duration: "120 min", rating: "6.8/10" },
  },
  {
    id: "movie-004",
    title: "\u00D2l\u00F2t\u016B\u00E9",
    category: "Nollywood Movies",
    description: "A young journalist goes undercover as a prostitute to expose the grim realities of human trafficking in Nigeria. A raw, eye-opening drama that earned international acclaim.",
    tags: ["drama", "social commentary", "human trafficking", "investigative"],
    price: "\u20A61,500 (rent) / \u20A63,500 (buy)",
    metadata: { year: "2019", director: "Kenneth Gyang", duration: "106 min", rating: "7.0/10" },
  },
  {
    id: "movie-005",
    title: "The Milkmaid",
    category: "Nollywood Movies",
    description: "A Fulani milkmaid embarks on a perilous journey through conflict-ridden Northern Nigeria to find her missing husband. A haunting depiction of resilience and faith in the face of terror.",
    tags: ["drama", "thriller", "northern nigeria", "resilience", "fulani"],
    price: "\u20A61,500 (rent) / \u20A63,500 (buy)",
    metadata: { year: "2020", director: "Desmond Ovbiagele", duration: "112 min", rating: "7.4/10" },
  },
  {
    id: "music-001",
    title: "Burna Boy \u2014 African Giant (Album)",
    category: "Music",
    description: "The Grammy-nominated album that took Afro-fusion global. Features hits like \"Anybody\", \"On The Low\", \"Killin Dem\" and \"Gbona\". A masterclass in blending Afrobeat, dancehall, reggae, and pop.",
    tags: ["afrobeat", "afro-fusion", "grammy", "burna boy", "nigerian music"],
    price: "\u20A63,500 (CD) / \u20A65,000 (Vinyl)",
    metadata: { artist: "Burna Boy", year: "2019", tracks: "19", label: "Atlantic Records" },
  },
  {
    id: "music-002",
    title: "Wizkid \u2014 Made in Lagos (Album)",
    category: "Music",
    description: "The iconic album blending Afrobeats with R&B, reggae, and soul. Features the global smash hit \"Essence\" featuring Tems, alongside \"Ginger\", \"Mighty Wine\", and \"Blessed\".",
    tags: ["afrobeat", "wizkid", "r&b", "essence", "nigerian music"],
    price: "\u20A63,500 (CD) / \u20A65,500 (Vinyl)",
    metadata: { artist: "Wizkid", year: "2020", tracks: "14", label: "RCA Records" },
  },
  {
    id: "music-003",
    title: "Davido \u2014 Timeless (Album)",
    category: "Music",
    description: "Davido's triumphant fourth studio album featuring collaborations with Angelique Kidjo, Asake, and Skepta. Tracks include \"Unavailable\", \"Feel\", and \"Over Dem\". Pure Afrobeats royalty.",
    tags: ["afrobeat", "davido", "nigerian music", "party", "30bg"],
    price: "\u20A63,500 (CD) / \u20A65,000 (Vinyl)",
    metadata: { artist: "Davido", year: "2023", tracks: "17", label: "Sony Music" },
  },
  {
    id: "music-004",
    title: "Asake \u2014 Mr. Money with the Vibe (Album)",
    category: "Music",
    description: "The debut album that took Afrobeats by storm. A fusion of Fuji music, Amapiano, and pop that produced hits like \"Omo Ope\", \"Sungba\", and \"Terminator\".",
    tags: ["afrobeat", "asake", "fuji", "amapiano", "nigerian music"],
    price: "\u20A63,000 (CD) / \u20A64,500 (Vinyl)",
    metadata: { artist: "Asake", year: "2022", tracks: "13", label: "YBNL Nation" },
  },
  {
    id: "music-005",
    title: "Tems \u2014 Born in the Wild (Album)",
    category: "Music",
    description: "The debut album from Nigeria's Grammy-winning alt\u00E9 queen. Ethereal vocals, introspective lyrics, and genre-defying production that oscillates between R&B, Afrobeat, and soul.",
    tags: ["alt\u00E9", "r&b", "soul", "tems", "nigerian music"],
    price: "\u20A63,500 (CD) / \u20A65,500 (Vinyl)",
    metadata: { artist: "Tems", year: "2024", tracks: "15", label: "RCA Records" },
  },
  {
    id: "book-001",
    title: "Half of a Yellow Sun \u2014 Chimamanda Ngozi Adichie",
    category: "Books",
    description: "A masterful novel set during the Biafran War, following the intertwined lives of five characters \u2014 a Nigerian university professor, his English wife, a young houseboy, a revolutionary, and a middle-class couple.",
    tags: ["fiction", "historical", "biafra", "war", "african literature"],
    price: "\u20A64,500 (Paperback)",
    metadata: { author: "Chimamanda Ngozi Adichie", year: "2006", pages: "448", awards: "Orange Prize for Fiction" },
  },
  {
    id: "book-002",
    title: "Things Fall Apart \u2014 Chinua Achebe",
    category: "Books",
    description: "The quintessential African novel. Chronicles the life of Okonkwo, a respected Igbo warrior, and the tragic impact of British colonialism and Christian missionaries on traditional Igbo society.",
    tags: ["fiction", "classic", "colonialism", "igbo", "african literature"],
    price: "\u20A63,500 (Paperback)",
    metadata: { author: "Chinua Achebe", year: "1958", pages: "209", awards: "BBC 100 Most Influential Novels" },
  },
  {
    id: "book-003",
    title: "Stay With Me \u2014 Ay\u1ECD\u0300b\u00E1mi Ad\u00E9b\u00E1y\u1ECD\u0300",
    category: "Books",
    description: "A heart-wrenching novel about a Yoruba couple struggling with infertility, marital pressure, and family secrets in modern-day Nigeria. Explores love, betrayal, and the weight of tradition.",
    tags: ["fiction", "family", "marriage", "nigeria", "contemporary"],
    price: "\u20A64,000 (Paperback)",
    metadata: { author: "Ay\u1ECD\u0300b\u00E1mi Ad\u00E9b\u00E1y\u1ECD\u0300", year: "2017", pages: "304", awards: "Shortlisted Baileys Women's Prize" },
  },
  {
    id: "book-004",
    title: "The Secret Lives of Baba Segi's Wives \u2014 Lola Shoneyin",
    category: "Books",
    description: "A darkly comic novel about polygamy in modern Nigeria. When Baba Segi takes a fourth, educated wife, the delicate balance of his household unravels, revealing buried secrets.",
    tags: ["fiction", "polygamy", "family secrets", "comedy", "nigeria"],
    price: "\u20A63,800 (Paperback)",
    metadata: { author: "Lola Shoneyin", year: "2010", pages: "272", awards: "Shortlisted Commonwealth Prize" },
  },
  {
    id: "book-005",
    title: "Purple Hibiscus \u2014 Chimamanda Ngozi Adichie",
    category: "Books",
    description: "A coming-of-age story about fifteen-year-old Kambili growing up in a wealthy but oppressive Catholic household in post-colonial Nigeria under her fanatical father's rule.",
    tags: ["fiction", "coming of age", "family", "religion", "nigeria"],
    price: "\u20A64,000 (Paperback)",
    metadata: { author: "Chimamanda Ngozi Adichie", year: "2003", pages: "320", awards: "Commonwealth Writers' Prize" },
  },
  {
    id: "drink-001",
    title: "Chapman Deluxe (Nigerian Classic Cocktail)",
    category: "Drinks",
    description: "Nigeria's favourite non-alcoholic cocktail. A refreshing blend of Fanta orange, Grenadine syrup, Angostura bitters, cucumber, lemon, and ice. Served with cherries and orange slice.",
    tags: ["chapman", "cocktail", "non-alcoholic", "party drink", "nigerian"],
    price: "\u20A61,500 (Glass) / \u20A64,500 (Pitcher)",
    metadata: { type: "Non-Alcoholic", serving: "Chilled", origin: "Nigeria" },
  },
  {
    id: "drink-002",
    title: "Zobo Bliss (Hibiscus Drink)",
    category: "Drinks",
    description: "Traditional Nigerian hibiscus drink brewed with dried zobo leaves, ginger, cloves, and pineapple. Naturally rich in vitamin C. Served chilled with a hint of sugar or honey.",
    tags: ["zobo", "hibiscus", "traditional", "non-alcoholic", "healthy"],
    price: "\u20A6800 (Cup) / \u20A62,500 (Bottle)",
    metadata: { type: "Non-Alcoholic", serving: "Chilled", origin: "Northern Nigeria" },
  },
  {
    id: "drink-003",
    title: "Fresh Palm Wine (Emu)",
    category: "Drinks",
    description: "Freshly tapped palm wine from the raffia palm tree. Naturally fermented, slightly sweet, and mildly effervescent. Best served ice-cold straight from the calabash.",
    tags: ["palm wine", "emu", "traditional", "fermented", "natural"],
    price: "\u20A6500 (Cup) / \u20A62,000 (Gallon)",
    metadata: { type: "Alcoholic (Natural)", serving: "Chilled", origin: "South-Eastern Nigeria" },
  },
  {
    id: "drink-004",
    title: "Kunu Aya (Tigernut Milk)",
    category: "Drinks",
    description: "Creamy, dairy-free milk made from fresh tiger nuts, dates, coconut, and a hint of vanilla. A popular Northern Nigerian beverage packed with fibre, vitamins, and natural energy.",
    tags: ["kunu", "tigernut", "dairy-free", "healthy", "northern nigerian"],
    price: "\u20A6600 (Cup) / \u20A61,800 (Bottle)",
    metadata: { type: "Non-Alcoholic", serving: "Chilled", origin: "Northern Nigeria" },
  },
  {
    id: "drink-005",
    title: "Fura de Nunu (Millet & Yoghurt Drink)",
    category: "Drinks",
    description: "A traditional Northern Nigerian refreshment \u2014 rolled millet balls (fura) soaked in fresh fermented cow milk (nunu). Tangy, filling, and incredibly refreshing.",
    tags: ["fura", "nunu", "millet", "yoghurt", "northern nigerian"],
    price: "\u20A6700 (Cup) / \u20A62,000 (Bottle)",
    metadata: { type: "Non-Alcoholic", serving: "Chilled", origin: "Northern Nigeria" },
  },
  {
    id: "elec-001",
    title: "Tecno Phantom V Fold",
    category: "Electronics",
    description: "The flagship foldable smartphone from Tecno. 7.85\" LTPO AMOLED main display, MediaTek Dimensity 9000+ processor, 50MP triple camera, and 5000mAh battery. The ultimate multitasking device.",
    tags: ["smartphone", "foldable", "tecno", "android", "premium"],
    price: "\u20A6950,000",
    metadata: { brand: "Tecno", ram: "12GB", storage: "256GB", battery: "5000mAh" },
  },
  {
    id: "elec-002",
    title: "Infinix Note 40 Pro",
    category: "Electronics",
    description: "A feature-packed mid-range smartphone with 108MP camera, 6.78\" FHD+ AMOLED display, MediaTek Helio G99, and 5000mAh with 45W fast charging. Exceptional value for money.",
    tags: ["smartphone", "infinix", "android", "mid-range", "value"],
    price: "\u20A6320,000",
    metadata: { brand: "Infinix", ram: "8GB", storage: "256GB", battery: "5000mAh" },
  },
  {
    id: "elec-003",
    title: "Dell Inspiron 15 Laptop",
    category: "Electronics",
    description: "Reliable 15.6\" laptop powered by Intel Core i7-1355U, 16GB DDR4 RAM, 512GB SSD, and Intel Iris Xe graphics. Perfect for work, study, and light creative tasks.",
    tags: ["laptop", "dell", "windows", "productivity", "work"],
    price: "\u20A6650,000",
    metadata: { brand: "Dell", ram: "16GB", storage: "512GB SSD", processor: "Intel Core i7-1355U" },
  },
  {
    id: "elec-004",
    title: "Soundcore Motion Boom Plus Speaker",
    category: "Electronics",
    description: "Portable Bluetooth speaker with 80W stereo sound, deep bass, IP67 waterproof rating, and 20-hour battery life. Built for outdoor parties and loud music sessions.",
    tags: ["speaker", "bluetooth", "portable", "bass", "outdoor"],
    price: "\u20A685,000",
    metadata: { brand: "Soundcore", battery: "20hrs", waterproof: "IP67", power: "80W" },
  },
  {
    id: "elec-005",
    title: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    description: "Industry-leading noise cancellation with Sony's HD Noise Cancelling Processor QN1. 30-hour battery, crystal-clear hands-free calling, and ultra-comfortable design for all-day wear.",
    tags: ["headphones", "noise cancelling", "sony", "premium", "wireless"],
    price: "\u20A6450,000",
    metadata: { brand: "Sony", battery: "30hrs", type: "Over-Ear", noiseCancelling: "Adaptive" },
  },
  {
    id: "fashion-001",
    title: "Premium Ankara Gown Set",
    category: "Fashion",
    description: "Stunning floor-length African print gown made from premium 100% cotton Ankara fabric. Features intricate patterns, flattering A-line silhouette, and matching headwrap (gele) included.",
    tags: ["ankara", "gown", "african print", "women fashion", "traditional"],
    price: "\u20A625,000",
    metadata: { material: "100% Cotton Ankara", sizes: "S-3XL", care: "Hand Wash" },
  },
  {
    id: "fashion-002",
    title: "Agbada Deluxe Package",
    category: "Fashion",
    description: "Luxurious four-piece agbada set crafted from high-quality brocade fabric with elegant embroidery. Includes the free-flowing outer robe (agbada), inner tunic (awotele), trousers (sokoto), and matching cap (fila).",
    tags: ["agbada", "traditional", "men fashion", "luxury", "ceremony"],
    price: "\u20A655,000",
    metadata: { material: "Premium Brocade", sizes: "M-4XL", care: "Dry Clean Only" },
  },
  {
    id: "fashion-003",
    title: "Native Senator Wear (Senator Style)",
    category: "Fashion",
    description: "Modern Nigerian senator-style outfit with intricate embroidery detail on premium cotton fabric. Features the signature high collar, embroidered chest panel, and matching trousers.",
    tags: ["senator", "native", "men fashion", "casual", "formal"],
    price: "\u20A635,000",
    metadata: { material: "Premium Cotton", sizes: "M-4XL", care: "Dry Clean Recommended" },
  },
  {
    id: "fashion-004",
    title: "Dashiki Print Collection",
    category: "Fashion",
    description: "Vibrant dashiki-print streetwear collection featuring bold African patterns. Includes a relaxed-fit dashiki top with matching joggers. Perfect for casual outings and cultural events.",
    tags: ["dashiki", "streetwear", "casual", "unisex", "african print"],
    price: "\u20A618,000",
    metadata: { material: "Cotton Blend", sizes: "XS-3XL", care: "Machine Wash" },
  },
  {
    id: "fashion-005",
    title: "Modern Kente Blazer",
    category: "Fashion",
    description: "A contemporary take on the classic Kente cloth \u2014 woven into a sharp, tailored blazer. Perfect for weddings, graduations, and formal events where you want to make a statement.",
    tags: ["kente", "blazer", "formal", "luxury", "ghanaian inspired"],
    price: "\u20A675,000",
    metadata: { material: "Handwoven Kente", sizes: "M-3XL", care: "Dry Clean Only" },
  },
]

export function getCatalog(): CatalogItem[] {
  return catalog
}

export function getCatalogByCategory(category: string): CatalogItem[] {
  return catalog.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()))
}

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id)
}

export function getCategories() {
  const cats = new Map<string, number>()
  for (const item of catalog) {
    cats.set(item.category, (cats.get(item.category) || 0) + 1)
  }
  return Array.from(cats.entries()).map(([name, count]) => ({ name, count }))
}

export function searchCatalog(query: string): CatalogItem[] {
  const q = query.toLowerCase()
  return catalog.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q),
  )
}
