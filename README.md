# Distributed Systems Blueprint (Node.js + NestJS)

A **production-grade distributed systems reference implementation** built with **NestJS**, **Node.js**, and **Docker**.

This repository is designed as a **learning blueprint** for developers who want to understand:
- how distributed systems are structured
- how services communicate securely
- how to add observability (logs, metrics, traces)
- how to build systems that are **scalable, resilient, and debuggable**

This is **not a toy example**. It mirrors real-world patterns used in production systems.

---

## 🧠 What This Repo Demonstrates

### Architecture & Concepts
- API Gateway pattern
- Service-to-service communication
- Synchronous (HTTP) + asynchronous (event-driven) workflows
- Public vs internal authentication
- Resilience patterns (timeouts, retries, circuit breaker)
- Observability-first design

### Tech Stack
- **Node.js (v24 LTS)**
- **NestJS (v11)**
- **Docker & Docker Compose**
- **NATS** (event messaging)
- **OpenTelemetry** (tracing & metrics)
- **Grafana + Tempo + Prometheus + Loki**
- **Pino** (structured logging)

---

## 🏗 Architecture Overview

                ┌───────────────┐
                │   API Gateway │
                │   (HTTP)      │
                └───────┬───────┘
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
┌─────────▼─────────┐ ┌─────▼─────────┐ ┌─────▼────────────┐
│ Users Service │ │ Orders Service │ │ Notifications │
│ (Internal HTTP) │ │ (HTTP + NATS) │ │ Service (Worker) │
└───────────────────┘ └─────┬──────────┘ └────────┬─────────┘
│ │
└─────── NATS ────────┘


### Communication Patterns
- **HTTP (sync)**: API Gateway → Users / Orders
- **Events (async)**: Orders → Notifications (via NATS)

---

## 🔐 Security Model

### Public Access
- JWT-based authentication
- Used by external clients
- Validated at the API Gateway

### Internal Communication
- Separate **internal JWT**
- Short-lived tokens
- Service-to-service trust only
- No internal service is publicly accessible

This enforces **clear trust boundaries**.

---

## 🧱 Services

### 1️⃣ API Gateway
- Public entry point
- Authenticates users
- Routes requests to internal services
- Handles retries and circuit breakers

Port: `3001`

---

### 2️⃣ Users Service
- Internal-only service
- Exposes user data
- Requires internal JWT

Port: `3002`

---

### 3️⃣ Orders Service
- Handles order creation
- Publishes `orders.created` events
- Exposes health endpoint

Port: `3003`

---

### 4️⃣ Notifications Service
- Event-driven worker
- Subscribes to NATS
- Sends notifications (simulated)

No public HTTP API (worker-style service)

---

## 📊 Observability (First-Class Citizen)

### Logs
- Structured JSON logs via **Pino**
- Centralized with **Loki**
- Queryable in Grafana

### Metrics
- Collected via **OpenTelemetry**
- Exported to **Prometheus**
- Scraped from OTEL Collector

### Traces
- End-to-end distributed tracing
- Exported via OTLP → Tempo
- Viewable in Grafana Explore

> Every service emits logs, metrics, and traces by default.

---

## ▶️ Running the System

### Prerequisites
- Node.js v24+
- Docker & Docker Compose

### Start everything
```bash
docker compose up --build
```


## 🔑 Try the System

### 1️⃣ Login (get JWT)
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "content-type: application/json" \
  -d '{"email":"you@example.com"}'
```

### 2️⃣ Call protected endpoint
```bash
curl http://localhost:3001/orders/me \
  -H "authorization: Bearer <TOKEN>"
```

### 3️⃣ Create an order (triggers async event)
```bash
curl -X POST http://localhost:3001/orders \
  -H "authorization: Bearer <TOKEN>" \
  -H "content-type: application/json" \
  -d '{"sku":"SKU-123","qty":2}'
```
You should see logs in notifications-service receiving the event.

## 📈 Viewing Observability

### Grafana

- URL: http://localhost:3000
- User: admin
- Password: admin

### View Traces

- Grafana → Explore → Tempo
- Filter by service:
```bash
{resource.service.name="api-gateway"}
```

### View Logs

- Grafana → Explore → Loki
  ```bash
  {container=~".*orders-service.*"}
  ```

### View Metrics

Grafana → Explore → Prometheus

---

## ⚙️ Scaling a Service

Example: scale Orders Service to 3 replicas

```bash
docker compose up --scale orders-service=3
```
The gateway will distribute requests across instances.

---

## 💥 Resilience Features

- Request timeouts
- Automatic retries
- Circuit breaker for internal calls
- Graceful shutdown
- Health checks
  
Try stopping a service and observe:
- retries in logs
- circuit breaker opening
- traces showing failures

---

## 🎯 Who This Repo Is For

- Developers learning distributed systems
- Backend engineers preparing for interviews
- Teams bootstrapping microservice architectures
- Anyone who wants a real, runnable reference

---

## 🛣 Roadmap / Ideas

- Trace context propagation over NATS
- Kubernetes manifests
- Rate limiting at gateway
- Failure injection demos
- Service mesh comparison

---

## 📜 License

MIT — use freely, fork, modify, and build on it.
