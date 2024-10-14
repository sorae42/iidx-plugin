import { GetVersion } from "../util";

export const streamingcommon: EPR = async (info, data, send) => {
  const version = GetVersion(info);

  let result: any = {
  }

  // have no idea what some of attribute or value does //
  // exposing these to plugin setting or use static value //
  switch (version) {
    case 32:
      result = {
        ...result,
      }
      break;

    default:
      return send.deny();
  }

  return send.object(result);
};

