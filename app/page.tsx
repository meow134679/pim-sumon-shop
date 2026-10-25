import Link from "next/link";
const categories = [
  { icon: "📺", name: "แอพพรีเมียม", detail: "ดูหนัง ซีรีส์ และบริการต่างๆ" },
  { icon: "🧴", name: "ครีม & โลชั่น", detail: "สกินแคร์และผลิตภัณฑ์ดูแลผิว" },
  { icon: "✨", name: "สครับ", detail: "ดูแลผิวกายให้เนียนนุ่ม" },
  { icon: "🌸", name: "น้ำหอม", detail: "กลิ่นหอมน่ารักหลายสไตล์" },
  { icon: "🎀", name: "บรา", detail: "แฟชั่นและชุดชั้นใน" },
  { icon: "👗", name: "เช่าชุด", detail: "เลือกวันรับและคืนชุดได้" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-sky-50 text-slate-700">
      <header className="border-b border-pink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-2xl font-black text-pink-500">
              Pim <span className="text-sky-500">Sumon</span>
            </h1>
            <p className="text-xs text-slate-400">Pim Sumon Shop</p >
          </div>

          <button className="rounded-full bg-pink-500 px-5 py-2 text-sm font-bold text-white shadow">
            🛒 ตะกร้า
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-[32px] bg-gradient-to-r from-pink-200 via-pink-100 to-sky-200 p-8 text-center shadow-sm">
          <div className="mb-3 text-5xl">🎀</div>

          <h2 className="text-4xl font-black text-pink-600">
            Pim <span className="text-sky-600">Sumon</span>
          </h2>

          <p className="mt-3 text-lg font-semibold">
            ร้านเล็กๆ ที่รวมของน่ารักไว้ให้คุณ
          </p >

          <p className="mt-2 text-sm text-slate-500">
            แอพพรีเมียม • ความงาม • แฟชั่น • เช่าชุด
          </p >
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <h2 className="mb-5 text-2xl font-black">
          เลือกหมวดสินค้า
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((item) => (
<Link
  key={item.name}
  href="/products"
  className="block cursor-pointer rounded-3xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
>
              <div className="mb-4 text-4xl">{item.icon}</div>

              <h3 className="text-lg font-black">
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {item.detail}
              </p >

              <p className="mt-4 font-bold text-pink-500">
                ดูสินค้า →
              </p >
            </Link>
          ))}
        </div>
      </section>

      <footer className="px-5 py-8 text-center text-sm text-slate-400">
        © 2026 Pim Sumon Shop ♡
      </footer>
    </main>
  );
}