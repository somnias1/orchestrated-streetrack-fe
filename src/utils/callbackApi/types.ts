import type { AxiosRequestConfig } from 'axios';

export interface AxiosRequestConfigCustom extends AxiosRequestConfig {
  sessionId?: string;
}

export type CallbackProps<T> = [
  AxiosRequestConfig<T>['url'],
  AxiosRequestConfigCustom?,
];
