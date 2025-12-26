import type { LoggerService } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { streamText, } from 'ai'
import { Request, Response } from 'express';

import { getMockedLLM } from "../mock";

@Injectable()
export class VercelService {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
  ) {}

  public stream(req: Request, res: Response) {
    const abortController = new AbortController();
    req.on('close', () => abortController.abort());

    const llmStream = this.getStream(abortController)

    llmStream.pipeDataStreamToResponse(res)
  }

  public getStream(abortController: AbortController) {
    return streamText({
      model: getMockedLLM(),
      prompt: "",
      abortSignal: abortController.signal,
      onFinish: ({ usage }) => {
        this.loggerService.log(usage);
      }
    });
  }
}
