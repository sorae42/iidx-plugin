export interface settings {
  collection: "settings";

  frame: number;
  menu_music: number;
  note_burst: number;
  turntable: number;
  lane_cover: number;
  pacemaker_cover: number;
  lift_cover: number;
  note_skin: number;
  note_size: number;
  judge_font: number;
  note_beam: number;
  note_beam_size: number;
  full_combo_splash: number;
  score_folders: boolean;
  clear_folders: boolean;
  difficulty_folders: boolean;
  alphabet_folders: boolean;
  rival_folders: boolean;
  rival_clear_folders: boolean;
  rival_shop_info: boolean;
  hide_playcount: boolean;
  disable_graphcutin: boolean;
  classic_hispeed: boolean;
  hide_iidxid: boolean;
  rival_played: boolean;
  disable_musicpreview: number;
  vefx_lock: number;
  effect: number;
  bomb_size: number;
  disable_hcn_color: number;
  first_note_preview: number;

  category_vox: number;
  judge_pos: number;
  premium_skin: number;

  qpro_head: number;
  qpro_hair: number;
  qpro_hand: number;
  qpro_face: number;
  qpro_body: number;

  random_lane_ticket: number[];
  random_lane_ticket_search: number[];

  skin_frame_flg: number;
  skin_bgm_flg: number;
  skin_lane_flg: number;
}

export const settings_data = {
  frame: 0,
  menu_music: 0,
  note_burst: 0,
  turntable: 0,
  lane_cover: 0,
  pacemaker_cover: 0,
  lift_cover: 0,
  note_skin: 0,
  note_size: 0,
  judge_font: 0,
  note_beam: 0,
  note_beam_size: 0,
  full_combo_splash: 0,
  score_folders: true,
  clear_folders: true,
  difficulty_folders: true,
  alphabet_folders: true,
  rival_folders: true,
  rival_clear_folders: true,
  rival_shop_info: true,
  hide_playcount: false,
  disable_graphcutin: false,
  classic_hispeed: false,
  rival_played: true,
  hide_iidxid: false,
  disable_musicpreview: 0,
  vefx_lock: 0,
  effect: 0,
  bomb_size: 0,
  disable_hcn_color: 0,
  first_note_preview: 0,

  category_vox: 0,
  judge_pos: 0,
  premium_skin: 0,

  qpro_head: 0,
  qpro_hair: 0,
  qpro_hand: 0,
  qpro_face: 0,
  qpro_body: 0,

  random_lane_ticket: [],
  random_lane_ticket_search: [],

  skin_frame_flg: 0,
  skin_bgm_flg: 0,
  skin_lane_flg: 0,
}
