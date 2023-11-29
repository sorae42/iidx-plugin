import { score, score_detail, score_top } from "../models/score";
import { profile } from "../models/profile";
import { shop_data } from "../models/shop_data";
import { pc_data } from "../models/pc_data";
import { settings } from "../models/settings";
import { rival } from "../models/rival";
import { ShopRanking_list } from "../data/settingslist";
import {
  base64decode,
  ClidToRank,
  GetVersion,
  IIDXidTorefid,
  DateToName,
  buffToHex,
  refidToProfile,
  refidToQpro,
  refidToPd,
} from "../util";

export const musicreg: EPR = async (info, data, send) => {
  const iidxid = parseInt($(data).attr().iidxid);
  const version = GetVersion(info);
  const versionStr = `IIDX${version}music`;
  const refid = await IIDXidTorefid(iidxid);
  const profile = await DB.FindOne<profile>(refid, {
    collection: "profile",
  });
  const shop_data = await DB.FindOne<shop_data>({
    collection: "shop_data",
  });
  const pc_data = await DB.FindOne<pc_data>(refid, {
    collection: "pc_data",
    version: version,
  });
  const settings = await DB.FindOne<settings>(refid, {
    collection: "settings",
  });
  const qpro = {
    head: settings.qpro_head,
    hair: settings.qpro_hair,
    hand: settings.qpro_hand,
    face: settings.qpro_face,
    body: settings.qpro_body,
  };

  //譜面難易度(0がSPビギナー 4がSPレジェンダリア 5がDPビギナー(該当曲無し) 9がDPレジェンダリア)
  const clid = parseInt($(data).attr().clid);
  //musicid
  const music_id = parseInt($(data).element("music_play_log").attr().music_id);
  //SPが0 DPが1
  const style = parseInt($(data).element("music_play_log").attr().play_style);
  //譜面難易度(0がビギナー 4がレジェンダリア)
  const rank = parseInt($(data).element("music_play_log").attr().note_id);
  //クリア(0:noplay 1:failed 2:assisted 3:easy 4:normal 5:hard 6:exhard 7:fc)
  const clear = parseInt($(data).element("music_play_log").attr().clear_flg);
  //exscore
  const exscore = parseInt($(data).element("music_play_log").attr().ex_score);
  //ミスカウント
  const miss = parseInt($(data).element("music_play_log").attr().miss_num);
  //途中落ちかどうか(途中落ち:0 完走:1)
  const is_sudden_death = !$(data).element("music_play_log").bool("is_sudden_death");
  //ゴースト(base64)
  const ghost = $(data).element("music_play_log").buffer("ghost").toString("base64");
  // ghost_gauge //
  const ghost_gauge = $(data).element("music_play_log").buffer("ghost_gauge").toString("base64");
  const option = parseInt($(data).element("music_play_log").attr().option1);
  const option_2 = parseInt($(data).element("music_play_log").attr().option2);
  const rankside = parseInt($(data).attr().rankside);

  let mArray = [-1, music_id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1];
  let optArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let opt2Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let dbflg = 0;
  let update = 1;

  const music_data: score | null = await DB.FindOne<score>(refid, {
    collection: "score",
    music_id: music_id,
  });

  const score_temp: score_detail | null = await DB.FindOne<score_detail>(
    refid,
    {
      collection: "score_detail",
      music_id: music_id,

      clid: clid,
    }
  );

  //mArrayがDB内に見つかったら代入
  if (music_data) {
    if (!_.isNil(music_data.optArray)) {
      optArray = music_data.optArray;
      opt2Array = music_data.opt2Array;
    }

    if (style == 0 && music_data.spmArray) {
      mArray = music_data.spmArray;
      dbflg = 1;

      if (_.isNil(score_temp) &&
        (music_data.spmArray[rank + 2] != 0 ||
          music_data.spmArray[rank + 7] != 0)
      ) {
        await DB.Insert<score_detail>(refid, {
          collection: "score_detail",

          music_id: music_id,
          clid: clid,

          score: music_data.spmArray[rank + 7],
          clflg: music_data.spmArray[rank + 2],
          miss: music_data.spmArray[rank + 12],
          time: Date.now() - 86400000,
        });
      }
    } else if (style == 1 && music_data.dpmArray) {
      mArray = music_data.dpmArray;
      dbflg = 1;

      if (_.isNil(score_temp) &&
        (music_data.dpmArray[rank + 2] != 0 ||
          music_data.dpmArray[rank + 7] != 0)
      ) {
        await DB.Insert<score_detail>(refid, {
          collection: "score_detail",

          music_id: music_id,
          clid: clid,

          score: music_data.dpmArray[rank + 7],
          clflg: music_data.dpmArray[rank + 2],
          miss: music_data.dpmArray[rank + 12],
          time: Date.now() - 86400000,
        });
      }
    }
  }

  //クリアランプ
  mArray[rank + 2] = Math.max(clear, mArray[rank + 2]);
  optArray[clid] = option;
  opt2Array[clid] = option_2;

  // 完走の場合ミスカウントセーブ
  if (is_sudden_death) {
    // -1の場合大小比較出来ない為
    if (mArray[rank + 12] == -1) {
      mArray[rank + 12] = miss;
    } else {
      mArray[rank + 12] = Math.min(mArray[rank + 12], miss);
    }
  }
  if (style == 0) {
    if (mArray[rank + 7] < exscore || dbflg == 0) {
      //スコア
      mArray[rank + 7] = Math.max(exscore, mArray[rank + 7]);
      await DB.Upsert<score>(
        refid,
        {
          collection: "score",
          music_id: music_id,
        },
        {
          $set: {
            music_id: music_id,
            spmArray: mArray,
            [clid]: ghost,

            optArray: optArray,
            opt2Array: opt2Array,
            [clid + 10]: ghost_gauge,
          },
        }
      );
    } else {
      mArray[rank + 7] = Math.max(exscore, mArray[rank + 7]);
      update = 0;
      await DB.Upsert<score>(
        refid,
        {
          collection: "score",
          music_id: music_id,
        },
        {
          $set: {
            music_id: music_id,
            spmArray: mArray,
          },
        }
      );
    }
  } else if (style == 1) {
    if (mArray[rank + 7] < exscore || dbflg == 0) {
      mArray[rank + 7] = Math.max(exscore, mArray[rank + 7]);
      await DB.Upsert<score>(
        refid,
        {
          collection: "score",
          music_id: music_id,
        },
        {
          $set: {
            music_id: music_id,
            dpmArray: mArray,
            [clid]: ghost,

            optArray: optArray,
            opt2Array: opt2Array,
            [clid + 10]: ghost_gauge,
          },
        }
      );
    } else {
      mArray[rank + 7] = Math.max(exscore, mArray[rank + 7]);
      update = 0;
      await DB.Upsert<score>(
        refid,
        {
          collection: "score",
          music_id: music_id,
        },
        {
          $set: {
            music_id: music_id,
            dpmArray: mArray,
          },
        }
      );
    }
  }

  //スコア詳細
  await DB.Insert<score_detail>(refid, {
    collection: "score_detail",

    music_id: music_id,
    clid: clid,

    score: exscore,
    clflg: clear,
    miss: miss,

    time: Date.now(),
  });

  //スコア詳細ロード[スコア,クリアランプ]
  const scores = (
    await DB.Find<score_detail>(refid, {
      collection: "score_detail",
      music_id: music_id,

      clid: clid,
    })
  ).map((r) => [r.score, r.clflg, r.time]);

  scores.sort((a, b) => b[0] - a[0] || a[1] - b[1]);

  //スコアが5つの時削除(仮)
  if (scores.length >= 5) {
    const dscore = scores[4][0];
    const dclflg = scores[4][1];
    const dtime = scores[4][2];
    await DB.Remove<score_detail>(refid, {
      collection: "score_detail",

      music_id: music_id,
      clid: clid,

      score: dscore,
      clflg: dclflg,
      time: dtime,
    });
  }

  let ranklist = [];
  if (ShopRanking_list.indexOf(U.GetConfig("ShopRanking")) == 0) {
    //今プレイした順位を計算
    const currentrank = scores.findIndex(
      (item) => item[0] == exscore && item[1] == clear
    );

    const now = Date.now();

    scores.forEach((rankscore, index) => {
      if (index == currentrank) {
        ranklist.push({
          body: String(qpro.body),
          clflg: String(rankscore[1]),
          dgrade: String(pc_data.dgid),
          face: String(qpro.face),
          hair: String(qpro.hair),
          hand: String(qpro.hand),
          head: String(qpro.head),
          iidx_id: String(profile.iidxid),
          myFlg: "1",
          name: profile.name,
          opname: shop_data.shop_name,
          pid: String(profile.pid),
          rnum: String(index + 1),
          score: String(rankscore[0]),
          sgrade: String(pc_data.sgid),
          update: String(update),
        });
      } else {
        ranklist.push({
          body: String(qpro.body),
          clflg: String(rankscore[1]),
          dgrade: String(pc_data.dgid),
          face: String(qpro.face),
          hair: String(qpro.hair),
          hand: String(qpro.hand),
          head: String(qpro.head),
          iidx_id: String(profile.iidxid),
          myFlg: "0",
          name: DateToName(now, rankscore[2]),
          opname: shop_data.shop_name,
          pid: String(profile.pid),
          rnum: String(index + 1),
          score: String(rankscore[0]),
          sgrade: String(pc_data.sgid),
          update: "0",
        });
      }
    });
  } else if (ShopRanking_list.indexOf(U.GetConfig("ShopRanking")) == 1) {
    let pscores: any[][];
    if (style == 0) {
      pscores = (
        await DB.Find(null, {
          collection: "score",
          music_id: music_id,
          spmArray: { $exists: true },
        })
      ).map((r) => [r.spmArray[rank + 7], r.spmArray[rank + 2], r.__refid]);
    } else if (style == 1) {
      pscores = (
        await DB.Find(null, {
          collection: "score",
          music_id: music_id,
          dpmArray: { $exists: true },
        })
      ).map((r) => [r.dpmArray[rank + 7], r.dpmArray[rank + 2], r.__refid]);
    }
    pscores.sort((a, b) => b[0] - a[0]);
    const currentrank = pscores.findIndex((item) => item[2] == refid);

    pscores = await Promise.all(
      pscores.map(async (r) => [
        r[0],
        r[1],
        await refidToProfile(r[2]),
        await refidToQpro(r[2]),
        await refidToPd(r[2])
      ])
    );

    pscores.forEach((rankscore, index) => {
      if (index == currentrank) {
        ranklist.push({
          body: String(qpro.body),
          clflg: String(rankscore[1]),
          dgrade: String(pc_data.dgid),
          face: String(qpro.face),
          hair: String(qpro.hair),
          hand: String(qpro.hand),
          head: String(qpro.head),
          iidx_id: String(profile.iidxid),
          myFlg: "1",
          name: profile.name,
          opname: shop_data.shop_name,
          pid: String(profile.pid),
          rnum: String(index + 1),
          score: String(rankscore[0]),
          sgrade: String(pc_data.sgid),
          update: String(update),
        });
      } else if (rankscore[0] != 0 || rankscore[1] != 0) {
        ranklist.push({
          body: String(rankscore[3][3]),
          clflg: String(rankscore[1]),
          dgrade: String(rankscore[4][1]),
          face: String(rankscore[3][2]),
          hair: String(rankscore[3][0]),
          hand: String(rankscore[3][4]),
          head: String(rankscore[3][1]),
          iidx_id: String(rankscore[2][2]),
          myFlg: "0",
          name: rankscore[2][0],
          opname: shop_data.shop_name,
          pid: String(rankscore[2][1]),
          rnum: String(index + 1),
          score: String(rankscore[0]),
          sgrade: String(rankscore[4][0]),
          update: "0",
        });
      }
    });
  }

  // score_top //
  const score_top: score_top | null = await DB.FindOne<score_top>(null, {
    collection: "score_top",
    play_style: style,
    music_id: music_id,
  });
  let tmp_names = ["", "", "", "", ""];
  let tmp_scores = [-1, -1, -1, -1, -1];
  let tmp_clflgs = [-1, -1, -1, -1, -1];
  let tmp_clid = clid;
  if (style == 1) tmp_clid -= 5;
  if (_.isNil(score_top)) {
    if (mArray[rank + 7] > exscore) { // migration //
      tmp_names[tmp_clid] = profile.name;
      tmp_scores[tmp_clid] = mArray[rank + 7];
      tmp_clflgs[tmp_clid] = mArray[rank + 2];
    } else {
      tmp_names[tmp_clid] = profile.name;
      tmp_scores[tmp_clid] = Number(exscore);
      tmp_clflgs[tmp_clid] = Number(clear);
    }

    await DB.Upsert<score_top>({
        collection: "score_top",
        play_style: style,
        music_id: music_id
      },
      {
        $set: {
          names: tmp_names,
          scores: tmp_scores,
          clflgs: tmp_clflgs,
        }
      }
    );
  } else {
    if (score_top.scores[tmp_clid] < mArray[rank + 7]) { // migration //
      score_top.names[tmp_clid] = profile.name;
      score_top.scores[tmp_clid] = mArray[rank + 7];
      score_top.clflgs[tmp_clid] = mArray[rank + 2];
    } else if (score_top.scores[tmp_clid] < exscore) {
      score_top.names[tmp_clid] = profile.name;
      score_top.scores[tmp_clid] = Number(exscore);
      score_top.clflgs[tmp_clid] = Number(clear);
    }

    await DB.Upsert<score_top>({
      collection: "score_top",
      play_style: style,
      music_id: music_id,
    },
    {
      $set: {
        names: score_top.names,
        scores: score_top.scores,
        clflgs: score_top.clflgs,
      }
    });
  }

  send.pugFile("pug/musicreg.pug", {
    version: versionStr,

    total_user_num: ranklist.length,
    music_id,
    clid,
    rankside,

    ranklist,
  });
};

