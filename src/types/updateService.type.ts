export type UpdateServiceFn<TPayload, TResponse> = (
  id: number,
  payload: TPayload,
) => Promise<TResponse>
