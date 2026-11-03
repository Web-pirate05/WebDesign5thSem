/* Eventora: shared UI and page logic (vanilla JavaScript, no dependencies) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = p => (p ? "₹" + p.toLocaleString("en-IN") : "Free");
const fmtDate = iso => new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const fmtTime = iso => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
const byId = id => EVENTS.find(e => e.id === Number(id));

/* ---------- Registrations in Local Storage ---------- */
const Regs = {
  all() { try { return JSON.parse(localStorage.getItem("eventora.regs")) || []; } catch { return []; } },
  save(list) { localStorage.setItem("eventora.regs", JSON.stringify(list)); },
  add(r) { this.save([...this.all(), r]); },
  remove(id) { this.save(this.all().filter(r => r.id !== id)); },
  seatsLeft(e) { return e.seats - this.all().filter(r => r.eventId === e.id).length; },
};

/* ---------- Shared shell: header, footer, theme, tickets dialog ---------- */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem("eventora.theme", t);
  const b = $("#theme");
  if (b) b.textContent = t === "dark" ? "☀ Light" : "☾ Dark";
}

function renderTickets() {
  const list = Regs.all();
  $("#tcount").textContent = list.length || "";
  $("#tickets-list").innerHTML = list.length
    ? list.map(r => { const e = byId(r.eventId); return `<li><div><strong>${e.name}</strong><small>${fmtDate(e.date)} for ${esc(r.name)}</small><code>${r.id}</code></div><button class="x" data-cancel="${r.id}" aria-label="Cancel registration ${r.id}">Cancel</button></li>`; }).join("")
    : `<li class="none">No registrations yet. <a href="events.html">Find an event</a></li>`;
}