export const musicgetrank: EPR = async (info, data, send) => {
  const version = GetVersion(info);
  const versionStr = `IIDX${version}music`;
  const cltype = parseInt($(data).attr().cltype);
  const iidxid = parseInt($(data).attr().iidxid);
  const refid = await IIDXidTorefid(iidxid);

  const spmArray: any = (
    await DB.Find(refid, {
      collection: "score",
      spmArray: { $exists: true },
    })
  ).map((r) => r.spmArray);
  spmArray.sort((a: number, b: number) => a[1] - b[1]);

  const dpmArray: any = (
    await DB.Find(refid, {
      collection: "score",
      dpmArray: { $exists: true },
    })
  ).map((r) => r.dpmArray);
  dpmArray.sort((a: number, b: number) => a[1] - b[1]);

  const rival_refids = [
    [parseInt($(data).attr().iidxid0), await IIDXidTorefid(parseInt($(data).attr().iidxid0))],
    [parseInt($(data).attr().iidxid1), await IIDXidTorefid(parseInt($(data).attr().iidxid1))],
    [parseInt($(data).attr().iidxid2), await IIDXidTorefid(parseInt($(data).attr().iidxid2))],
    [parseInt($(data).attr().iidxid3), await IIDXidTorefid(parseInt($(data).attr().iidxid3))],
    [parseInt($(data).attr().iidxid4), await IIDXidTorefid(parseInt($(data).attr().iidxid4))],
    [parseInt($(data).attr().iidxid5), await IIDXidTorefid(parseInt($(data).attr().iidxid5))],
  ];

  const result: any = {
    style: cltype,
    m: [],
    top: [],
  };

  if (cltype == 0) {
    spmArray.forEach((m: number[]) => {
      result.m.push(m);
    });
  } else if (cltype == 1) {
    dpmArray.forEach((m: number[]) => {
      result.m.push(m);
    });
  }

  for (let i = 0; i < rival_refids.length; i++) {
    if (_.isNaN(rival_refids[i][0])) continue;
    if (version <= 29 && i > 4) continue;

    if (cltype == 0) {
      let rival_spmArray: any = (
        await DB.Find(String(rival_refids[i][1]), {
          collection: "score",
          spmArray: { $exists: true },
        })
      ).map((r) => r.spmArray);
      rival_spmArray.sort((a: number, b: number) => a[1] - b[1]);

      rival_spmArray.forEach((m: number[]) => {
        m[0] = i;

        result.m.push(m);
      });
    } else if (cltype == 1) {
      let rival_dpmArray: any = (
        await DB.Find(String(rival_refids[i][1]), {
          collection: "score",
          dpmArray: { $exists: true },
        })
      ).map((r) => r.dpmArray);
      rival_dpmArray.sort((a: number, b: number) => a[1] - b[1]);

      rival_dpmArray.forEach((m: number[]) => {
        m[0] = i;

        result.m.push(m);
      });
    }
  }

  const score_top = await DB.Find<score_top>({
    collection: "score_top",
    play_style: cltype,
  });

  if (score_top.length > 0) {
    score_top.forEach((res) => {
      result.top.push(res);
    });
  }

  send.pugFile("pug/musicgetrank.pug", {
    version: versionStr,

    style: result.style,
    mArray: result.m,
    tArray: result.top,
  });
};

