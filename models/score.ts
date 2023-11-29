export interface score {
  collection: "score";

  music_id: number;

  spmArray: number[];
  dpmArray: number[];

  optArray: number[];
  opt2Array: number[];

  option_1: number;
  option_2: number;
}

export interface score_detail {
  collection: "score_detail";

  music_id: number;
  clid: number;

  score: number;
  clflg: number;
  miss: number;

  time: number;
}

export interface score_top {
  collection: "score_top";

  play_style: number;
  music_id: number;

  names: string[];
  scores: number[];
  clflgs: number[];
}
