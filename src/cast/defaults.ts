import cast from '../cast.json';

type Defaults = {defaultOutfit?: string; defaultAccessories?: string[]; defaultVars?: Record<string, string>; layerTransform?: string; hairStyle?: string};
export const castDefaults = (id: string): Defaults => (cast as Record<string, unknown>)[id] as Defaults ?? {};