function renderShell() {
  const page = document.body.dataset.page;
  $("#site-header").innerHTML = `
    <a class="logo" href="index.html">Mehhfil</a>
    <nav class="links" id="menu" aria-label="Main">
      <a href="index.html" ${page === "home" ? 'class="on"' : ""}>Home</a>
      <a href="events.html" ${page === "events" ? 'class="on"' : ""}>Events</a>
      <button class="link-btn" id="tickets-btn">My tickets <span id="tcount"></span></button>
    </nav>
    <div class="actions">
      <button class="icon-btn" id="theme" aria-label="Switch between light and dark theme"></button>
      <button class="icon-btn" id="burger" aria-label="Open menu" aria-expanded="false">☰</button>
    </div>`;
  $("#site-footer").innerHTML = `<div class="wrap foot-in"><span class="logo">Mehhfil</span><p class="muted">Made with ❤️ by Iman Parui (24051773)</p></div>`;
  document.body.insertAdjacentHTML("beforeend", `<dialog id="tickets"><div class="dlg"><h2>My tickets</h2><ul id="tickets-list"></ul><form method="dialog"><button class="btn ghost sm">Close</button></form></div></dialog>`);

  setTheme(document.documentElement.dataset.theme);
  $("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  $("#burger").onclick = () => { const o = $("#menu").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); };
  const dlg = $("#tickets");
  $("#tickets-btn").onclick = () => { renderTickets(); dlg.showModal(); };
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  $("#tickets-list").addEventListener("click", e => {
    const id = e.target.dataset.cancel;
    if (id) { Regs.remove(id); document.dispatchEvent(new Event("regs")); }
  });
  document.addEventListener("regs", renderTickets);
  renderTickets();
}

/* ---------- Reusable pieces ---------- */
const card = e => {
  const d = new Date(e.date);
  return `<article class="card">
    <a class="media" href="event.html?id=${e.id}" tabindex="-1" style="--h:${(e.id * 47) % 360}" aria-hidden="true">
      <img src="https://picsum.photos/seed/${e.seed}/640/400" alt="" loading="lazy" onerror="this.remove()">
      <span class="date"><b>${d.getDate()}</b>${d.toLocaleString("en", { month: "short" })}</span>
      <span class="tag">${e.category}</span>
    </a>
    <div class="body">
      <h3><a href="event.html?id=${e.id}">${e.name}</a></h3>
      <p class="desc">${e.desc}</p>
      <p class="where">${fmtTime(e.date)} at ${e.venue}</p>
      <div class="foot"><span class="price">${money(e.price)}</span><a class="btn sm" href="event.html?id=${e.id}">View and register</a></div>
    </div>
  </article>`;
};

function countdown(el, iso) {
  const tick = () => {
    const s = Math.max(0, Math.floor((new Date(iso) - Date.now()) / 1000));
    if (!s) { el.innerHTML = `<p class="live">The event is live now</p>`; return; }
    const parts = [["Days", Math.floor(s / 86400)], ["Hours", Math.floor((s % 86400) / 3600)], ["Mins", Math.floor((s % 3600) / 60)], ["Secs", s % 60]];
    el.innerHTML = parts.map(([l, v]) => `<div><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Home ---------- */
function initHome() {
  const next = [...EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  $("#next-name").textContent = next.name;
  $("#next-meta").textContent = `${fmtDate(next.date)}, ${next.venue}`;
  $("#next-link").href = `event.html?id=${next.id}`;
  countdown($("#next-cd"), next.date);
  $("#featured").innerHTML = EVENTS.filter(e => e.featured).map(card).join("");
  $("#cats").innerHTML = Object.entries(CATS).map(([c, i]) => `<a class="cat" href="events.html?cat=${c}"><span aria-hidden="true">${i}</span><b>${c}</b><small>${EVENTS.filter(e => e.category === c).length} events</small></a>`).join("");
}

/* ---------- Events: search, filter, sort ---------- */
function initEvents() {
  const p = new URLSearchParams(location.search);
  const state = { q: p.get("q") || "", cat: CATS[p.get("cat")] ? p.get("cat") : "All", sort: "date" };
  $("#chips").innerHTML = ["All", ...Object.keys(CATS)].map(c => `<button class="chip" data-cat="${c}">${c}</button>`).join("");
  const draw = () => {
    $$(".chip").forEach(b => { const on = b.dataset.cat === state.cat; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    const q = state.q.trim().toLowerCase();
    const list = EVENTS
      .filter(e => (state.cat === "All" || e.category === state.cat) && (!q || `${e.name} ${e.venue} ${e.category} ${e.desc}`.toLowerCase().includes(q)))
      .sort(state.sort === "price" ? (a, b) => a.price - b.price : (a, b) => new Date(a.date) - new Date(b.date));
    $("#count").textContent = `${list.length} event${list.length === 1 ? "" : "s"} found`;
    $("#grid").innerHTML = list.map(card).join("");
    $("#empty").hidden = list.length > 0;
  };
  $("#q").value = state.q;
  $("#q").addEventListener("input", e => { state.q = e.target.value; draw(); });
  $("#chips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { state.cat = b.dataset.cat; draw(); } });
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; draw(); });
  $("#reset").onclick = () => { state.q = ""; state.cat = "All"; $("#q").value = ""; draw(); };
  draw();
}

/* ---------- Event details + registration ---------- */
const RULES = {
  name: v => /^[A-Za-z][A-Za-z .'-]{2,49}$/.test(v.trim()) || "Enter your full name using letters only (at least 3 characters).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter a valid email address, like name@example.com.",
  phone: v => /^(\+91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")) || "Enter a valid 10-digit mobile number (optionally starting with +91).",
  eventId: v => !!v || "Choose the event you want to attend.",
};

function check(input) {
  const res = RULES[input.name](input.value);
  const ok = res === true;
  input.classList.toggle("bad", !ok);
  input.classList.toggle("good", ok && input.value !== "");
  input.setAttribute("aria-invalid", String(!ok));
  $(`#${input.id}-err`).textContent = ok ? "" : res;
  return ok;
}

function fail(input, msg) {
  input.classList.add("bad");
  input.setAttribute("aria-invalid", "true");
  $(`#${input.id}-err`).textContent = msg;
  input.focus();
}

function drawForm(e) {
  const fields = [["name", "Full name", "text", "name", "Aarav Sharma"], ["email", "Email address", "email", "email", "you@example.com"], ["phone", "Phone number", "tel", "tel", "98765 43210"]];
  $("#reg").innerHTML = `<h2>Reserve your spot</h2>
    <form id="form" novalidate>
      ${fields.map(([id, label, type, ac, ph]) => `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" autocomplete="${ac}" placeholder="${ph}" aria-describedby="${id}-err"><small class="err" id="${id}-err" role="alert"></small></div>`).join("")}
      <div class="field"><label for="eventId">Event</label><select id="eventId" name="eventId" aria-describedby="eventId-err">${EVENTS.map(x => `<option value="${x.id}" ${x.id === e.id ? "selected" : ""}>${x.name}</option>`).join("")}</select><small class="err" id="eventId-err" role="alert"></small></div>
      <button class="btn block" type="submit">Register for this event</button>
    </form>`;
  const form = $("#form");
  const inputs = $$("input, select", form);
  inputs.forEach(i => {
    i.addEventListener("blur", () => i.value && check(i));
    i.addEventListener("input", () => i.classList.contains("bad") && check(i));
  });
  form.addEventListener("submit", evt => {
    evt.preventDefault();
    const results = inputs.map(check);
    if (results.includes(false)) { inputs[results.indexOf(false)].focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    const chosen = byId(d.eventId);
    const email = d.email.trim().toLowerCase();
    if (Regs.seatsLeft(chosen) <= 0) return fail($("#eventId"), "This event is sold out. Choose another event.");
    if (Regs.all().some(r => r.eventId === chosen.id && r.email === email)) return fail($("#email"), "This email is already registered for this event.");
    const rec = { id: "EVT-" + Math.random().toString(36).slice(2, 8).toUpperCase(), eventId: chosen.id, name: d.name.trim(), email, phone: d.phone.trim(), at: Date.now() };
    Regs.add(rec);
    document.dispatchEvent(new Event("regs"));
    confirmation(rec, chosen, e);
  });
}

function confirmation(rec, chosen, e) {
  $("#reg").innerHTML = `<div class="done">
    <div class="check" aria-hidden="true">✓</div>
    <h2>You are registered, ${esc(rec.name.split(" ")[0])}</h2>
    <p class="muted">Your ticket is saved under My tickets.</p>
    <div class="ticket"><b>${chosen.name}</b><span>${fmtDate(chosen.date)}, ${fmtTime(chosen.date)}</span><span>${chosen.venue}</span><code>${rec.id}</code></div>
    <div class="cta"><a class="btn" href="events.html">Browse more events</a><button class="btn ghost" id="again">Register another person</button></div>
  </div>`;
  $("#again").onclick = () => drawForm(e);
  $("#reg").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function initEvent() {
  const e = byId(new URLSearchParams(location.search).get("id"));
  const root = $("#detail");
  if (!e) {
    root.innerHTML = `<div class="wrap empty-state"><h1>Event not found</h1><p class="muted">The link may be old or mistyped.</p><a class="btn" href="events.html">Browse all events</a></div>`;
    return;
  }
  document.title = `${e.name} | Eventora`;
  root.innerHTML = `<div class="wrap detail-grid">
    <div>
      <a class="back" href="events.html">Back to all events</a>
      <div class="cover" style="--h:${(e.id * 47) % 360}"><img src="https://picsum.photos/seed/${e.seed}/1100/560" alt="${e.name}" onerror="this.remove()"><span class="tag">${e.category}</span></div>
      <h1>${e.name}</h1>
      <dl class="facts">
        <div><dt>Date</dt><dd>${fmtDate(e.date)}</dd></div>
        <div><dt>Time</dt><dd>${fmtTime(e.date)}</dd></div>
        <div><dt>Venue</dt><dd>${e.venue}</dd></div>
        <div><dt>Price</dt><dd>${money(e.price)}</dd></div>
        <div><dt>Seats left</dt><dd id="seats"></dd></div>
      </dl>
      <p class="label">Starts in</p>
      <div id="cd" class="cd"></div>
      <h2>About this event</h2>
      <p class="about">${e.about}</p>
    </div>
    <aside class="reg" id="reg"></aside>
  </div>`;
  countdown($("#cd"), e.date);
  const seats = () => { $("#seats").textContent = Regs.seatsLeft(e); };
  seats();
  document.addEventListener("regs", seats);
  drawForm(e);
}

/* ---------- Boot ---------- */
renderShell();
({ home: initHome, events: initEvents, event: initEvent })[document.body.dataset.page]?.();
