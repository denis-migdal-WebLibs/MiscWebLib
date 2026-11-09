- Deploy new version
- PropertiesEffect
- Widget @core

- Restructure dirs
    - widget/@core => modules + contract.
    - remove core
        - @types => modules/@types
    - presentation => webui.
        - widgets
        - orchestrator (TPEngine)
        - nav : capabilities or orchestrator ?
    - infrastructure => modules/@platform + contract.
        - scheduling
        - storage
        - networking
    - remove @exports

-> Use ctrler for Reaction + method redir.
    -> CTRLER.scheduler ou NODE.scheduler.