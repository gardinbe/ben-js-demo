import { createUrl, requestJson } from '~/lib/services/json-client'
import { type AdviceSlip } from '~/lib/types/advice'
import { isNumber, isRecord, isString } from '~/lib/utils/predicates'
import { type Result } from '~/lib/utils/result'

export const fetchAdvice = (): Promise<Result<AdviceSlip>> =>
  requestJson(
    {
      decoderError: 'Advice Slip returned an unexpected payload',
      url: createUrl('https://api.adviceslip.com/', ['advice'], {
        cacheBust: Date.now(),
      }),
    },
    isAdviceSlip,
  )

const isAdviceSlip = (value: unknown): value is AdviceSlip =>
  isRecord(value) &&
  isRecord(value.slip) &&
  isString(value.slip.advice) &&
  isNumber(value.slip.id)
