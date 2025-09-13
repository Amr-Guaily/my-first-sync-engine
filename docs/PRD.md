# 📝 PRD: Sync Engine Demo App

## 1. Goal

Build a **small demo app** to showcase a working Sync Engine with:

- **Optimistic UI updates** (instant feedback)
- **Real-time synchronization** (via WebSocket)
- **Offline-first support** (transactions persist and replay)
- **Conflict resolution** (basic strategy)

---

## 2. Project Idea

### App Name: **Team Tasks Sync**

A lightweight task management app where multiple users can:

- View a shared list of **tasks** (title, description, status, assigned user)
- Add, edit, or delete tasks
- See updates instantly if another user changes something
- Work offline and have changes sync when back online

---

## 3. Actors & Roles

- **User:** Can create/edit/delete tasks. No authentication needed for demo (hardcoded users).

---

## 4. Core Features

| Feature                   | Description                                                       | Sync Engine Showcase    |
| ------------------------- | ----------------------------------------------------------------- | ----------------------- |
| View tasks list           | Fetch all tasks from server with TanStack Query caching.          | Server → Client sync    |
| Add/Edit/Delete tasks     | Changes happen optimistically on UI, queued, and sent to server.  | Optimistic UI, Tx queue |
| Real-time updates         | When another client changes a task, updates appear instantly.     | WebSocket broadcast     |
| Offline mode simulation   | Kill network: user edits still apply, saved locally, syncs later. | Offline-first           |
| Conflict handling (basic) | “Last write wins” for demo simplicity.                            | Conflict resolution     |
| Dockerized environment    | Run client, server, and Postgres DB in containers.                | Easy setup              |

---

## 5. Tech Stack

| Layer                  | Tech                                       | Purpose                                  |
| ---------------------- | ------------------------------------------ | ---------------------------------------- |
| **Frontend**           | React.js, Redux Toolkit, TanStack Query    | State management, caching, optimistic UI |
|                        | WebSocket (native or socket.io)            | Real-time updates                        |
| **Backend**            | Express.js                                 | REST + WebSocket server                  |
| **Database**           | PostgreSQL (via Docker)                    | Store tasks & sync logs                  |
| **Sync Engine Client** | Redux store + custom queue in localStorage | Transaction queue + replay               |
| **Sync Engine Server** | Sync actions table + WebSocket broadcaster | Change data capture                      |
| **Deployment**         | Docker & Docker Compose                    | Spin up client/server/db easily          |

---

## 6. Sync Engine Flow

1. **User edits task** → Change applied instantly to Redux store (optimistic update).
2. **Transaction created** → Added to local queue & persisted (localStorage or IndexedDB).
3. **API request sent** → Express validates & writes to Postgres.
4. **Server logs change** in `sync_actions` table.
5. **Server broadcasts** update via WebSocket.
6. **Clients receive update** → Update local Redux state.
7. **If offline:** Transactions stay queued → replay when reconnected.

---

## 7. Proposed Data Models

**Tasks Table:**
| Field | Type | Notes |
|------------------|-------------|-----------------------------|
| id | UUID | Primary key |
| title | String | Required |
| description | Text | Optional |
| status | Enum | (“todo”, “in-progress”, “done”) |
| assigned_user | String | Hardcoded users for demo |
| updated_at | Timestamp | Used for conflict resolution |

**Sync Actions Table:**
| Field | Type | Notes |
|------------------|-----------|-------------------------------|
| id | UUID | PK |
| action_type | String | (“create”, “update”, “delete”)|
| entity_id | UUID | Links to task id |
| payload | JSONB | Serialized changes |
| timestamp | Timestamp | Used for ordering changes |

---

## 8. High-Level Architecture

```
+----------------+       +----------------+        +-------------------+
| React Client   |       | Express Server |        | Postgres          |
|----------------|       |----------------|        |-------------------|
| Redux Toolkit  | <---> | REST API       | <----> | tasks table       |
| Tx Queue       |  WS   | WebSocket Hub  |        | sync_actions tbl  |
| TanStack Query | <---- | Broadcast      |        |                   |
+----------------+       +----------------+        +-------------------+
```

---

## 9. User Flow (Scenario)

1. User A adds a new task → UI updates instantly → Task queued.
2. Server saves task, logs action, broadcasts update.
3. User B’s client gets update via WebSocket → Task appears immediately.
4. User B edits same task offline → Update is queued locally.
5. User B reconnects → Queue flushes → Server merges changes (last-write-wins).
6. Both clients show latest data consistently.
