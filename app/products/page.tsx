"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PackageOption = {
  label: string;
  price: number;
};

type Product = {
  id: string;
  name: string;
  category: string;
  icon: string;
  image?: string;
  description?: string;
  packages: PackageOption[];
};
if (!isProductInStock(product)) {
  alert("สินค้าหรือแพ็กเกจนี้หมดสต็อกแล้ว");
  return;
}

// ======================================================
// สินค้าทั้งหมด
// ======================================================

const products: Product[] = [
  // ======================================================
  // แอปพรีเมียม
  // ======================================================

  {
    id: "netflix-mobile",
    name: "Netflix มือถือ",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/netflix.jpg",
    packages: [
      { label: "1 วัน", price: 12 },
      { label: "7 วัน", price: 49 },
      { label: "30 วัน", price: 139 },
    ],
  },

  {
    id: "netflix-tv",
    name: "Netflix TV",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/netflix.jpg",
    packages: [
      { label: "1 วัน", price: 25 },
      { label: "7 วัน", price: 60 },
      { label: "30 วัน", price: 180 },
    ],
  },

  {
    id: "iqiyi",
    name: "iQIYI",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/iQIYI.jpg",
    packages: [
      { label: "7 วัน หาร 4", price: 15 },
      { label: "7 วัน ยกแอค", price: 35 },
      { label: "30 วัน หาร 4", price: 30 },
      { label: "30 วัน หาร 3", price: 45 },
      { label: "30 วัน หาร 2", price: 55 },
      { label: "30 วัน ยกแอค", price: 85 },
    ],
  },

  {
    id: "wetv",
    name: "WeTV",
    category: "แอปพรีเมียม",
    icon: "▶️",
    image: "/wetv.jpg",
    packages: [
      { label: "7 วัน หาร 4", price: 15 },
      { label: "30 วัน หาร 4", price: 30 },
      { label: "30 วัน หาร 3", price: 50 },
      { label: "30 วัน หาร 2", price: 65 },
      { label: "30 วัน ยกแอค", price: 95 },
    ],
  },

  {
    id: "viu",
    name: "Viu",
    category: "แอปพรีเมียม",
    icon: "🟠",
    image: "/viu.jpg",
    packages: [
      { label: "7 วัน หาร 4", price: 15 },
      { label: "7 วัน ยกแอค", price: 30 },
      { label: "30 วัน หาร 4", price: 25 },
      { label: "30 วัน หาร 3", price: 35 },
      { label: "30 วัน หาร 2", price: 45 },
      { label: "30 วัน ยกแอค", price: 65 },
    ],
  },

  {
    id: "amazon-prime",
    name: "Amazon Prime",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/amazon.jpg",
    packages: [
      { label: "7 วัน หาร 5", price: 30 },
      { label: "7 วัน ยกแอค", price: 60 },
      { label: "30 วัน หาร 5", price: 59 },
      { label: "30 วัน หาร 3", price: 79 },
    ],
  },

  {
    id: "ch3-premium",
    name: "CH3+ Premium",
    category: "แอปพรีเมียม",
    icon: "3️⃣",
    image: "/CH3.jpg",
    packages: [
      { label: "7 วัน หาร 2", price: 30 },
      { label: "30 วัน หาร 2", price: 65 },
      { label: "30 วัน ยกแอค", price: 95 },
    ],
  },

  {
    id: "youku",
    name: "YouKu",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/youku.jpg",
    packages: [
      { label: "7 วัน หาร 4", price: 25 },
      { label: "30 วัน หาร 4", price: 35 },
      { label: "30 วัน หาร 3", price: 45 },
      { label: "30 วัน หาร 2", price: 60 },
      { label: "30 วัน ยกแอค", price: 80 },
    ],
  },

  {
    id: "monomax",
    name: "Monomax",
    category: "แอปพรีเมียม",
    icon: "️",
    image: "/monomax.jpg",
    packages: [
      { label: "7 วัน จอส่วนตัว", price: 35 },
      { label: "30 วัน หาร 2", price: 45 },
      { label: "30 วัน ส่วนตัว", price: 60 },
    ],
  },

  {
    id: "oned",
    name: "OneD",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/oneD.jpg",
    packages: [
      { label: "30 วัน หาร 4", price: 40 },
      { label: "30 วัน หาร 3", price: 55 },
      { label: "30 วัน หาร 2", price: 79 },
      { label: "30 วัน ยกแอค", price: 110 },
    ],
  },

  {
    id: "true-id",
    name: "True ID",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/trueID.jpg",
    packages: [
      { label: "7 วัน หาร 4", price: 25 },
      { label: "30 วัน หาร 4", price: 35 },
      { label: "30 วัน หาร 3", price: 45 },
      { label: "30 วัน หาร 2", price: 60 },
      { label: "30 วัน ยกแอค", price: 80 },
    ],
  },

  {
    id: "bilibili",
    name: "BiliBili",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/BiliBili.jpg",
    packages: [
      { label: "7 วัน หาร 4", price: 25 },
      { label: "30 วัน หาร 4", price: 40 },
      { label: "30 วัน หาร 3", price: 55 },
      { label: "30 วัน หาร 2", price: 65 },
      { label: "30 วัน ยกแอค", price: 105 },
    ],
  },

  {
    id: "canva",
    name: "Canva",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/BiliBili.jpg",
    packages: [
      { label: "7 วัน เมลลูกค้า", price: 15 },
      { label: "30 วัน เมลลูกค้า", price: 35 },
      { label: "30 วัน เมลร้าน", price: 40 },
    ],
  },

  {
    id: "capcut-pro",
    name: "CapCut Pro",
    category: "แอปพรีเมียม",
    icon: "✂️",
    image: "/capcut.jpg",
    packages: [
      { label: "1 วัน", price: 30 },
      { label: "3 วัน", price: 50 },
      { label: "7 วัน", price: 75 },
      { label: "30 วัน", price: 120 },
    ],
  },

  {
    id: "dramabox",
    name: "Dramabox",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/Dramabox.jpg",
    packages: [
      { label: "1 วัน", price: 69 },
      { label: "3 วัน", price: 100 },
      { label: "7 วัน", price: 160 },
      { label: "30 วัน", price: 500 },
    ],
  },

  {
    id: "dramawave",
    name: "Dramawave",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/Dramawave.jpg",
    packages: [
      { label: "1 วัน หาร 4", price: 69 },
      { label: "3 วัน หาร 4", price: 100 },
      { label: "7 วัน หาร 4", price: 160 },
      { label: "1 วัน จอส่วนตัว", price: 139 },
      { label: "3 วัน จอส่วนตัว", price: 190 },
    ],
  },

  {
    id: "shortmax",
    name: "ShortMax",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/shortmax.jpg",
    packages: [
      { label: "1 วัน", price: 69 },
      { label: "3 วัน", price: 99 },
      { label: "7 วัน", price: 169 },
    ],
  },

  {
    id: "stardust-tv",
    name: "Stardust TV",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/Stardust.jpg",
    packages: [
      { label: "1 วัน", price: 90 },
      { label: "3 วัน", price: 150 },
      { label: "7 วัน", price: 250 },
    ],
  },

  {
    id: "kalos",
    name: "Kalos",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/Kalos.jpg",
    packages: [
      { label: "1 วัน", price: 140 },
      { label: "3 วัน", price: 189 },
      { label: "7 วัน", price: 290 },
    ],
  },

  {
    id: "reelshort",
    name: "Reelshort",
    category: "แอปพรีเมียม",
    icon: "️",
    image: "/Reelshort.jpg",
    packages: [
      { label: "1 วัน", price: 75 },
      { label: "3 วัน", price: 150 },
      { label: "7 วัน", price: 220 },
    ],
  },

  {
    id: "flex-tv",
    name: "Flex TV",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/FlexTV.jpg",
    packages: [
      { label: "1 วัน", price: 90 },
      { label: "3 วัน", price: 150 },
      { label: "7 วัน", price: 250 },
    ],
  },

  {
    id: "moboreels",
    name: "Moboreels",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/Moboreels.jpg",
    packages: [
      { label: "1 วัน", price: 99 },
      { label: "3 วัน", price: 150 },
      { label: "7 วัน", price: 250 },
    ],
  },

  {
    id: "bili-tv",
    name: "Bili TV",
    category: "แอปพรีเมียม",
    icon: "️",
    image: "/BiliTV.jpg",
    packages: [
      { label: "1 วัน", price: 150 },
      { label: "3 วัน", price: 190 },
      { label: "7 วัน", price: 300 },
    ],
  },

  {
    id: "goodshort",
    name: "Goodshort",
    category: "แอปพรีเมียม",
    icon: "▶️",
    image: "/Goodshort.jpg",
    packages: [{ label: "7 วัน หาร 2", price: 320 }],
  },

  {
    id: "netshort",
    name: "Netshort",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/Netshort.jpg",
    packages: [{ label: "7 วัน หาร 3", price: 399 }],
  },

  {
    id: "honeyreels",
    name: "Honeyreels",
    category: "แอปพรีเมียม",
    icon: "",
    image: "/HoneyReels.jpg",
    packages: [
      { label: "1 วัน", price: 99 },
      { label: "3 วัน", price: 150 },
      { label: "7 วัน", price: 250 },
    ],
  },

  // ======================================================
  // ครีม & โลชั่น
  // ======================================================

  {
    id: "arista",
    name: "อริสต้า",
    category: "ครีม & โลชั่น",
    icon: "🧴",
    packages: [{ label: "1 ชิ้น", price: 390 }],
  },

  {
    id: "venita",
    name: "Venita HYA Skin",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 379 }],
  },

  {
    id: "cerave",
    name: "CeraVe",
    category: "ครีม & โลชั่น",
    icon: "🤍",
    packages: [{ label: "1 ชิ้น", price: 290 }],
  },

  {
    id: "vitamin-plus",
    name: "อันยองอี",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 290 }],
  },

  {
    id: "glow-cc",
    name: "กันแดด Glow CC",
    category: "ครีม & โลชั่น",
    icon: "☀️",
    packages: [{ label: "1 ชิ้น", price: 169 }],
  },

  {
    id: "CHERBEN",
    name: "รองพื้นเชอเบน",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 290 }],
  },

  {
    id: "vampire-11w",
    name: "Vampire 11W",
    category: "ครีม & โลชั่น",
    icon: "🧡",
    packages: [{ label: "1 ชิ้น", price: 490 }],
  },

  {
    id: "vaseline-3",
    name: "Vaseline สูตร 3",
    category: "ครีม & โลชั่น",
    icon: "🧴",
    packages: [{ label: "1 ชิ้น", price: 390 }],
  },

  {
    id: "eucerin",
    name: "Eucerin Body Lotion",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 590 }],
  },

  {
    id: "hiroe",
    name: "HIROE Body Cream",
    category: "ครีม & โลชั่น",
    icon: "🫐",
    packages: [{ label: "1 ชิ้น", price: 290 }],
  },

  {
    id: "mizu",
    name: "Mizu",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 199 }],
  },

  {
    id: "mizu-set",
    name: "Set Mizu",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 เซ็ต", price: 449 }],
  },

  {
    id: "aura-white",
    name: "Aura White",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 290 }],
  },

  {
    id: "perfume",
    name: "นมหอม",
    category: "ครีม & โลชั่น",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 490 }],
  },

  // ======================================================
  // น้ำหอม
  // ======================================================

  {
    id: "Pornmaya",
    name: "BROWN SUGAR",
    category: "น้ำหอม",
    icon: "",
    packages: [{ label: "1 ชิ้น", price: 290 }],
  },

  // ======================================================
  // เช่าชุด
  // ======================================================

  {
    id: "rent-1",
    name: "ชุดเช่า No.1",
    category: "เช่าชุด",
    icon: "",
    packages: [
      { label: "1 วัน", price: 99 },
      { label: "3 วัน", price: 149 },
    ],
  },

  {
    id: "rent-2",
    name: "ชุดเช่า No.2",
    category: "เช่าชุด",
    icon: "",
    packages: [
      { label: "1 วัน", price: 69 },
      { label: "3 วัน", price: 119 },
    ],
  },

  {
    id: "rent-3",
    name: "ชุดเช่า No.3",
    category: "เช่าชุด",
    icon: "",
    packages: [
      { label: "1 วัน", price: 115 },
      { label: "2 วัน", price: 160 },
      { label: "3 วัน", price: 200 },
    ],
  },

  {
    id: "rent-4",
    name: "ชุดเช่า No.4",
    category: "เช่าชุด",
    icon: "",
    packages: [
      { label: "1 วัน", price: 89 },
      { label: "2 วัน", price: 129 },
      { label: "3 วัน", price: 189 },
    ],
  },
];

