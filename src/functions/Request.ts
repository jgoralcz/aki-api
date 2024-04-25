import axios, { AxiosProxyConfig, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { issues } from '../constants/Client';
import * as FormData from 'form-data';

export interface AkinatorResult {
  completion?: string,
  akitude: string,
  step: string
  progression: string
  question_id: string
  question: string
}

export interface AkinatorResultGuess {
  completion: string
  description_proposition: string
  flag_photo: string
  id_base_proposition: string
  id_proposition: string
  name_proposition: string
  nb_elements: number
  photo: string
  pseudo: string
  valide_constrainte: string
}


export class AkinatorAPIError extends Error {
  constructor(data: any, region: string) {
    super(`A problem occurred with making the request data: ${data}: region: ${region}`);

    this.message = this.mapError(data.completion || '', region);
  }

  private mapError(c: string, region: string): string {
    if (!c) return `A problem occurred with making the request.\nRequest Body: ${c}`;

    switch (c) {
      case 'KO - SERVER DOWN': return `Akinator servers are down for the "${region}" region. Check back later. ${c}`;

      case 'KO - TECHNICAL ERROR': return `Akinator's servers have had a technical error for the "${region}" region. Check back later. ${c}`;

      case 'KO - INCORRECT PARAMETER': return `You inputted a wrong paramater, this could be session, region, or signature. ${c}`;

      case 'KO - TIMEOUT': return `Your Akinator session has timed out. ${c}`;

      case 'WARN - NO QUESTION': return `No question found. ${c}`;

      case 'KO - MISSING PARAMETERS': return `Akinator needs more parameters. Please make an issue at: ${issues}`;

      default: return `Unknown error has occurred. Server response: ${c}`;
    }
  }
}

export const request = async (url: string, formData: FormData, axiosConfig: AxiosRequestConfig): Promise<AkinatorAPIError | AkinatorResult | AkinatorResultGuess> => {
  const { status, data: result } = await axios.postForm<AkinatorResult | AkinatorResultGuess>(url, formData, axiosConfig);

  if (status !== 200 || !result) {
    throw new AkinatorAPIError(result, url);
  }

  const guess = result as AkinatorResultGuess;

  if (guess.id_proposition) {
    return guess;
  }

  return result;
};
