export interface IBaseExceptionInfo {
  status?: number;
  pointer?: string;
  title?: string;
  message?: string;
}

export interface IBaseErrorInfoParams extends IBaseExceptionInfo {}
