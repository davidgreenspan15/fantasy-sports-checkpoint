Team Migration

```mermaid
%% Example of sequence diagram
  sequenceDiagram

    participant fscApi as Fantasy Sports Checkpoint API
    participant espnApi as Espn API v2
    participant fscDatabase as Fantasy Sports Checkpoint Database


    fscApi->>espnApi: Request Data
    espnApi->>fscApi: Send Data
    espnApi ->>fscDatabase: Store Data in DB
    fscDatabase ->>espnApi: Store Data in DB



```
