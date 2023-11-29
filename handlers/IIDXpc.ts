import { pc_data, IIDX27_pc_data, IIDX28_pc_data, IIDX29_pc_data, IIDX30_pc_data, IIDX31_pc_data } from "../models/pc_data";
import { shop_data } from "../models/shop_data";
import { profile } from "../models/profile";
import { grade, eisei_grade, eisei_grade_data } from "../models/grade";
import { lightning_musicmemo, musicmemo_data, lightning_musicmemo_old, musicmemo_data_old, musicfilter_data, lightning_musicfilter } from "../models/music_memo";
import { lightning_settings, lightning_playdata, TDJ_settings, TDJ_settings_old, TDJ_playdata } from "../models/lightning";
import { settings, settings_data } from "../models/settings";
import { rival, rival_data } from "../models/rival";
import { world_tourism } from "../models/world_tourism";
import { GetVersion, IDToCode, AppendSettingConverter, randomIntRange, IIDXidTorefid, refidToQpro, refidToPd, refidToProfile } from "../util";

export const pccommon: EPR = async (info, data, send) => {
  const version = GetVersion(info);

  if (version == 27) {
    send.pugFile("pug/27pccommon.pug", {
      beat: U.GetConfig("BeatPhase"),
      expert: U.GetConfig("ExpertPhase"),
      expert_secret: U.GetConfig("ExpertSecretPhase"),
      boss: U.GetConfig("BossPhase"),
      system_voice: U.GetConfig("SystemVoicePhase"),
      extra_boss: U.GetConfig("ExtraBossPhase"),
      event_1: U.GetConfig("Event1Phase"),
    });
  } else if (version == 28) {
    send.pugFile("pug/28pccommon.pug", {
      beat: U.GetConfig("BeatPhase"),
      expert: U.GetConfig("ExpertPhase"),
      expert_secret: U.GetConfig("ExpertSecretPhase"),
      boss: U.GetConfig("BossPhase"),
      system_voice: U.GetConfig("SystemVoicePhase"),
      extra_boss: U.GetConfig("ExtraBossPhase"),
      event_1: U.GetConfig("Event1Phase"),
      movie_upload: U.GetConfig("MovieUpload"),
    });
  } else if (version == 29) {
    send.pugFile("pug/29pccommon.pug", {
      beat: U.GetConfig("BeatPhase"),
      expert: U.GetConfig("ExpertPhase"),
      expert_secret: U.GetConfig("ExpertSecretPhase"),
      boss: U.GetConfig("BossPhase"),
      system_voice: U.GetConfig("SystemVoicePhase"),
      extra_boss: U.GetConfig("ExtraBossPhase"),
      event_1: U.GetConfig("Event1Phase"),
      movie_upload: U.GetConfig("MovieUpload"),
    });
  } else if (version == 30) {
    send.pugFile("pug/30pccommon.pug", {
      beat: U.GetConfig("BeatPhase"),
      system_voice: U.GetConfig("SystemVoicePhase"),
      movie_upload: U.GetConfig("MovieUpload"),
    });
  } else if (version == 31) {
    send.pugFile("pug/31pccommon.pug", {
      beat: U.GetConfig("BeatPhase"),
      system_voice: U.GetConfig("SystemVoicePhase"),
      movie_upload: U.GetConfig("MovieUpload"),
    });
  }
};

export const pcoldget: EPR = async (info, data, send) => {
  const refid = $(data).attr().rid;
  const profile = await DB.FindOne<profile>(refid, { collection: "profile" });
  if (profile) {
    send.success();
  } else {
    send.deny();
  }
};

export const pcgetname: EPR = async (info, data, send) => {
  const refid = $(data).attr().rid;
  const profile = await DB.FindOne<profile>(refid, { collection: "profile" });
  send.object(
    K.ATTR({
      idstr: profile.iidxidstr,
      name: profile.name,
      pid: String(profile.pid),
    })
  );
};

export const pctakeover: EPR = async (info, data, send) => {
  const refid = $(data).attr().rid;
  const profile = await DB.FindOne<profile>(refid, { collection: "profile" });
  const version = GetVersion(info);
  let pc_data: object;

  if (version == 27) {
    pc_data = IIDX27_pc_data;
  } else if (version == 28) {
    pc_data = IIDX28_pc_data;
  } else if (version == 29) {
    pc_data = IIDX29_pc_data;
  } else if (version == 30) {
    pc_data = IIDX30_pc_data;
  } else if (version == 31) {
    pc_data = IIDX31_pc_data;
  }

  await DB.Upsert<profile>(
    refid,
    {
      collection: "profile",
    },
    {
      $set: {
        name: $(data).attr().name,
        pid: parseInt($(data).attr().pid),
        iidxid: profile.iidxid,
        iidxidstr: profile.iidxidstr,
        refid: refid,
      },
    }
  );
  await DB.Upsert<pc_data>(
    refid,
    {
      collection: "pc_data",
      version: version,
    },
    {
      $set: pc_data,
    }
  );
  send.object(
    K.ATTR({
      id: String(profile.iidxid),
    })
  );
};

export const pcreg: EPR = async (info, data, send) => {
  const id = _.random(10000000, 99999999);
  const id_str = IDToCode(id);
  const refid = $(data).attr().cid.split('|')[0];
  const version = GetVersion(info);
  let pc_data: object;
  let lightning_settings: object;
  let lightning_playdata: object;

  if (version == 27) {
    pc_data = IIDX27_pc_data;
    lightning_settings = TDJ_settings_old;
    lightning_playdata = TDJ_playdata;
  } else if (version == 28) {
    pc_data = IIDX28_pc_data;
    lightning_settings = TDJ_settings_old;
    lightning_playdata = TDJ_playdata;
  } else if (version == 29) {
    pc_data = IIDX29_pc_data;
    lightning_settings = TDJ_settings;
    lightning_playdata = TDJ_playdata;
  } else if (version == 30) {
    pc_data = IIDX30_pc_data;
    lightning_settings = TDJ_settings;
    lightning_playdata = TDJ_playdata;
  } else if (version == 31) {
    pc_data = IIDX31_pc_data;
    lightning_settings = TDJ_settings;
    lightning_playdata = TDJ_playdata;
  }

  await DB.Upsert<profile>(
    refid,
    {
      collection: "profile",
    },
    {
      $set: {
        name: $(data).attr().name,
        pid: parseInt($(data).attr().pid),
        iidxid: id,
        iidxidstr: id_str,
        refid: refid,
      },
    }
  );
  await DB.Upsert<pc_data>(
    refid,
    {
      collection: "pc_data",
      version: version,
    },
    {
      $set: pc_data,
    }
  );
  await DB.Upsert<settings>(
    refid,
    {
      collection: "settings",
    },
    {
      $set: settings_data
    }
  );
  await DB.Upsert<lightning_settings>(
    refid,
    {
      collection: "lightning_settings",
      version: version,
    },
    {
      $set: lightning_settings,
    }
  );
  await DB.Upsert<lightning_playdata>(
    refid,
    {
      collection: "lightning_playdata",
      version: version,
    },
    {
      $set: lightning_playdata,
    }
  );

  send.object(
    K.ATTR({
      id: String(id),
      id_str: id_str,
      // status: "0",
    })
  );
};