export const musicappoint: EPR = async (info, data, send) => {
  const version = GetVersion(info);
  const iidxid = parseInt($(data).attr().iidxid);
  const refid = await IIDXidTorefid(iidxid);
  const music_id = parseInt($(data).attr().mid);
  const clid = parseInt($(data).attr().clid);
  const ctype = parseInt($(data).attr().ctype);
  const subtype = parseInt($(data).attr().subtype);
  const rank = ClidToRank(clid).rank;
  const style = ClidToRank(clid).style;

  // MY DATA //
  const music_data_sp = await DB.FindOne<score>(refid, {
    collection: "score",
    music_id: music_id,
    spmArray: { $exists: true },
    [clid]: { $exists: true },
  });
  const music_data_dp = await DB.FindOne<score>(refid, {
    collection: "score",
    music_id: music_id,
    dpmArray: { $exists: true },
    [clid]: { $exists: true },
  });

  let ghost: string,
    ghost_gauge: string,
    score = 0,
    option = 0,
    option_2 = 0,
    versionStr = `IIDX${version}music`;

  // OTHERS //
  let other_refid,
    other_md_sp,
    other_md_dp,
    other_pc_data,
    other_profile,
    other_score,
    other_ghost,
    other_ghostGauge,
    other_option,
    other_option2,
    other_achieve,
    other_name,
    other_pid,
    other_iidxid,
    oGhost = null;

  /* ctype
   *[-1] - DEFAULT
   * [1] - RIVAL
   * [2] - ALL TOP
   * [3] - ALL AVG.
   * [4] - LOCATION TOP
   * [5] - LOCATION AVG.
   * [6] - SAME DAN TOP
   * [7] - SAME DAN AVG.
   * [8] - RIVAL TOP
   * [9] - RIVAL AVG.
   * [10] - STORE TOP
   * [13] - RIVAL NEXT
   * [14] - STORE ROTATE
   * [15] - RIVAL ROTATE
   */

  // OTHERS //
  if (ctype == 1 && !(_.isNaN(subtype))) { // RIVAL //
    other_refid = await IIDXidTorefid(subtype);
    other_md_sp = await DB.FindOne<score>(other_refid, {
      collection: "score",
      music_id: music_id,
      spmArray: { $exists: true },
      [clid]: { $exists: true },
    });
    other_md_dp = await DB.FindOne<score>(other_refid, {
      collection: "score",
      music_id: music_id,
      dpmArray: { $exists: true },
      [clid]: { $exists: true },
    });
    other_pc_data = await refidToPd(other_refid);
    other_profile = await refidToProfile(other_refid);

    other_name = other_profile[0];
    other_pid = other_profile[1];
    other_iidxid = other_profile[2];

    if (style == 0 && other_md_sp) {
      other_score = other_md_sp.spmArray[rank + 7];

      if (_.isNil(other_md_sp[clid + 10])) {
        other_option = 0;
        other_option2 = 0;

        other_ghostGauge = "00";
      } else {
        if (_.isNil(other_md_sp.optArray)) {
          other_option = 0;
          other_option2 = 0;
        } else {
          other_option = other_md_sp.optArray[clid];
          other_option2 = other_md_sp.opt2Array[clid];
        }

        other_ghostGauge = buffToHex(base64decode(other_md_sp[clid + 10]));
      }

      other_ghost = buffToHex(base64decode(other_md_sp[clid]));

      other_achieve = other_pc_data[0];
    } else if (style == 1 && other_md_dp) {
      other_score = other_md_dp.dpmArray[rank + 7];

      if (_.isNil(other_md_dp[clid + 10])) {
        other_option = 0;
        other_option2 = 0;

        other_ghostGauge = "00";
      } else {
        if (_.isNil(other_md_dp.optArray)) {
          other_option = 0;
          other_option2 = 0;
        } else {
          other_option = other_md_dp.optArray[clid];
          other_option2 = other_md_dp.opt2Array[clid];
        }
        
        other_ghostGauge = buffToHex(base64decode(other_md_dp[clid + 10]));
      }

      other_ghost = buffToHex(base64decode(other_md_dp[clid]));

      other_achieve = other_pc_data[1];
    }
  }
  else if (ctype == 8) { // RIVAL TOP //
    let rival_ghost = [];
    let rival_refids = await DB.Find<rival>(refid, {
      collection: "rival",
      play_style: (style + 1),
      rival_refid: { $exists: true },
    });

    for (let i = 0; i < rival_refids.length; i++) {
      if (style == 0) {
        other_md_sp = await DB.FindOne<score>(String(rival_refids[i].rival_refid), {
          collection: "score",
          music_id: music_id,
          spmArray: { $exists: true },
          [clid]: { $exists: true },
        });

        if (!(_.isNil(other_md_sp)))
          rival_ghost.push(other_md_sp);
      } else if (style == 1) {
        other_md_dp = await DB.FindOne<score>(String(rival_refids[i].rival_refid), {
          collection: "score",
          music_id: music_id,
          dpmArray: { $exists: true },
          [clid]: { $exists: true },
        });

        if (!(_.isNil(other_md_dp)))
          rival_ghost.push(other_md_dp);
      }
    }

    if (style == 0 && rival_ghost.length > 0) {
      rival_ghost.sort((a: score, b: score) => b.spmArray[rank + 7] - a.spmArray[rank + 7]);

      other_refid = rival_ghost[0].__refid;
      other_pc_data = await refidToPd(other_refid);
      other_profile = await refidToProfile(other_refid);

      other_name = other_profile[0];
      other_pid = other_profile[1];
      other_iidxid = other_profile[2];

      other_score = rival_ghost[0].spmArray[rank + 7];

      if (_.isNil(rival_ghost[0][clid + 10])) {
        other_option = 0;
        other_option2 = 0;

        other_ghostGauge = "00";
      } else {
        if (_.isNil(rival_ghost[0].optArray)) {
          other_option = 0;
          other_option2 = 0;
        } else {
          other_option = rival_ghost[0].optArray[clid];
          other_option2 = rival_ghost[0].opt2Array[clid];
        }

        other_ghostGauge = buffToHex(base64decode(rival_ghost[0][clid + 10]));
      }

      other_ghost = buffToHex(base64decode(rival_ghost[0][clid]));
      other_achieve = other_pc_data[0];
    } else if (style == 1 && rival_ghost.length > 1) {
      rival_ghost.sort((a: score, b: score) => b.dpmArray[rank + 7] - a.dpmArray[rank + 7]);

      other_refid = rival_ghost[0].__refid;
      other_pc_data = await refidToPd(other_refid);
      other_profile = await refidToProfile(other_refid);

      other_name = other_profile[0];
      other_pid = other_profile[1];
      other_iidxid = other_profile[2];

      other_score = rival_ghost[0].dpmArray[rank + 7];

      if (_.isNil(rival_ghost[0][clid + 10])) {
        other_option = 0;
        other_option2 = 0;

        other_ghostGauge = "00";
      } else {
        if (_.isNil(rival_ghost[0].optArray)) {
          other_option = 0;
          other_option2 = 0;
        } else {
          other_option = rival_ghost[0].optArray[clid];
          other_option2 = rival_ghost[0].opt2Array[clid];
        }

        other_ghostGauge = buffToHex(base64decode(rival_ghost[0][clid + 10]));
      }

      other_ghost = buffToHex(base64decode(rival_ghost[0][clid]));
      other_achieve = other_pc_data[1];
    }
  }
  else if (ctype == 2 || ctype == 4 || ctype == 10) { // ALL, VENUE, STORE TOP //
    other_md_sp = await DB.Find<score>(null, {
      collection: "score",
      music_id: music_id,
      spmArray: { $exists: true },
      [clid]: { $exists: true },
    });
    other_md_dp = await DB.Find<score>(null, {
      collection: "score",
      music_id: music_id,
      dpmArray: { $exists: true },
      [clid]: { $exists: true },
    });

    if (style == 0 && other_md_sp.length > 0) {
      other_md_sp.sort((a: score, b: score) => b.spmArray[rank + 7] - a.spmArray[rank + 7]);

      other_refid = other_md_sp[0].__refid;
      other_pc_data = await refidToPd(other_refid);
      other_profile = await refidToProfile(other_refid);

      other_name = other_profile[0];
      other_pid = other_profile[1];
      other_iidxid = other_profile[2];

      other_score = other_md_sp[0].spmArray[rank + 7];

      if (_.isNil(other_md_sp[0][clid + 10])) {
        other_option = 0;
        other_option2 = 0;

        other_ghostGauge = "00";
      } else {
        if (_.isNil(other_md_sp[0].optArray)) {
          other_option = 0;
          other_option2 = 0;
        } else {
          other_option = other_md_sp[0].optArray[clid];
          other_option2 = other_md_sp[0].opt2Array[clid];
        }

        other_ghostGauge = buffToHex(base64decode(other_md_sp[0][clid + 10]));
      }

      other_ghost = buffToHex(base64decode(other_md_sp[0][clid]));
      other_achieve = other_pc_data[0];
    } else if (style == 1 && other_md_dp.length > 0) {
      other_md_dp.sort((a: score, b: score) => b.dpmArray[rank + 7] - a.dpmArray[rank + 7]);

      other_refid = other_md_dp[0].__refid;
      other_pc_data = await refidToPd(other_refid);
      other_profile = await refidToProfile(other_refid);

      other_name = other_profile[0];
      other_pid = other_profile[1];
      other_iidxid = other_profile[2];

      other_score = other_md_dp[0].dpmArray[rank + 7];

      if (_.isNil(other_md_dp[0][clid + 10])) {
        other_option = 0;
        other_option2 = 0;

        other_ghostGauge = "00";
      } else {
        if (_.isNil(other_md_dp[0].optArray)) {
          other_option = 0;
          other_option2 = 0;
        } else {
          other_option = other_md_dp[0].optArray[clid];
          other_option2 = other_md_dp[0].opt2Array[clid];
        }

        other_ghostGauge = buffToHex(base64decode(other_md_dp[0][clid + 10]));
      }

      other_ghost = buffToHex(base64decode(other_md_dp[0][clid]));
      other_achieve = other_pc_data[1];
    }
  }
  else if (ctype == 6) { // SAME DAN TOP //
    const my_data = await DB.FindOne<pc_data>(refid, {
      collection: "pc_data",
      version: version,
    });
    let dArray = []; // music_datas //

    if (style == 0) {
      let same_dan = await DB.Find<pc_data>(null, {
        collection: "pc_data",
        version: version,
        sgid: my_data.sgid,
      });

      if (same_dan.length > 0) {
        for (let a = 0; a < same_dan.length; a++) {
          let other_md = await DB.FindOne<score>(same_dan[a].__refid, {
            collection: "score",
            music_id: music_id,
            spmArray: { $exists: true },
            [clid]: { $exists: true },
          });

          if (!(_.isNil(other_md)))
            dArray.push(other_md);
        }

        if (dArray.length > 0) {
          dArray.sort((a: score, b: score) => b.spmArray[rank + 7] - a.spmArray[rank + 7]);

          other_refid = dArray[0].__refid;
          other_pc_data = await refidToPd(other_refid);
          other_profile = await refidToProfile(other_refid);

          other_name = other_profile[0];
          other_pid = other_profile[1];
          other_iidxid = other_profile[2];

          other_score = dArray[0].spmArray[rank + 7];

          if (_.isNil(dArray[0][clid + 10])) {
            other_option = 0;
            other_option2 = 0;

            other_ghostGauge = "00";
          } else {
            if (_.isNil(dArray[0].optArray)) {
              other_option = 0;
              other_option2 = 0;
            } else {
              other_option = dArray[0].optArray[clid];
              other_option2 = dArray[0].opt2Array[clid];
            }

            other_ghostGauge = buffToHex(base64decode(dArray[0][clid + 10]));
          }

          other_ghost = buffToHex(base64decode(dArray[0][clid]));
          other_achieve = other_pc_data[0];
        }
      }
    } else {
      let same_dan = await DB.Find<pc_data>(null, {
        collection: "pc_data",
        version: version,
        dgid: my_data.dgid,
      });

      if (same_dan.length > 0) {
        for (let a = 0; a < same_dan.length; a++) {
          let other_md = await DB.FindOne<score>(same_dan[a].__refid, {
            collection: "score",
            music_id: music_id,
            dpmArray: { $exists: true },
            [clid]: { $exists: true },
          });

          if (!(_.isNil(other_md)))
            dArray.push(other_md);
        }

        if (dArray.length > 0) {
          dArray.sort((a: score, b: score) => b.dpmArray[rank + 7] - a.dpmArray[rank + 7]);

          other_refid = dArray[0].__refid;
          other_pc_data = await refidToPd(other_refid);
          other_profile = await refidToProfile(other_refid);

          other_name = other_profile[0];
          other_pid = other_profile[1];
          other_iidxid = other_profile[2];

          other_score = dArray[0].dpmArray[rank + 7];

          if (_.isNil(dArray[0][clid + 10])) {
            other_option = 0;
            other_option2 = 0;

            other_ghostGauge = "00";
          } else {
            if (_.isNil(dArray[0].optArray)) {
              other_option = 0;
              other_option2 = 0;
            } else {
              other_option = dArray[0].optArray[clid];
              other_option2 = dArray[0].opt2Array[clid];
            }

            other_ghostGauge = buffToHex(base64decode(dArray[0][clid + 10]));
          }

          other_ghost = buffToHex(base64decode(dArray[0][clid]));

          other_achieve = other_pc_data[1];
        }
      }
    }
  }

  if (!(_.isNil(other_ghost))) {
    if (_.isNil(other_option)) {
      other_option = 0;
      other_option2 = 0;
    }

    oGhost = {
      ghost: other_ghost,
      score: other_score,
      achieve: other_achieve,
      pid: other_pid,
      name: other_name,
      iidxid: other_iidxid,
      ghostGauge: other_ghostGauge,
      option: other_option,
      option2: other_option2,
    };
  }

  // MY DATA //
  if (style == 0 && music_data_sp) {
    score = music_data_sp.spmArray[rank + 7];

    if (_.isNil(music_data_sp[clid + 10])) {
      option = 0;
      option_2 = 0;

      ghost_gauge = "00";
    } else {
      if (_.isNil(music_data_sp.optArray)) {
        option = 0;
        option_2 = 0;
      } else {
        option = music_data_sp.optArray[clid];
        option_2 = music_data_sp.opt2Array[clid];
      }

      ghost_gauge = buffToHex(base64decode(music_data_sp[clid + 10]));
    }

    ghost = buffToHex(base64decode(music_data_sp[clid]));
  } else if (style == 1 && music_data_dp) {
    score = music_data_dp.dpmArray[rank + 7];

    if (_.isNil(music_data_dp[clid + 10])) {
      option = 0;
      option_2 = 0;

      ghost_gauge = "00";
    } else {
      if (_.isNil(music_data_dp.optArray)) {
        option = 0;
        option_2 = 0;
      } else {
        option = music_data_dp.optArray[clid];
        option_2 = music_data_dp.opt2Array[clid];
      }

      ghost_gauge = buffToHex(base64decode(music_data_dp[clid + 10]));
    }

    ghost = buffToHex(base64decode(music_data_dp[clid]));
  }

  if (!(_.isNil(ghost)) || !(_.isNil(other_ghost))) {
    send.pugFile("pug/musicappoint.pug", {
      version: versionStr,

      ghost,
      ghost_gauge,
      option: option,
      option_2: option_2,

      oGhost,
    });
  } else {
    send.success();
  }
};

export const musiccrate: EPR = async (info, data, send) => {
  const version = info.module;

  send.pugFile("pug/crate.pug", { version });
};

export const musicretry: EPR = async (info, data, send) => {
  const version = info.module;

  send.pugFile("pug/musicretry.pug", { version });
};
