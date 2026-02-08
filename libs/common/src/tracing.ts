import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Instrumentation } from '@opentelemetry/instrumentation';

export async function startTracing(serviceName: string) {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]:
      process.env.OTEL_SERVICE_NAMESPACE || 'distributed-systems-blueprint',
  });

  const traceExporter = new OTLPTraceExporter({
    url: `${endpoint}/v1/traces`,
  });

  const metricExporter = new OTLPMetricExporter({
    url: `${endpoint}/v1/metrics`,
  });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 5000,
  });

  const instrumentations: Instrumentation[] = [
    ...getNodeAutoInstrumentations({
      // keep defaults; auto-instruments http, fetch, dns, etc.
    }),
  ];

  const sdk = new NodeSDK({
    resource,
    traceExporter,
    metricReader,
    instrumentations,
  });

  await sdk.start();

  process.on('SIGTERM', async () => {
    await sdk.shutdown();
    process.exit(0);
  });
}
