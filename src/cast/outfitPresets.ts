import presets from './wardrobe.json';
import type {CastId} from './CastSprite';

export type Outfit = {label: string; model: CastId; vars: Record<string, string>};
export const wardrobe = presets as Record<string, Outfit | undefined>;
