import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineDotprompt, fromDotprompt} from '@genkit-ai/dotprompt';

export const ai = genkit({
  plugins: [googleAI({apiVersion: 'v1beta'})],
});

export const geminiPro = 'googleai/gemini-1.5-flash-latest';
