import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {CarInterior, CarKnee, CarWheel, DRIVER} from '../../kit/car';
import {BigEye, D, Macro, Pool, Soft} from '../../kit/frame';
import {Actors, C, Shot} from './cast';

// Rin's car (brief.md → Sets): the kit cabin seen through the windscreen, Rin at the wheel on the driver's side.
// data.tone: night (street lamp from the side), day (sun through the glass), dawn. Everything inside stays where it is;
// the camera moves from the medium to a real close-up (head ~half the frame at z ≈ 2).

const CarWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p), tone = d.tone ?? 'night', night = tone !== 'day';
  return (
    <>
      <Soft p={p}><CarInterior view="drive" f={p.f} night={night} /></Soft>
      <Actors p={p} floor={DRIVER.floor} pxPerCm={DRIVER.pxPerCm} />
      <CarWheel night={night} />
      <CarKnee night={night} />
      {tone === 'night' && <Pool x={420} y={300} rx={560} color="255,176,96" a={0.42} />}
      {d.roof && <Pool x={740} y={120} rx={520} color="255,226,170" a={0.42} />}
      {d.phone && <Pool x={d.phone[0]} y={d.phone[1]} rx={260} color="175,205,255" a={0.5} />}
      {tone === 'day' && <Pool x={1500} y={120} rx={1000} color="255,246,214" a={0.3} />}
      {tone === 'dawn' && <Pool x={1200} y={120} rx={1100} color="190,205,235" a={0.34} />}
    </>
  );
};

/** her eye as big as the frame; what she is looking at shows in it */
const Eye: React.FC<{p: ShotProps; day?: boolean}> = ({p, day}) => (
  <Macro p={p} bg="#050404" at={[44, 42]} vig={day ? 0.5 : 0.8} inner={30} z={1.06} ox={940} oy={440}>
    <BigEye cx={940} cy={430} s={1.05} skin={C.skinR} skinD="#b98c6a" lid={0.12} look={-0.18} wet
      glint={day ? <rect x={-48} y={-46} width={90} height={60} fill="#fff" opacity={0.75} /> : <>{[0, 1, 2].map(i => <rect key={i} x={-46} y={-34 + i * 22} width={92} height={7} fill="#ffd27a" />)}</>} />
    <div style={{position: 'absolute', inset: 0, background: day ? 'linear-gradient(90deg, rgba(255,240,200,.1), rgba(0,0,0,.45))' : 'linear-gradient(90deg, rgba(255,150,70,.16), rgba(0,0,0,.72))'}} />
  </Macro>
);

const Car: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'rin-ecu') return <Eye p={p} />;
  if (v === 'rin-ecu-day') return <Eye p={p} day />;
  return <Shot p={p} world={<CarWorld p={p} />} />;
};

export const CAR: Record<string, ShotComponent> = {car: Car};
