import { eisei_grade, grade } from "../models/grade";
import { GetVersion, IIDXidTorefid } from "../util";
import { pc_data } from "../models/pc_data";

export const graderaised: EPR = async (info, data, send) => {
  const version = GetVersion(info);
  const iidxid = parseInt($(data).attr().iidxid);
  const refid = await IIDXidTorefid(iidxid);
  const achi = parseInt($(data).attr().achi);
  const cstage = parseInt($(data).attr().cstage);
  const gid = parseInt($(data).attr().gid);
  const style = parseInt($(data).attr().gtype);
  const is_save = parseInt($(data).attr().is_save);
  const is_ex = parseInt($(data).attr().is_ex);
  const is_mirror = parseInt($(data).attr().is_mirror);

  const grade = await DB.FindOne<grade>(refid, {
    collection: "grade",
    version: version,
    style: style,
    grade: gid,
  });
  const pc_data = await DB.FindOne<pc_data>(refid, {
    collection: "pc_data",
    version: version,
  });

  const isTDJ = !(_.isNil($(data).element("lightning_play_data"))); // use this element to determine [TDJ] instead of info.model //
  const hasEiseiData = (!(_.isNil($(data).element("eisei_data"))) || !(_.isNil($(data).element("eisei_grade_data"))));;

  if (isTDJ && hasEiseiData) {
    let eisei_clear_type: number;
    let eisei_grade_id: number;
    let eisei_grade_type: number;
    let eisei_stage_num: number;
    let eisei_option: number;

    let eisei_past_achievement: number[];
    let eisei_past_selected_course: number[];
    let eisei_max_past_achievement: number[];
    let eisei_max_past_selected_course: number[];

    if (version == 27) {
      eisei_clear_type = parseInt($(data).element("eisei_data").attr().clear_type);
      eisei_grade_id = parseInt($(data).element("eisei_data").attr().grade_id);
      eisei_grade_type = parseInt($(data).element("eisei_data").attr().grade_type);
      eisei_stage_num = parseInt($(data).element("eisei_data").attr().stage_num);

      eisei_past_achievement = $(data).element("eisei_data").numbers("past_achievement");
      eisei_max_past_achievement = $(data).element("eisei_data").numbers("max_past_achievement");
    } if (version == 30) {
      eisei_clear_type = parseInt($(data).element("eisei_data").attr().clear_type);
      eisei_grade_id = parseInt($(data).element("eisei_data").attr().grade_id);
      eisei_grade_type = parseInt($(data).element("eisei_data").attr().grade_type);
      eisei_stage_num = parseInt($(data).element("eisei_data").attr().stage_num);
      eisei_option = parseInt($(data).element("eisei_data").attr().option);

      eisei_past_achievement = $(data).element("eisei_data").numbers("past_achievement");
      eisei_past_selected_course = $(data).element("eisei_data").numbers("past_selected_course");
      eisei_max_past_achievement = $(data).element("eisei_data").numbers("max_past_achievement");
      eisei_max_past_selected_course = $(data).element("eisei_data").numbers("max_past_selected_course");
    } else {
      eisei_clear_type = parseInt($(data).element("eisei_grade_data").attr().clear_type);
      eisei_grade_id = parseInt($(data).element("eisei_grade_data").attr().grade_id);
      eisei_grade_type = parseInt($(data).element("eisei_grade_data").attr().grade_type);
      eisei_stage_num = parseInt($(data).element("eisei_grade_data").attr().stage_num);

      eisei_past_achievement = $(data).element("eisei_grade_data").numbers("past_achievement");
      eisei_past_selected_course = $(data).element("eisei_grade_data").numbers("past_selected_course");
      eisei_max_past_achievement = $(data).element("eisei_grade_data").numbers("max_past_achievement");
      eisei_max_past_selected_course = $(data).element("eisei_grade_data").numbers("max_past_selected_course");
    }  

    await DB.Upsert<eisei_grade>(
      refid,
      {
        collection: "eisei_grade",
        version: version,
        grade_type: eisei_grade_type,
        grade_id: eisei_grade_id,
      },
      {
        $set: {
          clear_type: eisei_clear_type,
          stage_num: eisei_stage_num,
          option: eisei_option,

          past_achievement: eisei_past_achievement,
          past_selected_course: eisei_past_selected_course,
          max_past_achievement: eisei_max_past_achievement,
          max_past_selected_course: eisei_max_past_selected_course,
        },
      }
    );
  } else {
    if (grade) { // UPSERT [GRADE] //
      if (cstage >= grade.dArray[2] || achi >= grade.dArray[3]) {
        let archmax = Math.max(achi, grade.dArray[3]);
        let cstagemax = Math.max(cstage, grade.dArray[2]);
        await DB.Upsert<grade>(
          refid,
          {
            collection: "grade",
            version: version,
            style: style,
            grade: gid,
          },
          {
            $set: {
              version: version,
              style: style,
              grade: gid,
              dArray: [style, gid, cstagemax, archmax],
            },
          }
        );
      }
    } else { // INSERT [GRADE] //
      await DB.Upsert<grade>(
        refid,
        {
          collection: "grade",
          version: version,
          style: style,
          grade: gid,
        },
        {
          $set: {
            version: version,
            style: style,
            grade: gid,
            dArray: [style, gid, cstage, achi],
          },
        }
      );
    }

    if (cstage == 4 && style == 0 && pc_data.sgid < gid) { // SINGLE [PROFILE] //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            sgid: gid,
          },
        }
      );
    } else if (cstage == 4 && style == 1 && pc_data.dgid < gid) { // DOUBLE [PROFILE] //
      await DB.Upsert<pc_data>(
        refid,
        {
          collection: "pc_data",
          version: version,
        },
        {
          $set: {
            dgid: gid,
          },
        }
      );
    }
  }

  send.object(K.ATTR({ pnum: "1" }));
};
