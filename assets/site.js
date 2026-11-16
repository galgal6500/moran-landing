// ===== הגדרות האתר – כאן משנים את מספר הוואטסאפ =====
const SITE = {
  whatsapp: "972507330050", // מספר בפורמט בינלאומי, בלי + ובלי 0 בהתחלה
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
