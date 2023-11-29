import { profile } from "./models/profile";
import { settings } from "./models/settings";
import { pc_data } from "./models/pc_data";

export function IDToCode(id: number) {
  const padded = _.padStart(id.toString(), 8);
  return `${padded.slice(0, 4)}-${padded.slice(4)}`;
}

export function base64decode(s: string) {
  const base64list =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let t = "",
    p = -8,
    a = 0,
    c: number,
    d: number;

  for (let i = 0; i < s.length; i++) {
    if ((c = base64list.indexOf(s.charAt(i))) < 0) continue;
    a = (a << 6) | (c & 63);
    if ((p += 6) >= 0) {
      d = (a >> p) & 255;
      if (c != 64) t += String.fromCharCode(d);
      a &= 63;
      p -= 8;
    }
  }
  return t;
}

export function GetVersion(info: EamuseInfo) {
  return parseInt(info.module.substr(4, 2));
}

export async function IIDXidTorefid(iidxid: number) {
  const profile = await DB.FindOne<profile>(null, {
    collection: "profile",
    iidxid: iidxid,
  });

  if (_.isNil(profile)) return null;

  return profile.refid;
}

export function ClidToRank(clid: number) {
  let style: number, rank: number;
  if (clid >= 5) {
    style = 1;
    rank = clid - 5;
  } else {
    style = 0;
    rank = clid;
  }
  return {
    style: style,
    rank: rank,
  };
}

export function AppendSettingConverter(
  sf: boolean,
  cf: boolean,
  df: boolean,
  af: boolean,
  rf: boolean,
  rr: boolean,
  rs: boolean,
  hp: boolean,
  dg: boolean,
  ch: boolean,
  rp: boolean,
  hi: boolean,
) {
  const result =
    Number(sf) << 0 |
    Number(cf) << 1 |
    Number(df) << 2 |
    Number(af) << 3 |
    Number(rf) << 4 |
    Number(false) << 5 | // UNK //
    Number(rr) << 6 |
    Number(rs) << 7 |
    Number(hp) << 8 |
    Number(dg) << 9 |
    Number(ch) << 10 |
    Number(rp) << 11 |
    Number(hi) << 12;
    
  return result;
}

export function DateToName(now: number, score_time: number) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = now - score_time;

  if (elapsed < msPerMinute) {
    return "-" + Math.round(elapsed / 1000) + "s";
  } else if (elapsed < msPerHour) {
    return "-" + Math.round(elapsed / msPerMinute) + "m";
  } else if (elapsed < msPerDay) {
    return "-" + Math.round(elapsed / msPerHour) + "h";
  } else if (elapsed < msPerMonth) {
    return "-" + Math.round(elapsed / msPerDay) + "d";
  } else if (elapsed < msPerYear) {
    return "-" + Math.round(elapsed / msPerMonth) + "mo";
  } else {
    return "-" + Math.round(elapsed / msPerYear) + "yr";
  }
}

export function buffToHex(buff) {
  return Buffer.from(buff).toString("hex");
}

export function randomIntRange(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export async function refidToProfile(refid: string) {
  const profile = await DB.FindOne<profile>(refid, {
    collection: "profile",
  });

  let profile_data = [];

  try {
    profile_data = [
      profile.name,
      profile.pid,
      profile.iidxid,
      profile.iidxidstr,
    ];
  } catch {
    profile_data = ["", 0, 0, ""];
  }

  return profile_data;
}

export async function refidToQpro(refid: string) {
  const setting = await DB.FindOne<settings>(refid, {
    collection: "settings",
  });

  let qpro_data = [];

  try {
    qpro_data = [
      setting.qpro_hair,
      setting.qpro_head,
      setting.qpro_face,
      setting.qpro_body,
      setting.qpro_hand,
    ];
  } catch {
    qpro_data = [0, 0, 0, 0, 0];
  } 
  
  return qpro_data;
}

export async function refidToPd(refid: string) {
  const pc_data = await DB.FindOne<pc_data>(refid, {
    collection: "pc_data",
  });

  let p_data = [];

  try {
    p_data = [
      pc_data.sgid,
      pc_data.dgid,
      pc_data.sach,
      pc_data.dach,
    ];
  } catch {
    p_data = [0, 0, 0, 0];
  }

  return p_data;
}
