// vanilla.service.ts
import type { LoggerService } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { streamText, } from 'ai'
import { Request, Response } from 'express';

import { getMockedLLM } from './mock';

@Injectable()
export class AppService {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
  ) {}

  async stream(req: Request, res: Response) {
    const controller = new AbortController();
    req.on('close', () => controller.abort());

    const llmStream = this.getStream(controller)

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
