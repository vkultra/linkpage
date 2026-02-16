import { env } from '../config/env'

let sentryModule: typeof import('@sentry/react') | null = null
let initPromise: Promise<void> | null = null

export function initSentry(): Promise<void> {
  if (!import.meta.env.PROD || !env.sentryDsn) return Promise.resolve()
  if (initPromise) return initPromise

  initPromise = import('@sentry/react').then((Sentry) => {
    sentryModule = Sentry
    Sentry.init({
      dsn: env.sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    })
  })

  return initPromise
}

export function captureException(error: unknown): void {
  if (sentryModule) {
    sentryModule.captureException(error)
  } else {
    initSentry().then(() => {
      sentryModule?.captureException(error)
    })
  }
}
