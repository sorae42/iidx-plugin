export interface rival {
  collection: "rival";

  play_style: number;

  index: number;
  rival_refid: string;
};

export interface rival_data {
  play_style: number;
  index: number;

  is_robo: boolean;

  qprodata: number[];
  profile: (string | number)[];
  pc_data: number[];
}
