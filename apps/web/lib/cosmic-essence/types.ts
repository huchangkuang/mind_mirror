export type CosmicDimension = "EF" | "IT" | "N";

export type CosmicResultId =
  | "solar-flare-red"
  | "deep-space-rose"
  | "aurora-ufo-green"
  | "collapsed-dark-matter"
  | "neutron-bright-purple"
  | "supernova-pearl";

export type CosmicChoiceLetter = "A" | "B" | "C";

export interface CosmicQuestion {
  id: number;
  prompt: string;
  options: readonly {
    letter: CosmicChoiceLetter;
    text: string;
    dimension: CosmicDimension;
  }[];
}
