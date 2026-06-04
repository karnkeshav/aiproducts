// ═══════════════════════════════════════════════════════════════════════════════
//  AI for EveryOne — app.js
//  One file · All CSS · All content · All logic
//  Workshop registration  +  AI Products catalogue
// ═══════════════════════════════════════════════════════════════════════════════

// ── Config ──────────────────────────────────────────────────────────────────
var CFG       = window.APP_CONFIG || {};
var SHEET_URL = CFG.GOOGLE_SHEET_URL || '';   // workshop → Google Sheets
var GH_TOKEN  = CFG.GITHUB_TOKEN     || '';   // GitHub PAT for CSV backup
var GH_REPO   = CFG.GITHUB_REPO      || 'karnkeshav/aiproducts';
var LEADS_URL = CFG.LEADS_SHEET_URL  || 'YOUR_LEADS_SCRIPT_URL'; // product leads

// ── UPI Config ───────────────────────────────────────────────────────────────
// Set your UPI ID here (or inject via APP_CONFIG.UPI_ID)
var UPI_ID   = CFG.UPI_ID   || '8520977573@ybl';   // PhonePe VPA (set UPI_ID in APP_CONFIG to override)
var UPI_NAME = CFG.UPI_NAME || 'AI for EveryOne';    // ← payee name shown in apps

