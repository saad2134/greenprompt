# Promptonomics


## Architecture

```mermaid
flowchart LR
    subgraph Frontend
        BE[Browser Extension]
        WEB[Next.js Web App]
        API[Public API Users]
    end

    subgraph Backend
        CORE[Core Service]
        DB[DB + Analytics]
    end

    BE --> CORE
    WEB --> CORE
    API --> CORE
    CORE --> DB
```