// ======================================================
// หมวดหมู่
// enabled = true คือเปิดขาย
// enabled = false คือยังไม่เปิดขาย
// ======================================================

const categories = [
  {
    name: "แอปพรีเมียม",
    icon: "✨",
    enabled: true,
  },
  {
    name: "ครีม & โลชั่น",
    icon: "🧴",
    enabled: false,
  },
  {
    name: "น้ำหอม",
    icon: "",
    enabled: false,
  },
  {
    name: "เช่าชุด",
    icon: "",
    enabled: false,
  },
];

export default function ProductsPage() {
  // เปิดหน้าแรกที่แอปพรีเมียม
  const [category, setCategory] = useState("แอปพรีเมียม");

  const [selectedPackages, setSelectedPackages] = useState<
    Record<string, number>
  >({});

  const [cart, setCart] = useState<CartItem[]>([]);
const [stocks, setStocks] = useState<StockItem[]>([]);
const [stockLoaded, setStockLoaded] = useState(false);

const loadStocks = async () => {
  try {
    const response = await fetch("/api/stock", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      setStocks([]);
      setStockLoaded(true);
      return;
    }

    setStocks(
      (data.stock || []).map((item: any) => ({
        id: item.id,
        product: item.product,
        packageName: item.package_name,
        status: item.status,
      }))
    );

    setStockLoaded(true);
  } catch {
    setStocks([]);
    setStockLoaded(true);
  }
};

useEffect(() => {
  loadStocks();
}, []);

const isProductInStock = (product: Product) => {
  const selectedIndex = selectedPackages[product.id] ?? 0;
  const selectedPackage = product.packages[selectedIndex];

  if (!selectedPackage) return false;

  return stocks.some(
    (item) =>
      item.status === "available" &&
      item.product.trim().toLowerCase() ===
        product.name.trim().toLowerCase() &&
      item.packageName.trim().toLowerCase() ===
        selectedPackage.label.trim().toLowerCase()
  );
};

  // ======================================================
  // โหลดตะกร้าจาก localStorage
  // ======================================================

  useEffect(() => {
    const savedCart = localStorage.getItem("pimSumonCart");

    if (!savedCart) return;

    try {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        // เก็บไว้เฉพาะสินค้าหมวดที่เปิดขาย
        const allowedCart = parsedCart.filter(
          (item: CartItem) => item.category === "แอปพรีเมียม"
        );

        setCart(allowedCart);

        localStorage.setItem(
          "pimSumonCart",
          JSON.stringify(allowedCart)
        );
      }
    } catch {
      setCart([]);
    }
  }, []);

  // ======================================================
  // สินค้าที่แสดงตามหมวด
  // ======================================================

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.category === category
    );
  }, [category]);

  // ======================================================
  // เช็กว่าหมวดปัจจุบันเปิดขายหรือไม่
  // ======================================================

  const currentCategory = categories.find(
    (item) => item.name === category
  );

  const isCurrentCategoryEnabled =
    currentCategory?.enabled ?? false;

  // ======================================================
  // ยอดรวม
  // ======================================================

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  // ======================================================
  // เพิ่มสินค้าเข้าตะกร้า
  // ======================================================

  const addToCart = (product: Product) => {
// ป้องกันสินค้าหมวดที่ยังไม่เปิดขาย
const productCategory = categories.find(
  (item) => item.name === product.category
);

if (!productCategory?.enabled) {
  return;
}

    const selectedIndex =
      selectedPackages[product.id] ?? 0;

    const selectedPackage =
      product.packages[selectedIndex];

    if (!selectedPackage) return;


// เช็ก Stock ของสินค้า + แพ็กเกจ
const savedStock = localStorage.getItem("pimSumonStock");

let stockItems: any[] = [];

if (savedStock) {
  try {
    stockItems = JSON.parse(savedStock);
  } catch {
    stockItems = [];
  }
}

const availableStock = stockItems.find(
  (item) =>
    item.status === "available" &&
    item.product === product.name &&
    item.packageName === selectedPackage.label
);

if (!availableStock) {
  alert("สินค้าหรือแพ็กเกจนี้หมดสต็อกแล้ว");
  return;
}

    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      name: `${product.name} - ${selectedPackage.label}`,
      category: product.category,
      icon: product.icon,
      packageLabel: selectedPackage.label,
      price: selectedPackage.price,
    };

    const newCart = [...cart, newItem];

    setCart(newCart);

    localStorage.setItem(
      "pimSumonCart",
      JSON.stringify(newCart)
    );
  };

  // ======================================================
  // ลบสินค้าออกจากตะกร้า
  // ======================================================

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(newCart);

    localStorage.setItem(
      "pimSumonCart",
      JSON.stringify(newCart)
    );
  };

  // ======================================================
  // ล้างตะกร้า
  // ======================================================

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pimSumonCart");
  };

  // ======================================================
  // ไปหน้า Checkout
  // ======================================================

  const goToCheckout = () => {
    if (cart.length === 0) return;

    localStorage.setItem(
      "pimSumonCart",
      JSON.stringify(cart)
    );

    window.location.href = "/checkout";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-sky-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-bold text-pink-500"
            >
              ← กลับหน้าหลัก
            </Link>

            <h1 className="mt-3 text-3xl font-black">
              สินค้าของเรา 🛍️
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              เลือกหมวดหมู่สินค้าที่ต้องการจาก Pim Sumon
            </p>
          </div>

          <button
            type="button"
            onClick={goToCheckout}
            disabled={cart.length === 0}
            className="rounded-full bg-pink-500 px-5 py-3 font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-200"
          >
            🛒 ตะกร้า {cart.length} รายการ • ฿{totalPrice}
          </button>
        </div>

        {/* ==================================================
            CATEGORY
        ================================================== */}

        <div className="mt-8">
          <p className="mb-3 text-sm font-bold text-slate-500">
            หมวดหมู่สินค้า
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((item) => {
              const active = category === item.name;

              return (
                <button
                  type="button"
                  key={item.name}
                  disabled={!item.enabled}
                  onClick={() => {
                    if (item.enabled) {
                      setCategory(item.name);
                    }
                  }}
                  className={`relative rounded-2xl border px-4 py-4 text-left transition ${
                    active && item.enabled
                      ? "border-pink-400 bg-pink-500 text-white shadow-md"
                      : item.enabled
                      ? "border-pink-100 bg-white text-pink-500 hover:border-pink-300 hover:bg-pink-50"
                      : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="text-2xl">
                    {item.icon}
                  </div>

                  <p className="mt-2 text-sm font-black">
                    {item.name}
                  </p>

                  {item.enabled ? (
                    <p
                      className={`mt-1 text-xs ${
                        active
                          ? "text-pink-100"
                          : "text-slate-400"
                      }`}
                    >
                      เปิดให้บริการ
                    </p>
                  ) : (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-400">
                         เร็ว ๆ นี้
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            NOTICE
        ================================================== */}

        <div className="mt-6 rounded-3xl border border-pink-100 bg-gradient-to-r from-pink-50 to-sky-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
              ✨
            </div>

            <div>
              <p className="font-black text-slate-700">
                เปิดให้บริการแล้ว
              </p>

              <p className="mt-1 text-sm text-slate-500">
                ขณะนี้สามารถสั่งซื้อสินค้าในหมวด
                <span className="font-bold text-pink-500">
                  {" "}แอปพรีเมียม{" "}
                </span>
                ได้แล้ว ส่วนหมวดอื่นกำลังเตรียมเปิดให้บริการเร็ว ๆ นี้ ♡
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            CART
        ================================================== */}

        {cart.length > 0 && (
          <div className="mt-6 rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  ตะกร้าของฉัน 🛒
                </h2>

                <p className="text-sm text-slate-400">
                  {cart.length} รายการ
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-bold text-red-500"
              >
                ล้างตะกร้า
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-pink-50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold">
                      {item.icon} {item.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {item.category}
                    </p>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-3">
                    <span className="font-black text-pink-500">
                      ฿{item.price}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-bold text-red-500"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-pink-100 pt-4">
              <span className="font-black">
                ยอดรวม
              </span>

              <span className="text-xl font-black text-pink-500">
                ฿{totalPrice}
              </span>
            </div>

            <button
              type="button"
              onClick={goToCheckout}
              className="mt-4 w-full rounded-full bg-pink-500 py-3 font-bold text-white transition hover:bg-pink-600"
            >
              ดำเนินการสั่งซื้อ ♡
            </button>
          </div>
        )}

        {/* ==================================================
            CATEGORY TITLE
        ================================================== */}

        <div className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold text-pink-400">
              หมวดหมู่
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {currentCategory?.icon} {category}
            </h2>
          </div>

          <p className="text-sm text-slate-400">
            {filteredProducts.length} รายการ
          </p>
        </div>

        {/* ==================================================
            PRODUCT GRID
        ================================================== */}

        {isCurrentCategoryEnabled ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const selectedIndex =
                selectedPackages[product.id] ?? 0;

              const selectedPackage =
                product.packages[selectedIndex];

              if (!selectedPackage) {
                return null;
              }

              return (
                <div
                  key={product.id}
                  className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* รูปสินค้า */}

                  <div className="mb-4 overflow-hidden rounded-2xl bg-pink-50">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-48 w-full object-contain p-3"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-6xl">
                        {product.icon}
                      </div>
                    )}
                  </div>

                  {/* หมวดหมู่ */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-pink-400">
                      {product.category}
                    </p>

                    {isProductInStock(product) ? (
  <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
    พร้อมสั่งซื้อ
  </span>
) : (
  <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">
    ยังไม่มีของ
  </span>
)}
                  </div>

                  {/* ชื่อสินค้า */}

                  <h2 className="mt-1 text-xl font-black">
                    {product.name}
                  </h2>

                  {/* เลือกแพ็กเกจ */}

                  <div className="mt-4">
                    <label className="text-xs font-bold text-slate-500">
                      เลือกแพ็กเกจ
                    </label>

                    <select
                      value={selectedIndex}
                      onChange={(event) =>
                        setSelectedPackages((current) => ({
                          ...current,
                          [product.id]: Number(
                            event.target.value
                          ),
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-pink-100 bg-white px-3 py-3 outline-none transition focus:border-pink-300"
                    >
                      {product.packages.map(
                        (packageOption, index) => (
                          <option
                            key={`${product.id}-${index}`}
                            value={index}
                          >
                            {packageOption.label} - ฿
                            {packageOption.price}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* ราคา */}

                  <div className="mt-5 rounded-2xl bg-pink-50 p-4">
                    <p className="text-xs text-slate-400">
                      แพ็กเกจที่เลือก
                    </p>

                    <p className="mt-1 font-bold">
                      {selectedPackage.label}
                    </p>

                    <p className="mt-2 text-2xl font-black text-pink-500">
                      ฿{selectedPackage.price}
                    </p>
                  </div>

                  {/* เพิ่มตะกร้า */}

<button
  type="button"
  onClick={() => addToCart(product)}
  disabled={!isProductInStock(product)}
  className={`mt-5 w-full rounded-full py-3 font-bold transition ${
    isProductInStock(product)
      ? "bg-pink-500 text-white hover:bg-pink-600 active:scale-[0.98]"
      : "cursor-not-allowed bg-slate-200 text-slate-400"
  }`}
>
  {isProductInStock(product) ? "เพิ่มลงตะกร้า 🛒" : "สินค้าหมด"}
</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <div className="text-5xl">
              
            </div>

            <h3 className="mt-4 text-xl font-black">
              หมวดนี้ยังไม่เปิดให้บริการ
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              เรากำลังเตรียมสินค้าในหมวด {category}
              ให้พร้อมสำหรับคุณ กรุณารอติดตามเร็ว ๆ นี้ ♡
            </p>
          </div>
        )}

        {/* ==================================================
            FOOTER MESSAGE
        ================================================== */}

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-pink-400">
            Pim Sumon ♡
          </p>

          <p className="mt-1 text-xs text-slate-400">
            ขอบคุณที่เลือกใช้บริการของเรา
          </p>
        </div>
      </div>
    </main>
  );
}
