import React from 'react';
import {LightVeil, makeRoom, RBox, RFace, RoomShell, type Room} from './room';

// A narrow rented room, built once in perspective. Promoted from rear-cam (ห้องเช่าเจย์). Bed along the left wall, a
// folding table with a laptop against the back wall, one window on the right. Three lights to choose from, each with
// something in the frame making it: the laptop (night), the ceiling tube (evening), the window (dawn, 0..1).
// Three camera positions built in: ROOM from the door, HIGH from the ceiling, CORNER from the far corner. A person
// sits on the bed edge at BED_EDGE, where the room's scale is the cast's (about 3 px/cm), so close-ups aim at a real head.

export const RENTED_ROOM = {
  ROOM: makeRoom({x: 620, y: 470}, {x0: 380, x1: 1340, y0: 220, y1: 760}, 3.4),
  HIGH: makeRoom({x: 900, y: 140}, {x0: 380, x1: 1340, y0: 220, y1: 760}, 3.4),
  CORNER: makeRoom({x: 1500, y: 480}, {x0: 300, x1: 1560, y0: 220, y1: 760}, 3.0),
  BED_EDGE: makeRoom({x: 620, y: 470}, {x0: 380, x1: 1340, y0: 220, y1: 760}, 3.4).P(0.28, 1, 0.63),
};


/** the laptop's screen centre in world px: the light at night */
export const rentedRoomScreen = (r: Room) => r.P(0.72, 0.62, 0.26);

export const RentedRoom: React.FC<{r: Room; screen: boolean; tube: boolean; dawn: number; p?: unknown}> = ({r, screen, tube, dawn}) => {
  const s = rentedRoomScreen(r);
  return (
    <>
      <RoomShell r={r} id={`jr-${r.vp.x}`} wall="#5a5f62" side="#4a4e50" floorC="#3a3430" ceiling="#26282a" floor="tiles" walls="plain" />
      {/* window on the back wall: black night, grey-blue at dawn */}
      <RFace r={r} pts={[[0.6, 0.18, 0], [0.86, 0.18, 0], [0.86, 0.52, 0], [0.6, 0.52, 0]]} fill={dawn > 0 ? `rgb(${60 + 80 * dawn},${70 + 90 * dawn},${100 + 100 * dawn})` : '#0b0f18'} stroke="#1a1c1e" sw={8} />
      <RFace r={r} pts={[[0.73, 0.18, 0], [0.73, 0.52, 0]]} fill="none" stroke="#1a1c1e" sw={6} />
      {/* poster, calendar, hanging jacket, shelf with a rice cooker, a fan, a plug strip on the floor */}
      <RFace r={r} pts={[[0.08, 0.2, 0], [0.24, 0.2, 0], [0.24, 0.46, 0], [0.08, 0.46, 0]]} fill="#7a3a2a" />
      <RFace r={r} pts={[[0.32, 0.24, 0], [0.42, 0.24, 0], [0.42, 0.4, 0], [0.32, 0.4, 0]]} fill="#e8e2d2" />
      <RFace r={r} pts={[[0.32, 0.29, 0], [0.42, 0.29, 0]]} fill="none" stroke="#c0392b" sw={4} />
      <RFace r={r} pts={[[0.9, 0.3, 0], [0.98, 0.3, 0], [0.98, 0.7, 0], [0.9, 0.7, 0]]} fill="#21466b" />
      <RBox r={r} u={[0.45, 0.58]} v={[0.42, 0.46]} w={[0, 0.08]} front="#6a4a30" top="#7a5a3a" />
      <RBox r={r} u={[0.47, 0.53]} v={[0.34, 0.42]} w={[0.01, 0.06]} front="#e8e4da" top="#f4f0e6" />
      {/* the bed along the left wall: mattress, crumpled blanket, pillow */}
      <RBox r={r} u={[0, 0.47]} v={[0.9, 1]} w={[0.2, 0.6]} front="#3a3028" top="#7a8aa0" side="#2a2420" />
      <RBox r={r} u={[0.02, 0.2]} v={[0.85, 0.9]} w={[0.22, 0.32]} front="#d8d8d0" top="#e8e8e0" />
      {/* the folding table and the laptop on it */}
      <RBox r={r} u={[0.56, 0.88]} v={[0.73, 0.76]} w={[0.12, 0.42]} front="#8a7a62" top="#a08c70" />
      {[0.58, 0.86].map(u => <RBox key={u} r={r} u={[u, u + 0.012]} v={[0.76, 1]} w={[0.38, 0.4]} front="#3a3632" />)}
      <RBox r={r} u={[0.64, 0.8]} v={[0.72, 0.73]} w={[0.2, 0.34]} front="#2a2c30" top="#3a3c40" />
      <RFace r={r} pts={[[0.65, 0.53, 0.2], [0.79, 0.53, 0.2], [0.79, 0.72, 0.2], [0.65, 0.72, 0.2]]} fill={screen ? '#7fa6d8' : '#141618'} stroke="#111" sw={4} />
      <RBox r={r} u={[0.9, 0.97]} v={[0.86, 1]} w={[0.3, 0.38]} front="#2a3a4a" top="#3a4a5a" />
      <RBox r={r} u={[0.42, 0.52]} v={[0.98, 1]} w={[0.6, 0.66]} front="#e8e8e0" top="#f0f0e8" />
      {/* the helmet on the floor by the table, its rear camera's dead LED */}
      <RBox r={r} u={[0.48, 0.56]} v={[0.92, 1]} w={[0.44, 0.52]} front="#15171a" top="#1d2024" />
      {/* lights: the laptop's cold pool, the ceiling tube, dawn from the window */}
      {screen && <div style={{position: 'absolute', left: s.x - 700, top: s.y - 500, width: 1400, height: 1000, borderRadius: '50%', mixBlendMode: 'screen', pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(120,165,235,.48), rgba(120,165,235,0) 62%)'}} />}
      {tube && <RFace r={r} pts={[[0.3, 0.005, 0.4], [0.7, 0.005, 0.4], [0.7, 0.02, 0.45], [0.3, 0.02, 0.45]]} fill="#f4f6f0" />}
      <LightVeil id={`jrv-${r.vp.x}`} lights={[
        ...(screen ? [[s.x - 120, s.y + 120, 760] as [number, number, number]] : []),
        ...(tube ? [[960, 380, 900] as [number, number, number]] : []),
        ...(dawn > 0 ? [[r.P(0.73, 0.35, 0).x, r.P(0.73, 0.35, 0).y, 520 * dawn] as [number, number, number]] : []),
      ]} o={tube ? 0.28 : 0.5} />
    </>
  );
};