export const pcget: EPR = async (info, data, send) => {
  const refid = $(data).attr().rid;
  const version = GetVersion(info);
  const pc_data = await DB.FindOne<pc_data>(refid, {
    collection: "pc_data",
    version: version,
  });
  if (_.isNil(pc_data)) {
    send.deny();
  } else {
    const profile = await DB.FindOne<profile>(refid, { collection: "profile" });
    const shop_data = await DB.FindOne<shop_data>({
      collection: "shop_data",
    });
    const dArray = (
      await DB.Find<grade>(refid, {
        collection: "grade",
        version: version,
      })
    ).map((r) => r.dArray);
    dArray.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let settings: settings = await DB.FindOne<settings>(refid, { collection: "settings" });
    if (_.isNil(settings)) { // settings migration //
      await DB.Upsert<settings>(
        refid,
        {
          collection: "settings",
        },
        {
          $set: settings_data
        }
      )
      settings = { ...settings_data, collection: "settings" }
    }
    if (_.isNil(settings.rival_folders)) { // settings migration #2 //
      await DB.Upsert<settings>(refid, { collection: "settings" }, {
        $set: {
          rival_folders: true,
          rival_clear_folders: true,
          rival_shop_info: true,
          rival_played: true,
        }
      });

      settings.rival_folders = true;
      settings.rival_clear_folders = true;
      settings.rival_shop_info = true;
      settings.rival_played = true;
    }
    if (_.isNil(settings.rival_played)) { // settings migration #3 //
      await DB.Upsert<settings>(refid, { collection: "settings" }, {
        $set: {
          rival_played: true,
        }
      });

      settings.rival_played = true;
    }
    if (_.isNil(settings.skin_bgm_flg)) { // settings migration #4 //
      await DB.Upsert<settings>(refid, { collection: "settings" }, {
        $set: {
          skin_bgm_flg: 0,
          skin_frame_flg: 0,
          skin_lane_flg: 0,
        }
      });

      settings.skin_bgm_flg = 0;
      settings.skin_frame_flg = 0;
      settings.skin_lane_flg = 0;
    }
    const appendsetting = AppendSettingConverter(
      settings.score_folders,
      settings.clear_folders,
      settings.difficulty_folders,
      settings.alphabet_folders,
      settings.rival_folders,
      settings.rival_clear_folders,
      settings.rival_shop_info,
      settings.hide_playcount,
      settings.disable_graphcutin,
      settings.classic_hispeed,
      settings.rival_played,
      settings.hide_iidxid
    );
    let rivals = await DB.Find<rival>(refid, { collection: "rival" });
    let world_tourism = await DB.Find<world_tourism>(refid, { collection: "world_tourism" });
    let event_1 = await DB.Find(refid, { collection: "event_1", version: version });
    let event_1s = await DB.Find(refid, { collection: "event_1_sub", version: version });

    let lightning_settings = await DB.FindOne<lightning_settings>(refid, { collection: "lightning_settings", version: version });
    let lightning_playdata = await DB.FindOne<lightning_playdata>(refid, { collection: "lightning_playdata", version: version });
    let lightning_musicmemo = await DB.Find<lightning_musicmemo>(refid, { collection: "lightning_musicmemo", version: version });
    let lightning_musicmemo_old = await DB.Find<lightning_musicmemo_old>(refid, { collection: "lightning_musicmemo_old", version: version });
    let lightning_eisei = await DB.Find<eisei_grade>(refid, { collection: "eisei_grade", version: version });
    let lightning_musicfilter = await DB.Find<lightning_musicfilter>(refid, { collection: "lightning_musicfilter", version: version });

    // migration parts //
    if (_.isNil(lightning_settings) || _.isNil(lightning_playdata)) { // lightning save support //
      if (version >= 29) {
        await DB.Upsert<lightning_settings>(
          refid,
          {
            collection: "lightning_settings",
            version: version,
          },
          {
            $set: TDJ_settings,
          }
        );
      } else {
        await DB.Upsert<lightning_settings>(
          refid,
          {
            collection: "lightning_settings",
            version: version,
          },
          {
            $set: TDJ_settings_old,
          }
        );
      }

      await DB.Upsert<lightning_playdata>(
        refid,
        {
          collection: "lightning_playdata",
          version: version,
        },
        {
          $set: TDJ_playdata,
        }
      );

      lightning_settings = await DB.FindOne<lightning_settings>(refid, { collection: "lightning_settings", version: version });
      lightning_playdata = await DB.FindOne<lightning_playdata>(refid, { collection: "lightning_playdata", version: version });
    }
    if (_.isNil(profile.language)) { // language save support //
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            language: -1
          }
        }
      );

      profile.language = -1;
    }
    if (_.isNil(pc_data.sp_fluctuation) && version == 30) { // new attributes //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            sp_fluctuation: 0,
            dp_fluctuation: 0,
          }
        }
      );

      pc_data.sp_fluctuation = 0;
      pc_data.dp_fluctuation = 0;
    }
    if (_.isNil(pc_data.s_timing_split) && version == 30) { // bad migration //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            s_timing_split: 0,
            d_timing_split: 0,
            s_visualization: 0,
            d_visualization: 0,
          }
        }
      );

      pc_data.s_timing_split = 0;
      pc_data.d_timing_split = 0;
      pc_data.s_visualization = 0;
      pc_data.d_visualization = 0;
    }
    if (_.isNil(pc_data.event_last_select_gym_id) && version == 27) { // HEROIC VERSE event_1 //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            event_play_num: 0,
            event_last_select_gym_id: 0,
          }
        }
      );

      pc_data.event_play_num = 0;
      pc_data.event_last_select_gym_id = 0;
    }
    if (_.isNil(pc_data.event_story_prog) && version == 28) { // BISTROVER event_1 //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            event_play_num: 0,
            event_story_prog: 0,
            event_last_select_area_id: 0,
            event_failed_num: 0,
          }
        }
      );

      pc_data.event_play_num = 0;
      pc_data.event_story_prog = 0;
      pc_data.event_last_select_area_id = 0;
      pc_data.event_failed_num = 0;
    }
    if (_.isNil(pc_data.event_last_platform_id) && version == 29) { // CastHour event_1 //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            event_play_num: 0,
            event_last_platform_id: 0,
            event_last_platform_type: 0,
          }
        }
      );

      pc_data.event_play_num = 0;
      pc_data.event_last_platform_id = 0;
      pc_data.event_last_platform_type = 0;
    }
    if (_.isNil(pc_data.event_last_select_flyer_id) && version == 30) { // RESIDENT event_1 //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            event_play_num: 0,
            event_last_select_flyer_id: 0,
          }
        }
      );

      pc_data.event_play_num = 0;
      pc_data.event_last_select_flyer_id = 0;
    }

    // music_memo //
    let mArray = [];
    if (lightning_musicmemo.length > 0 && version >= 30) {
      lightning_musicmemo.forEach((res) => {
        let musicmemo_data: musicmemo_data = {
          folder_idx: res.folder_idx,
          folder_name: res.folder_name,
          play_style: res.play_style,

          music_ids: res.music_ids,
        }

        mArray.push(musicmemo_data);
      });
      mArray.sort((a: musicmemo_data, b: musicmemo_data): number => a.play_style - b.play_style || a.folder_idx - b.folder_idx);
    } else if (lightning_musicmemo_old.length > 0 && version >= 27) {
      lightning_musicmemo_old.forEach((res) => {
        let musicmemo_data: musicmemo_data_old = {
          music_idx: res.music_idx,
          play_style: res.play_style,

          music_id: res.music_id,
        }

        mArray.push(musicmemo_data);
      });
      mArray.sort((a: musicmemo_data_old, b: musicmemo_data_old): number => a.play_style - b.play_style || a.music_idx - b.music_idx);
    }

    let fArray = [];
    if (lightning_musicfilter.length > 0 && version >= 31) {
      lightning_musicfilter.forEach((res) => {
        let musicfilter_data: musicfilter_data = {
          play_style: res.play_style,
          folder_id: res.folder_id,
          filter_id: res.filter_id,

          is_valid: res.is_valid,
          value0: res.value0,
          value1: res.value1,
        }

        fArray.push(musicfilter_data);
      });
      fArray.sort((a: musicfilter_data, b: musicfilter_data): number => a.play_style - b.play_style || a.folder_id - b.folder_id);
    }

    // eisei_grade_data //
    let eArray = [];
    if (lightning_eisei.length > 0) {
      lightning_eisei.forEach((res) => {
        let eisei_data: eisei_grade_data = {
          grade_type: res.grade_type,
          grade_id: res.grade_id,
          stage_num: res.stage_num,
          clear_type: res.clear_type,
          option: res.option,

          past: res.past_achievement,
          selected_course: res.past_selected_course,
          max_past: res.max_past_achievement,
          max_selected_course: res.max_past_selected_course,
        }

        eArray.push(eisei_data);
      });
      eArray.sort((a: eisei_grade_data, b: eisei_grade_data): number => a.grade_type - b.grade_type || a.grade_id - b.grade_id);
    }

    // rivals //
    let rArray = [];
    if (rivals.length > 0) {
      for (let a = 0; a < rivals.length; a++) {
        if (version <= 29 && rivals[a].index > 4) continue;

        let profile = await refidToProfile(rivals[a].rival_refid);
        let pc_data = await refidToPd(rivals[a].rival_refid);
        let qprodata = await refidToQpro(rivals[a].rival_refid);

        let rival_data: rival_data = {
          play_style: rivals[a].play_style,
          index: rivals[a].index,

          is_robo: false,

          profile: profile,
          pc_data: pc_data,
          qprodata: qprodata,
        }

        rArray.push(rival_data);
      }
      rArray.sort((a: rival_data, b: rival_data): number => a.play_style - b.play_style || a.index - b.index);
    } 

    // world_tourism //
    let wArray = [];
    if (world_tourism.length > 0) {
      for (let wt of world_tourism) {
        let world_tourism_data = {
          tour_id: wt.tour_id,
          progress: wt.progress,
        }

        wArray.push(world_tourism_data);
      }
      wArray.sort((a, b) => a.tour_id - b.tour_id);
    }

    // event_1 //
    let evtArray = [], evtArray2 = [];
    if (event_1.length > 0) {
      for (let evt of event_1) {
        evtArray.push(evt);
      }
    }
    if (event_1s.length > 0) {
      for (let evt of event_1s) {
        evtArray2.push(evt);
      }
    }

    if (version == 27) {
      send.pugFile("pug/27get.pug", {
        settings,
        profile,
        appendsetting,
        pc_data,
        shop_data,
        dArray,
        lightning_settings,
        lightning_playdata,
        eArray,
        rArray,
        evtArray,
      });
    } else if (version == 28) {
      send.pugFile("pug/28get.pug", {
        profile,
        settings,
        appendsetting,
        pc_data,
        shop_data,
        dArray,
        lightning_settings,
        lightning_playdata,
        mArray,
        eArray,
        rArray,
        wArray,
        evtArray,
      });
    } else if (version == 29) {
      send.pugFile("pug/29get.pug", {
        profile,
        settings,
        appendsetting,
        pc_data,
        shop_data,
        dArray,
        lightning_settings,
        lightning_playdata,
        mArray,
        eArray,
        rArray,
        wArray,
        evtArray,
        evtArray2,
      });
    } else if (version == 30) {
      send.pugFile("pug/30get.pug", {
        profile,
        settings,
        appendsetting,
        pc_data,
        shop_data,
        dArray,
        lightning_settings,
        lightning_playdata,
        mArray,
        eArray,
        rArray,
        wArray,
        evtArray,
        evtArray2,
      });
    } else if (version == 31) {
      send.pugFile("pug/31get.pug", {
        profile,
        settings,
        appendsetting,
        pc_data,
        shop_data,
        dArray,
        lightning_settings,
        lightning_playdata,
        mArray,
        fArray,
        eArray,
        rArray,
        wArray,
        evtArray,
        evtArray2,
      });
    }
  }
};

