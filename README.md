# GreenPrompt 


## Architecture

A platform with three surfaces, one brain and one storage.

```mermaid
flowchart LR
    subgraph Frontend
        BE[Browser Extension<br/>'/extension']
        WEB[Next.js Web App<br/>'/web']
        API[Public API Users<br/>'/api']
    end

    subgraph Backend
        CORE[Core Service<br/>'/core']
        DB[DB + Analytics<br/>'/database']
    end

    %% Internal APIs
    BE <-->|Internal API| CORE
    WEB <-->|Internal API| CORE
    API <-->|Internal API| CORE
    CORE <-->|Internal API| DB

    


    %% Repo folder links
    click BE "./extension" "Open /extension folder"
    click WEB "./web" "Open /web folder"
    click API "./api" "Open /api folder"
    click CORE "./core" "Open /core folder"
    click DB "./database" "Open /database folder"

```


