// ===== הגדרות האתר – כאן משנים את מספר הוואטסאפ =====
const SITE = {
  whatsapp: "972507330050", // מספר בפורמט בינלאומי, בלי + ובלי 0 בהתחלה
  // קישורים לרשתות – להדביק כאן את הכתובת המלאה של כל פרופיל
  instagram: "",
  tiktok: "",
  facebook: "",
};

function waLink(message) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message || "היי מורן, אשמח לקבוע תור 🌸")}`;
}

// כל קישור עם data-wa נפתח בוואטסאפ עם ההודעה שכתובה בו
document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = waLink(a.getAttribute("data-wa"));
  a.target = "_blank";
  a.rel = "noopener";
});

// קישורים לרשתות חברתיות
document.querySelectorAll("[data-social]").forEach(a => {
  const url = SITE[a.dataset.social];
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  else a.addEventListener("click", e => e.preventDefault());
});

// סרטון בפתיחה – עוצר לפי בקשה, בהעדפת "בלי תנועה" או אם אין קובץ
const heroVideo = document.querySelector(".hero-video");
const vToggle = document.querySelector(".video-toggle");
if (heroVideo) {
  const extras = [...document.querySelectorAll(".hero-extra")];
  const allVids = () => [heroVideo, ...extras.filter(v => v.dataset.ready)];
  const setPaused = p => {
    allVids().forEach(v => { if (p) v.pause(); else v.play().catch(() => {}); });
    if (vToggle) { vToggle.classList.toggle("paused", p); vToggle.setAttribute("aria-label", p ? "הפעלת הסרטון" : "עצירת הסרטון"); }
  };
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-still");
  heroVideo.addEventListener("playing", () => { if (vToggle) vToggle.hidden = false; }, { once: true });
  vToggle?.addEventListener("click", () => setPaused(!heroVideo.paused));
  if (matchMedia("(min-width: 900px)").matches) extras.forEach(v => {
    v.addEventListener("loadedmetadata", () => { v.currentTime = +v.dataset.start || 0; v.dataset.ready = "1"; if (!heroVideo.paused) v.play().catch(() => {}); }, { once: true });
    v.preload = "auto"; v.load();
  });
  if (still()) setPaused(true);
  new MutationObserver(() => { if (still()) setPaused(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
}

// תפריט בטלפון
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
if (burger && nav) {
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// אנימציית כניסה בגלילה
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// הגדלת תמונות בגלריה
const lb = document.createElement("div");
lb.className = "lightbox";
lb.innerHTML = '<img alt="">';
document.body.appendChild(lb);
lb.addEventListener("click", () => lb.classList.remove("open"));
document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });
document.querySelectorAll(".ba-grid figure img, .grads img").forEach(img => {
  img.addEventListener("click", () => { lb.querySelector("img").src = img.src; lb.classList.add("open"); });
});

// טופס יצירת קשר – שולח את הפרטים כהודעת וואטסאפ מוכנה
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(form);
    const lines = [
      `היי מורן, אני ${f.get("name") || ""} 🌸`,
      f.get("service") ? `מתעניינת ב: ${f.get("service")}` : "",
      f.get("when") ? `מתי נוח לי: ${f.get("when")}` : "",
      f.get("message") || "",
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });
}

// שנה בתחתית הדף
document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

// קרוסלת המלצות – חיצים
document.querySelectorAll("[data-carousel]").forEach(c => {
  const track = c.querySelector(".track");
  const step = () => (track.querySelector(".slide")?.offsetWidth || 300) + 20;
  c.querySelector(".prev")?.addEventListener("click", () => track.scrollBy({ left: step() }));
  c.querySelector(".next")?.addEventListener("click", () => track.scrollBy({ left: -step() }));
});

// ===== תפריט נגישות =====
(function () {
  const root = document.documentElement;
  const base = document.currentScript ? document.currentScript.src.replace(/assets\/site\.js.*$/, "") : "";
  let prefs = {};
  try { prefs = JSON.parse(localStorage.getItem("a11y") || "{}"); } catch (e) {}
  const save = () => { try { localStorage.setItem("a11y", JSON.stringify(prefs)); } catch (e) {} };
  const apply = () => {
    root.style.fontSize = prefs.size ? (100 + prefs.size * 10) + "%" : "";
    ["contrast", "links", "font", "still"].forEach(k => root.classList.toggle("a11y-" + k, !!prefs[k]));
    panel.querySelectorAll("[data-toggle]").forEach(b => b.setAttribute("aria-pressed", prefs[b.dataset.toggle] ? "true" : "false"));
  };
  const btn = document.createElement("button");
  btn.className = "a11y-btn"; btn.type = "button"; btn.setAttribute("aria-label", "תפריט נגישות"); btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M19 8.5c-2.2.6-4.6.9-7 .9s-4.8-.3-7-.9l-.5 1.9c1.8.5 3.7.8 5.6.9V14l-2 7h2.1l1.8-5.6 1.8 5.6H16l-2-7v-2.7c1.9-.1 3.8-.4 5.6-.9z"/></svg>';
  const panel = document.createElement("div");
  panel.className = "a11y-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "תפריט נגישות");
  panel.innerHTML = `<h3>נגישות</h3>
    <button type="button" data-act="bigger">הגדלת טקסט +</button>
    <button type="button" data-act="smaller">הקטנת טקסט −</button>
    <button type="button" data-toggle="contrast">ניגודיות גבוהה</button>
    <button type="button" data-toggle="links">הדגשת קישורים</button>
    <button type="button" data-toggle="font">גופן קריא</button>
    <button type="button" data-toggle="still">עצירת אנימציות</button>
    <button type="button" data-act="reset">איפוס</button>
    <a href="${base}accessibility.html">הצהרת נגישות</a>`;
  document.body.append(btn, panel);
  btn.addEventListener("click", () => { const o = panel.classList.toggle("open"); btn.setAttribute("aria-expanded", o ? "true" : "false"); });
  panel.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.toggle) prefs[b.dataset.toggle] = !prefs[b.dataset.toggle];
    if (b.dataset.act === "bigger") prefs.size = Math.min((prefs.size || 0) + 1, 5);
    if (b.dataset.act === "smaller") prefs.size = Math.max((prefs.size || 0) - 1, -2);
    if (b.dataset.act === "reset") prefs = {};
    save(); apply();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") panel.classList.remove("open"); });
  apply();
})();
