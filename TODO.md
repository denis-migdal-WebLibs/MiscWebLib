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