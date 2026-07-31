import { FaGem, FaGift, FaHeart } from "react-icons/fa";

function About() {
  return (
    <main className="page-shell">
      <div className="container">
        <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">About Love2Bazzar</p>
            <h1 className="font-display mt-3 text-6xl font-bold leading-none">
              Luxury Jewellery With A Warm Local Heart
            </h1>
            <p className="mt-6 max-w-2xl leading-8 text-[#746c60]">
              Love2Bazzar is built for customers who want elegant jewellery,
              premium gift packaging, and a smooth online shopping experience.
              This frontend is ready to connect with a MERN backend for product
              uploads, orders, authentication, reviews, and payments.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80"
            alt="Luxury jewellery"
            className="rounded-lg shadow-[0_26px_70px_rgba(40,25,0,0.18)]"
          />
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            { icon: <FaGem />, title: "Premium Finish" },
            { icon: <FaGift />, title: "Gift Ready" },
            { icon: <FaHeart />, title: "Made With Care" },
          ].map((item) => (
            <div key={item.title} className="soft-card p-7 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#fbf1d1] text-2xl text-[#9a6b10]">
                {item.icon}
              </div>
              <h2 className="font-display text-3xl font-bold">{item.title}</h2>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export default About;
