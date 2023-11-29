export interface lightning_settings {
  collection: "lightning_settings";

  version: number;

  skin: number;
  skin_2: number;

  headphone_vol: number;
  keyboard_kind: number;

  resistance_sp_left: number;
  resistance_sp_right: number;
  resistance_dp_left: number;
  resistance_dp_right: number;

  vefx: number[];
  light: number[];
  concentration: number;
};

export interface lightning_playdata {
  collection: "lightning_playdata";

  version: number;

  sp_num: number;
  dp_num: number;
};

export const TDJ_settings = {
  skin: 0,
  skin_2: 0,

  headphone_vol: 10,
  keyboard_kind: 10, // default to qwerty //

  resistance_sp_left: 4,
  resistance_sp_right: 4,
  resistance_dp_left: 4,
  resistance_dp_right: 4,

  vefx: [7, 7, 7, 7, 7, 15, 15],
  light: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  concentration: 0,
};

export const TDJ_playdata = {
  sp_num: 0,
  dp_num: 0,
};

export const TDJ_settings_old = {
  skin: 0,
  skin_2: 0,

  headphone_vol: 10,

  resistance_sp_left: 4,
  resistance_sp_right: 4,
  resistance_dp_left: 4,
  resistance_dp_right: 4,

  vefx: [7, 7, 7, 7, 7, 15, 15],
  light: [1, 1, 1, 1, 1, 1],
  concentration: 0,
};
