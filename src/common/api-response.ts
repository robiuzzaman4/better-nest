export type APIResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
};

export type ApiResponsePayload<T> = {
  __apiResponsePayload: true;
  message: string;
  data: T;
};

export function apiResponse<T>(
  data: T,
  message = 'Request successful',
): ApiResponsePayload<T> {
  return {
    __apiResponsePayload: true,
    message,
    data,
  };
}

export function isApiResponsePayload<T>(
  value: unknown,
): value is ApiResponsePayload<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__apiResponsePayload' in value &&
    (value as ApiResponsePayload<T>).__apiResponsePayload === true
  );
}
