export interface lightning_musicmemo {
  collection: "lightning_musicmemo";
  version: number;

  folder_idx: number;
  folder_name: string;
  play_style: number;
  music_ids: number[];
}

export interface lightning_musicmemo_old {
  collection: "lightning_musicmemo_old";
  version: number;

  music_idx: number;
  play_style: number;
  music_id: number;
}

export interface lightning_musicfilter {
  collection: "lightning_musicfilter";
  version: number;

  play_style: number;
  folder_id: number;
  filter_id: number;
  is_valid: boolean;
  value0: number;
  value1: number;
}

export interface musicmemo_data {
  folder_idx: number;
  folder_name: string;
  play_style: number;
  music_ids: number[];
}

export interface musicmemo_data_old {
  music_idx: number;
  play_style: number;
  music_id: number;
}

export interface musicfilter_data {
  play_style: number;
  folder_id: number;
  filter_id: number;
  is_valid: boolean;
  value0: number;
  value1: number;
}
