import { GetVersion } from "../util";

export const systeminfo: EPR = async (info, data, send) => {
  const version = GetVersion(info);

  if (version == 27) {
    send.pugFile("pug/27systeminfo.pug");
  } else if (version == 28) {
    send.pugFile("pug/28systeminfo.pug");
  } else if (version == 29) {
    send.pugFile("pug/29systeminfo.pug", {
      boss: U.GetConfig("BossPhase"),
      extra_boss: U.GetConfig("ExtraBossPhase"),
      event_1_internal: U.GetConfig("Event1InternalPhase"),
    });
  } else if (version == 30) {
    send.pugFile("pug/30systeminfo.pug", {
      boss: U.GetConfig("BossPhase"),
      extra_boss: U.GetConfig("ExtraBossPhase"),
      event_1_internal: U.GetConfig("Event1InternalPhase"),
    });
  } else if (version == 31) {
    send.pugFile("pug/31systeminfo.pug", {
      boss: U.GetConfig("BossPhase"),
    });
  }
  else { send.success(); }
};