export const pcsave: EPR = async (info, data, send) => {
  const version = GetVersion(info);
  const cltype = parseInt($(data).attr().cltype);
  const refid = await IIDXidTorefid(parseInt($(data).attr().iidxid)); // temporarily using this function to fix save //
  const profile = await DB.FindOne<profile>(refid, {
    collection: "profile",
  });
  const pc_data = await DB.FindOne<pc_data>(refid, {
    collection: "pc_data",
    version: version,
  });
  const lightning_playdata = await DB.FindOne<lightning_playdata>(refid, {
    collection: "lightning_playdata",
    version: version,
  });
  const lightning_settings = await DB.FindOne<lightning_settings>(refid, {
    collection: "lightning_settings",
    version: version,
  });

  const isTDJ = !(_.isNil($(data).element("lightning_play_data"))); // use this element to determine [TDJ] instead of info.model //
  const hasStepUpData = !(_.isNil($(data).element("step")));
  const hasLanguageData = !(_.isNil($(data).element("language_setting")));
  const hasTowerData = !(_.isNil($(data).element("tower_data")));
  const hasMusicMemo = !(_.isNil($(data).element("music_memo")));
  const hasWorldTourism = !(_.isNil($(data).element("world_tourism_data")));
  const hasEventData = !(_.isNil($(data).element("event1"))) || !(_.isNil($(data).element("event_1")));
  const hasBadgeData = !(_.isNil($(data).element("badge")));
  const hasMusicFilter = !(_.isNil($(data).element("music_filter")));
  const hasSkinData = !(_.isNil($(data).element("skin_equip")));
  const hasTDJSkinData = !(_.isNil($(data).element("tdjskin_equip")));

  let spnum = pc_data.spnum,
    dpnum = pc_data.dpnum,
    sprank = pc_data.sprank,
    sppoint = pc_data.sppoint,
    dprank = pc_data.dprank,
    dppoint = pc_data.dppoint,
    spradar = pc_data.spradar,
    dpradar = pc_data.dpradar;

  // stepup //
  let dp_clear_mission_clear = pc_data.dp_clear_mission_clear,
    dp_clear_mission_level = pc_data.dp_clear_mission_level,
    dp_dj_mission_clear = pc_data.dp_dj_mission_clear,
    dp_dj_mission_level = pc_data.dp_dj_mission_level,
    dp_level = pc_data.dp_level,
    dp_mission_point = pc_data.dp_mission_point,
    dp_mplay = pc_data.dp_mplay,
    enemy_damage = pc_data.enemy_damage,
    total_point = pc_data.total_point,
    progress = pc_data.progress,
    sp_clear_mission_clear = pc_data.sp_clear_mission_clear,
    sp_clear_mission_level = pc_data.sp_clear_mission_level,
    sp_dj_mission_clear = pc_data.sp_dj_mission_clear,
    sp_dj_mission_level = pc_data.sp_dj_mission_level,
    sp_level = pc_data.sp_level,
    sp_mission_point = pc_data.sp_mission_point,
    sp_mplay = pc_data.sp_mplay,
    tips_read_list = pc_data.tips_read_list,
    enemy_defeat_flg = pc_data.enemy_defeat_flg,
    mission_clear_num = pc_data.mission_clear_num,
    sp_fluctuation = pc_data.sp_fluctuation,
    dp_fluctuation = pc_data.dp_fluctuation;

  // lightning //
  let lightning_spnum = lightning_playdata.sp_num,
    lightning_dpnum = lightning_playdata.dp_num;
  let lightning_skin = lightning_settings.skin,
    lightning_skin_2 = lightning_settings.skin_2,
    lightning_headphone_vol = lightning_settings.headphone_vol,
    lightning_resistance_sp_1 = lightning_settings.resistance_sp_left,
    lightning_resistance_sp_2 = lightning_settings.resistance_sp_right,
    lightning_resistance_dp_1 = lightning_settings.resistance_dp_left,
    lightning_resistance_dp_2 = lightning_settings.resistance_dp_right,
    lightning_vefx = lightning_settings.vefx,
    lightning_light = lightning_settings.light,
    lightning_concentration = lightning_settings.concentration,
    lightning_keyboard_kind = lightning_settings.keyboard_kind;

  // IIDX Tower //
  let tower_kbd = profile.tower_kbd,
    tower_scr = profile.tower_scr;

  // event_1 //
  let event_play_num = pc_data.event_play_num;

  let d_liflen = 0,
    s_liflen = 0,
    ngrade = 0;

  if (cltype == 0) {
    spnum = pc_data.spnum + 1;
    dpnum = pc_data.dpnum;
  }
  if (cltype == 1) {
    spnum = pc_data.spnum;
    dpnum = pc_data.dpnum + 1;
  }

  //liflenが存在したとき
  if ($(data).attr().d_lift) {
    d_liflen = parseInt($(data).attr().d_lift);
  }
  if ($(data).attr().s_lift) {
    s_liflen = parseInt($(data).attr().s_lift);
  }

  // lightning_playcount //
  if (isTDJ) {
    if (cltype == 0) {
      lightning_spnum = lightning_playdata.sp_num + 1;
      lightning_dpnum = lightning_playdata.dp_num;
    }
    if (cltype == 1) {
      lightning_spnum = lightning_playdata.sp_num;
      lightning_dpnum = lightning_playdata.dp_num + 1;
    }
  }

  // IIDX Tower //
  if (hasTowerData) {
    if (_.isNil(tower_kbd) || _.isNil(tower_scr)) { tower_kbd = 0; tower_scr = 0; }
    tower_kbd += parseInt($(data).element("tower_data").attr().keyboard);
    tower_scr += parseInt($(data).element("tower_data").attr().scratch);
  }

  // stepup //
  if (hasStepUpData) {
    dp_clear_mission_clear = parseInt(
      $(data).attr("step").dp_clear_mission_clear
    );
    dp_clear_mission_level = parseInt(
      $(data).attr("step").dp_clear_mission_level
    );
    dp_dj_mission_clear = parseInt($(data).attr("step").dp_dj_mission_clear);
    dp_dj_mission_level = parseInt($(data).attr("step").dp_dj_mission_level);
    dp_level = parseInt($(data).attr("step").dp_level);
    dp_mission_point = parseInt($(data).attr("step").dp_mission_point);
    dp_mplay = parseInt($(data).attr("step").dp_mplay);
    enemy_damage = parseInt($(data).attr("step").enemy_damage);
    total_point = parseInt($(data).attr("step").total_point);
    progress = parseInt($(data).attr("step").progress);
    sp_clear_mission_clear = parseInt(
      $(data).attr("step").sp_clear_mission_clear
    );
    sp_clear_mission_level = parseInt(
      $(data).attr("step").sp_clear_mission_level
    );
    sp_dj_mission_clear = parseInt($(data).attr("step").sp_dj_mission_clear);
    sp_dj_mission_level = parseInt($(data).attr("step").sp_dj_mission_level);
    sp_level = parseInt($(data).attr("step").sp_level);
    sp_mission_point = parseInt($(data).attr("step").sp_mission_point);
    sp_mplay = parseInt($(data).attr("step").sp_mplay);
    tips_read_list = parseInt($(data).attr("step").tips_read_list);
    enemy_defeat_flg = parseInt($(data).attr("step").enemy_defeat_flg);
    mission_clear_num = parseInt($(data).attr("step").mission_clear_num);
    sp_fluctuation = parseInt($(data).attr("step").sp_fluctuation);
    dp_fluctuation = parseInt($(data).attr("step").dp_fluctuation);
  }

  if ($(data).attr("dj_rank.1").style == "1") {
    sprank = $(data).element("dj_rank").numbers("rank");
    sppoint = $(data).element("dj_rank").numbers("point");
    dprank = $(data).element("dj_rank.1").numbers("rank");
    dppoint = $(data).element("dj_rank.1").numbers("point");
  } else if ($(data).attr("dj_rank").style == "0") {
    sprank = $(data).element("dj_rank").numbers("rank");
    sppoint = $(data).element("dj_rank").numbers("point");
    dprank = pc_data.dprank;
    dppoint = pc_data.dppoint;
  } else if ($(data).attr("dj_rank").style == "1") {
    sprank = pc_data.sprank;
    sppoint = pc_data.sppoint;
    dprank = $(data).element("dj_rank").numbers("rank");
    dppoint = $(data).element("dj_rank").numbers("point");
  } else {
    sprank = pc_data.sprank;
    sppoint = pc_data.sppoint;
    dprank = pc_data.dprank;
    dppoint = pc_data.dppoint;
  }

  if ($(data).attr("notes_radar.1").style == "1") {
    spradar = $(data).element("notes_radar").numbers("radar_score");
    dpradar = $(data).element("notes_radar.1").numbers("radar_score");
  } else if ($(data).attr("notes_radar").style == "0") {
    spradar = $(data).element("notes_radar").numbers("radar_score");
    dpradar = pc_data.dpradar;
  } else if ($(data).attr("notes_radar").style == "1") {
    spradar = pc_data.spradar;
    dpradar = $(data).element("notes_radar").numbers("radar_score");
  } else {
    spradar = pc_data.spradar;
    dpradar = pc_data.dpradar;
  }

  // lightning_settings //
  let music_memo = [];
  let music_filter = [];
  if (isTDJ) {
    lightning_headphone_vol = parseInt($(data).element("lightning_setting").attr().headphone_vol);

    lightning_resistance_sp_1 = parseInt($(data).element("lightning_setting").attr().resistance_sp_left);
    lightning_resistance_sp_2 = parseInt($(data).element("lightning_setting").attr().resistance_sp_right);
    lightning_resistance_dp_1 = parseInt($(data).element("lightning_setting").attr().resistance_dp_left);
    lightning_resistance_dp_2 = parseInt($(data).element("lightning_setting").attr().resistance_dp_right);

    lightning_vefx = $(data).element("lightning_setting").numbers("slider");
    lightning_light = $(data).element("lightning_setting").numbers("light");

    lightning_concentration = $(data).element("lightning_setting").number("concentration");

    lightning_keyboard_kind = parseInt($(data).element("lightning_setting").attr().keyboard_kind);

    if (hasMusicMemo) {
      if (version >= 30) {
        $(data).element("music_memo").elements("folder").forEach((res) => {
          let musicmemo_data: musicmemo_data = {
            folder_idx: parseInt(res.attr().folder_id),
            folder_name: res.attr().name,
            play_style: parseInt(res.attr().play_style),

            music_ids: res.numbers("music_id"),
          };

          music_memo.push(musicmemo_data);
        });
      } else if (version >= 27) {
        $(data).element("music_memo").elements("music").forEach((res) => {
          let musicmemo_data: musicmemo_data_old = {
            music_idx: parseInt(res.attr().index),
            music_id: parseInt(res.attr().music_id),
            play_style: parseInt(res.attr().play_style),
          };

          music_memo.push(musicmemo_data);
        });
      }
    }

    if (hasMusicFilter) {
      $(data).element("music_filter").elements("folder").forEach((res) => {
        let musicfilter_data: musicfilter_data = {
          play_style: parseInt(res.attr().play_style),
          folder_id: parseInt(res.attr().folder_id),
          filter_id: parseInt(res.attr().filter_id),
          is_valid: res.bool("is_valid"),
          value0: parseInt(res.attr().value0),
          value1: parseInt(res.attr().value1),
        };

        music_filter.push(musicfilter_data);
      });
    }
  }

  let wt_data = [];
  if (hasWorldTourism) {
    $(data).elements("world_tourism_data").forEach((res) => {
      let tourInfo = {
        tour_id: parseInt(res.attr().tour_id),
        progress: parseInt(res.attr().progress),
      }

      wt_data.push(tourInfo);
    });

    wt_data.forEach((res) => {
      DB.Upsert<world_tourism>(
        refid,
        {
          collection: "world_tourism",
          version: version,
          tour_id: parseInt(res.tour_id),
        },
        {
          $set: {
            progress: parseInt(res.progress),
          }
        }
      );
    });
  }

  let event_data, event_sub_data, eArray = [];
  if (hasEventData) {
    if (_.isNil(event_play_num)) { event_play_num = 0; }
    event_play_num += 1;

    if (version == 27) {
      $(data).element("event1").elements("gym_data").forEach((res) => {
        event_data = {
          gym_id: res.attr().gym_id,
          play_num: res.attr().play_num,
          gauge_spirit: res.attr().gauge_spirit,
          gauge_technique: res.attr().gauge_technique,
          gauge_body: res.attr().gauge_body,
          boss_attack_num: res.attr().boss_attack_num,
          boss_damage: res.attr().boss_damage,
          disp_lounge_list: res.attr().disp_lounge_list,
          stb_type: res.attr().stb_type,
          is_complete: res.number("is_complete"),
          is_gauge_max: res.number("is_gauge_max"),
        }

        eArray.push(event_data);
      });
    }
    else if (version == 28) {
      $(data).element("event_1").elements("area_data").forEach((res) => {
        event_data = {
          area_id: res.attr().area_id,
          play_num: res.attr().play_num,
          recipe_prog0: res.attr().recipe_prog0,
          recipe_prog1: res.attr().recipe_prog1,
          recipe_prog2: res.attr().recipe_prog2,
          recipe_prog3: res.attr().recipe_prog3,
          recipe_prog4: res.attr().recipe_prog4,
          recipe_prog5: res.attr().recipe_prog5,
          operation_num: res.attr().operation_num,
          operation_prog: res.attr().operation_prog,
          last_select_recipe: res.attr().last_select_recipe,
          area_prog: res.attr().area_prog,
          is_complete: res.number("is_complete"),
        }

        eArray.push(event_data);
      });
    }
    else if (version == 29) {
      $(data).element("event_1").elements("watch_data").forEach((res) => {
        if (!(_.isNil(res.element("channel")))) {
          event_data = {
            last_select_channel: res.attr().last_select_channel,
            platform_id: res.attr().platform_id,
            platform_prog: res.attr().platform_prog,
            play_num: res.attr().play_num,
          };

          event_sub_data = {
            platform_id: res.attr().platform_id,
            channel_id: res.element("channel").attr().channel_id,
            gauge: res.element("channel").attr().gauge,
            channel_play_num: res.element("channel").attr().play_num,
            is_complete: res.element("channel").number("is_complete"),
          }
        } else {
          event_data = {
            last_select_channel: res.attr().last_select_channel,
            platform_id: res.attr().platform_id,
            platform_prog: res.attr().platform_prog,
            play_num: res.attr().play_num,
          }

          event_sub_data = {
            platform_id: res.attr().platform_id,
            channel_id: 0,
            gauge: 0,
            channel_play_num: 0,
            is_complete: 0,
          }
        }

        eArray.push([event_data, event_sub_data]);
      });
    }
    else if (version == 30) {
      $(data).element("event_1").elements("flyer_data").forEach((res) => {
        if (!(_.isNil(res.element("genre_data")))) {
          event_data = {
            last_select_genre: res.attr().last_select_genre,
            flyer_id: res.attr().flyer_id,
            flyer_prog: res.attr().flyer_prog,
            play_num: res.attr().play_num,
            skill_param: res.attr().skill_param,
          };

          event_sub_data = {
            flyer_id: res.attr().flyer_id,
            genre_id: res.element("genre_data").attr().genre_id,
            gauge: res.element("genre_data").attr().gauge,
            genre_playnum: res.element("genre_data").attr().play_num,
            is_complete: res.element("genre_data").number("is_complete"),
          }
        } else {
          event_data = {
            last_select_genre: res.attr().last_select_genre,
            flyer_id: res.attr().flyer_id,
            flyer_prog: res.attr().flyer_prog,
            play_num: res.attr().play_num,
            skill_param: res.attr().skill_param,
          };

          event_sub_data = {
            flyer_id: res.attr().flyer_id,
            genre_id: 0,
            gauge: 0,
            genre_playnum: 0,
            is_complete: 0,
          }
        }

        eArray.push([event_data, event_sub_data]);
      });
    }
  }

  let badge_data = [];
  if (hasBadgeData) {
    // possible multiple data if flg_id exists //
    /* [save (total : 6) ]
       today_recommend (flg)
       weekly_recommend (flg)
       visitor (flg_id, flg) [1]
       notes_rader (flg_id, flg) [2]
       world_tourism (flg)
       event1 (flg_id, flg) [10]
    */

    /* [get]
       category_id // 0~9
       badge_flg_id
       badge_flg
    */

    let badge = $(data).element("badge");
    if (!(_.isNil(badge.element("today_recommend")))) {
      let badgeInfo = {
        category_id: "today_recommend",
        flg: parseInt(badge.element("today_recommend").attr().flg),
      };

      badge_data.push(badgeInfo);
    }

    if (!(_.isNil(badge.element("weekly_recommend")))) {
      let badgeInfo = {
        category_id: "weekly_recommend",
        flg: parseInt(badge.element("weekly_recommend").attr().flg),
      };

      badge_data.push(badgeInfo);
    }

    if (!(_.isNil(badge.element("visitor")))) {
      badge.elements("visitor").forEach((res) => {
        let badgeInfo = {
          category_id: "visitor",
          flg_id: parseInt(res.attr().flg_id),
          flg: parseInt(res.attr().flg),
        };

        badge_data.push(badgeInfo);
      });
    } 

    if (!(_.isNil(badge.element("notes_radar")))) {
      badge.elements("notes_radar").forEach((res) => {
        let badgeInfo = {
          category_id: "notes_radar",
          flg_id: parseInt(res.attr().flg_id),
          flg: parseInt(res.attr().flg),
        };

        badge_data.push(badgeInfo);
      });
    }

    if (!(_.isNil(badge.element("world_tourism")))) {
      let badgeInfo = {
        category_id: "world_tourism",
        flg: parseInt(badge.element("world_tourism").attr().flg),
      };

      badge_data.push(badgeInfo);
    }

    if (!(_.isNil(badge.element("event1")))) {
      badge.elements("event1").forEach((res) => {
        let badgeInfo = {
          category_id: "event1",
          flg_id: parseInt(res.attr().flg_id),
          flg: parseInt(res.attr().flg),
        };

        badge_data.push(badgeInfo);
      });
    }

    // TODO:: Figure category_name to category_id //
  }

  // cursed //
  if (hasSkinData) {
    let skinData = $(data).elements("skin_equip");
    let note_burst, bomb_size, turntable, judge_font,
      note_skin, note_size, lane_cover, pacemaker_cover, 
      lift_cover, note_beam, note_beam_size, full_combo_splash;

    skinData.forEach((res) => {
      if (parseInt(res.attr().skin_id) == 1) { note_burst = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 2) { bomb_size = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 3) { turntable = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 4) { judge_font = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 5) { note_skin = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 6) { note_size = parseInt(res.attr().skin_no); }

      else if (parseInt(res.attr().skin_id) == 13) { lane_cover = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 14) { pacemaker_cover = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 15) { lift_cover = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 16) { note_beam = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 17) { note_beam_size = parseInt(res.attr().skin_no); }
      else if (parseInt(res.attr().skin_id) == 18) { full_combo_splash = parseInt(res.attr().skin_no); }
    });

    await DB.Upsert<settings>(
      refid,
      {
        collection: "settings",
      },
      {
        $set: {
          note_burst,
          bomb_size,
          turntable,
          judge_font,
          note_skin,
          note_size,

          lane_cover,
          pacemaker_cover,
          lift_cover,
          note_beam,
          note_beam_size,
          full_combo_splash,
        }
      });
  }

  if (isTDJ && hasTDJSkinData) {
    let skinData = $(data).elements("tdjskin_equip");
    let premium_area;

    skinData.forEach((res) => {
      if (parseInt(res.attr().skin_id) == 0) { premium_area = parseInt(res.attr().skin_no); }
    });

    await DB.Upsert<settings>(
      refid,
      {
        collection: "settings",
      },
      {
        $set: {
          premium_area,
        }
      });
  }

  if (version == 27) {
    await DB.Upsert<pc_data>(
      refid,
      {
        collection: "pc_data",
        version: version,
      },
      {
        $set: {
          deller:
            pc_data.deller + parseInt($(data).element("deller").attr().deller),

          trophy: $(data)
            .element("achievements")
            .bigints("trophy")
            .slice(0, 10)
            .map(String),

          sprank: sprank,
          sppoint: sppoint,
          dprank: dprank,
          dppoint: dppoint,

          spradar: spradar,
          dpradar: dpradar,

          dp_clear_mission_clear: dp_clear_mission_clear,
          dp_clear_mission_level: dp_clear_mission_level,
          dp_dj_mission_clear: dp_dj_mission_clear,
          dp_dj_mission_level: dp_dj_mission_level,
          dp_level: dp_level,
          dp_mission_point: dp_mission_point,
          dp_mplay: dp_mplay,
          enemy_damage: enemy_damage,
          progress: progress,
          sp_clear_mission_clear: sp_clear_mission_clear,
          sp_clear_mission_level: sp_clear_mission_level,
          sp_dj_mission_clear: sp_dj_mission_clear,
          sp_dj_mission_level: sp_dj_mission_level,
          sp_level: sp_level,
          sp_mission_point: sp_mission_point,
          sp_mplay: sp_mplay,
          tips_read_list: tips_read_list,

          dpnum: dpnum,
          d_auto_scrach: parseInt($(data).attr().d_auto_scrach),
          d_camera_layout: parseInt($(data).attr().d_camera_layout),
          d_disp_judge: parseInt($(data).attr().d_disp_judge),
          d_gauge_disp: parseInt($(data).attr().d_gauge_disp),
          d_ghost_score: parseInt($(data).attr().d_ghost_score),
          d_gno: parseInt($(data).attr().d_gno),
          d_graph_score: parseInt($(data).attr().d_graph_score),
          d_gtype: parseInt($(data).attr().d_gtype),
          d_hispeed: parseFloat($(data).attr().d_hispeed),
          d_judge: parseInt($(data).attr().d_judge),
          d_judgeAdj: parseInt($(data).attr().d_judgeAdj),
          d_lane_brignt: parseInt($(data).attr().d_lane_brignt),
          d_liflen: d_liflen,
          d_notes: parseFloat($(data).attr().d_notes),
          d_opstyle: parseInt($(data).attr().d_opstyle),
          d_pace: parseInt($(data).attr().d_pace),
          d_sdlen: parseInt($(data).attr().d_sdlen),
          d_sdtype: parseInt($(data).attr().d_sdtype),
          d_sorttype: parseInt($(data).attr().d_sorttype),
          d_timing: parseInt($(data).attr().d_timing),
          d_tsujigiri_disp: parseInt($(data).attr().d_tsujigiri_disp),
          dach: parseInt($(data).attr().d_achi),
          dp_opt: $(data).attr().dp_opt,
          dp_opt2: $(data).attr().dp_opt2,
          d_sub_gno: parseInt($(data).attr().d_sub_gno),

          gpos: parseInt($(data).attr().gpos),
          mode: parseInt($(data).attr().mode),
          pmode: parseInt($(data).attr().pmode),
          rtype: parseInt($(data).attr().rtype),

          spnum: spnum,
          s_auto_scrach: parseInt($(data).attr().s_auto_scrach),
          s_camera_layout: parseInt($(data).attr().s_camera_layout),
          s_disp_judge: parseInt($(data).attr().s_disp_judge),
          s_gauge_disp: parseInt($(data).attr().s_gauge_disp),
          s_ghost_score: parseInt($(data).attr().s_ghost_score),
          s_gno: parseInt($(data).attr().s_gno),
          s_graph_score: parseInt($(data).attr().s_graph_score),
          s_gtype: parseInt($(data).attr().s_gtype),
          s_hispeed: parseFloat($(data).attr().s_hispeed),
          s_judge: parseInt($(data).attr().s_judge),
          s_judgeAdj: parseInt($(data).attr().s_judgeAdj),
          s_lane_brignt: parseInt($(data).attr().s_lane_brignt),
          s_liflen: s_liflen,
          s_notes: parseFloat($(data).attr().s_notes),
          s_opstyle: parseInt($(data).attr().s_opstyle),
          s_pace: parseInt($(data).attr().s_pace),
          s_sdlen: parseInt($(data).attr().s_sdlen),
          s_sdtype: parseInt($(data).attr().s_sdtype),
          s_sorttype: parseInt($(data).attr().s_sorttype),
          s_timing: parseInt($(data).attr().s_timing),
          s_tsujigiri_disp: parseInt($(data).attr().s_tsujigiri_disp),
          sach: parseInt($(data).attr().s_achi),
          sp_opt: $(data).attr().sp_opt,
          s_sub_gno: parseInt($(data).attr().s_sub_gno),
        },
      }
    );

    // lightning_stuffs //
    if (isTDJ) {
      await DB.Upsert<lightning_playdata>(
        refid,
        {
          collection: "lightning_playdata",
          version: version,
        },
        {
          $set: {
            sp_num: lightning_spnum,
            dp_num: lightning_dpnum,
          },
        }
      );

      await DB.Upsert<lightning_settings>(
        refid,
        {
          collection: "lightning_settings",
          version: version,
        },
        {
          $set: {
            skin: lightning_skin,
            skin_2: lightning_skin_2,

            headphone_vol: lightning_headphone_vol,

            resistance_sp_left: lightning_resistance_sp_1,
            resistance_sp_right: lightning_resistance_sp_2,
            resistance_dp_left: lightning_resistance_dp_1,
            resistance_dp_right: lightning_resistance_dp_2,

            vefx: lightning_vefx,
            light: lightning_light,
            concentration: lightning_concentration,
          },
        }
      );
    }

    // language //
    if (hasLanguageData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            language: parseInt($(data).element("language_setting").attr().language),
          },
        }
      );
    }

    // event_1 //
    if (hasEventData) {
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            event_play_num: event_play_num,
            event_last_select_gym_id: parseInt($(data).element("event1").attr().last_select_gym_id),
          }
        });

      eArray.forEach((res) => {
        DB.Upsert(
          refid,
          {
            collection: "event_1",
            version: version,
            gym_id: res.gym_id
          },
          {
            $set: res,
          });
      });
    }
  }
  else if (version == 28) {
    await DB.Upsert<pc_data>(
      refid,
      {
        collection: "pc_data",
        version: version,
      },
      {
        $set: {
          deller:
            pc_data.deller + parseInt($(data).element("deller").attr().deller),

          trophy: $(data)
            .element("achievements")
            .bigints("trophy")
            .slice(0, 10)
            .map(String),

          sprank: sprank,
          sppoint: sppoint,
          dprank: dprank,
          dppoint: dppoint,

          spradar: spradar,
          dpradar: dpradar,

          dp_clear_mission_clear: dp_clear_mission_clear,
          dp_clear_mission_level: dp_clear_mission_level,
          dp_dj_mission_clear: dp_dj_mission_clear,
          dp_dj_mission_level: dp_dj_mission_level,
          dp_level: dp_level,
          dp_mission_point: dp_mission_point,
          dp_mplay: dp_mplay,
          enemy_damage: enemy_damage,
          progress: progress,
          sp_clear_mission_clear: sp_clear_mission_clear,
          sp_clear_mission_level: sp_clear_mission_level,
          sp_dj_mission_clear: sp_dj_mission_clear,
          sp_dj_mission_level: sp_dj_mission_level,
          sp_level: sp_level,
          sp_mission_point: sp_mission_point,
          sp_mplay: sp_mplay,
          tips_read_list: tips_read_list,

          dpnum: dpnum,
          d_auto_scrach: parseInt($(data).attr().d_auto_scrach),
          d_camera_layout: parseInt($(data).attr().d_camera_layout),
          d_disp_judge: parseInt($(data).attr().d_disp_judge),
          d_gauge_disp: parseInt($(data).attr().d_gauge_disp),
          d_ghost_score: parseInt($(data).attr().d_ghost_score),
          d_gno: parseInt($(data).attr().d_gno),
          d_graph_score: parseInt($(data).attr().d_graph_score),
          d_gtype: parseInt($(data).attr().d_gtype),
          d_hispeed: parseFloat($(data).attr().d_hispeed),
          d_judge: parseInt($(data).attr().d_judge),
          d_judgeAdj: parseInt($(data).attr().d_judgeAdj),
          d_lane_brignt: parseInt($(data).attr().d_lane_brignt),
          d_liflen: d_liflen,
          d_notes: parseFloat($(data).attr().d_notes),
          d_opstyle: parseInt($(data).attr().d_opstyle),
          d_pace: parseInt($(data).attr().d_pace),
          d_sdlen: parseInt($(data).attr().d_sdlen),
          d_sdtype: parseInt($(data).attr().d_sdtype),
          d_sorttype: parseInt($(data).attr().d_sorttype),
          d_timing: parseInt($(data).attr().d_timing),
          d_tsujigiri_disp: parseInt($(data).attr().d_tsujigiri_disp),
          dach: parseInt($(data).attr().d_achi),
          dp_opt: $(data).attr().dp_opt,
          dp_opt2: $(data).attr().dp_opt2,
          d_sub_gno: parseInt($(data).attr().d_sub_gno),

          gpos: parseInt($(data).attr().gpos),
          mode: parseInt($(data).attr().mode),
          pmode: parseInt($(data).attr().pmode),
          rtype: parseInt($(data).attr().rtype),
          ngrade: parseInt($(data).attr().ngrade),

          spnum: spnum,
          s_auto_scrach: parseInt($(data).attr().s_auto_scrach),
          s_camera_layout: parseInt($(data).attr().s_camera_layout),
          s_disp_judge: parseInt($(data).attr().s_disp_judge),
          s_gauge_disp: parseInt($(data).attr().s_gauge_disp),
          s_ghost_score: parseInt($(data).attr().s_ghost_score),
          s_gno: parseInt($(data).attr().s_gno),
          s_graph_score: parseInt($(data).attr().s_graph_score),
          s_gtype: parseInt($(data).attr().s_gtype),
          s_hispeed: parseFloat($(data).attr().s_hispeed),
          s_judge: parseInt($(data).attr().s_judge),
          s_judgeAdj: parseInt($(data).attr().s_judgeAdj),
          s_lane_brignt: parseInt($(data).attr().s_lane_brignt),
          s_liflen: s_liflen,
          s_notes: parseFloat($(data).attr().s_notes),
          s_opstyle: parseInt($(data).attr().s_opstyle),
          s_pace: parseInt($(data).attr().s_pace),
          s_sdlen: parseInt($(data).attr().s_sdlen),
          s_sdtype: parseInt($(data).attr().s_sdtype),
          s_sorttype: parseInt($(data).attr().s_sorttype),
          s_timing: parseInt($(data).attr().s_timing),
          s_tsujigiri_disp: parseInt($(data).attr().s_tsujigiri_disp),
          sach: parseInt($(data).attr().s_achi),
          sp_opt: $(data).attr().sp_opt,
          s_sub_gno: parseInt($(data).attr().s_sub_gno),
        },
      }
    );

    // lightning_stuffs //
    if (isTDJ) {
      await DB.Upsert<lightning_playdata>(
        refid,
        {
          collection: "lightning_playdata",
          version: version,
        },
        {
          $set: {
            sp_num: lightning_spnum,
            dp_num: lightning_dpnum,
          },
        }
      );

      await DB.Upsert<lightning_settings>(
        refid,
        {
          collection: "lightning_settings",
          version: version,
        },
        {
          $set: {
            skin: lightning_skin,
            skin_2: lightning_skin_2,

            headphone_vol: lightning_headphone_vol,

            resistance_sp_left: lightning_resistance_sp_1,
            resistance_sp_right: lightning_resistance_sp_2,
            resistance_dp_left: lightning_resistance_dp_1,
            resistance_dp_right: lightning_resistance_dp_2,

            vefx: lightning_vefx,
            light: lightning_light,
            concentration: lightning_concentration,
          },
        }
      );

      if (hasMusicMemo) {
        music_memo.forEach((res) => {
          DB.Upsert<lightning_musicmemo_old>(
            refid,
            {
              collection: "lightning_musicmemo_old",
              version: version,
              music_idx: res.music_idx,
              play_style: res.play_style,
            },
            {
              $set: {
                music_id: res.music_id,
              },
            });
        });
      }
    }

    // language //
    if (hasLanguageData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            language: parseInt($(data).element("language_setting").attr().language),
          },
        }
      );
    }

    // event_1 //
    if (hasEventData) {
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            event_play_num: event_play_num,
            event_story_prog: parseInt($(data).element("event_1").attr().story_prog),
            event_last_select_area_id: parseInt($(data).element("event_1").attr().last_select_area_id),
            event_failed_num: parseInt($(data).element("event_1").attr().failed_num),
          }
        });

      eArray.forEach((res) => {
        DB.Upsert(refid, {
          collection: "event_1",
          version: version,
          area_id: res.area_id
        },
        {
          $set: res,
        });
      });
    }
  } 
  else if (version == 29) {
    await DB.Upsert<pc_data>(
      refid,
      {
        collection: "pc_data",
        version: version,
      },
      {
        $set: {
          deller:
            pc_data.deller + parseInt($(data).element("deller").attr().deller),

          trophy: $(data)
            .element("achievements")
            .bigints("trophy")
            .slice(0, 10)
            .map(String),

          sprank: sprank,
          sppoint: sppoint,
          dprank: dprank,
          dppoint: dppoint,

          spradar: spradar,
          dpradar: dpradar,

          dp_level: dp_level,
          dp_mplay: dp_mplay,
          enemy_damage: enemy_damage,
          enemy_defeat_flg: enemy_defeat_flg,
          mission_clear_num: mission_clear_num,
          progress: progress,
          sp_level: sp_level,
          sp_mplay: sp_mplay,
          tips_read_list: tips_read_list,
          total_point: total_point,

          dpnum: dpnum,
          d_auto_scrach: parseInt($(data).attr().d_auto_scrach),
          d_camera_layout: parseInt($(data).attr().d_camera_layout),
          d_disp_judge: parseInt($(data).attr().d_disp_judge),
          d_gauge_disp: parseInt($(data).attr().d_gauge_disp),
          d_ghost_score: parseInt($(data).attr().d_ghost_score),
          d_gno: parseInt($(data).attr().d_gno),
          d_graph_score: parseInt($(data).attr().d_graph_score),
          d_gtype: parseInt($(data).attr().d_gtype),
          d_hispeed: parseFloat($(data).attr().d_hispeed),
          d_judge: parseInt($(data).attr().d_judge),
          d_judgeAdj: parseInt($(data).attr().d_judgeAdj),
          d_lane_brignt: parseInt($(data).attr().d_lane_brignt),
          d_liflen: d_liflen,
          d_notes: parseFloat($(data).attr().d_notes),
          d_opstyle: parseInt($(data).attr().d_opstyle),
          d_pace: parseInt($(data).attr().d_pace),
          d_sdlen: parseInt($(data).attr().d_sdlen),
          d_sdtype: parseInt($(data).attr().d_sdtype),
          d_sorttype: parseInt($(data).attr().d_sorttype),
          d_timing: parseInt($(data).attr().d_timing),
          d_tsujigiri_disp: parseInt($(data).attr().d_tsujigiri_disp),
          dach: parseInt($(data).attr().d_achi),
          dp_opt: $(data).attr().dp_opt,
          dp_opt2: $(data).attr().dp_opt2,
          d_sub_gno: parseInt($(data).attr().d_sub_gno),

          gpos: parseInt($(data).attr().gpos),
          mode: parseInt($(data).attr().mode),
          pmode: parseInt($(data).attr().pmode),
          rtype: parseInt($(data).attr().rtype),
          ngrade: parseInt($(data).attr().ngrade),

          spnum: spnum,
          s_auto_scrach: parseInt($(data).attr().s_auto_scrach),
          s_camera_layout: parseInt($(data).attr().s_camera_layout),
          s_disp_judge: parseInt($(data).attr().s_disp_judge),
          s_gauge_disp: parseInt($(data).attr().s_gauge_disp),
          s_ghost_score: parseInt($(data).attr().s_ghost_score),
          s_gno: parseInt($(data).attr().s_gno),
          s_graph_score: parseInt($(data).attr().s_graph_score),
          s_gtype: parseInt($(data).attr().s_gtype),
          s_hispeed: parseFloat($(data).attr().s_hispeed),
          s_judge: parseInt($(data).attr().s_judge),
          s_judgeAdj: parseInt($(data).attr().s_judgeAdj),
          s_lane_brignt: parseInt($(data).attr().s_lane_brignt),
          s_liflen: s_liflen,
          s_notes: parseFloat($(data).attr().s_notes),
          s_opstyle: parseInt($(data).attr().s_opstyle),
          s_pace: parseInt($(data).attr().s_pace),
          s_sdlen: parseInt($(data).attr().s_sdlen),
          s_sdtype: parseInt($(data).attr().s_sdtype),
          s_sorttype: parseInt($(data).attr().s_sorttype),
          s_timing: parseInt($(data).attr().s_timing),
          s_tsujigiri_disp: parseInt($(data).attr().s_tsujigiri_disp),
          sach: parseInt($(data).attr().s_achi),
          sp_opt: $(data).attr().sp_opt,
          s_sub_gno: parseInt($(data).attr().s_sub_gno),
		      s_auto_adjust: parseInt($(data).attr().s_auto_adjust),
		      d_auto_adjust: parseInt($(data).attr().d_auto_adjust),
        },
      }
    );

    // lightning_stuffs //
    if (isTDJ) {
      await DB.Upsert<lightning_playdata>(
        refid,
        {
          collection: "lightning_playdata",
          version: version,
        },
        {
          $set: {
            sp_num: lightning_spnum,
            dp_num: lightning_dpnum,
          },
        }
      );

      await DB.Upsert<lightning_settings>(
        refid,
        {
          collection: "lightning_settings",
          version: version,
        },
        {
          $set: {
            skin: lightning_skin,
            skin_2: lightning_skin_2,

            headphone_vol: lightning_headphone_vol,

            resistance_sp_left: lightning_resistance_sp_1,
            resistance_sp_right: lightning_resistance_sp_2,
            resistance_dp_left: lightning_resistance_dp_1,
            resistance_dp_right: lightning_resistance_dp_2,

            vefx: lightning_vefx,
            light: lightning_light,
            concentration: lightning_concentration,
          },
        }
      );

      if (hasMusicMemo) {
        music_memo.forEach((res) => {
          DB.Upsert<lightning_musicmemo_old>(
            refid,
            {
              collection: "lightning_musicmemo_old",
              version: version,
              music_idx: res.music_idx,
              play_style: res.play_style,
            },
            {
              $set: {
                music_id: res.music_id,
              },
            });
        });
      }
    }

    // language //
    if (hasLanguageData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            language: parseInt($(data).element("language_setting").attr().language),
          },
        }
      );
    }

    // tower //
    if (hasTowerData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            tower_kbd: tower_kbd,
            tower_scr: tower_scr,
          },
        }
      );
    }

    // event_1 //
    if (hasEventData) {
      await DB.Upsert<pc_data>(refid, {
        collection: "pc_data",
        version: version,
      },
      {
        $set: {
          event_play_num: event_play_num,
          event_last_platform_id: parseInt($(data).element("event_1").attr().last_select_platform_id),
          event_last_platform_type: parseInt($(data).element("event_1").attr().last_select_platform_type),
        }
      });

      eArray.forEach((res) => {
        DB.Upsert(refid, {
          collection: "event_1",
          version: version,
          platform_id: res[0].platform_id
        },
        {
          $set: res[0],
        });

        DB.Upsert(refid, {
          collection: "event_1_sub",
          version: version,
          platform_id: res[1].platform_id,
          channel_id: res[1].channel_id,
        },
        {
          $set: res[1],
        });
      });
    }
  }
  else if (version == 30) {
    await DB.Upsert<pc_data>(
      refid,
      {
        collection: "pc_data",
        version: version,
      },
      {
        $set: {
          deller:
            pc_data.deller + parseInt($(data).element("deller").attr().deller),

          trophy: $(data)
            .element("achievements")
            .bigints("trophy")
            .slice(0, 10)
            .map(String),

          sprank: sprank,
          sppoint: sppoint,
          dprank: dprank,
          dppoint: dppoint,

          spradar: spradar,
          dpradar: dpradar,

          dp_fluctuation: dp_fluctuation,
          dp_level: dp_level,
          dp_mplay: dp_mplay,
          enemy_damage: enemy_damage,
          enemy_defeat_flg: enemy_defeat_flg,
          mission_clear_num: mission_clear_num,
          progress: progress,
          sp_fluctuation: sp_fluctuation,
          sp_level: sp_level,
          sp_mplay: sp_mplay,
          tips_read_list: tips_read_list,
          total_point: total_point,

          dpnum: dpnum,
          d_auto_scrach: parseInt($(data).attr().d_auto_scrach),
          d_camera_layout: parseInt($(data).attr().d_camera_layout),
          d_disp_judge: parseInt($(data).attr().d_disp_judge),
          d_gauge_disp: parseInt($(data).attr().d_gauge_disp),
          d_ghost_score: parseInt($(data).attr().d_ghost_score),
          d_gno: parseInt($(data).attr().d_gno),
          d_graph_score: parseInt($(data).attr().d_graph_score),
          d_gtype: parseInt($(data).attr().d_gtype),
          d_hispeed: parseFloat($(data).attr().d_hispeed),
          d_judge: parseInt($(data).attr().d_judge),
          d_judgeAdj: parseInt($(data).attr().d_judgeAdj),
          d_lane_brignt: parseInt($(data).attr().d_lane_brignt),
          d_liflen: d_liflen,
          d_notes: parseFloat($(data).attr().d_notes),
          d_opstyle: parseInt($(data).attr().d_opstyle),
          d_pace: parseInt($(data).attr().d_pace),
          d_sdlen: parseInt($(data).attr().d_sdlen),
          d_sdtype: parseInt($(data).attr().d_sdtype),
          d_sorttype: parseInt($(data).attr().d_sorttype),
          d_timing: parseInt($(data).attr().d_timing),
          d_timing_split: parseInt($(data).attr().d_timing_split),
          d_tsujigiri_disp: parseInt($(data).attr().d_tsujigiri_disp),
          d_visualization: parseInt($(data).attr().d_visualization),
          dach: parseInt($(data).attr().d_achi),
          dp_opt: $(data).attr().dp_opt,
          dp_opt2: $(data).attr().dp_opt2,
          d_sub_gno: parseInt($(data).attr().d_sub_gno),

          gpos: parseInt($(data).attr().gpos),
          mode: parseInt($(data).attr().mode),
          pmode: parseInt($(data).attr().pmode),
          rtype: parseInt($(data).attr().rtype),
          ngrade: parseInt($(data).attr().ngrade),

          spnum: spnum,
          s_auto_scrach: parseInt($(data).attr().s_auto_scrach),
          s_camera_layout: parseInt($(data).attr().s_camera_layout),
          s_disp_judge: parseInt($(data).attr().s_disp_judge),
          s_gauge_disp: parseInt($(data).attr().s_gauge_disp),
          s_ghost_score: parseInt($(data).attr().s_ghost_score),
          s_gno: parseInt($(data).attr().s_gno),
          s_graph_score: parseInt($(data).attr().s_graph_score),
          s_gtype: parseInt($(data).attr().s_gtype),
          s_hispeed: parseFloat($(data).attr().s_hispeed),
          s_judge: parseInt($(data).attr().s_judge),
          s_judgeAdj: parseInt($(data).attr().s_judgeAdj),
          s_lane_brignt: parseInt($(data).attr().s_lane_brignt),
          s_liflen: s_liflen,
          s_notes: parseFloat($(data).attr().s_notes),
          s_opstyle: parseInt($(data).attr().s_opstyle),
          s_pace: parseInt($(data).attr().s_pace),
          s_sdlen: parseInt($(data).attr().s_sdlen),
          s_sdtype: parseInt($(data).attr().s_sdtype),
          s_sorttype: parseInt($(data).attr().s_sorttype),
          s_timing: parseInt($(data).attr().s_timing),
          s_timing_split: parseInt($(data).attr().s_timing_split),
          s_tsujigiri_disp: parseInt($(data).attr().s_tsujigiri_disp),
          s_visualization: parseInt($(data).attr().s_visualization),
          sach: parseInt($(data).attr().s_achi),
          sp_opt: $(data).attr().sp_opt,
          s_sub_gno: parseInt($(data).attr().s_sub_gno),
		  s_auto_adjust: parseInt($(data).attr().s_auto_adjust),
		  d_auto_adjust: parseInt($(data).attr().d_auto_adjust),
        },
      }
    );

    // lightning_stuffs //
    if (isTDJ) {
      await DB.Upsert<lightning_playdata>(
        refid,
        {
          collection: "lightning_playdata",
          version: version,
        },
        {
          $set: {
            sp_num: lightning_spnum,
            dp_num: lightning_dpnum,
          },
        }
      );

      await DB.Upsert<lightning_settings>(
        refid,
        {
          collection: "lightning_settings",
          version: version,
        },
        {
          $set: {
            skin: lightning_skin,
            skin_2: lightning_skin_2,

            headphone_vol: lightning_headphone_vol,

            resistance_sp_left: lightning_resistance_sp_1,
            resistance_sp_right: lightning_resistance_sp_2,
            resistance_dp_left: lightning_resistance_dp_1,
            resistance_dp_right: lightning_resistance_dp_2,

            vefx: lightning_vefx,
            light: lightning_light,
            concentration: lightning_concentration,
          },
        }
      );

      if (hasMusicMemo) {
        music_memo.forEach((res) => {
          DB.Upsert<lightning_musicmemo>(
            refid,
            {
              collection: "lightning_musicmemo",
              version: version,
              folder_idx: res.folder_idx,
              play_style: res.play_style,
            },
            {
              $set: {
                folder_name: res.folder_name,
                music_ids: res.music_ids,
              },
            });
        });
      }
    }

    // language //
    if (hasLanguageData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            language: parseInt($(data).element("language_setting").attr().language),
          },
        }
      );
    }

    // tower //
    if (hasTowerData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            tower_kbd: tower_kbd,
            tower_scr: tower_scr,
          },
        }
      );
    }

    // event_1 //
    if (hasEventData) {
      await DB.Upsert<pc_data>(refid, {
        collection: "pc_data",
        version: version,
      },
      {
        $set: {
          event_play_num: event_play_num,
          event_last_select_flyer_id: parseInt($(data).element("event_1").attr().last_select_flyer_id),
        }
      });

      eArray.forEach((res) => {
        DB.Upsert(refid, {
          collection: "event_1",
          version: version,
          flyer_id: res[0].flyer_id
        },
        {
          $set: res[0],
        });

        DB.Upsert(refid, {
          collection: "event_1_sub",
          version: version,
          flyer_id: res[1].flyer_id,
          genre_id: res[1].genre_id,
        },
        {
          $set: res[1],
        });
      });
    }
  }
  else if (version == 31) {
    await DB.Upsert<pc_data>(
      refid,
      {
        collection: "pc_data",
        version: version,
      },
      {
        $set: {
          deller: pc_data.deller + parseInt($(data).element("deller").attr().deller),

          sprank: sprank,
          sppoint: sppoint,
          dprank: dprank,
          dppoint: dppoint,

          spradar: spradar,
          dpradar: dpradar,

          dp_fluctuation: dp_fluctuation,
          dp_level: dp_level,
          dp_mplay: dp_mplay,
          enemy_damage: enemy_damage,
          enemy_defeat_flg: enemy_defeat_flg,
          mission_clear_num: mission_clear_num,
          progress: progress,
          sp_fluctuation: sp_fluctuation,
          sp_level: sp_level,
          sp_mplay: sp_mplay,
          tips_read_list: tips_read_list,
          total_point: total_point,

          dpnum: dpnum,
          d_auto_scrach: parseInt($(data).attr().d_auto_scrach),
          d_camera_layout: parseInt($(data).attr().d_camera_layout),
          d_disp_judge: parseInt($(data).attr().d_disp_judge),
          d_gauge_disp: parseInt($(data).attr().d_gauge_disp),
          d_ghost_score: parseInt($(data).attr().d_ghost_score),
          d_gno: parseInt($(data).attr().d_gno),
          d_graph_score: parseInt($(data).attr().d_graph_score),
          d_gtype: parseInt($(data).attr().d_gtype),
          d_hispeed: parseFloat($(data).attr().d_hispeed),
          d_judge: parseInt($(data).attr().d_judge),
          d_judgeAdj: parseInt($(data).attr().d_judgeAdj),
          d_lane_brignt: parseInt($(data).attr().d_lane_brignt),
          d_liflen: d_liflen,
          d_notes: parseFloat($(data).attr().d_notes),
          d_opstyle: parseInt($(data).attr().d_opstyle),
          d_pace: parseInt($(data).attr().d_pace),
          d_sdlen: parseInt($(data).attr().d_sdlen),
          d_sdtype: parseInt($(data).attr().d_sdtype),
          d_sorttype: parseInt($(data).attr().d_sorttype),
          d_timing: parseInt($(data).attr().d_timing),
          d_timing_split: parseInt($(data).attr().d_timing_split),
          d_tsujigiri_disp: parseInt($(data).attr().d_tsujigiri_disp),
          d_visualization: parseInt($(data).attr().d_visualization),
          dach: parseInt($(data).attr().d_achi),
          dp_opt: $(data).attr().dp_opt,
          dp_opt2: $(data).attr().dp_opt2,
          d_sub_gno: parseInt($(data).attr().d_sub_gno),

          gpos: parseInt($(data).attr().gpos),
          mode: parseInt($(data).attr().mode),
          pmode: parseInt($(data).attr().pmode),
          rtype: parseInt($(data).attr().rtype),
          ngrade: parseInt($(data).attr().ngrade),

          spnum: spnum,
          s_auto_scrach: parseInt($(data).attr().s_auto_scrach),
          s_camera_layout: parseInt($(data).attr().s_camera_layout),
          s_disp_judge: parseInt($(data).attr().s_disp_judge),
          s_gauge_disp: parseInt($(data).attr().s_gauge_disp),
          s_ghost_score: parseInt($(data).attr().s_ghost_score),
          s_gno: parseInt($(data).attr().s_gno),
          s_graph_score: parseInt($(data).attr().s_graph_score),
          s_gtype: parseInt($(data).attr().s_gtype),
          s_hispeed: parseFloat($(data).attr().s_hispeed),
          s_judge: parseInt($(data).attr().s_judge),
          s_judgeAdj: parseInt($(data).attr().s_judgeAdj),
          s_lane_brignt: parseInt($(data).attr().s_lane_brignt),
          s_liflen: s_liflen,
          s_notes: parseFloat($(data).attr().s_notes),
          s_opstyle: parseInt($(data).attr().s_opstyle),
          s_pace: parseInt($(data).attr().s_pace),
          s_sdlen: parseInt($(data).attr().s_sdlen),
          s_sdtype: parseInt($(data).attr().s_sdtype),
          s_sorttype: parseInt($(data).attr().s_sorttype),
          s_timing: parseInt($(data).attr().s_timing),
          s_timing_split: parseInt($(data).attr().s_timing_split),
          s_tsujigiri_disp: parseInt($(data).attr().s_tsujigiri_disp),
          s_visualization: parseInt($(data).attr().s_visualization),
          sach: parseInt($(data).attr().s_achi),
          sp_opt: $(data).attr().sp_opt,
          s_sub_gno: parseInt($(data).attr().s_sub_gno),
          s_auto_adjust: parseInt($(data).attr().s_auto_adjust),
          d_auto_adjust: parseInt($(data).attr().d_auto_adjust),

          s_classic_hispeed: parseInt($(data).attr().s_classic_hispeed),
          d_classic_hispeed: parseInt($(data).attr().d_classic_hispeed),
        },
      }
    );

    // lightning_stuffs //
    if (isTDJ) {
      await DB.Upsert<lightning_playdata>(
        refid,
        {
          collection: "lightning_playdata",
          version: version,
        },
        {
          $set: {
            sp_num: lightning_spnum,
            dp_num: lightning_dpnum,
          },
        }
      );

      await DB.Upsert<lightning_settings>(
        refid,
        {
          collection: "lightning_settings",
          version: version,
        },
        {
          $set: {
            skin: lightning_skin,
            skin_2: lightning_skin_2,

            headphone_vol: lightning_headphone_vol,
            keyboard_kind: lightning_keyboard_kind,

            resistance_sp_left: lightning_resistance_sp_1,
            resistance_sp_right: lightning_resistance_sp_2,
            resistance_dp_left: lightning_resistance_dp_1,
            resistance_dp_right: lightning_resistance_dp_2,

            vefx: lightning_vefx,
            light: lightning_light,
            concentration: lightning_concentration,
          },
        }
      );

      if (hasMusicMemo) {
        music_memo.forEach((res) => {
          DB.Upsert<lightning_musicmemo>(
            refid,
            {
              collection: "lightning_musicmemo",
              version: version,
              folder_idx: res.folder_idx,
              play_style: res.play_style,
            },
            {
              $set: {
                folder_name: res.folder_name,
                music_ids: res.music_ids,
              },
            });
        });
      }

      if (hasMusicFilter) {
        music_filter.forEach((res) => {
          DB.Upsert<lightning_musicfilter>(
            refid,
            {
              collection: "lightning_musicfilter",
              version: version,
              folder_id: res.folder_id,
              filter_id: res.filter_id,
              play_style: res.play_style
            },
            {
              $set: {
                is_valid: res.is_valid,
                value0: res.value0,
                value1: res.value1,
              },
            });
        });
      }
    }

    // language //
    if (hasLanguageData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            language: parseInt($(data).element("language_setting").attr().language),
          },
        }
      );
    }

    // tower //
    if (hasTowerData) {
      await DB.Upsert<profile>(
        refid,
        {
          collection: "profile",
        },
        {
          $set: {
            tower_kbd: tower_kbd,
            tower_scr: tower_scr,
          },
        }
      );
    }
  }

  send.success();
};

