import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { supabase } from "./supabase.js";

const C = {
  teal: "#2DD4BF", tealDark: "#0D9488", emerald: "#34D399",
  amberDk: "#FBBF24", amberLt: "#FCD34D", pink: "#FDA4AF",
  text: "#F8FAFC", sub: "#E2E8F0", muted: "#CBD5E1",
  faint: "#94A3B8", vfaint: "#64748B", bg: "#0F172A",
  card: "rgba(30,41,59,0.65)", cardSolid: "#1E293B",
  border: "rgba(148,163,184,0.12)"
};
const F = "'Heebo','Segoe UI',Arial,sans-serif";

const Icon = ({ d, size = 18, color = C.muted, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ShieldIcon = p => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />;
const InfoIcon = p => <Icon {...p} d="M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />;
const CheckIcon = p => <Icon {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />;
const ArrowIcon = p => <Icon {...p} d="M19 12H5M12 19l-7-7 7-7" />;
const UpIcon = p => <Icon {...p} d="M12 19V5M5 12l7-7 7 7" />;

function HourglassLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <rect x="6" y="2" width="28" height="3.5" rx="1.75"
        fill="url(#hg)" opacity="0.9" />
      <rect x="6" y="34.5" width="28" height="3.5" rx="1.75"
        fill="url(#hg)" opacity="0.9" />
      <path d="M9 5.5 L20 18 L31 5.5" stroke="url(#hg)"
        strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M9 34.5 L20 22 L31 34.5" stroke="url(#hg)"
        strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="20" r="1.5" fill="#2DD4BF">
        <animate attributeName="opacity"
          values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="13" r="1" fill="#2DD4BF" opacity="0.6">
        <animate attributeName="cy"
          values="13;19.5" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity"
          values="0.6;0" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="18.5" cy="11" r="0.7" fill="#38BDF8" opacity="0.4">
        <animate attributeName="cy"
          values="11;19" dur="1.3s" repeatCount="indefinite" />
        <animate attributeName="opacity"
          values="0.4;0" dur="1.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="21.5" cy="12" r="0.8" fill="#2DD4BF" opacity="0.5">
        <animate attributeName="cy"
          values="12;19.5" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity"
          values="0.5;0" dur="1.1s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function AN({ value, duration = 1800 }) {
  const [d, setD] = useState(0);
  const r = useRef(null);
  useEffect(() => {
    let s = null;
    function step(ts) {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setD(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) r.current = requestAnimationFrame(step);
    }
    r.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r.current);
  }, [value, duration]);
  return <>{d.toLocaleString()}</>;
}

function SubCounter() {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    function tick() {
      const now = new Date();
      const mid = new Date(now);
      mid.setDate(mid.getDate() + 1);
      mid.setHours(0, 0, 0, 0);
      const diff = mid - now;
      setT({
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60
      });
    }
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const ns = {
    fontSize: 16, fontWeight: 600, color: C.teal,
    fontFamily: "'Courier Prime',monospace",
    background: "rgba(45,212,191,0.1)",
    borderRadius: 6, padding: "3px 6px",
    minWidth: 28, textAlign: "center", display: "inline-block"
  };
  return (
    <div style={{
      display: "flex", justifyContent: "center",
      alignItems: "center", gap: 3,
      direction: "ltr", marginTop: 8
    }}>
      <span style={ns}>{pad(t.h)}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.vfaint }}>:</span>
      <span style={ns}>{pad(t.m)}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.vfaint }}>:</span>
      <span style={ns}>{pad(t.s)}</span>
    </div>
  );
}

function getTodayHebDate() {
  var now = new Date();
  return now.toLocaleDateString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "numeric", month: "numeric", year: "numeric"
  });
}

