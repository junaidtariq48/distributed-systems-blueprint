import { LoggerModule } from 'nestjs-pino';

export function buildLogger(appName: string) {
  const level = process.env.LOG_LEVEL || "info";

  return LoggerModule.forRoot({
    pinoHttp: {
      name: appName,
      level,
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { singleLine: true } }
          : undefined,
      genReqId: (req) => {
        const existing = req.headers["x-request-id"];
        if (typeof existing === "string" && existing.length > 0) return existing;
        return cryptoRandomId();
      },
      customProps: (req, res) => {
        // Trace correlation: OpenTelemetry instrumentation injects trace context.
        // Many log backends can correlate via trace_id if present in logs.
        return {
          requestId: req.id,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
        };
      },
    },
  });
}

function cryptoRandomId(): string {
  // no external dependency, stable enough for demo
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
