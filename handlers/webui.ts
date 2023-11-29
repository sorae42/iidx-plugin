import { settings } from "../models/settings";
import { profile } from "../models/profile";
import { rival } from "../models/rival";
import {
  effect_list,
  frame_list,
  fullcombo_list,
  judge_list,
  keybeam_list,
  lanecover_list,
  menumusic_list,
  noteburst_list,
  notes_list,
  turntable_list,
  bombsize_list,
  first_note_preview_list,
  premium_skin_list,
  category_vox_list,
  notebeamsize_list,
  notesize_list,
} from "../data/customlist";

export const updateProfileSettings = async (data: {
  // All of data sent as string
  iidxid: string;
  name: string;

  frame?: string;
  menu_music?: string;
  note_burst?: string;
  turntable?: string;
  lane_cover?: string;
  pacemaker_cover?: string;
  note_skin?: string;
  judge_font?: string;
  note_beam?: string;
  full_combo_splash?: string;
  score_folders?: string;
  clear_folders?: string;
  difficulty_folders?: string;
  alphabet_folders?: string;
  rival_played?: string;
  rival_folders?: string;
  rival_clear_folders?: string;
  rival_shop_info?: string;
  hide_playcount?: string;
  disable_graphcutin?: string;
  classic_hispeed?: string;
  hide_iidxid?: string;
  disable_musicpreview?: string;
  vefx_lock?: string;
  effect?: string;
  bomb_size?: string;
  disable_hcn_color?: string;
  first_note_preview?: string;

  premium_skin?: string;
  judge_pos?: string;
  category_vox?: string;

  note_size?: string;
  note_beam_size?: string;
  lift_cover?: string;

  qpro_head?: string;
  qpro_hair?: string;
  qpro_hand?: string;
  qpro_face?: string;
  qpro_body?: string;

  random_lane_ticket?: string;
  random_lane_ticket_search?: string;

  skin_frame_flg?: string;
  skin_bgm_flg?: string;
  skin_lane_flg?: string;
}) => {
  const update: Update<settings>['$set'] = {};
  const profile = await DB.FindOne<profile>(null, {
    collection: "profile",
    iidxidstr: data.iidxid,
  });

  // Select
  if (data.frame && data.frame.length > 0) {
    update.frame = frame_list.indexOf(data.frame)
  }

  if (data.menu_music && data.menu_music.length > 0) {
    update.menu_music = menumusic_list.indexOf(data.menu_music)
  }

  if (data.note_burst && data.note_burst.length > 0) {
    update.note_burst = noteburst_list.indexOf(data.note_burst)
  }

  if (data.turntable && data.turntable.length > 0) {
    update.turntable = turntable_list.indexOf(data.turntable)
  }

  if (data.lane_cover && data.lane_cover.length > 0) {
    update.lane_cover = lanecover_list.indexOf(data.lane_cover)
  }

  if (data.pacemaker_cover && data.pacemaker_cover.length > 0) {
    update.pacemaker_cover = lanecover_list.indexOf(data.pacemaker_cover)
  }

  if (data.note_skin && data.note_skin.length > 0) {
    update.note_skin = notes_list.indexOf(data.note_skin)
  }

  if (data.judge_font && data.judge_font.length > 0) {
    update.judge_font = judge_list.indexOf(data.judge_font)
  }

  if (data.note_beam && data.note_beam.length > 0) {
    update.note_beam = keybeam_list.indexOf(data.note_beam)
  }
  if (data.full_combo_splash && data.full_combo_splash.length > 0) {
    update.full_combo_splash = fullcombo_list.indexOf(data.full_combo_splash)
  }

  if (data.effect && data.effect.length > 0) {
    update.effect = effect_list.indexOf(data.effect)
  }

  if (data.bomb_size && data.bomb_size.length > 0) {
    update.bomb_size = bombsize_list.indexOf(data.bomb_size)
  }

  if (data.first_note_preview && data.first_note_preview.length > 0) {
    update.first_note_preview = first_note_preview_list.indexOf(data.first_note_preview)
  }

  if (data.note_beam_size && data.note_beam_size.length > 0) {
    update.note_beam_size = notebeamsize_list.indexOf(data.note_beam_size)
  }

  if (data.note_size && data.note_size.length > 0) {
    update.note_size = notesize_list.indexOf(data.note_size)
  }

  if (data.lift_cover && data.lift_cover.length > 0) {
    update.lift_cover = lanecover_list.indexOf(data.lift_cover)
  }

  // Boolean
  update.score_folders = stb(data.score_folders)
  update.clear_folders = stb(data.clear_folders)
  update.difficulty_folders = stb(data.difficulty_folders)
  update.alphabet_folders = stb(data.alphabet_folders)
  update.rival_played = stb(data.rival_played)
  update.rival_folders = stb(data.rival_folders)
  update.rival_clear_folders = stb(data.rival_clear_folders)
  update.rival_shop_info = stb(data.rival_shop_info)
  update.hide_playcount = stb(data.hide_playcount)
  update.disable_graphcutin = stb(data.disable_graphcutin)
  update.classic_hispeed = stb(data.classic_hispeed)
  update.hide_iidxid = stb(data.hide_iidxid)
  update.disable_musicpreview = Number(stb(data.disable_musicpreview))
  update.vefx_lock = Number(stb(data.vefx_lock))
  update.disable_hcn_color = Number(stb(data.disable_hcn_color))

  // Numeric Field
  if (data.skin_bgm_flg && data.skin_bgm_flg.length > 0) {
    update.skin_bgm_flg = parseInt(data.skin_bgm_flg) || 0
  }

  if (data.skin_frame_flg && data.skin_frame_flg.length > 0) {
    update.skin_frame_flg = parseInt(data.skin_frame_flg) || 0
  }

  if (data.skin_lane_flg && data.skin_lane_flg.length > 0) {
    update.skin_lane_flg = parseInt(data.skin_lane_flg) || 0
  }

  if (data.qpro_head && data.qpro_head.length > 0) {
    update.qpro_head = parseInt(data.qpro_head) || 0
  }

  if (data.qpro_hair && data.qpro_hair.length > 0) {
    update.qpro_hair = parseInt(data.qpro_hair) || 0
  }

  if (data.qpro_hand && data.qpro_hand.length > 0) {
    update.qpro_hand = parseInt(data.qpro_hand) || 0
  }

  if (data.qpro_face && data.qpro_face.length > 0) {
    update.qpro_face = parseInt(data.qpro_face) || 0
  }

  if (data.qpro_body && data.qpro_body.length > 0) {
    update.qpro_body = parseInt(data.qpro_body) || 0
  }

  if (data.premium_skin && data.premium_skin.length > 0) {
    update.premium_skin = premium_skin_list.indexOf(data.premium_skin)
  }

  if (data.category_vox && data.category_vox.length > 0) {
    update.category_vox = category_vox_list.indexOf(data.category_vox)
  }

  if (data.judge_pos && data.judge_pos.length > 0) {
    update.judge_pos = parseInt(data.judge_pos) || 0
  }

  if (data.random_lane_ticket && data.random_lane_ticket.length > 0) {
    let lane_values_str = data.random_lane_ticket.split(",");
    let lane_values = [];

    for (let a = 0; a < 100; a++) {
      let lane_value = parseInt(lane_values_str[a]);

      if (!(_.isNaN(lane_value)) && lane_value >= 0 && lane_value < (7 * 6 * 5 * 4 * 3 * 2)) {
        lane_values.push(lane_value);
      }
    }

    update.random_lane_ticket = lane_values;
  } else {
    update.random_lane_ticket = [];
  }

  if (data.random_lane_ticket_search && data.random_lane_ticket_search.length > 0) {
    let lane_values_str = data.random_lane_ticket_search.split(",");
    let lane_values = [];

    for (let a = 0; a < 10; a++) {
      let lane_value = parseInt(lane_values_str[a]);

      if (!(_.isNaN(lane_value)) && lane_value >= 0) {
        lane_values.push(lane_value);
      }
    }

    update.random_lane_ticket_search = lane_values;
  } else {
    update.random_lane_ticket_search = [];
  }

  if (data.name !== profile.name &&
    (data.name.length > 0 && data.name.length < 7)) {
    await DB.Update<profile>(
      profile.refid,
      { collection: 'profile' },
      { $set: { name: data.name } }
    );
  }

  await DB.Update<settings>(
    profile.refid,
    { collection: 'settings' },
    { $set: update }
  );
};

