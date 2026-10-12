// Fasce di aggiornamento del Flusso Notizie (ora di Roma). Le usano il workflow
// di GitHub Pages (scripts/news-due.mjs) e la pagina (scripts/build-ui.mjs).
export const SCHEDULE = {
  timeZone: 'Europe/Rome',
  days: [1, 2, 3, 4, 5], // lunedì-venerdì
  slots: ['08:00', '10:00', '12:00', '15:00', '17:00'],
};

const WD = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: SCHEDULE.timeZone, hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit',
});

function wall(date) {
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, wd: WD[p.weekday], h: +p.hour, min: +p.minute };
}

// Istante UTC di un orario "da parete" a Roma (gestisce l'ora legale).
function romeToDate(y, m, d, h, min) {
  const guess = Date.UTC(y, m - 1, d, h, min);
  const w = wall(new Date(guess));
  const offset = Date.UTC(w.y, w.m - 1, w.d, w.h, w.min) - guess;
  return new Date(guess - offset);
}

// L'ultima fascia iniziata entro `now` (anticipata di `leadMin` minuti).
export function lastSlot(now = new Date(), leadMin = 0) {
  const ref = new Date(now.getTime() + leadMin * 60000);
  const today = wall(ref);
  const slots = SCHEDULE.slots.map((t) => t.split(':').map(Number)).sort((a, b) => a[0] * 60 + a[1] - (b[0] * 60 + b[1]));
  for (let k = 0; k <= 7; k++) {
    const day = new Date(Date.UTC(today.y, today.m - 1, today.d - k));
    const wd = ((day.getUTCDay() + 6) % 7) + 1;
    if (!SCHEDULE.days.includes(wd)) continue;
    for (let i = slots.length - 1; i >= 0; i--) {
      const at = romeToDate(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), slots[i][0], slots[i][1]);
      if (at <= ref) return at;
    }
  }
  return null;
}
