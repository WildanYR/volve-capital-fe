export type CreateServiceFn<TPayload, TResponse> = (
  payload: TPayload,
) => Promise<TResponse>