function OsintNetwork() {
  const sources = [
    { name: "צה״ל", c: "#86EFAC" },
    { name: "INSS", c: "#93C5FD" },
    { name: "Janes", c: "#A5B4FC" },
    { name: "Reuters", c: "#FDBA74" },
    { name: "BBC", c: "#FDE68A" },
    { name: "CNN", c: "#FCA5A5" },
    { name: "AP", c: "#F9A8D4" },
    { name: "N12", c: "#C4B5FD" },
    { name: "ynet", c: "#FDA4AF" },
    { name: "Telegram", c: "#6EE7B7" }
  ];
  const [glowing, setGlowing] = useState(new Set());
  useEffect(() => {
    const i = setInterval(() => {
      const count = Math.random() < 0.3 ? 4 : Math.random() < 0.5 ? 3 : 2;
      const next = new Set();
      while (next.size < count)
        next.add(Math.floor(Math.random() * sources.length));
      setGlowing(next);
      setTimeout(() => setGlowing(new Set()), 1200);
    }, 1400);
    return () => clearInterval(i);
  }, []);
  const positions = [
    { x: 8, y: 8 }, { x: 35, y: 3 }, { x: 65, y: 3 }, { x: 92, y: 8 },
    { x: 2, y: 50 }, { x: 98, y: 50 },
    { x: 8, y: 92 }, { x: 35, y: 97 }, { x: 65, y: 97 }, { x: 92, y: 92 }
  ];
  return (
    <div style={{
      background: C.card, backdropFilter: "blur(12px)",
      borderRadius: 16, border: "1px solid " + C.border,
      padding: "16px 10px 10px", marginBottom: 20
    }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: C.text, marginBottom: 5
        }}>הצלבת נתונים 24/7</div>
        <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
          המערכת מצליבה נתונים שפורסמו בכלי תקשורת מוכרים
          <br />ומייצרת הערכה מעודכנת
        </div>
      </div>
      <div style={{ position: "relative", height: 100 }}>
        <svg style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%"
        }}>
          <defs>
            <radialGradient id="hubG">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="35" fill="url(#hubG)" />
          <circle cx="50%" cy="50%" r="22" fill="none"
            stroke="rgba(45,212,191,0.12)" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="22" fill="none"
            stroke="#2DD4BF" strokeWidth="1.5"
            strokeDasharray="6,6" opacity="0.5">
            <animate attributeName="stroke-dashoffset"
              values="0;12" dur="2.5s" repeatCount="indefinite" />
          </circle>
          {positions.map((p, i) => {
            const hot = glowing.has(i);
            return (
              <line key={i}
                x1={p.x + "%"} y1={p.y + "%"}
                x2="50%" y2="50%"
                stroke={hot ? sources[i].c + "55" : "rgba(148,163,184,0.04)"}
                strokeWidth={hot ? 1.5 : 0.5}
                style={{ transition: "all 0.5s ease" }} />
            );
          })}
        </svg>
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)", zIndex: 2
        }}>
          <HourglassLogo size={30} />
        </div>
        {sources.map((s, i) => {
          const hot = glowing.has(i);
          return (
            <div key={i} style={{
              position: "absolute",
              left: positions[i].x + "%",
              top: positions[i].y + "%",
              transform: "translate(-50%,-50%)", zIndex: 3,
              background: hot ? s.c + "15" : "rgba(15,23,42,0.9)",
              border: "1.5px solid " + (hot ? s.c + "66" : "rgba(148,163,184,0.08)"),
              borderRadius: 6, padding: "2px 6px",
              fontSize: 8, fontWeight: 700,
              color: hot ? s.c : C.vfaint,
              boxShadow: hot ? "0 0 12px " + s.c + "33" : "none",
              transition: "all 0.5s ease",
              whiteSpace: "nowrap"
            }}>{s.name}</div>
          );
        })}
      </div>
    </div>
  );
}

function GlassCard({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: C.card, backdropFilter: "blur(12px)",
      borderRadius: 16, border: "1px solid " + C.border,
      ...style
    }}>
      {children}
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }} onClick={onClose}>
      <div style={{
        width: "min(92vw,440px)", maxHeight: "85vh",
        overflow: "auto", background: C.cardSolid,
        borderRadius: 20, padding: "24px 20px",
        border: "1px solid " + C.border, position: "relative"
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(148,163,184,0.1)",
          border: "none", color: C.muted,
          width: 32, height: 32, borderRadius: "50%",
          cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center",
          justifyContent: "center"
        }}>✕</button>
        <h2 style={{
          fontSize: 18, fontWeight: 800, color: C.text,
          marginBottom: 14, textAlign: "center"
        }}>{title}</h2>
        <div style={{
          fontSize: 14, color: C.sub, lineHeight: 1.8
        }}>{children}</div>
      </div>
    </div>
  );
}

