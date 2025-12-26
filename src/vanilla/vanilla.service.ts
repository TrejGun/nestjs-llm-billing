import type { LoggerService } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { streamText, } from 'ai'
import { Request, Response } from 'express';

import { getMockedLLM } from "../mock";
import { Readable } from "node:stream";

@Injectable()
export class VanillaService {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
  ) {}

  public stream(req: Request, res: Response) {
    const abortController = new AbortController();
    req.on('close', () => abortController.abort());

    const sourceStream = this.getStream();
    const [clientStream, backgroundStream] = sourceStream.tee();

    void this.processStreamInBackground(backgroundStream);

    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = clientStream.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (abortController.signal.aborted) break;
            controller.enqueue(value);
          }
        } catch {
          // client disconnected
        } finally {
          reader.releaseLock();
          controller.close();
        }
      }
    });

    this.pipeReadableStreamToResponse(responseStream, res)
  }

  public getStream() {
    const encoder = new TextEncoder();
    return new ReadableStream<Uint8Array>({
      async start(controller) {
        const chunks = ["Hello", " ", "world", "!", " Goodbye"];
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
          await new Promise(r => setTimeout(r, 100));
        }
        controller.close();
      }
    });
  }

  private async processStreamInBackground(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let totalChars = 0;

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        totalChars += decoder.decode(value, { stream: true }).length;
      }
    } catch {
      // ignore
    } finally {
      reader.releaseLock();
      this.loggerService.log('Total chars:', totalChars);
    }
  }

  public pipeReadableStreamToResponse(stream: ReadableStream<Uint8Array>, res: Response) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    const nodeStream = new Readable({
      read() {
        (async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              this.push(decoder.decode(value));
            }
          } catch (err) {
            // ignore
          } finally {
            this.push(null); // signal EOF
          }
        })();
      }
    });

    nodeStream.pipe(res); // pipe into Express response
  }
}
