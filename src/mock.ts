import { simulateReadableStream, streamText } from 'ai'
import { MockLanguageModelV1 } from 'ai/test'
import type { Request, Response } from 'express';


export const getMockedLLM =  () => {
  return new MockLanguageModelV1({
    doStream: async ({ prompt }) => ({
      stream: simulateReadableStream({
        chunkDelayInMs: 50,
        initialDelayInMs: 100,
        chunks: ['Hello', ' ', 'World', "!"].map(text => ({
          type: 'text-delta',
          textDelta: text,
        })),
      }),
      rawCall: { rawPrompt: null, rawSettings: {} },
    }),
  });
}



