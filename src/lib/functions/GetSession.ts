import axios, { AxiosRequestConfig } from 'axios';
import { patternSession, issues } from '../constants/Client';


const sessionError = new Error(`Cannot find the uid and frontaddr. Please report to the github at: ${issues}`);

type akinatorGameData = {
  data: string
}

/**
 * gets the session uid and frontaddr needed to play the game.
 * @param config the axios request config
 * @returns {Promise<{uid: string, frontaddr: string}>} the uid and frontaddr needed to start a game
 * @throws Error an error if the uid and frontaddr cannot be found
 */
export async function getSession(config?: AxiosRequestConfig): Promise<{ uid: string; frontaddr: string; } | Error> {
  const { data } = await axios.get<number, akinatorGameData>('https://en.akinator.com/game', config).catch(() => ({ data: null }));

  if (!data?.match(patternSession)) {
    throw sessionError;
  }

  // use pattern matching to get the uid and frontaddr. It looks like:
  // var uid_ext_session = 'a7560672-6944-11e9-bbad-0cc47a40ef18';
  // var frontaddr = 'NDYuMTA1LjExMC40NQ==';
  const uid = patternSession.exec(data)?.[1];
  const frontaddr = patternSession.exec(data)?.[2];

  if (!uid || !frontaddr) {
    throw sessionError;
  }

  return { uid, frontaddr };
}