export const pcvisit: EPR = async (info, data, send) => {
  send.object(K.ATTR({
    aflg: "1",
    anum: "1",
    pflg: "1",
    pnum: "1",
    sflg: "1",
    snum: "1",
  }));
};

export const pcgetlanegacha: EPR = async (info, data, send) => {
  const refid = $(data).attr().rid;
  const version = GetVersion(info);
  const strVersion = `IIDX${version}pc`;
  const settings = await DB.FindOne<settings>(refid, { collection: "settings" });

  let tArray = [];
  let fArray = [];
  for (let i = 0; i < 100; i++) {
    let random = randomIntRange(0, (7 * 6 * 5 * 4 * 3 * 2));

    let ticket = {
      id: i,
      arrange: random,
      expire: 4102326000,
    };

    tArray.push(ticket);
  }

  if (!(_.isNil(settings))) {
    if (!(_.isNil(settings.random_lane_ticket))) {
      if (settings.random_lane_ticket.length > 0) {
        for (let i = 0; i < settings.random_lane_ticket.length; i++) {
          if (i >= 100) break;

          let ticket = {
            id: (i + 100),
            arrange: settings.random_lane_ticket[i],
            expire: Math.floor(Date.now() / 1000),
          };

          tArray.push(ticket);
        }
      }
    }

    if (!(_.isNil(settings.random_lane_ticket_search))) {
      if (settings.random_lane_ticket_search.length > 0) {
        for (let i = 0; i < settings.random_lane_ticket_search.length; i++) {
          if (i >= 10) break;

          let favorite = {
            arrange: settings.random_lane_ticket_search[i],
          };

          fArray.push(favorite);
        }
      }
    }
  } 

  send.pugFile("pug/pcgetlanegacha.pug", {
    version: strVersion,
    tArray,
    fArray,
  });
};

export const pcgetcompeinfo: EPR = async (info, data, send) => {
  send.object({
    compe_status: K.ATTR({
      compe_status: "0",
    })
  });
};