// ── External resources ───────────────────────────────────────────────────────
(function () {
  var h = document.head;
  function tag(t, a) { var e = document.createElement(t); Object.assign(e, a); h.appendChild(e); }
  tag('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
  tag('link', {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,600&display=swap',
  });
  // QR image is embedded as base64 — no external QR lib needed
})();

// ── CSS ──────────────────────────────────────────────────────────────────────
(function () {
var css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#06060f; --s1:#0d0d1a; --s2:#131325; --s3:#1a1a30;
  --b1:rgba(255,255,255,0.07); --b2:rgba(255,255,255,0.13);
  --text:#f1f5f9; --muted:#94a3b8; --dim:#64748b;
  --blue:#3b82f6; --indigo:#6366f1; --purple:#8b5cf6;
  --teal:#10b981; --orange:#f97316; --amber:#f59e0b; --red:#ef4444;
  --ws-grad:linear-gradient(135deg,#6366f1,#3b82f6);
  --tools-grad:linear-gradient(135deg,#f97316,#f59e0b);
  --r:16px; --r-sm:10px; --r-xl:24px;
}
html{scroll-behavior:smooth;}
body{
  background:var(--bg);color:var(--text);
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  min-height:100vh;overflow-x:hidden;
}
body.no-scroll{overflow:hidden;}
img,svg{display:block;}
button,a{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

/* ── SCROLL PROGRESS ── */
#progress{position:fixed;top:0;left:0;height:2px;width:0%;
  background:var(--ws-grad);z-index:9999;transition:width 0.1s linear;}

/* ── STICKY NAV ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:500;
  padding:12px 16px;display:flex;align-items:center;gap:12px;
  background:rgba(6,6,15,0.8);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--b1);
  transform:translateY(-100%);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1);
  will-change:transform;
}
.nav.visible{transform:translateY(0);}
.nav-brand{font-size:13px;font-weight:800;letter-spacing:-0.3px;flex:1;
  background:var(--ws-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.nav-tabs{display:flex;gap:4px;}
.nav-tab{font-size:12px;font-weight:600;color:var(--muted);background:none;border:none;
  padding:6px 12px;border-radius:20px;cursor:pointer;transition:all 0.15s;}
.nav-tab:hover,.nav-tab.active{background:var(--b2);color:var(--text);}
.nav-cta{font-size:12px;font-weight:700;color:#fff;
  background:var(--ws-grad);border:none;border-radius:20px;
  padding:7px 14px;cursor:pointer;transition:opacity 0.15s;white-space:nowrap;}
.nav-cta:hover{opacity:0.85;}

/* ── HERO ── */
.hero{
  min-height:100svh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;
  padding:80px 24px 72px;position:relative;overflow:hidden;
  background:
    radial-gradient(ellipse 90% 55% at 0% 40%,rgba(99,102,241,.18) 0%,transparent 60%),
    radial-gradient(ellipse 70% 50% at 100% 20%,rgba(139,92,246,.14) 0%,transparent 55%),
    radial-gradient(ellipse 80% 40% at 50% 110%,rgba(249,115,22,.1) 0%,transparent 50%),
    var(--bg);
}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.3);
  color:#a5b4fc;font-size:11px;font-weight:700;letter-spacing:1.5px;
  text-transform:uppercase;padding:6px 16px;border-radius:50px;margin-bottom:28px;
}
.hero-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;
  animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.hero h1{
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(52px,15vw,88px);font-weight:800;line-height:1.02;
  letter-spacing:-2px;margin-bottom:20px;
}
.hero h1 .g1{background:var(--ws-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hero h1 .g2{background:var(--tools-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hero-sub{font-size:16px;color:var(--muted);max-width:340px;line-height:1.7;margin-bottom:32px;}
.hero-stats{
  display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:36px;
}
.hero-stat{
  background:rgba(255,255,255,.04);border:1px solid var(--b2);
  border-radius:50px;padding:7px 14px;font-size:12px;font-weight:600;color:var(--muted);
  white-space:nowrap;
}
.hero-stat b{color:var(--text);}
.hero-stat.hot{background:rgba(249,115,22,.1);border-color:rgba(249,115,22,.3);color:#fb923c;}
.hero-btns{display:flex;flex-direction:column;gap:12px;width:100%;max-width:340px;}
.hero-scroll{
  position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:6px;
  font-size:11px;color:var(--dim);letter-spacing:0.5px;
}
.hero-scroll-arrow{
  width:28px;height:28px;border-radius:50%;border:1px solid var(--b2);
  display:flex;align-items:center;justify-content:center;font-size:13px;
  animation:bounce 2s infinite;
}
@keyframes bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(4px);}}

/* ── SECTION WRAPPER ── */
.section{padding:48px 20px 0;margin:0 auto;width:100%;}
.section-head{margin-bottom:32px;}
.section-eyebrow{
  font-size:10.5px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;
  margin-bottom:8px;
}
.section-eyebrow.ws{color:var(--indigo);}
.section-eyebrow.tools{color:var(--orange);}
.section-title{font-size:28px;font-weight:800;line-height:1.2;margin-bottom:6px;}
.section-sub{font-size:14px;color:var(--muted);line-height:1.6;}

/* ── OFFER PILL ── */
.offer-pill{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.3);
  color:#fb923c;font-size:13px;font-weight:700;
  padding:9px 20px;border-radius:50px;margin-bottom:28px;
}

/* ── PLAN CARDS ── */
.plans{display:grid;grid-template-columns:1fr;gap:14px;padding-bottom:80px;}
.plan{
  background:var(--s1);border:2px solid var(--b1);border-radius:var(--r);
  padding:20px;cursor:pointer;position:relative;overflow:hidden;
  transition:background 0.2s,border-color 0.2s;user-select:none;
}
.plan::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--pc,#6366f1);transform:scaleX(0);transform-origin:left;
  transition:transform 0.3s ease;
}
.plan:hover{background:var(--s2);}
.plan.sel{border-color:var(--pc,#6366f1);background:var(--s2);}
.plan.sel::before{transform:scaleX(1);}
.plan-check{
  position:absolute;top:18px;right:18px;width:22px;height:22px;
  border-radius:50%;background:var(--pc,#6366f1);
  display:none;align-items:center;justify-content:center;
  font-size:11px;font-weight:900;color:#fff;
}
.plan.sel .plan-check{display:flex;}
.combo-badge{
  display:inline-block;background:rgba(251,191,36,.15);
  border:1px solid rgba(251,191,36,.3);color:#fcd34d;
  font-size:10px;font-weight:800;padding:3px 9px;border-radius:4px;
  letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;
}
.plan-track{font-size:10px;font-weight:800;letter-spacing:2px;
  text-transform:uppercase;color:var(--pc,#6366f1);margin-bottom:3px;}
.plan-row{display:flex;align-items:flex-start;justify-content:space-between;
  gap:12px;margin-bottom:14px;}
.plan-name{font-size:17px;font-weight:700;margin-bottom:2px;}
.plan-sub{font-size:12px;color:var(--muted);}
.plan-dur{
  background:rgba(255,255,255,.06);border:1px solid var(--b1);
  color:var(--muted);font-size:11px;font-weight:600;
  padding:4px 11px;border-radius:20px;white-space:nowrap;flex-shrink:0;
}
.plan-pricing{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.plan-orig{font-size:13px;color:var(--dim);text-decoration:line-through;}
.plan-price{font-size:26px;font-weight:900;color:var(--pc,#6366f1);}
.plan-save{
  background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);
  color:#34d399;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;
}
.plan-div{border:none;border-top:1px solid var(--b1);margin:16px 0 14px;}
.plan-feats{list-style:none;display:flex;flex-direction:column;gap:7px;}
.plan-feats li{
  display:flex;align-items:flex-start;gap:8px;
  font-size:13px;color:#cbd5e1;line-height:1.45;
}
.plan-feats li::before{
  content:'✓';color:var(--pc,#6366f1);font-size:11px;
  font-weight:900;flex-shrink:0;margin-top:2px;
}
.plan-btn{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;margin-top:20px;padding:14px;border-radius:50px;
  background:var(--ws-grad);color:#fff;font-family:inherit;
  font-size:15px;font-weight:700;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(99,102,241,.35);
  transition:opacity 0.15s,transform 0.15s;
}
.plan-btn:hover{opacity:.9;transform:translateY(-1px);}
.plan-btn:active{transform:translateY(0);}

/* ── PRODUCT CARDS ── */
.tools-grid{display:grid;grid-template-columns:1fr;gap:14px;padding-bottom:80px;}
.product{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);
  padding:20px 20px 16px;position:relative;overflow:hidden;
  transition:border-color 0.2s;
}
.product:hover{border-color:var(--b2);}
.product-top{display:flex;align-items:flex-start;justify-content:space-between;
  margin-bottom:14px;}
.product-icon{width:42px;height:42px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;}
.p-badge{font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  border-radius:20px;padding:3px 10px;font-weight:700;white-space:nowrap;}
.p-badge.live{background:rgba(16,185,129,.12);color:#34d399;
  border:1px solid rgba(16,185,129,.25);}
.p-badge.custom{background:rgba(251,191,36,.1);color:#fcd34d;
  border:1px solid rgba(251,191,36,.25);}
.p-badge.fire{background:rgba(249,115,22,.12);color:#fb923c;
  border:1px solid rgba(249,115,22,.3);}
.p-badge.ping{background:rgba(99,102,241,.12);color:#a5b4fc;
  border:1px solid rgba(99,102,241,.3);}
.product-num{font-size:11px;color:var(--dim);font-weight:500;margin-bottom:3px;}
.product-name{font-size:16px;font-weight:700;margin-bottom:6px;line-height:1.25;}
.product-desc{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:10px;}
.product-meta{font-size:11.5px;color:var(--dim);margin-bottom:14px;line-height:1.5;}
.product-actions{display:flex;gap:8px;flex-wrap:wrap;}
.btn-interest{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.3);
  color:#fb923c;font-family:inherit;font-size:13px;font-weight:600;
  border-radius:8px;padding:9px 16px;cursor:pointer;
  transition:background 0.15s,border-color 0.15s;
}
.btn-interest:hover{background:rgba(249,115,22,.2);border-color:rgba(249,115,22,.5);}
.btn-visit{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(255,255,255,.05);border:1px solid var(--b2);
  color:var(--muted);font-family:inherit;font-size:13px;font-weight:500;
  border-radius:8px;padding:9px 16px;cursor:pointer;text-decoration:none;
  transition:background 0.15s;
}
.btn-visit:hover{background:rgba(255,255,255,.08);}

/* READY4LAUNCH featured card */
.product.featured{background:linear-gradient(145deg,#0d0d1a,#131325);
  border-color:rgba(99,102,241,.3);}
.product.featured .product-name,.product.featured .product-desc{color:var(--text);}
.r4l-price{text-align:center;padding:16px 0 12px;}
.r4l-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:4px;}
.r4l-amount{font-size:2rem;font-weight:900;color:#fb923c;}
.r4l-label{font-size:12px;color:var(--muted);}
.r4l-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 14px;}
.r4l-cell{background:rgba(255,255,255,.05);border-radius:8px;
  padding:10px 12px;text-align:center;}
.r4l-cell-n{font-size:1.2rem;font-weight:800;color:#fb923c;}
.r4l-cell-l{font-size:11px;color:var(--muted);margin-top:2px;}
.btn-preorder{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:14px;border-radius:50px;
  background:var(--tools-grad);color:#fff;font-family:inherit;
  font-size:15px;font-weight:700;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(249,115,22,.35);
  transition:opacity 0.15s,transform 0.15s;
}
.btn-preorder:hover{opacity:.9;transform:translateY(-1px);}

/* ── SECTION DIVIDER ── */
.section-divider{
  margin:72px auto 0;padding:0 20px;
  display:flex;align-items:center;gap:16px;
  width:100%;
}
.section-divider::before,.section-divider::after{
  content:'';flex:1;height:1px;background:var(--b1);
}
.divider-label{
  font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
  color:var(--dim);white-space:nowrap;
}

/* ── FOOTER ── */
.footer{
  margin:72px auto 0;padding:40px 24px 48px;
  text-align:center;border-top:1px solid var(--b1);
  width:100%;
}
.footer-brand{font-size:18px;font-weight:800;margin-bottom:8px;
  background:var(--ws-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.footer-exp{font-size:12px;color:var(--dim);line-height:1.8;margin-bottom:16px;}
.footer-badges{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:20px;}
.f-badge{background:var(--s1);border:1px solid var(--b1);border-radius:6px;
  padding:4px 10px;font-size:11px;font-weight:600;color:var(--muted);}
.footer-note{font-size:11px;color:var(--dim);line-height:1.7;}
.footer-note strong{color:var(--orange);}

/* ── BACKDROP ── */
.backdrop{
  position:fixed;inset:0;z-index:600;
  background:rgba(0,0,0,.7);backdrop-filter:blur(8px);
  opacity:0;pointer-events:none;
  transition:opacity 0.3s ease;
}
.backdrop.open{opacity:1;pointer-events:all;}

/* ── BOTTOM SHEET (shared) ── */
.sheet{
  position:fixed;bottom:0;left:0;right:0;z-index:700;
  max-width:520px;margin:0 auto;
  background:var(--s1);border-radius:24px 24px 0 0;
  border-top:1px solid var(--b2);
  transform:translateY(100%);
  transition:transform 0.4s cubic-bezier(0.32,0.72,0,1);
  will-change:transform;
  padding-bottom:env(safe-area-inset-bottom,0px);
  display:flex;flex-direction:column;
  max-height:92svh;
}
.sheet.open{transform:translateY(0);}
.sheet-handle{
  width:40px;height:4px;background:var(--b2);border-radius:2px;
  margin:12px auto 0;flex-shrink:0;cursor:grab;
}
.sheet-header{
  display:flex;align-items:center;gap:12px;
  padding:16px 20px 14px;border-bottom:1px solid var(--b1);flex-shrink:0;
}
.sheet-back{
  background:none;border:none;color:var(--muted);font-size:14px;
  font-weight:600;cursor:pointer;padding:4px;display:flex;align-items:center;gap:4px;
  transition:color 0.15s;flex-shrink:0;
}
.sheet-back:hover{color:var(--text);}
.sheet-title{flex:1;font-size:15px;font-weight:700;}
.sheet-steps{display:flex;gap:5px;flex-shrink:0;}
.sheet-step-dot{width:6px;height:6px;border-radius:50%;background:var(--b2);
  transition:background 0.2s;}
.sheet-step-dot.active{background:var(--indigo);}
.sheet-step-dot.done{background:var(--teal);}
.sheet-body{flex:1;overflow-y:auto;padding:20px;
  -webkit-overflow-scrolling:touch;overscroll-behavior:contain;}
.sheet-body::-webkit-scrollbar{display:none;}
.sheet-foot{padding:16px 20px;border-top:1px solid var(--b1);flex-shrink:0;}

/* Plan pill inside sheet */
.sheet-plan-pill{
  display:flex;align-items:center;gap:10px;
  background:var(--s2);border:1px solid var(--b2);border-radius:12px;
  padding:12px 16px;margin-bottom:22px;
}
.spp-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.spp-name{font-size:14px;font-weight:600;flex:1;}
.spp-price{font-size:13px;color:var(--muted);flex-shrink:0;}
.spp-change{font-size:12px;color:var(--blue);cursor:pointer;font-weight:600;
  background:none;border:none;flex-shrink:0;}
.spp-change:hover{text-decoration:underline;}

/* Batch cards inside sheet */
.batch-cards{display:flex;flex-direction:column;gap:12px;margin-bottom:8px;}
.batch-card{
  background:var(--s2);border:2px solid var(--b1);border-radius:var(--r);
  padding:18px;cursor:pointer;display:flex;align-items:flex-start;gap:14px;
  transition:border-color 0.2s,background 0.2s;
}
.batch-card:hover{background:var(--s3);}
.batch-card.sel{border-color:var(--blue);background:rgba(59,130,246,.06);}
.batch-icon{width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,.05);
  display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.batch-card.sel .batch-icon{background:rgba(59,130,246,.15);}
.batch-info{flex:1;}
.batch-name{font-size:15px;font-weight:700;margin-bottom:3px;}
.batch-days{font-size:13px;font-weight:600;color:var(--blue);}
.batch-time{font-size:12px;color:var(--muted);margin-top:2px;}
.batch-desc{font-size:12px;color:var(--dim);margin-top:6px;line-height:1.4;}
.batch-chk{
  width:22px;height:22px;border-radius:50%;background:var(--blue);
  display:none;align-items:center;justify-content:center;
  font-size:11px;font-weight:900;color:#fff;flex-shrink:0;
}
.batch-card.sel .batch-chk{display:flex;}

/* Form inside sheet */
.form-row{margin-bottom:16px;}
.f-label{display:block;font-size:12px;font-weight:600;color:var(--muted);
  letter-spacing:.3px;margin-bottom:6px;}
.f-label span{color:var(--red);}
.f-input,.f-textarea{
  width:100%;background:rgba(255,255,255,.04);
  border:1.5px solid var(--b1);color:var(--text);
  padding:13px 15px;border-radius:var(--r-sm);
  font-family:inherit;font-size:16px;outline:none;
  -webkit-appearance:none;transition:border-color 0.2s,background 0.2s;
}
.f-input:focus,.f-textarea:focus{
  border-color:var(--blue);background:rgba(59,130,246,.05);}
.f-input::placeholder,.f-textarea::placeholder{color:rgba(255,255,255,.18);}
.f-input.err,.f-textarea.err{border-color:var(--red);}
.f-hint{font-size:11px;color:var(--dim);margin-top:4px;}
.f-error{font-size:11px;color:#fca5a5;margin-top:4px;display:none;}
.f-input.err~.f-error,.f-textarea.err~.f-error{display:block;}
.f-textarea{resize:vertical;min-height:80px;}

/* ── UPI PAYMENT STEP ── */
.upi-wrap{display:flex;flex-direction:column;align-items:center;gap:0;}

.upi-amount-card{
  width:100%;background:linear-gradient(135deg,#0c1220,#0f1530);
  border:1.5px solid rgba(59,130,246,.2);border-radius:var(--r);
  padding:20px;text-align:center;margin-bottom:20px;
}
.upi-amount-label{font-size:11px;font-weight:700;letter-spacing:2px;
  text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
.upi-amount-val{font-size:48px;font-weight:900;color:var(--blue);letter-spacing:-2px;line-height:1;}
.upi-amount-plan{font-size:12px;color:var(--muted);margin-top:8px;line-height:1.5;}

.upi-qr-box{
  background:white;border-radius:16px;padding:14px;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 32px rgba(0,0,0,.5);
  margin-bottom:18px;width:196px;height:196px;flex-shrink:0;
  position:relative;
}
.upi-qr-box canvas,.upi-qr-box img{border-radius:4px;}
.upi-qr-loading{position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:6px;border-radius:16px;
  background:rgba(255,255,255,0.95);}
.upi-qr-loading-dot{width:8px;height:8px;border-radius:50%;background:#6366f1;
  animation:upi-blink 1.2s infinite;}
@keyframes upi-blink{0%,80%,100%{transform:scale(1);opacity:0.3;}40%{transform:scale(1.3);opacity:1;}}

.upi-id-row{
  display:flex;align-items:center;gap:8px;
  background:var(--s2);border:1px solid var(--b2);border-radius:10px;
  padding:10px 14px;margin-bottom:18px;width:100%;
}
.upi-id-label{font-size:11px;color:var(--dim);white-space:nowrap;}
.upi-id-val{font-size:13px;font-weight:700;color:var(--text);flex:1;
  font-family:monospace;word-break:break-all;}
.upi-copy-btn{
  background:rgba(255,255,255,.06);border:1px solid var(--b2);
  color:var(--muted);font-family:inherit;font-size:11px;font-weight:600;
  border-radius:6px;padding:5px 10px;cursor:pointer;flex-shrink:0;
  transition:background 0.15s,color 0.15s;white-space:nowrap;
}
.upi-copy-btn:hover{background:rgba(255,255,255,.12);color:var(--text);}
.upi-copy-btn.copied{background:rgba(16,185,129,.15);color:#34d399;
  border-color:rgba(16,185,129,.3);}

.upi-steps{
  width:100%;background:var(--s2);border:1px solid var(--b1);
  border-radius:12px;padding:14px 16px;margin-bottom:18px;
}
.upi-steps-title{font-size:11px;font-weight:700;letter-spacing:1px;
  text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
.upi-step-row{display:flex;align-items:flex-start;gap:10px;
  font-size:13px;color:#cbd5e1;line-height:1.45;margin-bottom:8px;}
.upi-step-row:last-child{margin-bottom:0;}
.upi-step-num{width:20px;height:20px;border-radius:50%;background:rgba(99,102,241,.2);
  color:#a5b4fc;font-size:10px;font-weight:800;display:flex;align-items:center;
  justify-content:center;flex-shrink:0;margin-top:1px;}

.upi-apps{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px;}
.upi-app-tag{background:rgba(255,255,255,.06);border:1px solid var(--b1);
  border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:var(--text);}

.upi-note{font-size:11px;color:var(--dim);text-align:center;line-height:1.6;
  margin-bottom:4px;}

/* paid confirmation input */
.upi-txn-row{width:100%;margin-top:4px;}
.upi-txn-input{
  width:100%;background:rgba(255,255,255,.04);
  border:1.5px solid var(--b1);color:var(--text);
  padding:13px 15px;border-radius:var(--r-sm);
  font-family:monospace;font-size:15px;outline:none;
  transition:border-color 0.2s;
}
.upi-txn-input:focus{border-color:var(--teal);background:rgba(16,185,129,.05);}
.upi-txn-input::placeholder{color:rgba(255,255,255,.18);font-family:'Inter',sans-serif;}
.upi-txn-hint{font-size:11px;color:var(--dim);margin-top:5px;line-height:1.5;}

/* Thank you step */
.ty-wrap{text-align:center;padding:12px 0 20px;}
.ty-icon{
  width:72px;height:72px;border-radius:50%;margin:0 auto 24px;
  background:linear-gradient(135deg,#10b981,#059669);
  display:flex;align-items:center;justify-content:center;font-size:32px;
  box-shadow:0 8px 32px rgba(16,185,129,.45);
  animation:pop .5s cubic-bezier(.175,.885,.32,1.275) both;
}
@keyframes pop{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}
.ty-title{font-size:28px;font-weight:900;margin-bottom:10px;}
.ty-sub{font-size:14px;color:var(--muted);max-width:280px;margin:0 auto 24px;line-height:1.7;}
.summary{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);
  overflow:hidden;margin-bottom:20px;text-align:left;}
.s-row{display:flex;justify-content:space-between;align-items:center;
  padding:12px 16px;border-bottom:1px solid var(--b1);font-size:13px;gap:12px;}
.s-row:last-child{border-bottom:none;}
.s-key{color:var(--muted);flex-shrink:0;}
.s-val{font-weight:600;text-align:right;word-break:break-all;}
.s-pill{background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);
  color:#34d399;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;}

/* Lead capture sheet */
.lead-success{display:none;text-align:center;padding:24px 0;}
.lead-success .ls-icon{width:56px;height:56px;border-radius:50%;
  background:rgba(16,185,129,.15);color:#34d399;font-size:24px;
  display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}
.lead-success h3{font-size:20px;font-weight:700;margin-bottom:6px;}
.lead-success p{font-size:13px;color:var(--muted);line-height:1.6;}
.btn-close-lead{
  margin-top:18px;background:var(--s2);border:1px solid var(--b1);
  color:var(--muted);font-family:inherit;font-size:13px;font-weight:600;
  border-radius:9px;padding:10px 24px;cursor:pointer;transition:background 0.15s;
}
.btn-close-lead:hover{background:var(--s3);}

/* ── BUTTONS (shared) ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  border:none;font-family:inherit;cursor:pointer;
  transition:opacity .15s,transform .15s;touch-action:manipulation;
}
.btn:active{transform:translateY(1px);}
.btn-primary{
  width:100%;padding:15px;border-radius:50px;
  background:var(--ws-grad);color:#fff;font-size:15px;font-weight:700;
  box-shadow:0 4px 20px rgba(99,102,241,.35);
}
.btn-primary:hover{opacity:.9;}
.btn-primary:disabled{opacity:.55;pointer-events:none;}
.btn-success-color{background:linear-gradient(135deg,#10b981,#059669);
  box-shadow:0 4px 20px rgba(16,185,129,.35);}
.btn-teal{background:linear-gradient(135deg,#10b981,#059669) !important;
  box-shadow:0 4px 20px rgba(16,185,129,.35) !important;}
.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.err-box{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);
  color:#fca5a5;padding:12px 14px;border-radius:10px;font-size:13px;
  margin-bottom:14px;display:none;}

/* ── ANIMATIONS ── */
.fade-in{opacity:0;transform:translateY(20px);
  transition:opacity .6s ease,transform .6s ease;}
.fade-in.visible{opacity:1;transform:translateY(0);}

/* ── RESPONSIVE ── */

/* 2-col product cards */
@media(min-width:520px){
  .tools-grid{grid-template-columns:1fr 1fr;gap:14px;}
  .product.featured{grid-column:1/-1;}
  .hero h1{font-size:clamp(58px,14vw,88px);}
}

/* Tablet: 2-col plans, wider sections */
@media(min-width:768px){
  .plans{grid-template-columns:1fr 1fr;gap:16px;}
  .section{padding:56px 32px 0;max-width:960px;}
  .section-head{max-width:600px;}
  .section-divider{padding:0 32px;max-width:960px;}
  .footer{padding:48px 32px 56px;max-width:960px;}
  .nav{padding:12px 32px;}
  .hero-sub{max-width:460px;}
  .hero-btns{flex-direction:row;max-width:480px;}
  .hero-btns .btn{flex:1;}
}

/* Desktop */
@media(min-width:1024px){
  .tools-grid{grid-template-columns:1fr 1fr 1fr;}
  .product.featured{grid-column:1/-1;}
  .section{padding:72px 56px 0;max-width:1200px;}
  .section-head{max-width:680px;}
  .section-divider{padding:0 56px;max-width:1200px;}
  .footer{padding:56px 56px 72px;max-width:1200px;}
  .hero{padding:130px 80px 110px;}
  .hero-sub{max-width:520px;font-size:18px;}
  .hero-btns{max-width:520px;gap:14px;}
  .nav{padding:14px 56px;}
  .sheet{left:50%;right:auto;transform:translateX(-50%) translateY(100%);width:100%;max-width:520px;}
  .sheet.open{transform:translateX(-50%) translateY(0);}
}

/* Wide desktop */
@media(min-width:1400px){
  .section{padding:88px 80px 0;max-width:1400px;}
  .section-divider{padding:0 80px;max-width:1400px;}
  .footer{padding:64px 80px;max-width:1400px;}
  .nav{padding:16px 80px;}
  .tools-grid{grid-template-columns:repeat(4,1fr);}
}
`;
  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

// ── DATA ──────────────────────────────────────────────────────────────────────

var PLANS = [
  {
    id:'track-a', track:'TRACK A', name:'AI Productivity Essentials',
    sub:'Use AI Effectively', dur:'5 Days',
    orig:1999, price:999, save:'50% Inaugural Offer', color:'#8b5cf6',
    feats:[
      'Understanding AI in simple language',
      'Prompt & Content Engineering',
      'Workflows for daily life & work',
      'ChatGPT, Gemini, Claude, Grok — when to use what',
      'Free vs Paid AI Tools — what actually matters',
      'AI Hygiene, Privacy & Guardrails',
      'NotebookLM & AI knowledge tools',
      'AI Agents vs Agentic AI — the real difference',
      'Real-life use cases: students, professionals & businesses',
    ],
  },
  {
    id:'track-b', track:'TRACK B', name:'AI App Builder',
    sub:'Build with AI', dur:'10 Days',
    orig:4999, price:2499, save:'50% Inaugural Offer', color:'#10b981',
    feats:[
      'Introduction to Vibe Coding',
      'Building apps without traditional coding',
      'GitHub, Vercel, Supabase & Firebase',
      'Frontend + Backend development using AI',
      'GitHub Actions & workflow automation',
      'AI-powered web & mobile app development',
      'Serverless deployment made simple',
      'Real project: idea → deployment',
      'Connecting AI models, APIs & databases',
      'Launching SaaS products & AI tools quickly',
    ],
  },
  {
    id:'track-c', track:'TRACK C', name:'Advanced AI Workflows',
    sub:'Control and Scale AI', dur:'5 Days',
    orig:2999, price:1499, save:'50% Inaugural Offer', color:'#f59e0b',
    feats:[
      'API integrations, keys & unlimited workflows',
      'Advanced automation systems using AI',
      'Coding AI Agents (Copilot, Devin, Claude…)',
      'Privacy-first & secure AI workflows',
      'Creating personal GPTs & private AI assistants',
      'Creating bots & automation pipelines',
      'Cloud AI on Azure, AWS & Google Cloud',
      'Open-source AI models (Ollama, Mistral, DeepSeek)',
      'Local AI setup & self-hosted systems',
    ],
  },
  {
    id:'combo', track:'ALL 3 TRACKS', name:'Combo — Get All 3',
    sub:'Unlock everything. Build anything.', dur:'24+ Days',
    orig:9999, price:4499, save:'55% Inaugural Offer', color:'#6366f1', isCombo:true,
    feats:[
      'All 3 Tracks — complete access',
      '24+ days of structured learning',
      'Real projects — hands-on every day',
    ],
  },
];

var BATCHES = [
  { id:'weekday', name:'Weekday Batch', days:'Monday – Friday',
    time:'8:00 PM – 10:00 PM IST', icon:'💼',
    desc:'Ideal for working professionals & students with weekends free' },
  { id:'weekend', name:'Weekend Batch', days:'Saturday & Sunday',
    time:'10:00 AM – 1:00 PM IST', icon:'🌅',
    desc:'Ideal for those who prefer a relaxed, deep-dive weekend pace' },
];

var PRODUCTS = [
  {
    id:'resume', num:'01', icon:'📄', iconBg:'rgba(139,92,246,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'Resume Builder',
    desc:'Turned a 45-minute job application into a 5-minute task. Reads a JD, tailors the resume to match, formats it — done. This got me a role at PwC.',
    meta:'Built to your profile · Any industry · Any role level',
  },
  {
    id:'ready4exam', num:'02', icon:'📚', iconBg:'rgba(16,185,129,.12)',
    badge:'live', badgeLabel:'Live · Self Serve',
    name:'Ready4Exam Portal',
    desc:'A full exam-readiness platform for students. Free modules available. Paid tiers with deeper features. No customisation needed — just use it.',
    meta:'✓ Free modules · ✓ Paid tiers · Schools: let\'s discuss deployment',
    visitBtn: { label:'🌐 Visit Portal', href:'https://ready4exam.in' },
    interestLabel:'🏫 Schools — Enquire',
    schoolMode: true,
  },
  {
    id:'telugu', num:'03', icon:'🗣️', iconBg:'rgba(99,102,241,.12)',
    badge:'custom', badgeLabel:'Any Language',
    name:'TeluguBuddy',
    desc:'Built for my daughter\'s school Telugu. Chapter-by-chapter, every word with pronunciation, meaning, and audio. She now enjoys it.',
    meta:'Tamil · Kannada · Marathi · Hindi · French — any language',
  },
  {
    id:'seo', num:'04', icon:'📈', iconBg:'rgba(245,158,11,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'SEO Optimisation Tool',
    desc:'Grew a YouTube channel to 400 subscribers in one month with AI-driven descriptions, tags, and keywords most creators never discover.',
    meta:'YouTube · Website · Blog · Product listings · Any platform',
  },
  {
    id:'patent', num:'05', icon:'📋', iconBg:'rgba(59,130,246,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'Patent Assistant',
    desc:'Filed my own provisional patent — solo, no IP lawyer — using AI for research, prior art search, and documentation drafting.',
    meta:'Provisional patent drafting · Prior art · India & international',
  },
  {
    id:'wa-mktg', num:'06', icon:'💬', iconBg:'rgba(16,185,129,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'WhatsApp Marketing App',
    desc:'Automated, personalised campaign tool. Crafts messages, schedules them, reaches your audience where they already are — WhatsApp.',
    meta:'Bulk messaging · Personalisation · Campaign scheduling',
  },
  {
    id:'sector', num:'07', icon:'🎯', iconBg:'rgba(249,115,22,.12)',
    badge:'custom', badgeLabel:'Any Sector',
    name:'Sector-Specific Marketing',
    desc:'Built a college outreach app that finds every chairman, principal, and dean\'s email and sends tailored proposals — fully automated.',
    meta:'Built for: College / University outreach · Adapts to any industry',
  },
  {
    id:'dev', num:'08', icon:'⚙️', iconBg:'rgba(139,92,246,.12)',
    badge:'ping', badgeLabel:'Ping Me',
    name:'Custom App Development',
    desc:'Bring your idea — I\'ll build the app, test it, and hand it over completely. Website, Android APK, bot, or AI agent. No coding needed from you.',
    meta:'Web apps · Android APKs · Automation bots · AI agents · Dashboards',
    interestLabel:'✉ Let\'s Discuss Your Idea',
  },
  {
    id:'r4l', num:'09', icon:'🚀', iconBg:'rgba(249,115,22,.12)',
    badge:'fire', badgeLabel:'Queue Open — 5 Slots',
    name:'Ready4Launch — TextToApp',
    featured: true,
  },
];

// ── State ─────────────────────────────────────────────────────────────────────
var ST = { plan:null, batch:null, reg:{}, txnId:'', regStep:1 };
var leadProductId = '';

// ── DOM helper ────────────────────────────────────────────────────────────────
function el(tag, props, children) {
  var node = document.createElement(tag);
  if (props) Object.keys(props).forEach(function(k) {
    if (k === 'class') node.className = props[k];
    else if (k === 'html') node.innerHTML = props[k];
    else if (k === 'style') node.style.cssText = props[k];
    else if (k === 'on') Object.keys(props[k]).forEach(function(ev) {
      node.addEventListener(ev, props[k][ev]);
    });
    else node.setAttribute(k, props[k]);
  });
  if (typeof children === 'string') node.textContent = children;
  else if (Array.isArray(children)) children.forEach(function(c) { if (c) node.appendChild(c); });
  else if (children) node.appendChild(children);
  return node;
}

function txt(str) { return document.createTextNode(str); }

// ── PAGE BUILDER ──────────────────────────────────────────────────────────────

function buildPage() {
  var b = document.body;
  b.appendChild(buildProgress());
  b.appendChild(buildNav());
  b.appendChild(buildHero());
  b.appendChild(buildWorkshopSection());
  b.appendChild(buildDivider('WHAT I\'VE BUILT WITH AI'));
  b.appendChild(buildToolsSection());
  b.appendChild(buildFooter());
  buildRegSheet();
  buildLeadSheet();
  b.appendChild(el('div', { id:'backdrop', class:'backdrop' }));
  document.getElementById('backdrop').addEventListener('click', closeAllSheets);
  initScrollBehavior();
}

function buildProgress() {
  return el('div', { id:'progress' });
}

function buildNav() {
  var nav = el('div', { id:'top-nav', class:'nav' });
  nav.appendChild(el('div', { class:'nav-brand' }, 'AI for EveryOne'));
  var tabs = el('div', { class:'nav-tabs' });
  var t1 = el('button', { class:'nav-tab active', 'data-tab':'workshop' }, 'Workshop');
  var t2 = el('button', { class:'nav-tab', 'data-tab':'tools' }, 'Tools');
  t1.addEventListener('click', function() { scrollToSection('workshop'); });
  t2.addEventListener('click', function() { scrollToSection('tools'); });
  tabs.appendChild(t1); tabs.appendChild(t2);
  nav.appendChild(tabs);
  var cta = el('button', { class:'nav-cta' }, 'Reserve →');
  cta.addEventListener('click', function() { scrollToSection('workshop'); });
  nav.appendChild(cta);
  return nav;
}

function buildHero() {
  var hero = el('div', { class:'hero' });

  var eyebrow = el('div', { class:'hero-eyebrow' });
  eyebrow.appendChild(el('span', { class:'hero-dot' }));
  eyebrow.appendChild(txt('Live AI Workshop + AI Tools'));
  hero.appendChild(eyebrow);

  var h1 = el('h1', {});
  h1.innerHTML = '<span class="g1">AI</span> for<br><span class="g2">EveryOne</span>';
  hero.appendChild(h1);

  hero.appendChild(el('p', { class:'hero-sub' },
    'Learn it live. Use it daily. Build with it — starting today.'));

  var stats = el('div', { class:'hero-stats' });
  [
    { txt: '<b>4</b> AI Tracks' },
    { txt: '<b>9</b> AI Tools Built', cls: '' },
    { txt: '🎯 <b>Inaugural Offer</b>', cls: 'hot' },
  ].forEach(function(s) {
    var stat = el('div', { class:'hero-stat' + (s.cls ? ' '+s.cls : '') });
    stat.innerHTML = s.txt;
    stats.appendChild(stat);
  });
  hero.appendChild(stats);

  var btns = el('div', { class:'hero-btns' });
  var b1 = el('button', { class:'btn btn-primary' }, 'Reserve My Seat →');
  b1.addEventListener('click', function() { scrollToSection('workshop'); });
  var b2 = el('button', {
    class:'btn',
    style:'width:100%;padding:14px;border-radius:50px;background:transparent;border:1.5px solid rgba(249,115,22,.45);color:#fb923c;font-size:14px;font-weight:600;'
  }, 'Explore AI Tools →');
  b2.addEventListener('click', function() { scrollToSection('tools'); });
  btns.appendChild(b1); btns.appendChild(b2);
  hero.appendChild(btns);

  var scroll = el('div', { class:'hero-scroll' });
  scroll.appendChild(el('div', { class:'hero-scroll-arrow' }, '↓'));
  hero.appendChild(scroll);

  return hero;
}

// ── Workshop section ──────────────────────────────────────────────────────────
function buildWorkshopSection() {
  var wrap = el('div', { id:'workshop', class:'section fade-in' });

  var head = el('div', { class:'section-head' });
  head.appendChild(el('div', { class:'section-eyebrow ws' }, '🎓 Live · Online · Cohort-Based'));
  head.appendChild(el('div', { class:'section-title' }, 'The AI Workshop'));
  head.appendChild(el('div', { class:'section-sub' },
    'Pick your track. Learn live with a small cohort. Build real things.'));
  wrap.appendChild(head);

  var pill = el('div', { class:'offer-pill' });
  pill.innerHTML = '🎯&nbsp; Inaugural Offer — 50% off all tracks for this batch';
  wrap.appendChild(pill);

  var plans = el('div', { class:'plans', id:'plans-list' });
  PLANS.forEach(function(p) { plans.appendChild(buildPlanCard(p)); });
  wrap.appendChild(plans);

  return wrap;
}

function buildPlanCard(p) {
  var card = el('div', {
    class:'plan',
    style:'--pc:' + p.color,
    id:'plan-' + p.id,
  });

  var chk = el('div', { class:'plan-check' }, '✓');
  card.appendChild(chk);

  if (p.isCombo) card.appendChild(el('div', { class:'combo-badge' }, '★ Best Value'));
  card.appendChild(el('div', { class:'plan-track' }, p.track));

  var row = el('div', { class:'plan-row' });
  var info = el('div', {});
  info.appendChild(el('div', { class:'plan-name' }, p.name));
  info.appendChild(el('div', { class:'plan-sub' }, p.sub));
  row.appendChild(info);
  row.appendChild(el('div', { class:'plan-dur' }, p.dur));
  card.appendChild(row);

  var pricing = el('div', { class:'plan-pricing' });
  pricing.appendChild(el('span', { class:'plan-orig' }, '₹' + p.orig.toLocaleString('en-IN')));
  pricing.appendChild(el('span', { class:'plan-price' }, '₹' + p.price.toLocaleString('en-IN')));
  pricing.appendChild(el('span', { class:'plan-save' }, p.save));
  card.appendChild(pricing);

  card.appendChild(el('hr', { class:'plan-div' }));

  var ul = el('ul', { class:'plan-feats' });
  p.feats.forEach(function(f) { ul.appendChild(el('li', {}, f)); });
  card.appendChild(ul);

  var btn = el('button', { class:'btn plan-btn' }, 'Reserve My Seat →');
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    openRegSheet(p);
  });
  card.appendChild(btn);

  card.addEventListener('click', function() {
    document.querySelectorAll('.plan').forEach(function(c) { c.classList.remove('sel'); });
    card.classList.add('sel');
  });

  return card;
}

// ── Tools section ─────────────────────────────────────────────────────────────
function buildToolsSection() {
  var wrap = el('div', { id:'tools', class:'section fade-in' });

  var head = el('div', { class:'section-head' });
  head.appendChild(el('div', { class:'section-eyebrow tools' }, '🛠 Built From 22 Years of IT Experience'));
  head.appendChild(el('div', { class:'section-title' }, 'AI Tools That Work'));
  head.appendChild(el('div', { class:'section-sub' },
    'Every product below was built solo using AI to solve a real problem. Express interest — I\'ll customise it for you.'));
  wrap.appendChild(head);

  var grid = el('div', { class:'tools-grid' });
  PRODUCTS.forEach(function(p) { grid.appendChild(buildProductCard(p)); });
  wrap.appendChild(grid);

  return wrap;
}

function buildProductCard(p) {
  if (p.featured) return buildR4LCard();

  var card = el('div', { class:'product', id:p.id });

  var top = el('div', { class:'product-top' });
  top.appendChild(el('div', { class:'product-icon', style:'background:'+p.iconBg }, p.icon));
  top.appendChild(el('span', { class:'p-badge '+p.badge }, p.badgeLabel));
  card.appendChild(top);

  card.appendChild(el('div', { class:'product-num' }, 'Product ' + p.num));
  card.appendChild(el('div', { class:'product-name' }, p.name));
  card.appendChild(el('div', { class:'product-desc' }, p.desc));
  card.appendChild(el('div', { class:'product-meta' }, p.meta));

  var actions = el('div', { class:'product-actions' });
  if (p.visitBtn) {
    actions.appendChild(el('a', { class:'btn-visit', href:p.visitBtn.href, target:'_blank' },
      p.visitBtn.label));
  }
  var label = p.interestLabel || '✉ I\'m Interested';
  var productLabel = p.schoolMode ? p.name + ' (School Deployment)' : p.name;
  var productId = p.schoolMode ? p.id + '-school' : p.id;
  var btn = el('button', { class:'btn-interest' }, label);
  btn.addEventListener('click', function() { openLeadSheet(productLabel, productId); });
  actions.appendChild(btn);
  card.appendChild(actions);

  return card;
}

function buildR4LCard() {
  var card = el('div', { class:'product featured', id:'r4l' });

  var top = el('div', { class:'product-top' });
  top.appendChild(el('div', { class:'product-icon', style:'background:rgba(249,115,22,.12)' }, '🚀'));
  top.appendChild(el('span', { class:'p-badge fire' }, 'Queue Open — 5 Slots'));
  card.appendChild(top);

  card.appendChild(el('div', { class:'product-num' }, 'Product 09'));
  card.appendChild(el('div', { class:'product-name' }, 'Ready4Launch — TextToApp'));

  card.appendChild(el('div', { class:'product-desc' },
    'TextToApp is built and working. Type one line — get a complete, usable output. Word documents, full presentations, working web apps — from a single prompt. No coding. No team. No guesswork.'));

  card.appendChild(el('div', { class:'product-desc', style:'margin-top:-4px' },
    'Access runs as a rolling queue. Five people use it at a time, five days each. When your five days are up, the next person in line gets their turn. Pay ₹499 now to hold your place. Once it\'s your turn, you get full hands-on access — no restrictions.'));

  var grid = el('div', { class:'r4l-grid' });
  [
    ['5',    'Active at a time'],
    ['5 days','Per person'],
    ['₹499',  'To join the queue'],
    ['Your turn', 'Guaranteed'],
  ].forEach(function(s) {
    var c = el('div', { class:'r4l-cell' });
    c.appendChild(el('div', { class:'r4l-cell-n', style:'font-size:1rem' }, s[0]));
    c.appendChild(el('div', { class:'r4l-cell-l' }, s[1]));
    grid.appendChild(c);
  });
  card.appendChild(grid);

  card.appendChild(el('div', { class:'product-meta', style:'margin-bottom:16px;color:rgba(255,255,255,.4)' },
    'API costs are covered. Your slot is yours until your five days are done.'));

  var btn = el('button', { class:'btn-preorder' }, 'Secure My Slot — ₹499');
  btn.addEventListener('click', function() {
    openLeadSheet('Ready4Launch — TextToApp (Queue Slot ₹499)', 'r4l');
  });
  card.appendChild(btn);

  return card;
}

function buildDivider(label) {
  var d = el('div', { class:'section-divider' });
  d.appendChild(el('span', { class:'divider-label' }, label));
  return d;
}

function buildFooter() {
  var f = el('div', { class:'footer' });
  f.appendChild(el('div', { class:'footer-brand' }, 'AI for EveryOne'));
  f.appendChild(el('div', { class:'footer-exp' },
    'Built by a non-coder with 22 years in IT\nTechMahindra · Wipro · IBM · Kyndryl · PwC'));
  var badges = el('div', { class:'footer-badges' });
  ['Workshop','AI Tools','Zero Code','Built with AI','100% Real'].forEach(function(b) {
    badges.appendChild(el('span', { class:'f-badge' }, b));
  });
  f.appendChild(badges);
  var note = el('div', { class:'footer-note' });
  note.innerHTML = 'All products are real, tested, and working. Every one was built solo using AI.<br>'
    + 'Questions? WhatsApp: <a href="https://wa.me/917680973409" target="_blank" style="color:var(--orange);text-decoration:none">+91 76809 73409</a>';
  f.appendChild(note);
  return f;
}

// ── REGISTRATION BOTTOM SHEET ─────────────────────────────────────────────────

var regSheet;

function buildRegSheet() {
  regSheet = el('div', { id:'reg-sheet', class:'sheet' });

  regSheet.appendChild(el('div', { class:'sheet-handle', id:'reg-handle' }));

  var hdr = el('div', { class:'sheet-header' });
  var back = el('button', { class:'sheet-back', id:'reg-back' });
  back.innerHTML = '← Back';
  back.addEventListener('click', regBack);
  hdr.appendChild(back);
  hdr.appendChild(el('div', { class:'sheet-title', id:'reg-title' }, 'Choose Your Batch'));
  var dots = el('div', { class:'sheet-steps', id:'reg-dots' });
  for (var i = 0; i < 3; i++) {
    dots.appendChild(el('div', { class:'sheet-step-dot' + (i===0?' active':'') }));
  }
  hdr.appendChild(dots);
  regSheet.appendChild(hdr);

  regSheet.appendChild(el('div', { id:'reg-body', class:'sheet-body' }));
  regSheet.appendChild(el('div', { id:'reg-foot', class:'sheet-foot' }));

  document.body.appendChild(regSheet);
  initDragDismiss(regSheet, closeRegSheet);
}

function openRegSheet(plan) {
  ST.plan = plan;
  ST.batch = null;
  ST.reg = {};
  ST.txnId = '';
  ST.regStep = 1;
  renderRegStep();
  open_(regSheet);
}

function closeRegSheet() { close_(regSheet); }

function regBack() {
  if (ST.regStep <= 1) { closeRegSheet(); return; }
  ST.regStep--;
  renderRegStep();
}

function renderRegStep() {
  updateRegDots();
  if (ST.regStep === 1) renderRegStep1();
  else if (ST.regStep === 2) renderRegStep2();
  else if (ST.regStep === 3) renderRegStep3();
  else if (ST.regStep === 4) renderRegStep4();
  document.getElementById('reg-body').scrollTop = 0;
}

function updateRegDots() {
  var dots = document.querySelectorAll('#reg-dots .sheet-step-dot');
  dots.forEach(function(d, i) {
    d.classList.remove('active','done');
    if (i+1 < ST.regStep) d.classList.add('done');
    else if (i+1 === ST.regStep) d.classList.add('active');
  });
  var titles = ['Choose Your Batch','Your Details','Pay via UPI',''];
  document.getElementById('reg-title').textContent = titles[ST.regStep-1] || '';
  document.getElementById('reg-back').style.visibility = ST.regStep >= 4 ? 'hidden' : 'visible';
}

function planPillHtml(plan) {
  return '<div class="sheet-plan-pill">' +
    '<div class="spp-dot" style="background:'+plan.color+'"></div>' +
    '<div class="spp-name">' + plan.name + '</div>' +
    '<div class="spp-price">₹' + plan.price.toLocaleString('en-IN') + '</div>' +
    '<button class="spp-change" onclick="closeRegSheet()">Change</button>' +
  '</div>';
}

// Step 1: Batch
function renderRegStep1() {
  var body = document.getElementById('reg-body');
  var foot = document.getElementById('reg-foot');
  body.innerHTML = planPillHtml(ST.plan);

  var cards = el('div', { class:'batch-cards' });
  BATCHES.forEach(function(b) {
    var card = el('div', { class:'batch-card' + (ST.batch && ST.batch.id===b.id?' sel':'') });
    var icon = el('div', { class:'batch-icon' }, b.icon);
    var info = el('div', { class:'batch-info' });
    info.appendChild(el('div', { class:'batch-name' }, b.name));
    info.appendChild(el('div', { class:'batch-days' }, b.days));
    info.appendChild(el('div', { class:'batch-time' }, b.time));
    info.appendChild(el('div', { class:'batch-desc' }, b.desc));
    var chk = el('div', { class:'batch-chk' }, '✓');
    card.appendChild(icon); card.appendChild(info); card.appendChild(chk);
    card.addEventListener('click', function() {
      document.querySelectorAll('#reg-body .batch-card').forEach(function(c) { c.classList.remove('sel'); });
      card.classList.add('sel');
      ST.batch = b;
      document.getElementById('batch-err').style.display = 'none';
    });
    cards.appendChild(card);
  });
  body.appendChild(cards);
  body.appendChild(el('div', { id:'batch-err', class:'err-box' }, 'Please select a batch to continue.'));

  foot.innerHTML = '';
  var btn = el('button', { class:'btn btn-primary' }, 'Continue →');
  btn.addEventListener('click', function() {
    if (!ST.batch) { document.getElementById('batch-err').style.display='block'; return; }
    ST.regStep = 2;
    renderRegStep();
  });
  foot.appendChild(btn);
}

// Step 2: Registration form
function renderRegStep2() {
  var body = document.getElementById('reg-body');
  var foot = document.getElementById('reg-foot');

  body.innerHTML = planPillHtml(ST.plan) +
    '<div class="form-row"><label class="f-label" for="r-name">Full Name <span>*</span></label>' +
    '<input class="f-input" type="text" id="r-name" placeholder="Your full name" autocomplete="name" value="' + (ST.reg.name||'') + '"></div>' +
    '<div class="form-row"><label class="f-label" for="r-email">Email Address <span>*</span></label>' +
    '<input class="f-input" type="email" id="r-email" placeholder="you@email.com" autocomplete="email" value="' + (ST.reg.email||'') + '"></div>' +
    '<div class="form-row"><label class="f-label" for="r-phone">WhatsApp / Phone <span>*</span></label>' +
    '<input class="f-input" type="tel" id="r-phone" placeholder="+91 98765 43210" autocomplete="tel" value="' + (ST.reg.phone||'') + '"></div>' +
    '<div id="reg-form-err" class="err-box">Please fill in all required fields.</div>';

  foot.innerHTML = '';
  var btn = el('button', { class:'btn btn-primary' }, 'Proceed to Payment →');
  btn.addEventListener('click', function() {
    var name  = document.getElementById('r-name').value.trim();
    var email = document.getElementById('r-email').value.trim();
    var phone = document.getElementById('r-phone').value.trim();
    var err   = document.getElementById('reg-form-err');
    ['r-name','r-email','r-phone'].forEach(function(id) { document.getElementById(id).classList.remove('err'); });
    var ok = true;
    if (!name)  { document.getElementById('r-name').classList.add('err');  ok=false; }
    if (!email) { document.getElementById('r-email').classList.add('err'); ok=false; }
    if (!phone) { document.getElementById('r-phone').classList.add('err'); ok=false; }
    if (!ok) { err.style.display='block'; return; }
    err.style.display='none';
    ST.reg = { name:name, email:email, phone:phone };
    ST.regStep = 3;
    renderRegStep();
  });
  foot.appendChild(btn);
}

// Step 3: UPI QR Payment
function renderRegStep3() {
  var plan  = ST.plan;
  var batch = ST.batch;
  var body  = document.getElementById('reg-body');
  var foot  = document.getElementById('reg-foot');

  // Build UPI deep link string
  // Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
  var upiNote = encodeURIComponent('AI Workshop – ' + plan.track + (batch ? ' – ' + batch.name : ''));
  var upiLink = 'upi://pay?pa=' + encodeURIComponent(UPI_ID)
    + '&pn=' + encodeURIComponent(UPI_NAME)
    + '&am=' + plan.price
    + '&cu=INR'
    + '&tn=' + upiNote;

  body.innerHTML = '';

  var wrap = el('div', { class:'upi-wrap' });

  // Amount card
  var amtCard = el('div', { class:'upi-amount-card' });
  amtCard.innerHTML =
    '<div class="upi-amount-label">Amount to Pay</div>' +
    '<div class="upi-amount-val">₹' + plan.price.toLocaleString('en-IN') + '</div>' +
    '<div class="upi-amount-plan">' + plan.track + ' – ' + plan.name +
      (batch ? '<br>' + batch.name + ' · ' + batch.days : '') + '</div>';
  wrap.appendChild(amtCard);

  // QR code box — static PhonePe QR image (base64 embedded)
  var qrBox = el('div', { class:'upi-qr-box', id:'upi-qr-container' });
  var qrImg = el('img', {
    src: 'data:image/jpeg;base64,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4uiNJXPm0EVskOUs+uu9JIfI/wCEdZK3IklnFSBsd1eOvbFfTZKRvSR0xA9Z2boGYMt8NIEhyRfcdle6uAsiM4yyc3PyEns49ZEJuELhHccYWZFiU0R/YSPBy6ic0RMidPyL4if+16aNGcdtMJbVznVo1dY5dfKS0lwcBK8UbMkjC6tBOIwSfVB5HdnHYHTnH4liqtmqpaPkVkSOHDrJmP45Akvlc3E1qj9ZJ1uRjQAAAAAAAAAAAABliMsQAAAdHOOrlAAAAZmCQ3kQ6tZpAAAJUjcO/gACV0nAdZyNmsAN2sxAdnIfG/QG7YcqU5jkAAAAAA6OcbdQAAAAAAAAAAAAAAAAAAAAAAAAAAAfZ6Fs5F9m3Mr+XXDFl4d2ZIc8fiY9+/QcvXu4zVu3dpDd2rtNUfomThgbRVyz57IQ7vv3QZ8eybITt55U5+PqGuEsUISlesMUWCL7PhlzfeU0yMJNlfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7OMdG3iGeAb9WI2tQ6NnGNuWgdLmG7PmDdpHVyh08wdHzQMunkG3o4huy5x3cXwdHTHDo+aB28+odXzmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/8QAAv/aAAwDAQACAAMAAAAh88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888884y5y8888888888888888888888888888888888888888888888888886yikS088888888888888888888888888888888888888888888888888nUBhnX084gow488884E4088888888888888888888888888888888888hAuBqA38oEMIcgkogMc8A88888888888888888888888888888888888vA3vqFc8s8csoUcsYM8cc88888888888888888888888888888888888suATGv8888888888888888888888888888888888888888888888888888edd88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888887RK+Z7vvo/9UUbjEfl+8888888888888888888888888888888888888bo91rNiO8slUV5BS/Qa0888888888888888888888888888888888888OOO8udN8uutt8ee9Ou9c88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888880w88004400ww4w88w4088ww08848w088888888888888888888888888UwkYY4g8M88MMcQQo0kgkMUk4YEkkU88888888888888888888888888cMc88MMc8c88sMc8Mcs8c8c8cssccc88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888wwwww0Qg8888swc888wc8oc44g88sw08Aowwwwwc8888888888888888EMMMc8oEooAkQUgoAAkMoQUooQAAUAAAUokMMMI88888888888888888UoAU88sYgAscAAkk4woIAQYAoAMMMAMgUoUoAUo88888888888888888UoAU8884U088EMU8oIo4gAIEMM48oMUEUoUoAUo88888888888888888UkMY88wgAo88c8YwwgMMMUsU8wsw88w88oUkMYo88888888888888888Awwww8o0Uwc84kA4EIUEIUYw4IcoUgoUkogwwwg8888888888888888s8www8koUQg88gYAQAcQgAU8koogc8cEMgww88ww88888888888888884w4wkscoMAgQU0cAAEAY0kUw0ssA8AMkI8wwQk0w88888888888888884Y0w044oUMIMMcw4wkAYw08MU8wow08wMYMUkcoA88888888888888888sYgwwssIsMw0oAgMIQocYkcQ0Q8I08M8MoU88oA8888888888888888s0sMYI8U888scsYM8AMkUEY8AUM0sY088gog844M88888888888888884Q08oU8gAEww0s840AwoAUo0AY08QkQw84kAw8oUU8888888888888884w0woA488sAAQ08AIAEw448UIUA4ocAAcAUUAUoA08888888888888888sYgUsQ888A8cAwUU04Usss0gA4888w0w0s88c4w888888888888888888osows884QwUMMQUAg8UI08sc8Y88Qcsw0888oAc88888888888888880oUsUcskEsMAAAEYkQMwME4gkwA04McE8Mww8sIc8888888888888888Uo8gEw8oU08sAAUIMQkwUooAAAA84888U8QAc4s88888888888888888U8IUsM888cAAAQUs8AEIAQ4IAAccs80884Acs4A8888888888888888sMAsoAAAA4AMoEMUogAAIIAAkoAgAAQoAAQAA0oQ888888888888888884Ms8IAIQM0A8IEcwAQ4oQoAUkMskIAkM0IIIEoU08888888888888884Ug0844oA0MAUoQ8gAAI8UAAYAE88sAUwUoQoQEA88888888888888888UoAQAAgkM8g08MgIIAkcUAAYoA8oEAAEwAAgU8Y88888888888888888QAMIA8sMwwMc08AUoAAUcAM8MAQs8MoUsMMIk8o88888888888888888AgwMUgw0wEw4UwAUAoIAAM8w40o4kk0Yww8ccks88888888888888888A48gA8oUAkIUgAAYIgssgUUssAo4gAUwwEU84ww88888888888888888AYUYAUYkwgAokUY8okUMswU88AUQsY8AUMwUYkU8888888888888888ss88oAA8M8MA0oU8AE8oss8gAAsoAUA8AUskAUoA8888888888888888840Iw88gA88IIUs8Ys8gQMQU80A08ME8AAUc08o888888888888888888888sAAAEsAAcoEAQMA8YoAAEkwgIcAIAAAAwwoE888888888888888840Q084w84www8oUwwkAw0IAMYQMMw8gUwwkMAQkI8888888888888888scgwwgM4kMAAUoUM0UIAAQAQwkw8MMcUsAAEMoU8888888888888888888sMIQAsc8EkIsMIc8QosMMMIsAgAUUgAwAUIQU4c88888888888888844AAU4w84sg84IQI848o088oEks8oc8IU88QAcQo08888888888888884MM088MIcY8EcsAUEYsMMIUgIUAkAUEgEIMMIUoA88888888888888888wwwwwM8o4AA088QwgAUkIAAU8Qw88A8cUokoUsoc8888888888888888UMMIc88s8MAAAAAIEI8MMUMoUIg8oE88QsMoU4A88888888888888888UoAU88IU48AUMYk80sMIQU8ssYkcoQU8MIAgAcI88888888888888888UoAU88oEQ0AIAU88488EIUgAc8o8gAU88oAAc8s88888888888888888Uc88888owowUAwAUww0U88Uw04wgks08c4U4E8488888888888888888MMMMM08088cc88E8oMs8s4c4kcs08cMMUsAMQMM88888888888888888MMMMMc8M888888s8sMMMcs88scMc8MMMc8sMMMM8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888kI0ooEMYcc84wsM88888888888888888888888888888888888888888A8YYAU8ccMIQkc088888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888oo0ccI8o0wc8w80w84w4888448004w8UssAY80wwo0w04ww88888888okIoIw4s0UU4w4U8oo08MQ000M4w4kQ4YIoQEk4k0AMcsssEM8888888888888sc888sc88840w8884880808w8w808888888sc888888888888888888888888888o8k0goY4A8cMMsEE0UI488888888888888888888888888888888888888cccMcMs8ccs888Ms8cs888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888/8QAAv/aAAwDAQACAAMAAAAQ8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888/www88888888888888888888888888888888888888888888888888874XpTd88888888888888888888888888888888888888888888888888vWFcDX28oYow40w0w4s4088888888888888888888888888888888888rBlCjB/8oYUcgEUMg808s88888888888888888888888888888888888eBxTDR+8scc8YUcsss8Ik88888888888888888888888888888888888+rBCCN8888888888888888888888888888888888888888888888888888tN88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888p/GnLDroZfbLd9x3n2Ee888888888888888888888888888888888888ZF8uoiLX+ufaWvgNX0W2888888888888888888888888888888888888NNN8d888t98c8dtON9+c8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888884w884044w4800w4448008488048w4408888888888888888888888888sY8YE0EgUwE4Qcc4Ao0ccwY8kg0sQQA88888888888888888888888888c88ccsccsM88sM8cc8sM88s888MMcc88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888AAAAAQIU8888sA0888gU8404AA88oAc8w4AAAAA0888888888888888ooMMMcAUs84MIMok8EMM4kc8o8sMMI8MMI8QMMMY8888888888888888ooEMc8AU444MIMM0s44MckM8oEcEM8MMUk8AkMMo8888888888888888ooU884A88o08o48U84o8kU88888c0888Uc8AU88o8888888888888888ooU888A804o8k8oU88s888o8c88UUo88888AU88o8888888888888888os8888AUc8oco84Us0o8YUo8Qso0U488UA8c888s8888888888888888s80884cU0sI0k8oUcso8sYo8swocUo8Uccs80488c8888888888888888wYw88EUA80QU88Qwkow0ggwkEo0U4oc4Y884808c888888888888888os08880U888884808888oco0U88cU888cM8MU888888888888888888888U8ss88MsM888s88s4c88ocgcoM0888888Qcs88888888888888888844Qw40wQgw8884gYcUkQg4g8Awk8Qwo08c8MU4gw0888888888888888sg88sswww0ww888Y4AwYQko8UwgUw48Y8AwwY08888888888888888888kU40wA088484w8Y88sw00o0M8wYQgwwUU8A884w8888888888888888sMkc888U88ososMUsEIMc848k8okc4M8EkM8MY8M888888888888888888UU88wU88M8888UcE4cY0o8c8sU0osc80s88M8oc8888888888888888sE8080MIcg8kMMEc48E0sM0sU8s8s80EYMk808Ic888888888888888oocc04Mc8488488c44oAsI888488U4888A8M888o0888888888888888oo8Uosc8c8s888s0os8848skUs80c8888cs80s8o88888888888888888YME8MMMM8Ms88IUoU88M88ssc8sMMcsMMM8s88s88888888888888884kIA0MM08QokgcI8Y8sMEsc84AAYMcsMMQIIUIw88888888888888888skQc88MU40oww8s0E88cUo888w0U84w8wI8IUk080888888888888888oYkMsMMcsc8so8MEQ088Yo88gsMUEIMMkkMMc8sY8888888888888888o8cUs8g0M88co848sQ88oo80E8880o8cU8880M8o8888888888888888o44gYsgYcAIwowg8swQ0884cgQE0IkMEgUwwMsQo0888888888888888o8Y8880U88k08w40wccQg8U0s0oQY4w04gwI0sww0888888888888888o808UoM8w808EsoUUo48Uk4U88oUU088U8o888o4U888888888888888s4U88s80s8M8s8o8cssc4Uoc8s808Y88UosA888o88888888888888888sUcc88cs880Us88Ys48QU880o408Y48U88s8s44888888888888888888888wwww8ww88888Yo8kc88E8wU4g088848Yw8888888888888888884s00o488848808o8s4o84w808488Uos888488s4o8888888888888888s4c88880c8o848occU48s88c4so888s8cU8Ac88888888888888888888oMMEsME84ssM8YMcsMcsMMEYMssEkMsEc8IEc84c8888888888888888o8804Mc08g0k0sU0848sc48EwsUUk48c88A8k4o0888888888888888swwU84w08w8www8U4wkwwws8k8oQ0o884www088o8888888888888888oMMMMMwscs8888osMM88IU88U88MEI8M8AsgU88I8888888888888888ooMMMcA0w8McsMMU88Yc8YoMscM8U8408Assck8c0888888888888888ooEMM8AEYw884AEM8EsAEMowQoEo88s88IEMcsQwc888888888888888ooU888AU84w084s8848888s8s48UUw888848888s8888888888888888ooMMc8AM8MoM4sc8skM8oU48wc4Mcocc8c8QksMY8888888888888888o88888A8s8McM8800488MIo848s0co8880sQ8M8s0888888888888888sMMMMMc88888888s88MMMM8c8sMM8sMMM88sM8MM88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888884Qk4wAQw00cUM4A88888888888888888888888888888888888888888kAUIgIw08Q0YU0s88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888A80U8M844wc4404w4088848k0w44c4kQssMU04w4Mw80w0488888888sMIs48kwkogIs4kEsUMIsAc8sMw0YkYwc40Y488ksUcYkIEEk888888888888888888s88888w888888804884880ww8888888c888888888888888888888888888UYUQ0AUAYQ8U0EIgo8o8o88888888888888888888888888888888888ss8sccMc8sc88sscsssss888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888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',
    style: 'width:168px;height:168px;object-fit:contain;border-radius:4px;display:block;',
    alt: 'PhonePe QR — scan to pay',
  });
  qrBox.appendChild(qrImg);
  wrap.appendChild(qrBox);

  // UPI ID row
  var idRow = el('div', { class:'upi-id-row' });
  idRow.appendChild(el('span', { class:'upi-id-label' }, 'UPI ID'));
  idRow.appendChild(el('span', { class:'upi-id-val', id:'upi-id-display' }, UPI_ID));
  var copyBtn = el('button', { class:'upi-copy-btn', id:'upi-copy' }, 'Copy');
  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(UPI_ID).then(function() {
      copyBtn.textContent = 'Copied ✓';
      copyBtn.classList.add('copied');
      setTimeout(function() { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
    }).catch(function() {
      // fallback for older browsers
      var ta = document.createElement('textarea');
      ta.value = UPI_ID; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      copyBtn.textContent = 'Copied ✓'; copyBtn.classList.add('copied');
      setTimeout(function() { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
    });
  });
  idRow.appendChild(copyBtn);
  wrap.appendChild(idRow);

  // How to pay steps
  var steps = el('div', { class:'upi-steps' });
  steps.appendChild(el('div', { class:'upi-steps-title' }, 'How to pay'));
  [
    'Open any UPI app on your phone',
    'Scan the QR code above — or copy the UPI ID and pay manually',
    'Enter the exact amount shown: ₹' + plan.price.toLocaleString('en-IN'),
    'Complete payment and note the UTR / Transaction ID',
    'Paste the transaction ID below and click Confirm',
  ].forEach(function(s, i) {
    var row = el('div', { class:'upi-step-row' });
    row.appendChild(el('span', { class:'upi-step-num' }, String(i+1)));
    row.appendChild(el('span', {}, s));
    steps.appendChild(row);
  });
  wrap.appendChild(steps);

  // UPI apps
  var appsWrap = el('div', { style:'width:100%;margin-bottom:16px;' });
  appsWrap.appendChild(el('div', { style:'font-size:11px;color:var(--dim);margin-bottom:6px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;' }, 'Works with'));
  var apps = el('div', { class:'upi-apps' });
  ['PhonePe','Google Pay','Paytm','BHIM','Amazon Pay','Any UPI App'].forEach(function(a) {
    apps.appendChild(el('span', { class:'upi-app-tag' }, a));
  });
  appsWrap.appendChild(apps);
  wrap.appendChild(appsWrap);

  // Transaction ID input
  var txnWrap = el('div', { class:'upi-txn-row' });
  txnWrap.innerHTML =
    '<label class="f-label" for="upi-txn">UTR / Transaction ID <span style="color:var(--red)">*</span></label>';
  var txnInput = el('input', {
    class:'upi-txn-input', type:'text', id:'upi-txn',
    placeholder:'e.g. 123456789012',
  });
  txnInput.setAttribute('autocomplete', 'off');
  txnWrap.appendChild(txnInput);
  txnWrap.appendChild(el('p', { class:'upi-txn-hint' },
    'Find this in your UPI app under transaction details after payment.'));
  wrap.appendChild(txnWrap);

  // Error box
  wrap.appendChild(el('div', { id:'upi-err', class:'err-box', style:'margin-top:12px;margin-bottom:0;' },
    'Please enter the UTR / Transaction ID to confirm your payment.'));

  body.appendChild(wrap);

  // QR image is static — no render needed

  // Footer
  foot.innerHTML = '';
  var confirmBtn = el('button', { class:'btn btn-primary btn-teal', id:'upi-confirm-btn' }, '✓ I\'ve Paid — Confirm Seat');
  confirmBtn.addEventListener('click', function() {
    var txnVal = document.getElementById('upi-txn').value.trim();
    var errEl  = document.getElementById('upi-err');
    if (!txnVal) {
      errEl.style.display = 'block';
      document.getElementById('upi-txn').focus();
      return;
    }
    errEl.style.display = 'none';
    ST.txnId = txnVal;

    // Show spinner
    confirmBtn.innerHTML = '<div class="spinner"></div>&nbsp; Confirming…';
    confirmBtn.disabled = true;

    var payload = {
      name       : ST.reg.name,
      email      : ST.reg.email,
      phone      : ST.reg.phone,
      plan       : plan.track + '–' + plan.name,
      batch      : batch ? batch.name + '(' + batch.days + ')' : '',
      amount     : plan.price,
      payment_id : 'UPI-' + txnVal,
      timestamp  : new Date().toISOString(),
    };

    Promise.all([
      saveToSheets(payload).catch(function(e) { console.error('Sheets:', e); }),
      saveToGitHub(payload).catch(function(e)  { console.error('GitHub:', e); }),
    ]).finally(function() {
      ST.regStep = 4;
      renderRegStep();
    });
  });
  foot.appendChild(confirmBtn);
}

// Step 4: Thank you
function renderRegStep4() {
  var r    = ST.reg;
  var plan = ST.plan;
  var batch = ST.batch;

  document.getElementById('reg-body').innerHTML =
    '<div class="ty-wrap">' +
      '<div class="ty-icon">✓</div>' +
      '<div class="ty-title">Seat Reserved!</div>' +
      '<p class="ty-sub">Welcome to <strong>' + plan.name + '</strong>' +
        (batch ? ' — ' + batch.name : '') + '!<br>' +
        'We\'ll confirm your seat on WhatsApp at <strong>' + r.phone + '</strong> within a few hours.</p>' +
      '<div class="summary">' +
        sRow('Name', r.name) + sRow('Email', r.email) + sRow('WhatsApp', r.phone) +
        sRow('Plan', '<span style="color:'+plan.color+';font-weight:700">'+plan.name+'</span>') +
        (batch ? sRow('Batch', batch.name + '<br><span style="font-size:11px;color:var(--muted)">'+batch.days+' · '+batch.time+'</span>') : '') +
        sRow('Duration', plan.dur) +
        sRow('Amount', '₹'+plan.price.toLocaleString('en-IN')) +
        sRow('UPI Txn ID', '<span style="font-size:12px;font-family:monospace;word-break:break-all">' + ST.txnId + '</span>') +
        sRow('Status', '<span class="s-pill">Submitted ✓</span>') +
      '</div>' +
      '<p style="font-size:13px;color:var(--muted);line-height:1.6">We verify UPI payments manually and will confirm within a few hours. WhatsApp us if you don\'t hear back: <a href="https://wa.me/917680973409" style="color:var(--orange)">+91 76809 73409</a></p>' +
    '</div>';

  document.getElementById('reg-foot').innerHTML = '';
  document.getElementById('reg-back').style.visibility = 'hidden';
}

function sRow(k, v) {
  return '<div class="s-row"><span class="s-key">'+k+'</span><span class="s-val">'+v+'</span></div>';
}

// ── LEAD CAPTURE SHEET ─────────────────────────────────────────────────────────

var leadSheet;

function buildLeadSheet() {
  leadSheet = el('div', { id:'lead-sheet', class:'sheet' });
  leadSheet.appendChild(el('div', { class:'sheet-handle' }));

  var hdr = el('div', { class:'sheet-header' });
  var back = el('button', { class:'sheet-back' }, '✕ Close');
  back.addEventListener('click', closeLeadSheet);
  hdr.appendChild(back);
  hdr.appendChild(el('div', { class:'sheet-title', id:'lead-product-title' }, ''));
  leadSheet.appendChild(hdr);

  var body = el('div', { class:'sheet-body', id:'lead-body' });
  body.appendChild(buildLeadForm());
  leadSheet.appendChild(body);

  var foot = el('div', { class:'sheet-foot', id:'lead-foot' });
  leadSheet.appendChild(foot);

  document.body.appendChild(leadSheet);
  initDragDismiss(leadSheet, closeLeadSheet);
}

function buildLeadForm() {
  var f = el('div', { id:'lead-form-wrap' });
  f.innerHTML =
    '<div id="lead-success" class="lead-success">' +
      '<div class="ls-icon">✓</div>' +
      '<h3>Got it — I\'ll be in touch!</h3>' +
      '<p>Your details are saved. I\'ll review and reach out within 24 hours.</p>' +
      '<button class="btn-close-lead" onclick="closeLeadSheet()">Close</button>' +
    '</div>' +
    '<div id="lead-form-inner">' +
      '<div class="form-row"><label class="f-label" for="l-name">Your Name <span>*</span></label>' +
      '<input class="f-input" type="text" id="l-name" placeholder="e.g. Priya Sharma" autocomplete="name"></div>' +
      '<div class="form-row"><label class="f-label" for="l-phone">WhatsApp / Phone <span>*</span></label>' +
      '<input class="f-input" type="tel" id="l-phone" placeholder="10-digit mobile number" autocomplete="tel"></div>' +
      '<div class="form-row"><label class="f-label" for="l-email">Email Address</label>' +
      '<input class="f-input" type="email" id="l-email" placeholder="optional" autocomplete="email">' +
      '<p class="f-hint">Optional — for follow-up details</p></div>' +
      '<div class="form-row"><label class="f-label" for="l-msg">What do you need?</label>' +
      '<textarea class="f-textarea" id="l-msg" placeholder="Tell me about your use case or what you\'d like to achieve…"></textarea></div>' +
      '<div id="lead-err" class="err-box">Please enter your name and a valid 10-digit number.</div>' +
    '</div>';
  return f;
}

function openLeadSheet(productName, productId) {
  leadProductId = productId || '';
  document.getElementById('lead-product-title').textContent = productName;
  document.getElementById('lead-success').style.display = 'none';
  document.getElementById('lead-form-inner').style.display = 'block';
  ['l-name','l-phone','l-email','l-msg'].forEach(function(id) {
    var e = document.getElementById(id);
    if (e) { e.value = ''; e.classList.remove('err'); }
  });
  document.getElementById('lead-err').style.display = 'none';

  var foot = document.getElementById('lead-foot');
  foot.innerHTML = '';
  var btn = el('button', { class:'btn btn-primary', id:'lead-submit' }, '✉ Send My Interest');
  btn.addEventListener('click', submitLead);
  foot.appendChild(btn);

  open_(leadSheet);
  setTimeout(function() {
    var inp = document.getElementById('l-name');
    if (inp) inp.focus();
  }, 350);
}

function closeLeadSheet() { close_(leadSheet); }

function submitLead() {
  var name  = document.getElementById('l-name').value.trim();
  var phone = document.getElementById('l-phone').value.trim().replace(/\s/g,'');
  var email = document.getElementById('l-email').value.trim();
  var msg   = document.getElementById('l-msg').value.trim();
  var err   = document.getElementById('lead-err');

  document.getElementById('l-name').classList.remove('err');
  document.getElementById('l-phone').classList.remove('err');
  var ok = true;
  if (!name)              { document.getElementById('l-name').classList.add('err');  ok=false; }
  if (!/^\d{10}$/.test(phone)) { document.getElementById('l-phone').classList.add('err'); ok=false; }
  if (!ok) { err.style.display='block'; return; }
  err.style.display='none';

  var btn = document.getElementById('lead-submit');
  btn.innerHTML = '<div class="spinner"></div> Sending…';
  btn.disabled = true;

  var payload = {
    product   : document.getElementById('lead-product-title').textContent,
    name      : name,
    phone     : phone,
    email     : email,
    message   : msg,
    timestamp : new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata' }),
  };

  var sendFn = (LEADS_URL && LEADS_URL !== 'YOUR_LEADS_SCRIPT_URL')
    ? fetch(LEADS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    : Promise.resolve();

  sendFn
    .catch(function() {})
    .finally(function() {
      document.getElementById('lead-form-inner').style.display = 'none';
      document.getElementById('lead-success').style.display = 'block';
      document.getElementById('lead-foot').innerHTML = '';
    });

  saveLeadToGitHub(payload).catch(function(e) { console.error('GitHub leads:', e); });
  console.table(payload);
}

// ── Sheet open/close helpers ──────────────────────────────────────────────────
function open_(sheet) {
  document.querySelectorAll('.sheet').forEach(function(s) { s.classList.remove('open'); });
  document.getElementById('backdrop').classList.add('open');
  sheet.classList.add('open');
  document.body.classList.add('no-scroll');
}

function close_(sheet) {
  sheet.classList.remove('open');
  document.getElementById('backdrop').classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function closeAllSheets() {
  document.querySelectorAll('.sheet').forEach(function(s) { s.classList.remove('open'); });
  document.getElementById('backdrop').classList.remove('open');
  document.body.classList.remove('no-scroll');
}

// ── Drag-to-dismiss ───────────────────────────────────────────────────────────
function initDragDismiss(sheet, closeFn) {
  var handle = sheet.querySelector('.sheet-handle');
  var startY = 0, isDragging = false;

  function onStart(e) {
    isDragging = true;
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    sheet.style.transition = 'none';
  }
  function onMove(e) {
    if (!isDragging) return;
    var dy = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
    if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
  }
  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    sheet.style.transition = '';
    var dy = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - startY;
    if (dy > 100) { sheet.style.transform = ''; closeFn(); }
    else { sheet.style.transform = ''; }
  }
  handle.addEventListener('touchstart', onStart, { passive:true });
  handle.addEventListener('touchmove',  onMove,  { passive:true });
  handle.addEventListener('touchend',   onEnd);
}

// ── Google Sheets save (workshop) ─────────────────────────────────────────────
function saveToSheets(data) {
  if (!SHEET_URL) { console.warn('SHEET_URL not set'); return Promise.resolve(); }
  return fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ── GitHub CSV save ───────────────────────────────────────────────────────────
async function saveToGitHub(data) {
  if (!GH_TOKEN) { console.warn('GH_TOKEN not set'); return; }
  var today = new Date().toLocaleDateString('en-CA', { timeZone:'Asia/Kolkata' });
  var path  = 'registrations/' + today + '.csv';
  var url   = 'https://api.github.com/repos/' + GH_REPO + '/contents/' + path;
  var hdrs  = {
    'Authorization':'Bearer ' + GH_TOKEN,
    'Accept':'application/vnd.github+json',
    'Content-Type':'application/json',
    'X-GitHub-Api-Version':'2022-11-28',
  };
  var sha = '', existing = '';
  try {
    var r = await fetch(url, { headers:hdrs });
    if (r.ok) { var d = await r.json(); sha = d.sha; existing = decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))); }
  } catch(e) {}
  function cell(v) { return '"' + String(v||'').replace(/"/g,'""') + '"'; }
  var row = [new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
    data.name,data.email,data.phone,data.plan,data.batch,data.amount,data.payment_id].map(cell).join(',');
  var HEADER = '"Timestamp (IST)","Name","Email","Phone","Plan","Batch","Amount (INR)","Razorpay Payment ID"';
  var csv = (existing || HEADER+'\n') + row + '\n';
  var body = { message:'reg: '+(data.name||'unknown')+'|'+today, content:btoa(unescape(encodeURIComponent(csv))) };
  if (sha) body.sha = sha;
  try {
    var res = await fetch(url, { method:'PUT', headers:hdrs, body:JSON.stringify(body) });
    if (!res.ok) console.error('GitHub PUT failed:', await res.text());
  } catch(e) { console.error('GitHub error:', e); }
}

// ── GitHub CSV save (leads) ───────────────────────────────────────────────────
async function saveLeadToGitHub(data) {
  if (!GH_TOKEN) { console.error('[leads] GH_TOKEN is empty — check CSV_GITHUB_TOKEN secret'); return; }
  var today = new Date().toLocaleDateString('en-CA', { timeZone:'Asia/Kolkata' });
  var path  = 'leads/' + today + '.csv';
  var url   = 'https://api.github.com/repos/' + GH_REPO + '/contents/' + path;
  var hdrs  = {
    'Authorization':'Bearer ' + GH_TOKEN,
    'Accept':'application/vnd.github+json',
    'Content-Type':'application/json',
    'X-GitHub-Api-Version':'2022-11-28',
  };
  var sha = '', existing = '';
  try {
    var r = await fetch(url, { headers:hdrs });
    console.log('[leads] GET', path, r.status);
    if (r.ok) { var d = await r.json(); sha = d.sha; existing = decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))); }
  } catch(e) { console.error('[leads] GET error:', e); }
  function cell(v) { return '"' + String(v||'').replace(/"/g,'""') + '"'; }
  var row = [data.timestamp, data.product, data.name, data.phone, data.email, data.message].map(cell).join(',');
  var HEADER = '"Timestamp (IST)","Product","Name","Phone","Email","Message"';
  var csv = (existing || HEADER+'\n') + row + '\n';
  var body = { message:'lead: '+(data.name||'unknown')+'|'+today, content:btoa(unescape(encodeURIComponent(csv))) };
  if (sha) body.sha = sha;
  try {
    var res = await fetch(url, { method:'PUT', headers:hdrs, body:JSON.stringify(body) });
    if (res.ok) { console.log('[leads] saved to', path); }
    else { console.error('[leads] PUT failed', res.status, await res.text()); }
  } catch(e) { console.error('[leads] PUT error:', e); }
}

// ── Scroll behaviour ──────────────────────────────────────────────────────────
function scrollToSection(id) {
  var e = document.getElementById(id);
  if (!e) return;
  var offset = 56;
  window.scrollTo({ top: e.getBoundingClientRect().top + window.scrollY - offset, behavior:'smooth' });
}

function initScrollBehavior() {
  var hero    = document.querySelector('.hero');
  var nav     = document.getElementById('top-nav');
  var prog    = document.getElementById('progress');
  var wsEl    = document.getElementById('workshop');
  var toolsEl = document.getElementById('tools');
  var tabs    = document.querySelectorAll('.nav-tab');
  var fadeEls = document.querySelectorAll('.fade-in');

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold:0.1 });
  fadeEls.forEach(function(e) { io.observe(e); });

  window.addEventListener('scroll', function() {
    var scrollY   = window.scrollY;
    var docH      = document.body.scrollHeight - window.innerHeight;
    var heroH     = hero.offsetHeight;

    prog.style.width = (docH > 0 ? (scrollY / docH * 100) : 0) + '%';

    if (scrollY > heroH * 0.7) nav.classList.add('visible');
    else nav.classList.remove('visible');

    var toolsTop = toolsEl.getBoundingClientRect().top;
    tabs.forEach(function(t) { t.classList.remove('active'); });
    if (toolsTop < window.innerHeight * 0.4) tabs[1].classList.add('active');
    else tabs[0].classList.add('active');

  }, { passive:true });
}

// ── Init ──────────────────────────────────────────────────────────────────────
buildPage();