export const updateRivalSettings = async (data: {
  // All of data sent as string
  iidxid: string;

  sp_rival1?: string;
  sp_rival2?: string;
  sp_rival3?: string;
  sp_rival4?: string;
  sp_rival5?: string;
  sp_rival6?: string;

  dp_rival1?: string;
  dp_rival2?: string;
  dp_rival3?: string;
  dp_rival4?: string;
  dp_rival5?: string;
  dp_rival6?: string;
}) => {
  const profile = await DB.FindOne<profile>(null, {
    collection: "profile",
    iidxidstr: data.iidxid,
  });
  let update_array = [];

  if (!(_.isEmpty(data.sp_rival1))) {
    let update_data = {
      play_style: 1,
      index: 0,
      rival_refid: data.sp_rival1,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 1,
        index: 0,
      }
    )
  }

  if (!(_.isEmpty(data.sp_rival2))) {
    let update_data = {
      play_style: 1,
      index: 1,
      rival_refid: data.sp_rival2,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 1,
        index: 1,
      }
    )
  }

  if (!(_.isEmpty(data.sp_rival3))) {
    let update_data = {
      play_style: 1,
      index: 2,
      rival_refid: data.sp_rival3,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 1,
        index: 2,
      }
    )
  }

  if (!(_.isEmpty(data.sp_rival4))) {
    let update_data = {
      play_style: 1,
      index: 3,
      rival_refid: data.sp_rival4,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 1,
        index: 3,
      }
    )
  }

  if (!(_.isEmpty(data.sp_rival5))) {
    let update_data = {
      play_style: 1,
      index: 4,
      rival_refid: data.sp_rival5,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 1,
        index: 4,
      }
    )
  }

  if (!(_.isEmpty(data.sp_rival6))) {
    let update_data = {
      play_style: 1,
      index: 5,
      rival_refid: data.sp_rival6,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 1,
        index: 5,
      }
    )
  }

  if (!(_.isEmpty(data.dp_rival1))) {
    let update_data = {
      play_style: 2,
      index: 0,
      rival_refid: data.dp_rival1,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 2,
        index: 0,
      }
    )
  }

  if (!(_.isEmpty(data.dp_rival2))) {
    let update_data = {
      play_style: 2,
      index: 1,
      rival_refid: data.dp_rival2,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 2,
        index: 1,
      }
    )
  }

  if (!(_.isEmpty(data.dp_rival3))) {
    let update_data = {
      play_style: 2,
      index: 2,
      rival_refid: data.dp_rival3,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 2,
        index: 2,
      }
    )
  }

  if (!(_.isEmpty(data.dp_rival4))) {
    let update_data = {
      play_style: 2,
      index: 3,
      rival_refid: data.dp_rival4,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 2,
        index: 3,
      }
    )
  }

  if (!(_.isEmpty(data.dp_rival5))) {
    let update_data = {
      play_style: 2,
      index: 4,
      rival_refid: data.dp_rival5,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 2,
        index: 4,
      }
    )
  }

  if (!(_.isEmpty(data.dp_rival6))) {
    let update_data = {
      play_style: 2,
      index: 5,
      rival_refid: data.dp_rival6,
    };

    update_array.push(update_data);
  } else {
    await DB.Remove<rival>(profile.refid,
      {
        collection: 'rival',
        play_style: 2,
        index: 5,
      }
    )
  }

  for (let i = 0; i < update_array.length; i++) {
    await DB.Upsert<rival>(profile.refid, {
      collection: "rival",
      play_style: update_array[i].play_style,
      index: update_array[i].index,
    }, {
      $set: {
        rival_refid: update_array[i].rival_refid,
        }
      }
    )
  }
};

function stb(s: string | null): boolean {
  if (_.isNil(s)) return false;
  switch (s.toLowerCase().trim()) {
    case "true": case "yes": case "1": case "on": return true;
    case "false": case "no": case "0": case "off": case null: return false;
    default: return Boolean(s);
  }
}
