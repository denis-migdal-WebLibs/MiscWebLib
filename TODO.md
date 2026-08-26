- revoir reactive
  - link() vs forward() vs sync()
  - cache value
  - forward without dst.

- doc
- set as default branch.
- debug tools
- ensure no export defaults / no import core.

- regarder anciens dépôts.

=====

From TP Engine:

- Expand<>/expand() in MWL

- Debug
    - __LOG__() [only in __DEBUG__ + only during __START_LOG__ / __STOP_LOG__]
        - console : beging/stop group.
        - + possibilité de filter sur ID ?
    - __SET_ID__(name) => this + [NAME]-[id] (?).
    - propagation : represent tree -> how (with SET) ?

=====

Project structure:
- dist/
- build/
  - cache/
  - scripts/
- libs/
- tests/
- src/
  - libs/ (compiled lib)
  - exports/ (source lib)
    - README.md for the documentation.
  - pages/ : (Website) artefacts
    - templates/
    - assets/
    - tests/
    - content.txt
  - routes/ (REST)
  - models/
  - widgets/ : content
  - presentation/
    - widgets/ : structure
    - capabilities/
    - styles/
    - [page specific]/
  - ports/ : APIs, e.g. REST, BDD, Browser

Subdirectories:
- index (an index to facilitate imports).
- core
- tools

=====

- importer utils des autres dépôts
  - LISS, etc.
  - download/upload
- marquer LISS comme obsolète.

- check other repos (1/25)