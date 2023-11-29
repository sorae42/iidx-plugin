export interface grade {
  collection: "grade";
  version: number;

  style: number;
  grade: number;
  dArray: number[]; // style, gid, cstagemax, archmax //
}

export interface eisei_grade {
  collection: "eisei_grade";
  version: number;

  clear_type: number;
  grade_id: number;
  grade_type: number;
  stage_num: number;
  option: number;

  past_achievement: number[];
  past_selected_course: number[];
  max_past_achievement: number[];
  max_past_selected_course: number[];
}

export interface eisei_grade_data {
  clear_type: number;
  grade_id: number;
  grade_type: number;
  stage_num: number;
  option: number;

  past: number[];
  selected_course: number[];
  max_past: number[];
  max_selected_course: number[];
}
