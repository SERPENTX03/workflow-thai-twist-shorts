// เที่ยวสุดท้าย หนึ่งล้านบาท (the last ride) — scene helpers for the landscape film. Load it in a scene after the
// stylesheets, before the scene's own script:
//   <script src="assets/kit/stories/last-ride.js"></script>
// What it does:
//   LR.shots(id, fb)     the scene's shots from the "shots" variable build.mjs passes ({at, dur, view, who, vo})
//   LR.run({...})        one instance per shot (its own DOM, so no two tweens fight over one element when seeking),
//                        shown at its start and hidden at its end; view "name/act" picks views[name] and passes act
//   LR.fig / LR.who      a cast member placed by feet + height, with face, talk mouth, pose arms and grip props
//   LR.talk              mouth flaps on the measured voice window (the shot's `vo`), closed at the end
//   LR.phone / LR.ledger the HTML phone and handover book (text stays editable)
// Deterministic: no clocks, no random. All times are local to the scene clip.
// GSAP x/y/rotation on an SVG element replaces its transform attribute: keep a static transform on an inner <g>
// and tween an outer one.
(function () {
  if (window.LR) return;
  const r = (n) => Math.round(n * 10) / 10;
  const A = 'width="200" height="520"';

  // ---------- shots + runner ----------
  // per-instance values: the runtime's table for this composition id, else the host's data-variable-values attribute
  function shots(compId, fallback) {
    const tries = [
      () => window.__hfVariablesByComp && window.__hfVariablesByComp[compId],
      () => JSON.parse(document.querySelector(`[data-composition-id="${compId}"][data-variable-values]`).getAttribute('data-variable-values')),
    ];
    for (const get of tries) {
      try { const a = JSON.parse((get() || {}).shots || '[]'); if (Array.isArray(a) && a.length) return a; } catch (e) { /* next */ }
    }
    return fallback;
  }
  // the innermost element carrying this composition id is the scene root (the host in index.html carries it too)
  function root(compId) {
    const all = document.querySelectorAll(`[data-composition-id="${compId}"]`);
    return all[all.length - 1];
  }
  function run(o) {
    const host = root(o.comp);
    const list = o.shots;
    list.forEach((s, k) => {
      const [name, act = ''] = String(s.view || '').split('/');
      const view = o.views[name] || o.views._;
      const id = `${o.prefix}${k}`;
      const c = {
        k, id, act, name, who: s.who || '', at: s.at, dur: s.dur, end: r(s.at + s.dur), tl: o.tl,
        vo: s.vo ? [r(s.vo[0]), r(s.vo[1])] : null,
        prev: list[k - 1] ? String(list[k - 1].view) : '', next: list[k + 1] ? String(list[k + 1].view) : '',
        q: (sel) => (sel ? `#${id} ${sel}` : `#${id}`),
        t: (sec) => r(s.at + sec),             // seconds into the shot -> scene time
        p: (f) => r(s.at + f * s.dur),         // fraction of the shot -> scene time
      };
      // the voice line, local to the shot ([from, to] seconds after the cut), when there is one
      c.line = c.vo ? [r(c.vo[0] - s.at), r(c.vo[1] - s.at)] : null;
      host.insertAdjacentHTML('beforeend', `<div class="lr-shot" id="${id}"><div class="lr-cam">${view.html(c)}</div><div class="lr-fade"></div></div>`);
      o.tl.set(`#${id}`, { opacity: 1 }, s.at);
      if (k < list.length - 1) o.tl.set(`#${id}`, { opacity: 0 }, r(s.at + s.dur));
      if (view.anim) view.anim(c);
      if (c.vo && c.who) {
        const m = document.getElementById(`${id}-${c.who}-m`);
        if (m) talk(o.tl, m, c.vo[0], c.vo[1]);
      }
    });
  }
  // camera on the shot: a slow push (default) or any from/to of scale, x, y
  const clamp = (v) => { const s = v.scale ?? 1, mx = Math.max(0, (s - 1) * 960), my = Math.max(0, (s - 1) * 540);
    return { ...v, ...(v.x !== undefined ? { x: Math.max(-mx, Math.min(mx, v.x)) } : {}), ...(v.y !== undefined ? { y: Math.max(-my, Math.min(my, v.y)) } : {}) }; };
  function cam(c, from = { scale: 1 }, to = { scale: 1.04 }, ease = 'sine.inOut', at = 0, dur) {
    c.tl.fromTo(c.q('.lr-cam'), clamp(from), { ...clamp(to), duration: dur || c.dur - at, ease }, c.t(at));
  }
  function fadeIn(c, d = 0.6) { c.tl.fromTo(c.q('.lr-fade'), { opacity: 1 }, { opacity: 0, duration: d, ease: 'none' }, c.at); }
  function fadeOut(c, d = 0.8) { c.tl.fromTo(c.q('.lr-fade'), { opacity: 0 }, { opacity: 1, duration: d, ease: 'none' }, r(c.end - d)); }

  // ---------- talk mouths ----------
  const SHAPES = ['#talk-a', '#talk-m', '#talk-e', '#talk-o', '#talk-m', '#talk-a', '#talk-e', '#talk-m'];
  function talk(tl, el, from, to) {
    let i = 0;
    for (let t = from; t < to - 0.06; t = r(t + 0.12)) tl.set(el, { attr: { href: SHAPES[i++ % SHAPES.length] } }, t);
    tl.set(el, { attr: { href: '#talk-m' } }, r(to));
  }

  // ---------- figures ----------
  // x = centre, feet = ground y, h = drawn height in px (cm x 2.6 x k). frame 520 adults, 420 kids.
  function fig(o) {
    const frame = o.frame || 520, h = o.h, w = (h * 200) / frame;
    const style = `left:${r(o.x - w / 2)}px;top:${r(o.feet - h)}px;width:${r(w)}px;height:${r(h)}px;${o.style || ''}`;
    return `<svg${o.id ? ` id="${o.id}"` : ''} class="who ${o.cls || ''}" style="${style}" viewBox="0 0 200 ${frame}" overflow="visible">${o.body}</svg>`;
  }
  // hand anchors of the pose arms (hands-poses.md)
  const POSE = {
    hold: { r: [112, 244], l: [88, 244] }, chest: { r: [116, 196], l: [84, 196] }, offer: { r: [214, 222], l: [-14, 222] },
    raise: { r: [190, 110], l: [10, 110] }, reach: { r: [226, 176], l: [-26, 176] }, carry: { r: [150, 262], l: [50, 262] },
    pocket: { r: null, l: null },
  };
  const PROP = { phone: 'lr-phone-hand', key: 'lr-key', shoe: 'lr-shoe-hand', torch: 'prop-flashlight', book: 'lr-book-hand' };
  // per character: symbol, sleeve class, frame, face offset (faces/talk/marks), pose-arm offset
  const CAST = {
    ek: { sym: 'lr-ek', cls: 'c-lr-ek', fy: 0, ay: 0 },
    chan: { sym: 'lr-chan', cls: 'c-lr-chan', fy: 13, ay: 0 },
    mom: { sym: 'lr-mom', cls: 'c-lr-mom', fy: 4, ay: 0 },
    girl: { sym: 'lr-girl', cls: 'c-lr-girl', fy: 0, ay: 0, frame: 420 },
    son: { sym: 'lr-son', cls: 'c-lr-son', fy: 0, ay: 0, frame: 420 },
    wife: { sym: 'lr-wife-sit', cls: 'c-lr-wife', fy: 104, ay: 100 },
    man: { sym: 'man', cls: 'c-man', fy: 0, ay: 0 },
    student: { sym: 'student', cls: 'c-student', fy: 0, ay: 0 },
  };
  // o: { x, feet, h, face, talk, r, l, rProp, lProp, nocap, cls, under, over, id, mouthId }
  // face = one of the shared face-* names; talk = draw a talk mouth (id `${id}-m`) instead of the resting one.
  // Ek's watch is on his screen-right wrist: it moves with a posed r arm (lr-watch-wrist at the hand), unless watch:false.
  function who(name, o) {
    const C = CAST[name];
    const cls = [C.cls, o.cls || ''];
    let body = `<use href="#${C.sym}" width="200" height="${C.frame || 520}"/>` + (o.under || '');
    if (o.face) {
      cls.push('face-off');
      if (name === 'ek') cls.push('lr-no-cap');
      body += `<use href="#face-${o.face}" ${A} transform="translate(0 ${C.fy})"/>`;
      if (name === 'ek' && !o.nocap) body += `<use href="#lr-ek-cap" ${A}/>`;
    } else if (o.nocap && name === 'ek') cls.push('lr-no-cap');
    if (o.talk && !o.face) {
      cls.push('mouth-off');
      body += `<use${o.id ? ` id="${o.id}-m"` : ''} href="#talk-m" ${A} transform="translate(0 ${C.fy})"/>`;
    }
    for (const side of ['r', 'l']) {
      const pose = o[side];
      if (!pose) continue;
      cls.push(`arm-${side}-off`);
      const at = POSE[pose] && POSE[pose][side];
      let arm = `<use href="#arm-${side}-${pose}" ${A}/>`;
      const prop = o[side + 'Prop'];
      if (prop && at) arm += `<use href="#${PROP[prop] || prop}" transform="translate(${at[0]} ${at[1]})${o[side + 'PropT'] || ''}"/>`;
      if (name === 'ek' && side === 'r' && at && o.watch !== false && pose !== 'carry') arm += `<use href="#lr-watch-wrist" transform="translate(${at[0]} ${at[1]})"/>`;
      body += C.ay ? `<g transform="translate(0 ${C.ay})">${arm}</g>` : arm;
    }
    if (o.carry) body += o.carry;
    body += o.over || '';
    return fig({ id: o.id, x: o.x, feet: o.feet, h: o.h, frame: C.frame, cls: cls.join(' '), body, style: o.style });
  }
  // an svg layer in the 1920 x 1080 frame (sets, trucks, props)
  const layer = (inner, o = {}) => `<svg${o.id ? ` id="${o.id}"` : ''} class="lr-layer ${o.cls || ''}" viewBox="${o.vb || '0 0 1920 1080'}" style="${o.style || ''}" overflow="visible">${inner}</svg>`;
  // the side-view truck at (x, groundY) with scale k; cls: lr-lights-on lr-no-box lr-damaged lr-own lr-cream-box
  function truck(x, ground, k, o = {}) {
    const w = 1300 * k, h = 620 * k;
    const inner = o.parts
      ? o.parts
      : `<use href="#lr-truck-shadow-side" width="1300" height="620"/><g class="lr-body">${o.box === false ? '' : '<use href="#lr-truck-side-box" width="1300" height="620"/>'}<use href="#lr-truck-side-body" width="1300" height="620"/>${o.own ? '<use href="#lr-own-marks" width="1300" height="620"/>' : ''}${o.lights ? '<use href="#lr-truck-beam-side" width="1300" height="620"/>' : ''}${o.damage ? '<use href="#lr-truck-damage-side" width="1300" height="620"/>' : ''}${o.extra || ''}</g><g class="lr-wheel-a" transform="translate(330 520)"><use href="#lr-g-wheel"/></g><g class="lr-wheel-b" transform="translate(1030 520)"><use href="#lr-g-wheel"/></g>`;
    return `<svg${o.id ? ` id="${o.id}"` : ''} class="lr-truck ${o.cls || ''}" viewBox="0 0 1300 620" overflow="visible" style="left:${r(x)}px;top:${r(ground - 600 * k)}px;width:${r(w)}px;height:${r(h)}px;${o.style || ''}">${inner}</svg>`;
  }
  // rear of the box truck, centre x, ground y, scale k; cls: lr-doors-open lr-prints
  function rear(x, ground, k, o = {}) {
    const w = 600 * k, h = 640 * k;
    return `<svg${o.id ? ` id="${o.id}"` : ''} class="lr-truck lr-cream-box ${o.cls || ''}" viewBox="-40 0 600 640" overflow="visible" style="left:${r(x - w / 2)}px;top:${r(ground - 632 * k)}px;width:${r(w)}px;height:${r(h)}px;${o.style || ''}"><use href="#lr-truck-rear" x="-40" width="600" height="640"/>${o.inner || ''}</svg>`;
  }

  // ---------- phone (HTML close-up, 420 x 860) ----------
  const handset = '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" fill="#fff"/></svg>';
  // screens: call-chan | dial-wife | slip | chat-wife | chat-chan | deposit ; o.time (status bar), o.state (chat: 'read'|'sent'|'pending')
  function phone(screen, o = {}) {
    const time = o.time || '23:12';
    let s = '';
    if (screen === 'call-chan') s = `<div class="lr-screen lr-on lr-screen--call-chan"><div class="lr-call-sub">สายเรียกเข้า…</div><div class="lr-call-avatar">ช</div><div class="lr-call-name">ลุงชาญ</div><div class="lr-call-buttons"><div class="lr-call-btn"><b>${handset}</b>ปฏิเสธ</div><div class="lr-call-btn is-accept"><b>${handset}</b>รับสาย</div></div></div>`;
    else if (screen === 'on-call') s = `<div class="lr-screen lr-on lr-screen--call-chan"><div class="lr-call-sub">กำลังสนทนา · ลำโพง</div><div class="lr-call-avatar">ช</div><div class="lr-call-name">ลุงชาญ</div><div class="lr-call-time">${o.timer || '01:12'}</div><div class="lr-call-buttons"><div class="lr-call-btn"><b>${handset}</b>วางสาย</div></div></div>`;
    else if (screen === 'dial-wife') s = `<div class="lr-screen lr-on lr-screen--call-wife"><div class="lr-call-sub lr-dial-a">กำลังโทร…</div><div class="lr-call-sub lr-dial-b">ไม่มีผู้รับสาย</div><div class="lr-call-avatar">ภ</div><div class="lr-call-name">ภรรยา</div><div class="lr-call-buttons"><div class="lr-call-btn"><b>${handset}</b>วางสาย</div></div></div>`;
    else if (screen === 'slip') s = `<div class="lr-screen lr-on lr-screen--slip"><div class="lr-slip-ok">✓</div><div class="lr-slip-title">โอนเงินสำเร็จ</div><div class="lr-slip-amount">500,000.00</div><div class="lr-slip-unit">บาท</div><div class="lr-slip-row"><span>จาก</span><b>ชาญ ส.</b></div><div class="lr-slip-row lr-slip-to"><span>ผู้รับเงินแทน</span><b>ภรรยา (บัญชีของเอก)</b></div><div class="lr-slip-row"><span>${o.when || 'วันนี้ 23:12 น.'}</span></div></div>`;
    else if (screen === 'deposit') s = `<div class="lr-screen lr-on lr-screen--deposit"><div class="lr-bank-app">แจ้งเตือนบัญชี</div><div class="lr-bank-icon">฿</div><div class="lr-bank-label">เงินเข้า</div><div class="lr-bank-amount">+500,000.00</div><div class="lr-bank-unit">บาท</div><div class="lr-bank-from">จาก ชาญ ส.</div><div class="lr-bank-time">วันนี้ 23:12 น.</div></div>`;
    else if (screen === 'chat-wife') s = `<div class="lr-screen lr-on lr-screen--chat"><div class="lr-chat-head"><i>ภ</i>ภรรยา</div>
        <div class="lr-msg lr-in lr-photo"><div class="lr-bill"><b>ใบแจ้งหนี้</b><span>ค้างชำระ</span><em>12,480.-</em></div><div class="lr-book-kid">การบ้าน<br/>ป.2</div></div>
        <div class="lr-msg lr-in lr-text">ไม่ต้องรีบขับนะ กลับมากินข้าวด้วยกันก็พอ</div>
        <div class="lr-msg lr-out lr-text lr-mine">ได้เงินแล้วนะ เดี๋ยวทำงานเสร็จจะกลับ<i class="lr-tick lr-tick-pending"></i></div></div>`;
    else if (screen === 'chat-chan') s = `<div class="lr-screen lr-on lr-screen--chat"><div class="lr-chat-head"><i class="lr-chan-dot">ช</i>ลุงชาญ</div><div class="lr-msg lr-in lr-text lr-chan-msg">รับแล้ว ไปต่อได้</div></div>`;
    return `<div class="lr-phone${o.cls ? ' ' + o.cls : ''}"${o.id ? ` id="${o.id}"` : ''} style="${o.style || ''}"><div class="lr-phone-screen"><div class="lr-status"><span>${time}</span><i></i></div>${s}</div></div>`;
  }

  // ---------- the handover book (HTML spread, 1040 x 700) ----------
  // page: 'sign' (Ek's form, bottom folded), 'old' (yellowed, struck names), 'chan' (Chan's handover blank) + 'ek',
  //       'unfold' (Ek's page with the fold opened), 'next' (the next pickup), 'struck' (Chan's page, handover done)
  const sig = '<svg class="lr-sign" viewBox="0 0 300 80"><path d="M10 56 C40 10 60 70 84 40 S120 20 132 50 S170 70 196 30 S240 46 286 34"/></svg>';
  function formPage(o = {}) {
    return `<div class="lr-page lr-form"><div class="lr-page-title">ผู้รับมอบรถ (ต่อ)</div>
      <div class="lr-field"><span>ชื่อคนขับ</span><b class="lr-fill">${o.name || ''}</b></div>
      <div class="lr-field"><span>วันที่รับรถ</span><b class="lr-fill">${o.date || ''}</b></div>
      <div class="lr-field lr-payee"><span>ผู้รับเงินแทน</span><b class="lr-fill">${o.payee || ''}</b></div>
      <div class="lr-field lr-sig-row"><span>ลงชื่อ</span>${o.signed ? sig : '<b class="lr-fill"></b>'}</div>
      <div class="lr-clause"><span class="lr-clause-a">ผู้รับรถยินยอมปฏิบัติหน้าที่จนส่งมอบครบถ้วน</span></div>
      <div class="lr-clause lr-clause-tail"><span class="lr-clause-b"${o.open ? '' : ' style="opacity:0"'}>แก่ผู้รับหน้าที่รายถัดไป</span></div><div class="lr-fold"${o.open ? ' style="display:none"' : ''}><i></i></div></div>`;
  }
  function ledger(page, o = {}) {
    const rows = (list) => list.map(([n, y, p, cls]) => `<div class="lr-row ${cls || 'is-struck'}"><b>${n}</b><small>${y} · ${p}</small></div>`).join('');
    let L = '', R = '';
    if (page === 'sign' || page === 'unfold') {
      L = `<div class="lr-page"><div class="lr-page-title">ผู้รับมอบรถ · เล่มที่ 3</div>${rows([['ชาญ', '2549', 'รับเงิน: บุตรสาว', 'lr-chan-row']])}<div class="lr-row"><small>ส่งมอบ</small><b class="lr-blank">&nbsp;</b></div></div>`;
      R = formPage({ name: o.name, date: o.date, payee: o.payee, signed: o.signed, open: page === 'unfold' });
    } else if (page === 'old') {
      L = `<div class="lr-page lr-yellow"><div class="lr-page-title">ผู้รับมอบรถ · เล่มที่ 1</div>${rows([['บุญมี', '2519', 'รับเงิน: ภรรยา'], ['เสถียร', '2524', 'รับเงิน: มารดา'], ['ประยูร', '2530', 'รับเงิน: บุตร']])}</div>`;
      R = `<div class="lr-page lr-yellow lr-torn"><div class="lr-page-title">เล่มที่ 2</div>${rows([['สมศักดิ์', '2538', 'รับเงิน: ภรรยา'], ['วิชัย', '2543', 'รับเงิน: พี่สาว']])}</div>`;
    } else if (page === 'chan' || page === 'struck') {
      const done = page === 'struck';
      L = `<div class="lr-page"><div class="lr-page-title">ผู้รับมอบรถ · เล่มที่ 3</div><div class="lr-row ${done ? 'is-struck' : 'lr-chan-row'}"><b>ชาญ</b><small>2549 · รับเงิน: บุตรสาว</small></div><div class="lr-row"><small>ส่งมอบ</small><b class="${done ? 'lr-done' : 'lr-blank'}">${done ? 'เอก ✓' : '&nbsp;'}</b></div></div>`;
      R = `<div class="lr-page"><div class="lr-page-title">ผู้รับมอบรถ (ต่อ)</div><div class="lr-row is-new"><b>เอก</b><small>วันนี้ · รับเงิน: ภรรยา</small></div>${sig}<div class="lr-row"><small>ส่งมอบ</small><b class="lr-blank">&nbsp;</b></div></div>`;
    } else if (page === 'next') {
      L = `<div class="lr-page"><div class="lr-page-title">ผู้รับมอบรถ (ต่อ)</div><div class="lr-row is-new"><b>เอก</b><small>รับเงิน: ภรรยา</small></div>${sig}</div>`;
      R = `<div class="lr-page lr-next"><div class="lr-page-title">เที่ยวถัดไป</div><div class="lr-coord">พิกัด 14.2871, 100.6123</div><div class="lr-coord-sub">ศาลาริมถนน · กม. 38</div><div class="lr-note"><span>หนึ่งคน</span><span>ยังไม่ทราบว่า</span><span>ตัวเองเสียชีวิต</span></div></div>`;
    }
    return `<div class="lr-ledger is-open${o.cls ? ' ' + o.cls : ''}"${o.id ? ` id="${o.id}"` : ''} style="${o.style || ''}"><div class="lr-ledger-spread">${L}${R}</div></div>`;
  }

  // ---------- reusable views (each returns { html(c), anim(c) }; o may be an object or a function of c) ----------
  const opt = (o, c) => (typeof o === 'function' ? o(c) : o) || {};
  const V = {};
  const NIGHT = '<div class="lr-night"></div>';
  // through the windscreen: Ek driving. o: face, nocap, spirit, seat ('doll'|'phone'|'book'), drive (passing lights),
  // dash (['cap', 'doll'] on the dashboard), box (the warm box light is on), talk (default: when Ek speaks the shot), shake (t), knock (t list: thuds behind his head),
  // close (a close-up on his face instead of the windscreen two-shot)
  V.cab = (oo) => ({
    html: (c) => {
      const o = opt(oo, c);
      const talkOn = o.talk ?? (c.who === 'ek' && !o.face);
      const ekBox = 'x="170" y="203" width="300" height="780"';
      const seat = o.seat === 'doll' ? '<g transform="translate(770 640) rotate(-8) scale(1.25)"><use href="#lr-doll"/></g>'
        : o.seat === 'phone' ? `<g transform="translate(760 700) rotate(-70)"><rect x="-40" y="-80" width="80" height="160" rx="14" fill="#1d2433"/><rect x="-32" y="-70" width="64" height="134" rx="8" fill="#8fb8e8" class="lr-seat-glow"/></g>`
          : o.seat === 'book' ? '<g transform="translate(760 700) rotate(-12)"><rect x="-90" y="-60" width="180" height="120" rx="8" fill="#6b4f36"/><rect x="-60" y="-34" width="120" height="34" fill="#e8dcc3"/></g>' : '';
      // o.dash: things on the dashboard (his cap after he took it off at home; the doll leaning on the glass)
      const dash = (o.dash || []).map((d) => d === 'cap' ? '<g class="lr-dash-cap" transform="translate(560 640) rotate(-6) scale(.7)"><use href="#lr-ek-cap" width="200" height="520"/></g>'
        : d === 'doll' ? '<g class="lr-dash-doll" transform="translate(840 640) rotate(4) scale(1.1)"><use href="#lr-doll"/></g>' : '').join('');
      const cls = ['lr-layer', 'c-lr-ek', 'lr-cream-box', o.spirit ? 'lr-spirit' : '', o.face ? 'face-off lr-no-cap' : '', o.nocap ? 'lr-no-cap' : '', talkOn ? 'mouth-off' : ''].join(' ');
      return layer('<use href="#lr-l-cab-out" width="1920" height="1080"/>')
        + `<svg class="${cls}" viewBox="0 0 1920 1080"><g transform="translate(352 0) scale(1.125)">
          <use href="#lr-cab-back" width="1080" height="960"/>
          <rect x="230" y="70" width="620" height="210" rx="26" fill="var(--lamp, #ffcf8a)" class="lr-boxlight" opacity="${o.box ? 0.35 : 0}"/>
          ${seat}
          <g id="${c.id}-ek"><use href="#lr-ek-drive" ${ekBox}/>${o.face ? `<use href="#face-${o.face}" ${ekBox}/>` : ''}${o.face && !o.nocap ? `<use href="#lr-ek-cap" ${ekBox}/>` : ''}${talkOn ? `<use id="${c.id}-ek-m" href="#talk-m" ${ekBox}/>` : ''}</g>
          <use href="#lr-cab-dash" width="1080" height="960"/>${dash}<use href="#lr-cab-wheel" width="1080" height="960"/>
          <g id="${c.id}-hands"><use href="#lr-ek-drive-hands" ${ekBox}/></g>
          <g class="lr-streaks" opacity="${o.drive ? 1 : 0}"><rect id="${c.id}-streak" x="240" y="90" width="90" height="170" rx="20" fill="rgba(255,236,190,.12)"/></g>
          <use href="#lr-cab-frame" width="1080" height="960"/></g></svg>`
        + (o.extra || '') + `<div class="lr-night" style="background:rgba(6,10,26,${o.dark ?? 0.25})"></div>`;
    },
    anim: (c) => {
      const o = opt(oo, c);
      if (o.drive) {
        c.tl.fromTo(`#${c.id}-streak`, { x: 640 }, { x: -120, duration: 1.4, repeat: Math.ceil(c.dur / 1.4), ease: 'none' }, c.at);
        c.tl.fromTo(`#${c.id}-ek`, { y: 0 }, { y: 3, duration: 0.4, yoyo: true, repeat: Math.ceil(c.dur / 0.4), ease: 'sine.inOut' }, c.at);
      }
      (o.knock || []).forEach((t) => c.tl.fromTo(c.q('.lr-cam'), { x: 0 }, { x: 6, duration: 0.04, yoyo: true, repeat: 3, ease: 'none' }, c.t(t)));
      if (o.shake !== undefined) c.tl.fromTo(c.q('.lr-cam'), { x: 0 }, { x: 12, duration: 0.05, yoyo: true, repeat: 7, ease: 'none' }, c.t(o.shake));
      // close: his face fills the frame (head at about 712,355 in the 1920 frame)
      if (o.close) cam(c, { scale: 1.55, x: 384, y: 287 }, { scale: 1.62, x: 401, y: 300 });
      else if (o.cam !== false) cam(c, { scale: 1, y: 0 }, { scale: o.push || 1.05, y: o.pushY || 0 });
      if (o.anim) o.anim(c);
    },
  });
  // phone close-up in Ek's hand. o: screen, time, cls, buzz (vibrate), msg (the newest bubble slides in at t),
  // zoom0/zoom1 + pan0Y/panY (keep what matters above the subtitle band)
  V.phone = (oo) => ({
    html: (c) => {
      const o = opt(oo, c);
      return layer(`<rect width="1920" height="1080" fill="${o.bg || '#0b0f16'}"/>`)
        + `<div class="lr-phone-wrap" id="${c.id}-ph" style="position:absolute;left:750px;top:${o.top ?? 60}px;width:420px;height:860px">${phone(o.screen, { time: o.time, cls: o.cls, when: o.when, style: 'left:0;top:0' })}</div>`
        + `<svg class="lr-layer ${o.handCls || 'c-lr-ek'}" viewBox="0 0 1920 1080"><g transform="translate(960 1030)"><use href="#lr-arm-big"/></g></svg>` + (o.extra || '');
    },
    anim: (c) => {
      const o = opt(oo, c);
      if (o.buzz) c.tl.fromTo(`#${c.id}-ph`, { x: 0 }, { x: 6, duration: 0.05, yoyo: true, repeat: Math.max(1, Math.floor(c.dur / 0.1) - 1), ease: 'none' }, c.at);
      if (o.msg !== undefined) c.tl.fromTo(c.q(o.msgSel || '.lr-mine'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, c.t(o.msg));
      if (o.unanswered !== undefined) { c.tl.set(c.q('.lr-dial-a'), { display: 'none' }, c.t(o.unanswered)); c.tl.set(c.q('.lr-dial-b'), { display: 'block' }, c.t(o.unanswered)); }
      cam(c, { scale: o.zoom0 || 1, y: o.pan0Y || 0 }, { scale: o.zoom1 || 1.05, y: o.panY || 0 });
      if (o.anim) o.anim(c);
    },
  });
  // the handover book, open on a surface. o: page, bg ('hood'|'lap'|'dark'), name/date/payee/signed, sign (draw the
  // signature at t), unfold (lift the fold at t), strike (strike Chan at t), point (a finger points at the clause at t)
  V.ledger = (oo) => ({
    html: (c) => {
      const o = opt(oo, c);
      const bg = o.bg === 'hood' ? '<rect width="1920" height="1080" fill="#d6c9ac"/><rect width="1920" height="1080" fill="url(#lr-shutter-fade)"/><ellipse cx="960" cy="420" rx="900" ry="420" fill="#ffcf8a" opacity=".12"/>'
        : o.bg === 'lap' ? '<rect width="1920" height="1080" fill="#2a2f38"/><rect y="760" width="1920" height="320" fill="#3d434c"/>' : '<rect width="1920" height="1080" fill="#14110d"/>';
      return layer(bg) + `<div id="${c.id}-book" style="position:absolute;left:${o.x ?? 362}px;top:${o.y ?? 42}px;width:1040px;height:700px;transform-origin:0 0;scale:${o.k ?? 1.15}">${ledger(o.page, { name: o.name, date: o.date, payee: o.payee, signed: o.signed, style: 'left:0;top:0' })}</div>`
        + (o.point !== undefined ? `<svg class="lr-layer ${o.handCls || 'c-lr-chan'}" viewBox="0 0 1920 1080"><g id="${c.id}-finger"><g transform="translate(${o.px ?? 1500} ${o.py ?? 640}) rotate(-40) scale(.55)"><use href="#lr-arm-big"/></g></g></svg>` : '')
        + (o.dim ? `<div class="lr-night" style="background:rgba(6,10,26,${o.dim})"></div>` : '');
    },
    anim: (c) => {
      const o = opt(oo, c);
      if (o.point !== undefined) c.tl.fromTo(`#${c.id}-finger`, { x: 400, y: 300 }, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' }, c.t(o.point));
      if (o.sign !== undefined) c.tl.fromTo(c.q('.lr-form .lr-sign path'), { strokeDasharray: 520, strokeDashoffset: 520 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, c.t(o.sign));
      if (o.unfold !== undefined) {
        c.tl.fromTo(c.q('.lr-fold'), { yPercent: 0, opacity: 1 }, { yPercent: 105, opacity: 0, duration: 0.8, ease: 'power2.inOut' }, c.t(o.unfold));
        c.tl.fromTo(c.q('.lr-clause-b'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, c.t(o.unfold + 0.5));
      }
      if (o.strike !== undefined) c.tl.fromTo(c.q(o.strikeSel || '.lr-row.is-struck b'), { textDecorationColor: 'rgba(138,42,34,0)' }, { textDecorationColor: 'rgba(138,42,34,1)', duration: 0.5, stagger: 0.25 }, c.t(o.strike));
      if (o.glow) c.tl.fromTo(c.q(o.glow), { backgroundColor: 'rgba(246,196,69,0)' }, { backgroundColor: 'rgba(246,196,69,.45)', duration: 0.6, ease: 'sine.out' }, c.t(o.glowAt || 0.4));
      cam(c, { scale: o.zoom0 || 1, x: o.pan0X || 0, y: o.pan0Y || 0 }, { scale: o.zoom1 || 1.06, x: o.panX || 0, y: o.panY || 0 });
      if (o.anim) o.anim(c);
    },
  });
  // the side mirror: what is behind the truck. o: show ('two' mother + girl | 'empty' | 'hug' a faint mother holding
  // the girl behind the box door), wet, drive
  V.mirror = (oo) => ({
    html: (c) => {
      const o = opt(oo, c);
      const people = o.show === 'two' ? who('mom', { x: 990, feet: 900, h: 470, cls: 'lr-rim' }) + who('girl', { x: 1150, feet: 900, h: 330, r: 'hold', rProp: 'lr-doll', rPropT: ' scale(.74)', cls: 'lr-rim', over: '<use href="#lr-hand-cover" transform="translate(112 244)"/>' })
        : o.show === 'hug' ? `<svg class="who lr-wet" style="left:880px;top:420px;width:320px;height:475px;opacity:.6" viewBox="0 0 350 520" overflow="visible"><use href="#lr-mom-girl" width="350" height="520"/></svg>` : '';
      return layer('<rect width="1920" height="1080" fill="#0a0e15"/><path d="M0 0 H1920 V1080 H0Z" fill="#1b212b"/><rect x="0" y="0" width="420" height="1080" fill="#d6c9ac" opacity=".9"/><rect x="380" y="0" width="40" height="1080" fill="rgba(0,0,0,.3)"/>')
        + `<div class="lr-mirror" style="position:absolute;left:560px;top:120px;width:880px;height:640px;border-radius:120px;overflow:hidden;border:26px solid #4a505a;box-sizing:border-box;background:#0d1320;box-shadow:0 0 0 6px #23272e, 0 30px 60px rgba(0,0,0,.6)">
            <div style="position:absolute;left:-560px;top:-120px;width:1920px;height:1080px">${layer('<use href="#lr-l-road-back" width="1920" height="1080"/>', { style: 'opacity:.85' })}
              <svg class="lr-layer lr-cream-box" viewBox="0 0 1920 1080"><path d="M560 120 L780 260 L780 900 L560 1080Z" fill="var(--lr-box)"/><path d="M780 260 V900" stroke="rgba(0,0,0,.3)" stroke-width="8"/></svg>
              <div id="${c.id}-ppl">${people}</div><div class="lr-night" style="background:rgba(6,10,26,.18)"></div></div>
            <div style="position:absolute;inset:0;background:linear-gradient(120deg, rgba(255,255,255,.12), rgba(255,255,255,0) 40%)"></div></div>`;
    },
    anim: (c) => {
      const o = opt(oo, c);
      if (o.show === 'two' && o.appear !== undefined) c.tl.fromTo(`#${c.id}-ppl`, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, c.t(o.appear));
      cam(c, { scale: 1 }, { scale: o.push || 1.06 });
    },
  });
  // side view of the road with the box truck. o: x (truck left), k, arrive (drive in from the left), drive (keeps
  // moving), leave (drives off right), lights, hazard, dip (t: the back sinks as someone boards), stop ('sala'|'shop'|
  // 'bridge'), stopX, people (html), fg (html after the truck), truckCls, own (Ek's pickup), fog
  V.road = (oo) => ({
    html: (c) => {
      const o = opt(oo, c);
      const k = o.k || 0.62, ground = o.ground || 840;
      const stop = o.stop === 'sala' ? `<use href="#lr-road-sala" x="${o.stopX ?? 1180}" y="${ground - 330}" width="380" height="330"/><use href="#lr-garland" x="${(o.stopX ?? 1180) + 64}" y="${ground - 196}" width="34" height="100"/>`
        : o.stop === 'shop' ? `<use href="#lr-road-shop" x="${o.stopX ?? 1160}" y="${ground - 400}" width="436" height="400"/>`
          : o.stop === 'bridge' ? `<use href="#lr-road-bridge" x="${o.stopX ?? 700}" y="${ground - 300}" width="1300" height="361"/>` : '';
      const tcls = [o.truckCls || 'lr-cream-box', o.lights ? 'lr-lights-on' : ''].join(' ');
      return layer('<use href="#lr-l-road-sky" width="1920" height="1080"/><use href="#lr-l-road-ground" y="600" width="1920" height="480"/>' + stop + `<g id="${c.id}-dash"><use href="#lr-l-road-dash" x="-120" y="752" width="2160" height="12"/></g>`)
        + `<div id="${c.id}-tr" style="position:absolute;inset:0">${truck(o.x ?? 420, ground, k, { id: `${c.id}-truck`, cls: tcls, lights: o.lights, box: o.box, own: o.own, damage: o.damage })}`
        + (o.hazard ? `<div class="lr-haz" style="position:absolute;left:${(o.x ?? 420) + 8}px;top:${ground - 250 * k}px;width:26px;height:26px;border-radius:50%;background:#ffb547;box-shadow:0 0 30px 10px rgba(255,181,71,.6)"></div><div class="lr-haz" style="position:absolute;left:${(o.x ?? 420) + 1270 * k}px;top:${ground - 230 * k}px;width:26px;height:26px;border-radius:50%;background:#ffb547;box-shadow:0 0 30px 10px rgba(255,181,71,.6)"></div>` : '')
        + '</div>' + (o.people || '') + (o.fg || '') + (o.fog ? layer('<rect y="300" width="1920" height="600" fill="url(#lr-l-fog)"/>', { cls: 'lr-fogl' }) : '') + NIGHT;
    },
    anim: (c) => {
      const o = opt(oo, c);
      const moving = o.drive || o.arrive || o.leave;
      if (o.drive) c.tl.fromTo(`#${c.id}-dash`, { x: 0 }, { x: -240 * Math.ceil(c.dur * 3), duration: c.dur, ease: 'none' }, c.at);
      if (moving) c.tl.fromTo(c.q('.lr-wheel-a use, .lr-wheel-b use'), { rotation: 0 }, { rotation: 360 * c.dur * (o.drive ? 1.6 : 0.8), svgOrigin: '0 0', duration: c.dur, ease: o.drive ? 'none' : 'power2.out' }, c.at);
      if (o.arrive) c.tl.fromTo(`#${c.id}-tr`, { x: -1500 }, { x: 0, duration: Math.min(2.6, c.dur * 0.8), ease: 'power2.out' }, c.at);
      if (o.leave) c.tl.fromTo(`#${c.id}-tr`, { x: 0 }, { x: 2200, duration: c.dur, ease: 'power2.in' }, c.t(o.leaveAt || 0));
      if (o.hazard) c.tl.fromTo(c.q('.lr-haz'), { opacity: 1 }, { opacity: 0.1, duration: 0.35, yoyo: true, repeat: Math.ceil(c.dur / 0.35), ease: 'steps(1)' }, c.at);
      if (o.dip !== undefined) c.tl.fromTo(c.q('.lr-body'), { y: 0, rotation: 0 }, { y: 10, rotation: -1.2, svgOrigin: '680 520', duration: 0.35, ease: 'power2.out' }, c.t(o.dip));
      if (o.slam !== undefined) c.tl.fromTo(c.q('.lr-body'), { x: 0 }, { x: 4, duration: 0.04, yoyo: true, repeat: 3, ease: 'none' }, c.t(o.slam));
      if (o.cam !== false) cam(c, o.cam0 || { scale: 1, x: 0 }, o.cam1 || { scale: 1.05, x: -30 });
      if (o.anim) o.anim(c);
    },
  });
  V.black = (oo) => ({ html: (c) => { const o = opt(oo, c); return o.text ? `<div class="lr-card-text">${o.text}</div>` : ''; }, anim: (c) => { const o = opt(oo, c); if (o.text) c.tl.fromTo(c.q('.lr-card-text'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, c.t(o.textAt || 0.2)); } });

  window.LR = { shots, run, cam, fadeIn, fadeOut, talk, fig, who, layer, truck, rear, phone, ledger, V, NIGHT, r, A };
})();
