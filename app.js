// =============================================================================
//  AI Products Catalogue — app.js
//  All CSS, HTML, and logic lives here. index.html is a bare shell.
// =============================================================================

// ── CONFIG — replace these two values before publishing ───────────────────────
const SHEET_ENDPOINT = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // see setup-guide.html
const WA_NUMBER      = '91XXXXXXXXXX';                 // your WhatsApp number
// =============================================================================

// ── External resources ────────────────────────────────────────────────────────
(function loadExternalResources() {
  const fonts = document.createElement('link');
  fonts.rel  = 'stylesheet';
  fonts.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap';
  document.head.appendChild(fonts);

  const qrScript = document.createElement('script');
  qrScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  document.head.appendChild(qrScript);
})();

// ── CSS ───────────────────────────────────────────────────────────────────────
(function injectStyles() {
  const css = `
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0f1117;--ink2:#3a3d4a;--muted:#7a7f94;
  --surface:#ffffff;--bg:#f5f4f0;--accent:#e85d26;
  --accent2:#1a56db;--gold:#c9a84c;
  --radius:14px;--card-shadow:0 2px 12px rgba(0,0,0,0.07);
}
html{scroll-behavior:smooth;}
body{background:var(--bg);font-family:'Outfit',sans-serif;color:var(--ink);min-height:100vh;font-size:15px;}

/* HERO */
.hero{background:var(--ink);color:#fff;padding:3rem 1.5rem 2.5rem;text-align:center;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:rgba(232,93,38,0.12);pointer-events:none;}
.hero::after{content:'';position:absolute;bottom:-80px;left:-40px;width:260px;height:260px;border-radius:50%;background:rgba(26,86,219,0.08);pointer-events:none;}
.hero-badge{display:inline-block;background:rgba(232,93,38,0.18);color:#f09060;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;border-radius:20px;padding:5px 14px;margin-bottom:1.1rem;}
.hero h1{font-family:'Playfair Display',serif;font-size:2.1rem;font-weight:700;line-height:1.2;margin-bottom:0.7rem;}
.hero h1 em{font-style:italic;color:#f09060;}
.hero p{font-size:14px;color:rgba(255,255,255,0.65);max-width:340px;margin:0 auto 1.5rem;line-height:1.6;}
.hero-note{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:7px 16px;font-size:12.5px;color:rgba(255,255,255,0.75);}
.hero-note span{width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

/* NAV STRIP */
.strip{background:#fff;border-bottom:1px solid #e8e6e0;padding:0.6rem 1rem;display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;}
.strip::-webkit-scrollbar{display:none;}
.strip a{white-space:nowrap;font-size:12px;color:var(--muted);text-decoration:none;padding:5px 12px;border-radius:20px;border:1px solid #e0ddd6;transition:all 0.15s;}
.strip a:hover{background:var(--ink);color:#fff;border-color:var(--ink);}

/* SECTION */
.section{padding:2rem 1rem 0;}
.section-label{font-size:10.5px;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:0.5rem;}
.section-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;margin-bottom:0.3rem;}
.section-sub{font-size:13px;color:var(--muted);margin-bottom:1.25rem;line-height:1.5;}

/* CARDS */
.cards{display:flex;flex-direction:column;gap:12px;padding:0 1rem 1.5rem;}
.card{background:var(--surface);border-radius:var(--radius);box-shadow:var(--card-shadow);padding:1.25rem 1.25rem 1rem;border:1px solid #ece9e2;position:relative;overflow:hidden;}
.card.featured{background:var(--ink);color:#fff;border-color:transparent;}
.card.featured .card-name,.card.featured .card-desc{color:#fff;}
.card.featured .card-meta{color:rgba(255,255,255,0.55);}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem;}
.card-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;}
.card.featured .card-icon{background:rgba(255,255,255,0.12);}
.badge{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;border-radius:20px;padding:3px 10px;font-weight:600;white-space:nowrap;}
.badge.live{background:#dcfce7;color:#15803d;}
.badge.custom{background:#fef3c7;color:#92400e;}
.badge.hot{background:var(--accent);color:#fff;}
.badge.preorder{background:linear-gradient(135deg,#e85d26,#c9a84c);color:#fff;animation:shimmer 2.5s infinite;}
@keyframes shimmer{0%,100%{opacity:1;}50%{opacity:0.8;}}
.card-num{font-size:11px;color:var(--muted);font-weight:500;margin-bottom:3px;}
.card-name{font-size:1.05rem;font-weight:600;margin-bottom:0.4rem;line-height:1.25;}
.card-desc{font-size:13px;color:var(--ink2);line-height:1.55;margin-bottom:0.9rem;}
.card-meta{font-size:11.5px;color:var(--muted);margin-bottom:0.85rem;line-height:1.5;}
.card-actions{display:flex;gap:8px;flex-wrap:wrap;}
.btn{display:inline-flex;align-items:center;gap:6px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;border-radius:8px;padding:9px 16px;text-decoration:none;cursor:pointer;border:none;transition:all 0.15s;}
.btn-interest{background:var(--ink);color:#fff;}
.btn-interest:hover{background:var(--accent);}
.btn-link{background:#f0ede6;color:var(--ink);}
.btn-link:hover{background:#e0ddd6;}
.btn-preorder{background:linear-gradient(135deg,#e85d26,#c9a84c);color:#fff;width:100%;justify-content:center;padding:12px;font-size:14px;font-weight:600;}
.btn-preorder:hover{opacity:0.92;}
.dev-card{background:var(--ink2);color:#fff;border-color:transparent;}
.dev-card .card-name,.dev-card .card-desc{color:#fff;}
.dev-card .card-meta{color:rgba(255,255,255,0.55);}

/* READY4LAUNCH PRICING */
.featured-price{text-align:center;padding:1rem 0 0.5rem;}
.price-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:4px;}
.price-main{font-size:2rem;font-weight:700;color:#f09060;}
.price-label{font-size:12px;color:rgba(255,255,255,0.55);}
.price-old{font-size:13px;color:rgba(255,255,255,0.4);text-decoration:line-through;}
.price-saving{font-size:11px;background:rgba(74,222,128,0.2);color:#4ade80;border-radius:20px;padding:3px 10px;display:inline-block;margin-bottom:0.75rem;}
.pilot-steps{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0.75rem 0;}
.pilot-step{background:rgba(255,255,255,0.07);border-radius:8px;padding:0.65rem 0.85rem;text-align:center;}
.pilot-step .ps-num{font-size:1.2rem;font-weight:700;color:#f09060;}
.pilot-step .ps-label{font-size:11px;color:rgba(255,255,255,0.55);margin-top:2px;}

/* HOW IT WORKS STEPS */
.steps-bar{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:0 1rem 2rem;background:#fff;border-radius:var(--radius);border:1px solid #ece9e2;padding:1.25rem;}
.step{text-align:center;}
.step-num{width:28px;height:28px;border-radius:50%;background:var(--ink);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;}
.step-text{font-size:11.5px;color:var(--muted);line-height:1.4;}

/* DIVIDER */
.divider{height:1px;background:#e8e5de;margin:0 1rem;}

/* QR SECTION */
.qr-section{margin:2rem 1rem;background:#fff;border-radius:var(--radius);box-shadow:var(--card-shadow);border:1px solid #ece9e2;padding:1.5rem;}
.qr-section h3{font-family:'Playfair Display',serif;font-size:1.15rem;margin-bottom:0.4rem;}
.qr-section p{font-size:13px;color:var(--muted);margin-bottom:1rem;line-height:1.5;}
.qr-input-row{display:flex;gap:8px;flex-wrap:wrap;}
.qr-input{flex:1;min-width:0;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--ink);}
.qr-input:focus{outline:none;border-color:var(--accent);}
.btn-gen{background:var(--ink);color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;border:none;border-radius:8px;padding:10px 18px;cursor:pointer;white-space:nowrap;}
.btn-gen:hover{background:var(--accent);}
#qr-output{margin-top:1.25rem;text-align:center;display:none;}
#qr-output canvas,#qr-output img{border-radius:8px;border:1px solid #ece9e2;}
#qr-output p{font-size:12px;color:var(--muted);margin-top:8px;}
.btn-dl{display:inline-flex;align-items:center;gap:6px;margin-top:10px;background:var(--ink);color:#fff;font-family:'Outfit',sans-serif;font-size:12px;padding:8px 16px;border-radius:8px;cursor:pointer;border:none;}
.btn-dl:hover{background:var(--accent);}

/* FOOTER */
footer{background:var(--ink);color:rgba(255,255,255,0.5);text-align:center;padding:2rem 1rem;font-size:12px;line-height:1.8;}
footer strong{color:#fff;}

/* ── MODAL ─────────────────────────────────────────────────────────────────── */
.modal-overlay{
  display:none;position:fixed;inset:0;z-index:1000;
  background:rgba(15,17,23,0.65);backdrop-filter:blur(4px);
  align-items:center;justify-content:center;padding:1rem;
}
.modal-overlay.open{display:flex;}
.modal{
  background:#fff;border-radius:18px;width:100%;max-width:420px;
  box-shadow:0 20px 60px rgba(0,0,0,0.25);overflow:hidden;
  animation:slideUp 0.22s ease;
}
@keyframes slideUp{from{transform:translateY(24px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.modal-head{
  background:var(--ink);padding:1.25rem 1.4rem 1.1rem;
  display:flex;align-items:flex-start;justify-content:space-between;
}
.modal-head-text{}
.modal-product-tag{
  font-size:10px;letter-spacing:0.15em;text-transform:uppercase;
  color:rgba(255,255,255,0.45);margin-bottom:4px;
}
.modal-title{font-family:'Playfair Display',serif;font-size:1.15rem;color:#fff;line-height:1.25;}
.modal-close{
  background:rgba(255,255,255,0.1);border:none;color:#fff;
  width:30px;height:30px;border-radius:50%;cursor:pointer;
  font-size:1rem;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;margin-left:12px;margin-top:2px;transition:background 0.15s;
}
.modal-close:hover{background:rgba(255,255,255,0.2);}
.modal-body{padding:1.4rem;}
.form-row{margin-bottom:1rem;}
.form-label{display:block;font-size:12px;font-weight:600;color:var(--ink2);margin-bottom:5px;letter-spacing:0.02em;}
.form-label span{color:var(--accent);}
.form-input,.form-textarea{
  width:100%;padding:10px 12px;
  border:1.5px solid #e0ddd6;border-radius:9px;
  font-family:'Outfit',sans-serif;font-size:13.5px;color:var(--ink);
  background:#fafaf8;transition:border-color 0.15s,box-shadow 0.15s;
  outline:none;
}
.form-input:focus,.form-textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(232,93,38,0.1);background:#fff;}
.form-input.error,.form-textarea.error{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.1);}
.form-textarea{resize:vertical;min-height:80px;}
.form-hint{font-size:11px;color:var(--muted);margin-top:4px;}
.form-error{font-size:11px;color:#ef4444;margin-top:4px;display:none;}
.form-input.error + .form-error,.form-textarea.error + .form-error{display:block;}
.modal-foot{padding:0 1.4rem 1.4rem;display:flex;gap:10px;}
.btn-submit{
  flex:1;background:var(--ink);color:#fff;border:none;
  font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;
  border-radius:10px;padding:13px;cursor:pointer;transition:all 0.15s;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.btn-submit:hover{background:var(--accent);}
.btn-submit:disabled{opacity:0.6;cursor:not-allowed;}
.btn-cancel{
  background:#f0ede6;color:var(--ink2);border:none;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;
  border-radius:10px;padding:13px 18px;cursor:pointer;transition:background 0.15s;
}
.btn-cancel:hover{background:#e0ddd6;}

/* SUCCESS STATE */
.modal-success{
  padding:2.5rem 1.5rem;text-align:center;display:none;
}
.modal-success .success-icon{
  width:56px;height:56px;border-radius:50%;background:#dcfce7;
  color:#15803d;font-size:1.6rem;display:flex;align-items:center;
  justify-content:center;margin:0 auto 1rem;
}
.modal-success h3{font-family:'Playfair Display',serif;font-size:1.2rem;margin-bottom:0.5rem;}
.modal-success p{font-size:13px;color:var(--muted);line-height:1.6;}
.modal-success .btn-done{
  margin-top:1.25rem;background:var(--ink);color:#fff;border:none;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;
  border-radius:9px;padding:10px 24px;cursor:pointer;transition:background 0.15s;
}
.modal-success .btn-done:hover{background:var(--accent);}

/* SPINNER */
.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}

/* RESPONSIVE */
@media(min-width:600px){
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .card.featured,.card.fullwidth{grid-column:1/-1;}
  .hero h1{font-size:2.5rem;}
}
@media(min-width:900px){
  .cards{grid-template-columns:1fr 1fr 1fr;}
  .hero{padding:4rem 2rem 3rem;}
  .section{padding:2.5rem 2rem 0;}
  .cards{padding:0 2rem 2rem;}
  .qr-section{margin:2rem 2rem;}
  .steps-bar{margin:0 2rem 2rem;}
  .divider{margin:0 2rem;}
}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// ── Data ──────────────────────────────────────────────────────────────────────
const navLinks = [
  { href: '#resume',     label: 'Resume Builder'    },
  { href: '#ready4exam', label: 'Ready4Exam'         },
  { href: '#telugu',     label: 'TeluguBuddy'        },
  { href: '#seo',        label: 'SEO Optimizer'      },
  { href: '#patent',     label: 'Patent Assistant'   },
  { href: '#wa-mktg',    label: 'WhatsApp Mktg'      },
  { href: '#sector',     label: 'Sector Mktg'        },
  { href: '#dev',        label: 'Custom Dev'         },
  { href: '#r4l',        label: 'Ready4Launch 🔥'    },
];

const products = [
  {
    id: 'resume', num: '01', icon: '📄', iconBg: '#fff5f0',
    badge: 'custom', badgeLabel: 'Custom for you',
    name: 'Resume Builder',
    desc: 'Turned a 45-minute job application into a 5-minute task. Reads a job description, tailors your resume to match it, formats it — done. This got me a role at PwC.',
    meta: 'Built to your profile · Any industry · Any role level',
  },
  {
    id: 'ready4exam', num: '02', icon: '📚', iconBg: '#f0fdf4',
    badge: 'live', badgeLabel: 'Live — Self Serve',
    name: 'Ready4Exam Portal',
    desc: 'A full exam-readiness platform built for students who can\'t afford to miss class. Free modules available. Paid tiers with deeper features. No customisation needed — just use it.',
    meta: '✓ Free modules available · ✓ Paid tiers on the website · Schools: let\'s discuss deployment',
    extraBtn: { cls: 'btn-link', label: '🌐 Visit Portal', href: '#' },
    schoolsBtn: true,
  },
  {
    id: 'telugu', num: '03', icon: '🗣️', iconBg: '#fdf4ff',
    badge: 'custom', badgeLabel: 'Any Language',
    name: 'TeluguBuddy',
    desc: 'Built for my daughter who had Telugu in school — a subject we don\'t speak at home. Chapter-by-chapter, every word with English pronunciation, meaning, and audio. She now enjoys it.',
    meta: 'Can be built for any language · Tamil, Kannada, Marathi, Hindi, French — you name it',
  },
  {
    id: 'seo', num: '04', icon: '📈', iconBg: '#fffbeb',
    badge: 'custom', badgeLabel: 'Custom for you',
    name: 'SEO Optimisation Tool',
    desc: 'Used this to grow a YouTube channel to 400 subscribers in one month — with AI-driven descriptions, tags, and keywords most creators don\'t even know exist. Applicable to any business or content channel.',
    meta: 'YouTube · Website · Blog · Product listings · Any content platform',
  },
  {
    id: 'patent', num: '05', icon: '📋', iconBg: '#f0f9ff',
    badge: 'custom', badgeLabel: 'Custom for you',
    name: 'Patent Assistant',
    desc: 'Filed my own provisional patent — solo, no IP lawyer, no partner — using AI to handle the research, prior art search, and documentation drafting. If you have an idea worth protecting, this is how you start.',
    meta: 'Provisional patent drafting · Prior art research · Documentation · India & international',
  },
  {
    id: 'wa-mktg', num: '06', icon: '💬', iconBg: '#f0fdf4',
    badge: 'custom', badgeLabel: 'Custom for you',
    name: 'WhatsApp Marketing App',
    desc: 'Automated, personalised campaign tool built to market this very AI programme. Crafts messages, schedules them, and reaches your audience where they already are — WhatsApp.',
    meta: 'Bulk messaging · Personalisation · Campaign scheduling · Any product or service',
  },
  {
    id: 'sector', num: '07', icon: '🎯', iconBg: '#fff5f0',
    badge: 'custom', badgeLabel: 'Any Sector',
    name: 'Sector-Specific Marketing Tool',
    desc: 'Built a college outreach app that finds every chairman, principal, and dean\'s email address and sends a tailored proposal — fully automated. The same logic works for any sector: healthcare, retail, hospitality, you name it.',
    meta: 'Built example: College / University outreach · Adaptable to any industry',
  },
];

// ── DOM helpers ───────────────────────────────────────────────────────────────
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'html')  node.innerHTML = v;
    else if (k === 'style') node.style.cssText = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === 'string') node.appendChild(document.createTextNode(child));
    else if (child) node.appendChild(child);
  }
  return node;
}

function buildSection(label, title, sub) {
  const sec = el('div', { class: 'section' });
  sec.appendChild(el('p', { class: 'section-label' }, label));
  sec.appendChild(el('p', { class: 'section-title', html: title }));
  sec.appendChild(el('p', { class: 'section-sub' }, sub));
  return sec;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
let modalOverlay;

function buildModal() {
  modalOverlay = el('div', { class: 'modal-overlay', id: 'lead-modal' });

  const modal = el('div', { class: 'modal' });

  // — Head
  const head = el('div', { class: 'modal-head' });
  const headText = el('div', { class: 'modal-head-text' });
  headText.appendChild(el('p', { class: 'modal-product-tag', id: 'modal-product-tag' }, ''));
  headText.appendChild(el('p', { class: 'modal-title', id: 'modal-title' }, ''));
  const closeBtn = el('button', { class: 'modal-close', id: 'modal-close' }, '✕');
  closeBtn.addEventListener('click', closeModal);
  head.appendChild(headText);
  head.appendChild(closeBtn);
  modal.appendChild(head);

  // — Form body
  const body = el('div', { class: 'modal-body', id: 'modal-form-body' });

  // Name
  const rowName = el('div', { class: 'form-row' });
  const lblName = el('label', { class: 'form-label', for: 'f-name' });
  lblName.innerHTML = 'Your Name <span>*</span>';
  const inpName = el('input', { class: 'form-input', type: 'text', id: 'f-name', placeholder: 'e.g. Priya Sharma', autocomplete: 'name' });
  const errName = el('p', { class: 'form-error' }, 'Please enter your name');
  rowName.appendChild(lblName); rowName.appendChild(inpName); rowName.appendChild(errName);
  body.appendChild(rowName);

  // Phone
  const rowPhone = el('div', { class: 'form-row' });
  const lblPhone = el('label', { class: 'form-label', for: 'f-phone' });
  lblPhone.innerHTML = 'WhatsApp / Phone <span>*</span>';
  const inpPhone = el('input', { class: 'form-input', type: 'tel', id: 'f-phone', placeholder: '10-digit mobile number', autocomplete: 'tel' });
  const errPhone = el('p', { class: 'form-error' }, 'Please enter a valid 10-digit number');
  rowPhone.appendChild(lblPhone); rowPhone.appendChild(inpPhone); rowPhone.appendChild(errPhone);
  body.appendChild(rowPhone);

  // Email
  const rowEmail = el('div', { class: 'form-row' });
  const lblEmail = el('label', { class: 'form-label', for: 'f-email' }, 'Email Address');
  const inpEmail = el('input', { class: 'form-input', type: 'email', id: 'f-email', placeholder: 'optional', autocomplete: 'email' });
  const hintEmail = el('p', { class: 'form-hint' }, 'Optional — for sending you a follow-up summary');
  rowEmail.appendChild(lblEmail); rowEmail.appendChild(inpEmail); rowEmail.appendChild(hintEmail);
  body.appendChild(rowEmail);

  // Message
  const rowMsg = el('div', { class: 'form-row' });
  const lblMsg = el('label', { class: 'form-label', for: 'f-msg' }, 'What do you need?');
  const txMsg = el('textarea', { class: 'form-textarea', id: 'f-msg', placeholder: 'Tell me a bit about your use case or what you\'re hoping to achieve...' });
  rowMsg.appendChild(lblMsg); rowMsg.appendChild(txMsg);
  body.appendChild(rowMsg);

  modal.appendChild(body);

  // — Success state (hidden by default)
  const successDiv = el('div', { class: 'modal-success', id: 'modal-success' });
  const successIcon = el('div', { class: 'success-icon' }, '✓');
  successDiv.appendChild(successIcon);
  successDiv.appendChild(el('h3', {}, 'Got it — I\'ll be in touch!'));
  successDiv.appendChild(el('p', {}, 'Your details have been saved. I\'ll review and reach out within 24 hours.'));
  const doneBtn = el('button', { class: 'btn-done' }, 'Close');
  doneBtn.addEventListener('click', closeModal);
  successDiv.appendChild(doneBtn);
  modal.appendChild(successDiv);

  // — Footer
  const foot = el('div', { class: 'modal-foot', id: 'modal-foot' });
  const submitBtn = el('button', { class: 'btn-submit', id: 'modal-submit' }, '✉ Send My Interest');
  submitBtn.addEventListener('click', submitLead);
  const cancelBtn = el('button', { class: 'btn-cancel' }, 'Cancel');
  cancelBtn.addEventListener('click', closeModal);
  foot.appendChild(submitBtn);
  foot.appendChild(cancelBtn);
  modal.appendChild(foot);

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  // Close on Esc
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

function openModal(productName) {
  document.getElementById('modal-product-tag').textContent = 'Expressing interest in';
  document.getElementById('modal-title').textContent = productName;
  // reset form
  ['f-name','f-phone','f-email','f-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.classList.remove('error'); }
  });
  document.getElementById('modal-form-body').style.display = 'block';
  document.getElementById('modal-foot').style.display = 'flex';
  document.getElementById('modal-success').style.display = 'none';
  const sb = document.getElementById('modal-submit');
  sb.innerHTML = '✉ Send My Interest';
  sb.disabled = false;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-name').focus(), 100);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Form validation & submission ──────────────────────────────────────────────
function validate() {
  let ok = true;
  const name  = document.getElementById('f-name');
  const phone = document.getElementById('f-phone');

  name.classList.remove('error');
  phone.classList.remove('error');

  if (!name.value.trim()) { name.classList.add('error'); ok = false; }
  if (!/^\d{10}$/.test(phone.value.replace(/\s/g, ''))) { phone.classList.add('error'); ok = false; }
  return ok;
}

async function submitLead() {
  if (!validate()) return;

  const sb = document.getElementById('modal-submit');
  sb.innerHTML = '<div class="spinner"></div> Sending…';
  sb.disabled = true;

  const payload = {
    product : document.getElementById('modal-title').textContent,
    name    : document.getElementById('f-name').value.trim(),
    phone   : document.getElementById('f-phone').value.trim(),
    email   : document.getElementById('f-email').value.trim(),
    message : document.getElementById('f-msg').value.trim(),
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  try {
    if (SHEET_ENDPOINT === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      // Dev mode — log to console and show success
      console.table(payload);
      await new Promise(r => setTimeout(r, 800));
    } else {
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    // Show success
    document.getElementById('modal-form-body').style.display = 'none';
    document.getElementById('modal-foot').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
  } catch (err) {
    sb.innerHTML = '✉ Send My Interest';
    sb.disabled = false;
    alert('Something went wrong — please try again.');
  }
}

// ── Card builder ──────────────────────────────────────────────────────────────
function buildCard(p) {
  const card = el('div', { class: 'card', id: p.id });
  const top  = el('div', { class: 'card-top' });
  top.appendChild(el('div', { class: 'card-icon', style: `background:${p.iconBg}` }, p.icon));
  top.appendChild(el('span', { class: `badge ${p.badge}` }, p.badgeLabel));
  card.appendChild(top);
  card.appendChild(el('p', { class: 'card-num' }, `Product ${p.num}`));
  card.appendChild(el('p', { class: 'card-name' }, p.name));
  card.appendChild(el('p', { class: 'card-desc' }, p.desc));
  card.appendChild(el('p', { class: 'card-meta' }, p.meta));

  const actions = el('div', { class: 'card-actions' });
  if (p.extraBtn) {
    actions.appendChild(el('a', { class: `btn ${p.extraBtn.cls}`, href: p.extraBtn.href, target: '_blank' }, p.extraBtn.label));
  }
  const cta = el('button', { class: 'btn btn-interest' });
  cta.textContent = p.schoolsBtn ? '🏫 Schools — Register Interest' : '✉ I\'m Interested';
  cta.addEventListener('click', () => openModal(p.name + (p.schoolsBtn ? ' (School Deployment)' : '')));
  actions.appendChild(cta);
  card.appendChild(actions);
  return card;
}

// ── Page builder ──────────────────────────────────────────────────────────────
function buildPage() {
  const body = document.body;

  // Hero
  const hero = el('div', { class: 'hero' });
  hero.appendChild(el('div', { class: 'hero-badge' }, 'AI Tools Portfolio'));
  hero.appendChild(el('h1', { html: 'Built from <em>experience.</em><br>Available for you.' }));
  hero.appendChild(el('p', {}, '22 years in IT. Zero coding. All of these were built to solve real problems — and they work. If you need one, let\'s talk.'));
  const note = el('div', { class: 'hero-note' });
  note.appendChild(el('span', {}));
  note.appendChild(document.createTextNode('All products built solo, using AI — no developer required'));
  hero.appendChild(note);
  body.appendChild(hero);

  // Nav strip
  const strip = el('div', { class: 'strip' });
  navLinks.forEach(l => strip.appendChild(el('a', { href: l.href }, l.label)));
  body.appendChild(strip);

  // How it works
  body.appendChild(buildSection('How This Works', 'How This Works',
    'Browse a product, tap the button, fill in your details — and you\'re done. I\'ll review and reach out within 24 hours.'));
  const stepsBar = el('div', { class: 'steps-bar' });
  [['1','Browse products below'],['2','Tap the interest button'],['3','I\'ll reach out in 24 hrs']].forEach(([n, t]) => {
    const s = el('div', { class: 'step' });
    s.appendChild(el('div', { class: 'step-num' }, n));
    s.appendChild(el('p', { class: 'step-text' }, t));
    stepsBar.appendChild(s);
  });
  body.appendChild(stepsBar);

  // Products catalogue
  body.appendChild(buildSection('01–07 · Tools Available', 'The Product Catalogue',
    'Express interest in any product below. I\'ll customise it for your use case and get in touch.'));
  const cards = el('div', { class: 'cards' });
  products.forEach(p => cards.appendChild(buildCard(p)));
  body.appendChild(cards);

  body.appendChild(el('div', { class: 'divider' }));

  // Custom dev
  body.appendChild(buildSection('08 · Custom Development',
    'You imagine it. I\'ll build it and hand it over.',
    'No lock-in. No ongoing dependency. Your idea, built with AI, owned by you.'));
  const devCards = el('div', { class: 'cards' });
  const devCard  = el('div', { class: 'card dev-card fullwidth', id: 'dev' });
  const devTop   = el('div', { class: 'card-top' });
  devTop.appendChild(el('div', { class: 'card-icon', style: 'background:rgba(255,255,255,0.1)' }, '⚙️'));
  devTop.appendChild(el('span', { class: 'badge hot' }, 'Ping Me'));
  devCard.appendChild(devTop);
  devCard.appendChild(el('p', { class: 'card-name' }, 'Custom App Development & Handover'));
  devCard.appendChild(el('p', { class: 'card-desc' },
    'Have a specific problem you want solved? Bring your idea — I\'ll build the app, test it, and hand it over completely. Website, Android APK, automation bot, or AI agent — scoped to your exact need. No coding knowledge required from your side.'));
  devCard.appendChild(el('p', { class: 'card-meta' },
    'Web apps · Android APKs · Automation bots · AI agents · Dashboards · Any domain'));
  const devActions = el('div', { class: 'card-actions' });
  const devCta = el('button', { class: 'btn btn-interest' }, '✉ Let\'s Discuss Your Idea');
  devCta.addEventListener('click', () => openModal('Custom App Development'));
  devActions.appendChild(devCta);
  devCard.appendChild(devActions);
  devCards.appendChild(devCard);
  body.appendChild(devCards);

  body.appendChild(el('div', { class: 'divider' }));

  // Ready4Launch
  body.appendChild(buildSection('09 · The Big One 🔥', 'Ready4Launch — TextToApp',
    'One line of text. A complete, working app. Pre-booking now open for the pilot batch.'));
  const r4lCards = el('div', { class: 'cards' });
  const r4l = el('div', { class: 'card featured fullwidth', id: 'r4l' });
  const r4lTop = el('div', { class: 'card-top' });
  r4lTop.appendChild(el('div', { class: 'card-icon' }, '🚀'));
  r4lTop.appendChild(el('span', { class: 'badge preorder' }, 'Pre-Booking Open'));
  r4l.appendChild(r4lTop);
  r4l.appendChild(el('p', { class: 'card-name', style: 'font-size:1.2rem' }, 'Ready4Launch — TextToApp'));
  r4l.appendChild(el('p', { class: 'card-desc' },
    'Type one line. Get a complete app. This is not a concept — it\'s almost done. It converts any text to a professional Word document. It generates full presentations. And it builds any app from a single prompt — no coding, no team, no waiting.'));
  r4l.appendChild(el('p', { class: 'card-desc', style: 'margin-top:-0.25rem' },
    'For technical users: fill in a few details and your entire stack is ready in minutes.'));

  const price = el('div', { class: 'featured-price' });
  const priceRow = el('div', { class: 'price-row' });
  priceRow.appendChild(el('span', { class: 'price-main' }, '₹499'));
  const pd = el('div', {});
  pd.appendChild(el('p', { class: 'price-label' }, 'Pre-booking price'));
  pd.appendChild(el('p', { class: 'price-old' }, '₹1,999 at launch'));
  priceRow.appendChild(pd);
  price.appendChild(priceRow);
  price.appendChild(el('span', { class: 'price-saving' }, 'You save ₹1,500 — 75% off launch price'));
  r4l.appendChild(price);

  const pilotSteps = el('div', { class: 'pilot-steps' });
  [['5','Day pilot access'],['2','Prompts/feature per day'],['3','Core features to explore'],['~4–5','Days to launch']].forEach(([n, l]) => {
    const s = el('div', { class: 'pilot-step' });
    s.appendChild(el('p', { class: 'ps-num' }, n));
    s.appendChild(el('p', { class: 'ps-label' }, l));
    pilotSteps.appendChild(s);
  });
  r4l.appendChild(pilotSteps);
  r4l.appendChild(el('p', { class: 'card-meta', style: 'margin-bottom:1rem' },
    'Note: API costs are on me during the pilot — which is why slots are limited. This is not pressure, it\'s just transparency. Those who\'ve seen it are already asking when it\'s ready.'));

  const preOrderBtn = el('button', { class: 'btn btn-preorder' }, '🔥 Pre-Book My Pilot Slot — ₹499');
  preOrderBtn.addEventListener('click', () => openModal('Ready4Launch — TextToApp (Pilot Pre-Booking ₹499)'));
  r4l.appendChild(preOrderBtn);
  r4lCards.appendChild(r4l);
  body.appendChild(r4lCards);

  // QR section
  const qrSec = el('div', { class: 'qr-section', id: 'qr-gen' });
  qrSec.appendChild(el('h3', {}, '📲 Generate Your QR Code'));
  qrSec.appendChild(el('p', {}, 'Once you\'ve hosted this page, paste the URL below to generate the QR code for your printout, banner, or visiting card.'));
  const qrRow  = el('div', { class: 'qr-input-row' });
  const qrInp  = el('input', { class: 'qr-input', type: 'url', id: 'qr-url', placeholder: 'https://your-hosted-url.com' });
  const qrBtn  = el('button', { class: 'btn-gen' }, 'Generate QR');
  qrBtn.addEventListener('click', generateQR);
  qrRow.appendChild(qrInp); qrRow.appendChild(qrBtn);
  qrSec.appendChild(qrRow);
  const qrOut  = el('div', { id: 'qr-output' });
  qrOut.appendChild(el('div', { id: 'qr-canvas' }));
  qrOut.appendChild(el('p', {}, 'Scan to open your product catalogue'));
  const dlBtn  = el('button', { class: 'btn-dl' }, '⬇ Download QR Code');
  dlBtn.addEventListener('click', downloadQR);
  qrOut.appendChild(dlBtn);
  qrSec.appendChild(qrOut);
  body.appendChild(qrSec);

  // Footer
  const footer = el('footer', {});
  footer.innerHTML = `
    <strong>AI-Powered Tools</strong> · Built by a non-coder with 22 years in IT<br/>
    TechMahindra · Wipro · IBM · Kyndryl · PwC<br/><br/>
    <span style="font-size:11px;">All products are real, tested, and working. Every one was built solo using AI.</span>
  `;
  body.appendChild(footer);

  // Build modal last (appends to body)
  buildModal();
}

// ── QR logic ──────────────────────────────────────────────────────────────────
function generateQR() {
  const url = document.getElementById('qr-url').value.trim();
  if (!url) { alert('Please enter a URL first.'); return; }
  const container = document.getElementById('qr-canvas');
  container.innerHTML = '';
  new QRCode(container, { text: url, width: 200, height: 200, colorDark: '#0f1117', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
  document.getElementById('qr-output').style.display = 'block';
}

function downloadQR() {
  const canvas = document.querySelector('#qr-canvas canvas');
  if (!canvas) { alert('Generate a QR code first.'); return; }
  const link = document.createElement('a');
  link.download = 'product-catalogue-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── Init ──────────────────────────────────────────────────────────────────────
buildPage();
