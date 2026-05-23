"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const usd = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const seatLabel = (r, c) => `${alpha[r]}${c + 1}`;

const MOVIES = [
  { id: "mv1", title: "Starlight Odyssey", hallId: "hall-a", time: "Today 7:30 PM", price: 12, genre: "Sci‑Fi Adventure", poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=900&auto=format&fit=crop", desc: "A cosmic road trip where two friends try to fix a broken comet." },
  { id: "mv2", title: "Neon City Nights", hallId: "hall-b", time: "Today 8:00 PM", price: 15, genre: "Cyber Noir", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900&auto=format&fit=crop", desc: "A rooftop heist across a glowing megacity." },
  { id: "mv3", title: "Whispering Pines", hallId: "hall-c", time: "Today 9:15 PM", price: 10, genre: "Mystery", poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop", desc: "A slow mystery set in a foggy mountain town." },
  { id: "mv4", title: "Quantum Chef", hallId: "hall-d", time: "Today 10:00 PM", price: 13, genre: "Comedy", poster: "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=900&auto=format&fit=crop", desc: "A chef jumps timelines to perfect the ultimate recipe." },
];

const HALLS = {
  "hall-a": { name: "Hall A", rows: 8, cols: 12, aisles: [6] },
  "hall-b": { name: "Hall B", rows: 10, cols: 14, aisles: [4, 10] },
  "hall-c": { name: "Hall C", rows: 7, cols: 10, aisles: [5] },
  "hall-d": { name: "Hall D", rows: 9, cols: 12, aisles: [6] },
};

const PREBOOKED = {
  "hall-a": ["A1", "A2", "C7", "D6", "E5", "F8"],
  "hall-b": ["B3", "B4", "B5", "H10", "H11"],
  "hall-c": ["A9", "B9", "E2"],
  "hall-d": ["C6", "C7", "F1", "F2"],
};

const ADDONS = [
  { id: "popcorn", name: "Popcorn Combo", price: 6, note: "Popcorn + small drink", img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=500&auto=format&fit=crop" },
  { id: "drink", name: "Large Drink", price: 4, note: "Choose any flavor", img: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?q=80&w=500&auto=format&fit=crop" },
  { id: "poster", name: "Limited Poster", price: 12, note: "18x24 premium print", img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=500&auto=format&fit=crop" },
  { id: "shirt", name: "Movie T-Shirt", price: 20, note: "Black, S-XL", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop" },
];

const BOOKINGS_KEY = "cinemaBookingsCinematic";

function loadBookings() {
  if (typeof window === "undefined") return { mv1: [], mv2: [], mv3: [], mv4: [] };
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || { mv1: [], mv2: [], mv3: [], mv4: [] }; }
  catch { return { mv1: [], mv2: [], mv3: [], mv4: [] }; }
}
function saveBookings(data) { try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(data)); } catch {} }

function useBookings(hallId, movieId) {
  const [booked, setBooked] = useState(PREBOOKED[hallId] || []);
  useEffect(() => {
    const all = loadBookings();
    setBooked(Array.from(new Set([...(PREBOOKED[hallId] || []), ...(all[movieId] || [])])));
  }, [hallId, movieId]);
  return {
    isBooked: (s) => booked.includes(s),
    bookSeats: (seats) => {
      const all = loadBookings();
      all[movieId] = Array.from(new Set([...(all[movieId] || []), ...seats]));
      saveBookings(all);
      setBooked(Array.from(new Set([...(PREBOOKED[hallId] || []), ...all[movieId]])));
    },
  };
}

const screenAnim = {
  initial: { opacity: 0, y: 24, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -24, filter: "blur(10px)" },
};

export default function Page() {
  const [screen, setScreen] = useState("home");
  const [movieId, setMovieId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [promo, setPromo] = useState(null);
  const movie = useMemo(() => MOVIES.find((m) => m.id === movieId), [movieId]);

  const goHome = () => { setScreen("home"); setMovieId(null); setSelected([]); setPromo(null); };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <CinematicBackground />

      <header className="sticky top-0 z-40 border-b border-red-950/40 bg-black/65 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button onClick={goHome} className="group flex items-center gap-3">
            <motion.span whileHover={{ rotate: -8, scale: 1.08 }} className="grid h-12 w-12 place-items-center rounded-2xl bg-red-700 font-black shadow-glow">CS</motion.span>
            <span className="text-xl font-black tracking-tight">Cinema Seats</span>
          </button>
          {screen !== "home" && (
            <motion.button whileTap={{ scale: .95 }} onClick={goHome} className="rounded-full border border-zinc-800 bg-zinc-950/70 px-5 py-2 text-sm text-zinc-200">
              Exit experience
            </motion.button>
          )}
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-8">
        <AnimatePresence mode="wait">
          {screen === "home" && <Screen key="home"><Home onPick={(id) => { setMovieId(id); setScreen("trailer"); }} /></Screen>}
          {screen === "trailer" && movie && <Screen key="trailer"><TrailerGate movie={movie} onBack={goHome} onContinue={() => setScreen("seats")} /></Screen>}
          {screen === "seats" && movie && <Screen key="seats"><SeatPicker movie={movie} selected={selected} setSelected={setSelected} onBack={() => setScreen("trailer")} onProceed={(seats, p) => { setSelected(seats); setPromo(p); setScreen("checkout"); }} /></Screen>}
          {screen === "checkout" && movie && <Screen key="checkout"><Checkout movie={movie} seats={selected} promo={promo} onBack={() => setScreen("seats")} onConfirm={() => setScreen("confirmation")} /></Screen>}
          {screen === "confirmation" && movie && <Screen key="confirmation"><Confirmation movie={movie} seats={selected} onHome={goHome} /></Screen>}
        </AnimatePresence>
      </section>
    </main>
  );
}

function Screen({ children }) {
  return <motion.div variants={screenAnim} initial="initial" animate="animate" exit="exit" transition={{ duration: .42, ease: "easeOut" }}>{children}</motion.div>;
}

function CinematicBackground() {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 18 });
  const sy = useSpring(my, { stiffness: 45, damping: 18 });
  useEffect(() => {
    const onMove = (e) => { mx.set((e.clientX / window.innerWidth - .5) * 24); my.set((e.clientY / window.innerHeight - .5) * 24); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);
  return (
    <>
      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(220,38,38,.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(146,64,14,.16),transparent_30%),linear-gradient(180deg,rgba(0,0,0,.2),#000_86%)]" />
      <div className="film-grain" />
      <div className="pointer-events-none fixed left-0 top-0 h-full w-1/2 animate-projector bg-gradient-to-r from-red-900/20 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none fixed inset-y-0 left-1/2 w-[2px] bg-gradient-to-b from-transparent via-red-600/20 to-transparent" />
    </>
  );
}

function Home({ onPick }) {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[.35em] text-red-400">Tonight’s premiere</p>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          A ticket flow that feels like the <span className="text-red-500">opening scene.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-zinc-400">
          Animated cards, a pre-show transition, live seat motion, cinematic lighting, animated totals, and add-on upsells.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {MOVIES.map((m, i) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: i * .08, type: "spring", stiffness: 90 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/70 shadow-2xl"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src={m.poster} alt={m.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute left-4 top-4 rounded-full border border-amber-400/50 bg-black/55 px-3 py-1 text-xs text-amber-200">{m.genre}</div>
              <motion.div className="absolute inset-x-[-40%] top-0 h-24 -skew-y-6 bg-white/15 blur-xl" animate={{ x: ["-30%", "130%"] }} transition={{ repeat: Infinity, duration: 5 + i, ease: "linear" }} />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-black">{m.title}</h2>
                <p className="text-sm text-zinc-300">{m.time}</p>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm text-zinc-400">{m.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-300">{usd(m.price)} / seat</span>
                <motion.button whileTap={{ scale: .95 }} onClick={() => onPick(m.id)} className="rounded-2xl bg-red-600 px-4 py-3 font-bold shadow-glow hover:bg-red-500">
                  Enter
                </motion.button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}

function TrailerGate({ movie, onBack, onContinue }) {
  return (
    <div className="mx-auto max-w-5xl">
      <button onClick={onBack} className="mb-5 text-zinc-300">← Back</button>
      <motion.div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="relative aspect-video">
          <Image src={movie.poster} alt={movie.title} fill sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <motion.div initial={{ scale: .75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 140 }} className="absolute inset-0 grid place-items-center">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: .94 }} onClick={onContinue} className="grid h-24 w-24 place-items-center rounded-full border border-red-300/40 bg-red-600/80 text-4xl shadow-glow">
              ▶
            </motion.button>
          </motion.div>
          <div className="absolute bottom-8 left-8 right-8">
            <p className="mb-2 text-sm uppercase tracking-[.35em] text-red-300">Pre-show</p>
            <h1 className="text-5xl font-black">{movie.title}</h1>
            <p className="mt-3 max-w-xl text-zinc-300">{movie.desc}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SeatPicker({ movie, selected, setSelected, onBack, onProceed }) {
  const hall = HALLS[movie.hallId];
  const { isBooked } = useBookings(movie.hallId, movie.id);
  const [promoCode, setPromoCode] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoStatus, setPromoStatus] = useState(null);
  const [tip, setTip] = useState(null);

  useEffect(() => {
    if (promo?.code === "111") setPromo((p) => p && { ...p, amount: Math.round(selected.length * movie.price * .1) });
  }, [selected, movie.price, promo?.code]);

  const subtotal = selected.length * movie.price;
  const fee = Math.round(subtotal * .05);
  const discount = promo?.amount || 0;
  const total = Math.max(0, subtotal + fee - discount);

  const applyPromo = () => {
    if (promoCode.trim() === "111" && selected.length) {
      setPromo({ code: "111", amount: Math.round(selected.length * movie.price * .1) });
      setPromoStatus("applied");
    } else { setPromo(null); setPromoStatus("invalid"); }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.8fr_.9fr]">
      <div>
        <button onClick={onBack} className="mb-4 text-zinc-300">← Back</button>
        <h1 className="text-4xl font-black">Choose your seats</h1>
        <p className="mb-6 text-zinc-400">{movie.title} · {hall.name} · {movie.time}</p>

        <LayoutGroup>
          <motion.div layout className="relative mx-auto w-fit rounded-[2rem] border border-zinc-800 bg-black/65 p-6 shadow-2xl">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="mb-3 h-2 origin-center rounded-full bg-gradient-to-r from-red-950 via-red-500 to-red-950" />
            <div className="mb-6 text-center text-xs uppercase tracking-[.45em] text-zinc-500">Screen</div>
            <div className="space-y-2">
              {Array.from({ length: hall.rows }).map((_, r) => (
                <div key={r} className="flex items-center justify-center gap-2">
                  <div className="w-5 text-right text-xs text-zinc-500">{alpha[r]}</div>
                  {Array.from({ length: hall.cols }).map((_, c) => {
                    const label = seatLabel(r, c), booked = isBooked(label), isSel = selected.includes(label);
                    return (
                      <div key={label} className="flex items-center gap-2">
                        <motion.button
                          layout
                          disabled={booked}
                          whileHover={!booked ? { scale: 1.18, y: -4, rotate: isSel ? 0 : -2 } : {}}
                          whileTap={!booked ? { scale: .88 } : {}}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTip({ x: rect.right + 18, y: rect.bottom + 18, label, row: alpha[r], col: c + 1, price: movie.price, status: booked ? "Occupied" : isSel ? "Selected" : "Available" });
                          }}
                          onMouseLeave={() => setTip(null)}
                          onClick={() => !booked && setSelected((prev) => prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label])}
                          className={[
                            "grid h-10 w-10 place-items-center rounded-xl border text-xs font-bold transition",
                            booked ? "cursor-not-allowed border-zinc-900 bg-zinc-950 text-zinc-700"
                            : isSel ? "border-red-400 bg-red-600/25 text-red-100 shadow-glow"
                            : "border-zinc-700 bg-zinc-800/80 text-zinc-100 hover:border-red-500"
                          ].join(" ")}
                        >{label}</motion.button>
                        {hall.aisles.includes(c) && <div className="w-3" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <AnimatePresence>
              {tip && <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .94 }} className="pointer-events-none fixed z-50 rounded-2xl border border-red-900 bg-black/95 px-4 py-3 text-sm shadow-2xl" style={{ left: tip.x, top: tip.y }}>
                <div className="font-black text-red-300">Seat {tip.label}</div>
                <div className="text-zinc-200">Row {tip.row}, Col {tip.col}</div>
                <div className="font-bold text-red-300">{usd(tip.price)}</div>
                <div className="text-zinc-400">{tip.status}</div>
              </motion.div>}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <div className="mt-5 flex justify-center gap-6 text-sm text-zinc-400">
          <Legend color="bg-zinc-800" label="Available" />
          <Legend color="bg-red-600/30 ring-1 ring-red-500" label="Selected" />
          <Legend color="bg-zinc-950 ring-1 ring-zinc-800" label="Occupied" />
        </div>
      </div>

      <motion.aside layout className="rounded-[2rem] border border-zinc-800 bg-black/65 p-6 shadow-2xl">
        <h2 className="mb-5 text-3xl font-black text-red-500">Checkout</h2>
        <AnimatePresence initial={false}>
          {selected.length === 0 ? <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400">No seats selected yet.</motion.p> :
            <motion.ul layout className="mb-4 overflow-hidden rounded-2xl border border-zinc-800">
              {selected.map((seat) => <motion.li key={seat} layout initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex justify-between border-b border-zinc-800 px-4 py-3 last:border-0"><span>Seat {seat}</span><span>{usd(movie.price)}</span></motion.li>)}
            </motion.ul>
          }
        </AnimatePresence>

        <div className="mb-4 flex gap-2">
          <input value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setPromoStatus(null); }} placeholder={'Enter "111" to get discount'} disabled={!selected.length} className="min-w-0 flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-red-500 disabled:opacity-50" />
          <motion.button whileTap={{ scale: .95 }} onClick={applyPromo} disabled={!selected.length} className="rounded-2xl border border-red-800 px-4 text-red-200 disabled:opacity-40">Apply</motion.button>
        </div>
        <AnimatePresence>
          {promoStatus === "applied" && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-3 text-sm text-green-400">Promo applied: −{usd(discount)} (10%)</motion.p>}
          {promoStatus === "invalid" && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-3 text-sm text-red-300">Invalid code</motion.p>}
        </AnimatePresence>

        <Summary rows={[["Subtotal", usd(subtotal)], ["Booking fee (5%)", usd(fee)], ...(promo ? [[`Promo (${promo.code})`, `- ${usd(discount)}`]] : [])]} total={usd(total)} />
        <motion.button whileHover={selected.length ? { scale: 1.02 } : {}} whileTap={selected.length ? { scale: .97 } : {}} disabled={!selected.length} onClick={() => onProceed(selected, promo)} className="mt-5 w-full rounded-3xl bg-red-600 px-5 py-4 text-lg font-black shadow-glow hover:bg-red-500 disabled:bg-zinc-700 disabled:shadow-none">Checkout →</motion.button>
      </motion.aside>
    </div>
  );
}

function Checkout({ movie, seats, promo, onBack, onConfirm }) {
  const { bookSeats } = useBookings(movie.hallId, movie.id);
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [agree, setAgree] = useState(false);
  const [addons, setAddons] = useState(Object.fromEntries(ADDONS.map(a => [a.id, 0])));
  const addonItems = ADDONS.filter(a => addons[a.id] > 0).map(a => ({ ...a, qty: addons[a.id], lineTotal: addons[a.id] * a.price }));
  const tickets = seats.length * movie.price, fee = Math.round(tickets * .05), discount = promo?.amount || 0, merch = addonItems.reduce((s, a) => s + a.lineTotal, 0), total = Math.max(0, tickets + fee - discount + merch);

  const place = () => {
    if (!name || !email || !agree) return;
    bookSeats(seats);
    sessionStorage.setItem("lastOrder", JSON.stringify({ id: `ORD-${Date.now().toString().slice(-6)}`, movieId: movie.id, name, email, seats, ticketsSubtotal: tickets, bookingFee: fee, promo, merchSubtotal: merch, addons: addonItems, total }));
    onConfirm();
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.3fr_.9fr]">
      <div>
        <button onClick={onBack} className="mb-3 text-zinc-300">← Back</button>
        <h1 className="mb-5 text-4xl font-black">Checkout</h1>
        <section className="rounded-[2rem] border border-zinc-800 bg-black/65 p-6 shadow-2xl">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-3xl font-black">Make it even better</h2><p className="text-zinc-400">Snacks & merch. Promo does not apply.</p></div>
            <motion.div key={merch} initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full bg-red-600/20 px-4 py-2 text-red-200">Add-ons: {usd(merch)}</motion.div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ADDONS.map((a, idx) => <AddonCard key={a.id} addon={a} qty={addons[a.id]} idx={idx} setQty={(q) => setAddons(s => ({ ...s, [a.id]: Math.max(0, q) }))} />)}
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-[2rem] border border-zinc-800 bg-black/65 p-6 shadow-2xl">
          <h2 className="mb-4 text-2xl font-black">Order Summary</h2>
          <div className="mb-4 flex flex-wrap gap-2">{seats.map(s => <span key={s} className="rounded-xl bg-zinc-800 px-3 py-2 text-sm">{s}</span>)}</div>
          <Summary rows={[["Tickets", usd(tickets)], ["Booking fee (5%)", usd(fee)], ...(promo ? [[`Promo (${promo.code})`, `- ${usd(discount)}`]] : []), ["Add-ons", usd(merch)]]} total={usd(total)} />
        </section>
        <section className="rounded-[2rem] border border-zinc-800 bg-black/65 p-6 shadow-2xl">
          <h2 className="mb-4 text-2xl font-black">Your Details</h2>
          <label className="mb-2 block text-sm text-zinc-200">Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Johnson" className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-red-500" />
          <label className="mb-2 block text-sm text-zinc-200">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-red-500" />
          <label className="mb-5 flex items-start gap-3 text-zinc-200"><input checked={agree} onChange={e => setAgree(e.target.checked)} type="checkbox" className="mt-1 h-4 w-4 accent-red-600" /><span>I understand this is a demo (no payment will be processed).</span></label>
          <motion.button whileHover={name && email && agree ? { scale: 1.02 } : {}} whileTap={name && email && agree ? { scale: .97 } : {}} disabled={!name || !email || !agree} onClick={place} className="w-full rounded-3xl bg-red-600 px-5 py-4 text-lg font-black shadow-glow hover:bg-red-500 disabled:bg-zinc-700 disabled:shadow-none">Place Order</motion.button>
        </section>
      </aside>
    </div>
  );
}

function AddonCard({ addon, qty, idx, setQty }) {
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * .05 }} whileHover={{ y: -5 }} className={`overflow-hidden rounded-[1.75rem] border bg-zinc-950/80 ${qty ? "border-red-600 shadow-glow" : "border-zinc-800"}`}>
      <div className="relative h-36">
        <Image src={addon.img} alt={addon.name} fill sizes="300px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-3 left-3 font-bold">{addon.name}</div>
        <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm">{usd(addon.price)}</div>
      </div>
      <div className="p-4">
        <p className="mb-3 text-sm text-zinc-400">{addon.note}</p>
        <div className="flex items-center justify-between">
          <Qty value={qty} onChange={setQty} />
          <motion.span key={qty * addon.price} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold">{qty ? usd(qty * addon.price) : ""}</motion.span>
        </div>
      </div>
    </motion.article>
  );
}

function Confirmation({ movie, seats, onHome }) {
  const [order, setOrder] = useState(null);
  useEffect(() => { const raw = sessionStorage.getItem("lastOrder"); if (raw) setOrder(JSON.parse(raw)); }, []);
  const storedSeats = order?.seats || seats, tickets = order?.ticketsSubtotal ?? storedSeats.length * movie.price, fee = order?.bookingFee ?? Math.round(tickets * .05), promo = order?.promo, discount = promo?.amount || 0, merch = order?.merchSubtotal || 0, addons = order?.addons || [], total = order?.total ?? Math.max(0, tickets + fee - discount + merch);

  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.div initial={{ scale: .2, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 14 }} className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full border border-green-600/50 bg-green-600/15">
        <svg viewBox="0 0 24 24" className="h-12 w-12 text-green-500"><path d="M20 7L9 18l-5-5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </motion.div>
      <h1 className="text-5xl font-black">You’re all set!</h1>
      <p className="mt-3 text-zinc-400">Your order is confirmed for <span className="text-white">{movie.title}</span>.</p>
      <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-black/65 p-6 text-left shadow-2xl">
        <div className="mb-4 flex justify-between text-sm"><span className="text-zinc-400">Order ID</span><span className="font-mono">{order?.id || "N/A"}</span></div>
        <div className="mb-4"><div className="mb-2 text-sm text-zinc-400">Seats</div><div className="flex flex-wrap gap-2">{storedSeats.map(s => <span key={s} className="rounded-xl bg-zinc-800 px-3 py-2 text-sm">{s}</span>)}</div></div>
        {addons.length > 0 && <div className="mb-4"><div className="mb-2 text-sm text-zinc-400">Add-ons</div>{addons.map(a => <div key={a.id} className="flex justify-between text-sm"><span>{a.name} × {a.qty}</span><span>{usd(a.lineTotal)}</span></div>)}</div>}
        <Summary rows={[["Tickets", usd(tickets)], ["Booking fee (5%)", usd(fee)], ...(promo ? [[`Promo (${promo.code})`, `- ${usd(discount)}`]] : []), ["Add-ons", usd(merch)]]} total={usd(total)} />
      </section>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .96 }} onClick={onHome} className="mt-7 rounded-3xl bg-red-600 px-8 py-4 font-black shadow-glow">Back to Home</motion.button>
    </div>
  );
}

function Summary({ rows, total }) {
  return <div className="space-y-2 text-sm">{rows.map(([label, value]) => <div key={label} className="flex justify-between text-zinc-300"><span>{label}</span><span className="font-semibold text-white">{value}</span></div>)}<motion.div key={total} initial={{ scale: .98 }} animate={{ scale: 1 }} className="mt-3 flex justify-between border-t border-zinc-800 pt-3 text-lg font-black"><span>Total</span><span>{total}</span></motion.div></div>;
}
function Legend({ color, label }) { return <span className="inline-flex items-center gap-2"><span className={`inline-block h-4 w-4 rounded ${color}`} />{label}</span>; }
function Qty({ value, onChange }) {
  return <div className="inline-flex items-center overflow-hidden rounded-2xl border border-zinc-700"><motion.button whileTap={{ scale: .9 }} onClick={() => onChange(value - 1)} className="px-3 py-2 text-lg hover:bg-zinc-800">−</motion.button><motion.span key={value} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-10 text-center font-semibold">{value}</motion.span><motion.button whileTap={{ scale: .9 }} onClick={() => onChange(value + 1)} className="px-3 py-2 text-lg hover:bg-zinc-800">+</motion.button></div>;
}