function ArsenalBar({ emoji, label, remaining, total, goneLabel, goneColor, remainColor }) {
  var gone = total - remaining;
  var remainPct = (remaining / total) * 100;
  var gonePct = 100 - remainPct;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 6
      }}>
        <span style={{ fontSize: 16, color: C.text, fontWeight: 700 }}>
          {label}
        </span>
        <span style={{ fontSize: 13, color: C.faint }}>
          מתוך {total.toLocaleString()}
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginBottom: 6, direction: "ltr"
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{
            fontSize: 26, fontWeight: 800, color: goneColor,
            fontFamily: "'Courier Prime',monospace"
          }}><AN value={gone} /></span>
          <span style={{
            fontSize: 12, color: goneColor, fontWeight: 600
          }}>{goneLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{
            fontSize: 12, color: remainColor, fontWeight: 600
          }}>נותרו</span>
          <span style={{
            fontSize: 26, fontWeight: 800, color: remainColor,
            fontFamily: "'Courier Prime',monospace"
          }}><AN value={remaining} /></span>
        </div>
      </div>
      <div style={{
        height: 48, borderRadius: 12, overflow: "hidden",
        display: "flex", direction: "ltr"
      }}>
        <div style={{
          width: gonePct + "%", height: "100%",
          background: goneColor + "12",
          position: "relative", transition: "width 2s", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 24,
            letterSpacing: 4, opacity: 0.1,
            filter: "grayscale(0.5)",
            overflow: "hidden", whiteSpace: "nowrap"
          }}>{Array(25).fill(emoji).join("  ")}</div>
        </div>
        <div style={{
          width: 3, height: "100%",
          background: remainColor + "88", flexShrink: 0
        }} />
        <div style={{
          width: remainPct + "%", height: "100%",
          background: "linear-gradient(90deg, " + remainColor + "55, " + remainColor + "77)",
          position: "relative", transition: "width 2s",
          overflow: "hidden",
          boxShadow: "inset 0 0 20px " + remainColor + "33"
        }}>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 24,
            letterSpacing: 4, opacity: 0.5,
            overflow: "hidden", whiteSpace: "nowrap"
          }}>{Array(25).fill(emoji).join("  ")}</div>
        </div>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 4, direction: "ltr",
        fontSize: 11, color: C.faint, fontWeight: 500
      }}>
        <span>{gonePct.toFixed(0)}%</span>
        <span>{remainPct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

const ARTICLES = {
  osint: {
    title: "מה זה OSINT, מודיעין ממקורות גלויים",
    content: "OSINT הוא ראשי תיבות של Open Source Intelligence, כלומר מודיעין ממקורות גלויים. מדובר באיסוף וניתוח מידע ממקורות שזמינים לציבור הרחב, ללא צורך בגישה למידע מסווג.\n\nמקורות גלויים כוללים: כלי תקשורת, פרסומים רשמיים, מכוני מחקר, רשתות חברתיות רשמיות, ומאגרי מידע ציבוריים.\n\nהערך של OSINT הוא באיסוף שיטתי, בהצלבה, ובניתוח של מידע שפזור במקורות רבים.\n\nחשוב להבין: מידע גלוי הוא בהכרח חלקי. לכן כל הערכה מבוססת OSINT היא חלקית ונתונה לשינוי."
  },
  crossref: {
    title: "איך עובדת הצלבת נתונים אוטומטית",
    content: "הצלבת נתונים (Cross-referencing) היא תהליך שבו משווים נתון מספרי ממקור אחד לנתונים דומים ממקורות אחרים.\n\nהעיקרון: אם שני מקורות בלתי תלויים מדווחים על מספר דומה (סטייה עד 10%), סביר שהמספר קרוב למציאות.\n\nהמערכת סורקת מקורות אוטומטית, מחלצת נתונים מספריים, ומשווה. נתון מאושר רק אם מגובה ב-2 מקורות לפחות.\n\nהצלבה לא מושלמת. מקורות יכולים להיות מוטים לאותו כיוון, ולכן מעדיפים מקורות בלתי תלויים."
  },
  rate: {
    title: "מה זה שיעור הצלחה ואיך מחשבים אחוזים",
    content: "שיעור הצלחה מחשב את היחס בין הצלחות לניסיונות.\n\nהחישוב: (הצלחות ÷ ניסיונות) × 100.\n\nלדוגמה: 270 הצלחות מתוך 285 = 94.7%.\n\nשיעור 95% = מתוך כל 100, חמישה לא הצליחו. במספרים גדולים זה משמעותי.\n\nמגבלות: שיעור מפורסם הוא תמיד הערכה. נתונים מתעדכנים בדיעבד."
  },
  glossary: {
    title: "מילון מושגים",
    content: "OSINT: מודיעין ממקורות גלויים.\n\nהצלבת נתונים: השוואת נתונים ממקורות שונים.\n\nשיעור הצלחה: אחוז ההצלחות מסך הניסיונות.\n\nהערכה: נתון מחושב, נתון לשינוי.\n\nמגמה: כיוון שינוי לאורך זמן.\n\nמקור בלתי תלוי: מקור שאינו מסתמך על אחר.\n\nנתון מצטבר: סכום כולל מתחילת המדידה.\n\nמלאי: כמות זמינה בנקודת זמן.\n\nטווח ביטחון: מרווח שהנתון נמצא בו."
  },
  sources: {
    title: "מקורות המידע שלנו",
    content: "10 מקורות:\n\nצה\"ל: נתונים רשמיים שאושרו.\n\nINSS: הערכות כמותיות אקדמיות.\n\nJanes: ניתוח יכולות טכני.\n\nReuters: סוכנות ידיעות בינלאומית.\n\nBBC: תאגיד השידור הבריטי.\n\nCNN: רשת חדשות אמריקאית.\n\nAP: סוכנות ידיעות אמריקאית.\n\nN12: חדשות ישראליות.\n\nynet: דיווחים ישראליים.\n\nTelegram: ערוצי מודיעין גלויים.\n\nכל נתון מגובה ב-2+ מקורות בלתי תלויים."
  },
  guide: {
    title: "איך לקרוא את הדשבורד",
    content: "הספירה: הערכת ימים שנותרו. נתונה לשינוי.\n\nגרפי ארסנל: שמאל (דהוי) = מה שכבר לא זמין. ימין (מואר) = מה שנותר.\n\nמשפך הגנה: שוגרו > חצו > יורטו > לא יורטו. באנר ירוק = אחוז הצלחה.\n\nמקורות: שמות מאירים = נסרקו לאחרונה.\n\n\"עודכן לפני\": זמן העדכון האחרון."
  },
  methodology: {
    title: "מתודולוגיה",
    content: "1. סריקה אוטומטית של מקורות גלויים.\n\n2. הצלבה: 2+ מקורות, סטייה עד 10%.\n\n3. עדכון בדשבורד. מקור יחיד מסומן.\n\n4. ביקורת ידנית שבועית.\n\nלא מפורסם: מיקומים, פריסות, מידע שלא פורסם בתקשורת.\n\nמגבלות: מידע חלקי, מוטה, מיושן. הערכות נתונות לשינוי."
  },
  reliability: {
    title: "מהימנות נתונים",
    content: "בדיקת מקור: מי פרסם? יש אינטרס?\n\nהצלבה: מקורות נוספים מאשרים?\n\nעקביות: נתון עקבי עם קודמים?\n\nהטיה: ממשלות מפרסמים מה שמשרת אותם.\n\nעיתוי: בזמן אמת = פחות מדויק.\n\nהאתר מצליב מקורות מרובים ובלתי תלויים."
  },
  faq: {
    title: "שאלות נפוצות",
    content: "מה האתר? הערכה על בסיס הצלבת OSINT.\n\nמאיפה הנתונים? כלי תקשורת מוכרים.\n\nכמה מדויק? הערכות, נתונות לשינוי.\n\nקשור לצה\"ל? לא.\n\nמה באזעקה? הנחיות פיקוד העורף בלבד.\n\nקשר: kamanishar.info@gmail.com"
  },
  trends: {
    title: "ניתוח מגמות בזמן אמת",
    content: "ניתוח מגמות בודק שינוי לאורך זמן: עלייה, ירידה, יציבות.\n\nהאתגר: שינוי קצר טווח לא בהכרח מעיד על מגמה ארוכת טווח.\n\nפתרון: ממוצעים נעים (Moving Average) מחליקים תנודות ומגלים כיוון אמיתי."
  },
  estimating: {
    title: "הערכת כמויות ממקורות גלויים",
    content: "ספירה ישירה: מקורות רשמיים. הכי אמין.\n\nהערכת מומחים: מכוני מחקר.\n\nחישוב שארית: התחלה פחות ניצול.\n\nכל שיטה כרוכה באי ודאות. הצלבה בין שיטות קריטית."
  },
  gap: {
    title: "הפער בין הערכה למציאות",
    content: "מידע חלקי: לא רואים הכל.\n\nעיכוב: מידע מגיע באיחור.\n\nהטיה: לכל מקור יש אינטרס.\n\nאי ודאות: תמיד יש טווח.\n\nשינויים: המציאות משתנה.\n\nהנתונים = אינדיקציה, לא עובדה מוחלטת."
  },
  about: {
    title: "אודות",
    content: "\"כמה נשאר?\" הערכה על בסיס OSINT מ-10 מקורות. אינו משתמש במידע מסווג.\n\nאינו קשור לצה\"ל, פיקוד העורף, משרד הביטחון או גוף ממשלתי.\n\nהערכות בלבד. יש להישמע לפיקוד העורף.\n\nקשר: kamanishar.info@gmail.com"
  },
  terms: {
    title: "תנאי שימוש",
    content: "בתוקף מ-22.3.2026.\n\n1. הערכות OSINT בלבד. 2. לא מסווג. 3. ייתכנו סטיות. 4. פרסומים שעברו צנזורה בלבד. 5. לא מיקומים/פריסות. 6. לא קשור לצה\"ל. 7. לא להסתמך, יש להישמע לפיקוד העורף. 8. AS IS. 9. אין אחריות לנזק. 10. קניין רוחני מוגן. 11. לא מתחת גיל 13. 12. עשוי להשתנות. 13. קישורים חיצוניים, לא אחראים. 14. דין ישראלי."
  },
  privacy: {
    title: "מדיניות פרטיות",
    content: "עודכן מרץ 2026.\n\nלא אוסף מידע אישי. Google AdSense עשוי להשתמש בעוגיות. ניהול בהגדרות דפדפן.\n\nנתוני שימוש אנונימיים. לא מתחת גיל 13.\n\nקשר: kamanishar.info@gmail.com"
  }
};

const AL = [
  ["faq", "שאלות נפוצות"], ["methodology", "מתודולוגיה"],
  ["sources", "מקורות"], ["osint", "מה זה OSINT"],
  ["crossref", "הצלבת נתונים"], ["rate", "שיעור הצלחה"],
  ["glossary", "מילון מושגים"], ["guide", "מדריך לדשבורד"],
  ["reliability", "מהימנות נתונים"], ["trends", "ניתוח מגמות"],
  ["estimating", "הערכת כמויות"], ["gap", "מגבלות הנתונים"],
  ["about", "אודות"], ["terms", "תנאי שימוש"],
  ["privacy", "מדיניות פרטיות"]
];

function ArticlePage() {
  const loc = useLocation();
  const id = loc.pathname.split("/").pop();
  const a = ARTICLES[id];
  if (!a) return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: F, color: C.faint }}>
      עמוד לא נמצא · <Link to="/" style={{ color: C.teal }}>חזרה</Link>
    </div>
  );
  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 100px" }}>
        <header style={{
          padding: "16px 0 20px", display: "flex",
          alignItems: "center", justifyContent: "space-between"
        }}>
          <Link to="/" style={{
            textDecoration: "none", display: "flex",
            alignItems: "center", gap: 6
          }}>
            <HourglassLogo size={24} />
            <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>
              כמה נשאר?
            </span>
          </Link>
          <Link to="/" style={{
            fontSize: 12, color: C.teal, textDecoration: "underline",
            fontWeight: 600, display: "flex", alignItems: "center", gap: 4
          }}>
            <ArrowIcon size={14} color={C.teal} /> חזרה לדשבורד
          </Link>
        </header>
        <h1 style={{
          fontSize: 26, fontWeight: 900, color: C.text,
          lineHeight: 1.3, marginBottom: 20
        }}>{a.title}</h1>
        <article style={{ fontSize: 15, color: C.sub, lineHeight: 2 }}>
          {a.content.split("\n\n").map((p, i) => (
            <p key={i} style={{ marginBottom: 14 }}>{p}</p>
          ))}
        </article>
        <nav style={{
          marginTop: 30, padding: "16px 0",
          borderTop: "1px solid " + C.border
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: C.text, marginBottom: 10
          }}>עוד באתר</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {AL.filter(([k]) => k !== id).slice(0, 8).map(([key, label]) => (
              <Link key={key} to={"/article/" + key} style={{
                fontSize: 11, color: C.teal, textDecoration: "none",
                background: C.cardSolid, padding: "5px 10px",
                borderRadius: 6, border: "1px solid " + C.border
              }}>{label}</Link>
            ))}
          </div>
        </nav>
        <div style={{
          textAlign: "center", fontSize: 10,
          color: C.vfaint, marginTop: 20
        }}>כמה נשאר? v4.5 · © 2026</div>
      </div>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "linear-gradient(180deg,transparent," + C.bg + " 40%)",
        padding: "16px 0 0"
      }}>
        <div style={{
          width: 320, height: 50, margin: "0 auto 8px",
          background: C.cardSolid, borderRadius: 8,
          display: "flex", alignItems: "center",
          justifyContent: "center",
          border: "1px solid " + C.border
        }}>
          <span style={{ color: C.vfaint, fontSize: 10 }}>320 × 50</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [modal, setModal] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayDate, setTodayDate] = useState("");
  const [showUp, setShowUp] = useState(false);

  useEffect(() => {
    setTodayDate(getTodayHebDate());
    async function f() {
      var r = await supabase
        .from("dashboard_data")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);
      if (r.data && r.data.length > 0) setData(r.data[0]);
      setLoading(false);
    }
    f();
    var ch = supabase
      .channel("dc")
      .on("postgres_changes", {
        event: "*", schema: "public", table: "dashboard_data"
      }, function (p) { if (p.new) setData(p.new); })
      .subscribe();
    function onScroll() { setShowUp(window.scrollY > 400); }
    window.addEventListener("scroll", onScroll);
    var dateInterval = setInterval(function () {
      setTodayDate(getTodayHebDate());
    }, 60000);
    return function () {
      supabase.removeChannel(ch);
      window.removeEventListener("scroll", onScroll);
      clearInterval(dateInterval);
    };
  }, []);

  useEffect(() => { document.title = "כמה נשאר?"; }, []);

  if (loading) return (
    <div dir="rtl" style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: F
    }}>
      <div style={{ color: C.faint }}>טוען נתונים...</div>
    </div>
  );

  if (!data) return (
    <div dir="rtl" style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: F
    }}>
      <div style={{ color: C.faint }}>לא נמצאו נתונים</div>
    </div>
  );

  var fired = data.missiles_fired;
  var crossed = data.missiles_crossed;
  var intercepted = data.missiles_intercepted;
  var hitGround = crossed - intercepted;
  var interceptPct = crossed > 0
    ? ((intercepted / crossed) * 100).toFixed(1) : "0";

  var daysLeft = data.end_date
    ? Math.max(0, Math.ceil((new Date(data.end_date) - new Date()) / (864e5)))
    : data.end_estimate_days;

  return (
    <div dir="rtl" style={{
      minHeight: "100vh", background: C.bg,
      color: C.text, fontFamily: F
    }}>
      {modal === "about" && (
        <Modal onClose={() => setModal(null)}
          title={'אודות "כמה נשאר?"'}>
          <p style={{ marginBottom: 10 }}>
            הערכה מעודכנת על בסיס OSINT. אינו משתמש במידע מסווג.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: C.text }}>
              כל הנתונים מפרסומים שעברו צנזורה צבאית.
            </strong>
          </p>
          <div style={{
            marginBottom: 10,
            background: "rgba(251,191,36,0.08)",
            padding: "10px 12px", borderRadius: 8,
            fontSize: 13, lineHeight: 1.6,
            border: "1px solid rgba(251,191,36,0.15)"
          }}>
            <strong style={{ color: C.amberDk }}>
              אינו קשור לצה"ל, פיקוד העורף, משרד הביטחון או גוף ממשלתי.
            </strong>
          </div>
          <p style={{ fontSize: 13, color: C.faint }}>
            קשר: kamanishar.info@gmail.com
          </p>
        </Modal>
      )}

      {showUp && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", bottom: 74, right: 16, zIndex: 150,
            width: 40, height: 40, borderRadius: "50%",
            background: C.cardSolid, border: "1px solid " + C.border,
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
          <UpIcon size={18} color={C.teal} />
        </button>
      )}

      <div style={{
        maxWidth: 900, margin: "0 auto",
        padding: "0 16px", paddingBottom: 82
      }}>
        <header style={{
          textAlign: "center", padding: "60px 0 8px",
          position: "relative", maxWidth: 500, margin: "0 auto"
        }}>
          <button onClick={() => setModal("about")} style={{
            position: "absolute", top: 18, left: 6,
            background: C.card, backdropFilter: "blur(12px)",
            border: "1px solid " + C.border, cursor: "pointer",
            padding: "6px 12px", borderRadius: 8,
            display: "flex", alignItems: "center",
            gap: 4, minHeight: 36
          }}>
            <InfoIcon size={16} color={C.muted} />
            <span style={{
              fontSize: 12, color: C.muted, fontWeight: 600
            }}>אודות</span>
          </button>

          <div style={{
            position: "absolute", top: 18, right: 6,
            display: "inline-flex", alignItems: "center", gap: 5,
            background: C.card, backdropFilter: "blur(12px)",
            borderRadius: 8, padding: "6px 12px",
            fontSize: 12, color: C.sub, fontWeight: 600,
            border: "1px solid " + C.border, minHeight: 36
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#EF4444",
              animation: "pulse 1.5s infinite",
              display: "inline-block"
            }} />
            שאגת הארי · {todayDate}
          </div>

          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 10, marginTop: 4
          }}>
            <HourglassLogo size={40} />
            <h1 style={{
              fontSize: 40, fontWeight: 900,
              color: C.text, lineHeight: 1.1
            }}>כמה נשאר?</h1>
          </div>

          <div style={{
            fontSize: 14, color: C.muted,
            marginTop: 5, fontWeight: 500
          }}>מעקב אחר יכולות השיגור של איראן</div>
        </header>

        <div className="kn-grid" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="kn-full">
            <OsintNetwork />
          </div>

          <GlassCard style={{
            padding: "22px 18px 18px", textAlign: "center",
            animation: "countGlow 4s ease infinite"
          }} className="kn-days-card">
            <div style={{
              fontSize: 15, color: C.sub,
              marginBottom: 10, fontWeight: 600
            }}>הערכה לסיום יכולות השיגור של איראן</div>
            <div style={{
              display: "flex", alignItems: "baseline",
              justifyContent: "center", gap: 8
            }}>
              <span style={{
                fontSize: 68, fontWeight: 900, color: C.teal,
                fontFamily: "'Courier Prime',monospace", lineHeight: 1
              }}>{daysLeft}</span>
              <span style={{
                fontSize: 24, color: C.faint, fontWeight: 600
              }}>ימים</span>
            </div>
            <SubCounter />
            <div style={{
              fontSize: 12, color: C.muted, marginTop: 10
            }}>על בסיס הצלבת מקורות מודיעין גלויים</div>
          </GlassCard>

          <GlassCard style={{ padding: "20px 16px" }}
            className="kn-arsenal-card">
            <ArsenalBar emoji="🚀" label="טילים בליסטיים"
              remaining={data.missiles_remaining} total={2500}
              goneLabel="שוגרו / נוטרלו"
              goneColor={C.emerald} remainColor="#F59E0B" />
            <ArsenalBar emoji="🚛" label="משגרים ניידים"
              remaining={data.launchers_remaining} total={470}
              goneLabel="נוטרלו"
              goneColor={C.emerald} remainColor="#F59E0B" />
          </GlassCard>

          <GlassCard style={{ padding: "16px 14px" }} className="kn-full">
            <div style={{
              fontSize: 15, fontWeight: 700, color: C.text,
              marginBottom: 10, textAlign: "center"
            }}>מאמרים ומידע נוסף</div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6, marginBottom: 8
            }}>
              {AL.slice(0, 3).map(([k, l]) => (
                <Link key={k} to={"/article/" + k} style={{
                  fontSize: 13, color: "#fff",
                  background: "linear-gradient(135deg," + C.tealDark + "," + C.teal + ")",
                  padding: "11px 4px", borderRadius: 8,
                  textDecoration: "none", textAlign: "center",
                  fontWeight: 600
                }}>{l}</Link>
              ))}
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6
            }}>
              {AL.slice(3).map(([k, l]) => (
                <Link key={k} to={"/article/" + k} style={{
                  fontSize: 11, color: C.sub,
                  background: "rgba(148,163,184,0.06)",
                  padding: "9px 4px", borderRadius: 6,
                  border: "1px solid rgba(148,163,184,0.15)",
                  textDecoration: "none", textAlign: "center",
                  fontWeight: 500
                }}>{l}</Link>
              ))}
            </div>
          </GlassCard>

          <div className="kn-full" style={{
            textAlign: "center", fontSize: 12, color: C.faint,
            lineHeight: 1.8, paddingBottom: 10
          }}>
            הנתונים מבוססים על פרסומים שעברו צנזורה צבאית בלבד
            <br />
            אין להסתמך כמידע מבצעי רשמי · יש להישמע להנחיות פיקוד העורף
            <br />
            <span style={{
              display: "inline-flex", gap: 6,
              marginTop: 4, alignItems: "center"
            }}>
              <Link to="/article/terms" style={{
                color: C.muted, fontSize: 12,
                textDecoration: "underline", padding: "8px 2px"
              }}>תנאי שימוש</Link>
              <span style={{ color: C.vfaint }}>·</span>
              <Link to="/article/privacy" style={{
                color: C.muted, fontSize: 12,
                textDecoration: "underline", padding: "8px 2px"
              }}>מדיניות פרטיות</Link>
            </span>
            <br />
            <span style={{ color: C.vfaint, fontSize: 11 }}>
              כמה נשאר? v4.5
            </span>
          </div>
        </div>
      </div>

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "linear-gradient(180deg,transparent," + C.bg + " 40%)",
        padding: "16px 0 0"
      }}>
        <div style={{
          width: 320, height: 50, margin: "0 auto 8px",
          background: C.cardSolid, borderRadius: 8,
          display: "flex", alignItems: "center",
          justifyContent: "center",
          border: "1px solid " + C.border
        }}>
          <span style={{ color: C.vfaint, fontSize: 10 }}>320 × 50</span>
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

var CSS_TEXT = [
  "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}",
  "@keyframes countGlow{0%,100%{box-shadow:0 0 30px rgba(45,212,191,0.04)}",
  "50%{box-shadow:0 0 50px rgba(45,212,191,0.1)}}",
  "*{box-sizing:border-box;margin:0;padding:0}",
  "body{background:#0F172A;font-family:'Heebo','Segoe UI',Arial,sans-serif}",
  "@media(min-width:768px){",
  ".kn-grid{display:grid!important;grid-template-columns:1fr 1fr!important;",
  "gap:20px!important;align-items:stretch!important}",
  ".kn-full{grid-column:1/-1!important}",
  ".kn-days-card{display:flex!important;flex-direction:column!important;",
  "justify-content:center!important;align-items:center!important}",
  ".kn-arsenal-card{display:flex!important;flex-direction:column!important;",
  "justify-content:center!important}",
  "}"
].join("");

export default function App() {
  return (
    <>
      <style>{CSS_TEXT}</style>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </>
  );
}
