import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppErrorResponse } from './app-error-response.interface';
import { IBaseExceptionInfo } from '@/common/base/exception/interfaces/base-exception.interface';
import {
  DEFAULT_ERROR,
  formatRegex,
  GENERIC_EXCEPTION,
} from '@/common/base/exception/constants/base-exception.constant';

@Catch(HttpException)
export class AppHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = this.createErrorResponse(exception, request);

    response.status(status).json(errorResponse);
  }

  private createErrorResponse(
    exception: HttpException,
    request: Request,
  ): AppErrorResponse {
    const errorInformation = this.getErrorInformationFromException(exception);

    const errorTitle = this.getErrorTitle(errorInformation, exception);
    const errorDetail = this.getErrorDetail(errorInformation);
    const errorPointer = this.getErrorPointer(errorInformation, request);

    return {
      error: {
        detail: errorDetail,
        source: { pointer: errorPointer },
        title: errorTitle,
        status: String(errorInformation.status || exception.getStatus()),
      },
    };
  }

  private getErrorInformationFromException(
    exception: HttpException,
  ): IBaseExceptionInfo {
    const exceptionInformation = exception.getResponse();

    if (typeof exceptionInformation === 'string') {
      return { message: exceptionInformation };
    }

    if (Array.isArray(exceptionInformation)) {
      return { message: exceptionInformation.join(', ') };
    }

    const responseObject = exceptionInformation as Record<string, any>;

    if (Array.isArray(responseObject.message)) {
      return {
        message: responseObject.message.join(', '),
        ...responseObject,
      };
    }

    return responseObject as IBaseExceptionInfo;
  }

  private getErrorTitle(
    errorInfo: IBaseExceptionInfo,
    exception: HttpException,
  ): string {
    const exceptionName = exception?.name || '';
    const errorTitle = errorInfo?.title || '';

    if (exceptionName === GENERIC_EXCEPTION) {
      return errorTitle || DEFAULT_ERROR;
    }

    const formattedName = exceptionName
      .replace('Exception', '')
      .replace(formatRegex, '$1 $2');
    return errorTitle || formattedName || DEFAULT_ERROR;
  }

  private getErrorDetail(errorInfo: IBaseExceptionInfo): string {
    const { message = '' } = errorInfo || {};
    return message || DEFAULT_ERROR;
  }

  private getErrorPointer(
    errorInfo: IBaseExceptionInfo,
    request: Request,
  ): string {
    const { pointer = '' } = errorInfo || {};
    return pointer || request.url;
  }
}
