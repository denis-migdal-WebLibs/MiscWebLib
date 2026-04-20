Setup environment
-----------------

- Use WebpackFramework.
    - Document WebpackFramework (entries selection rules + usage)
        - src/pages[/assets|/components]
        - src/pages/templates (replace skeletons).
        - src/pages/tests (?).
        - src/libs[/test] [deno]
        - src/core/
        - tests/ [deno].
        - README.md (usage + principles)
        - TODO.md
        - ARCHITECTURE.md
    - use unit tests.
        - Deno
        - Web page tests (?) ~> iframe (?).
    - try out .d.ts bundle. (cf Chart.js) + tester...
    - [?]

Map
---

- marquer les principes.
- image des différents dossiers, de leur dépendance, et fonctions.
- /index.ts => export vs /core/ (internal) vs README.md.
- libs: multi-generation ?

WebComp
-------

- importer Crypto/WebComp
    - refactors
    - features

Components
----------

- Code
- Editor
- Lightmode
- menu
- pages
- playground

- default skeleton.

Reecrire
--------

- TPEngine
- WebSlides
    - 4 views (manage them better).
        - fullscreen
        - normal
        - print (onPrint ?)
        - overview
        => nettoyer.
        => how to delay contents for perfs (?).
    - alias pour les ranges.
- ChartJS++ (cf Crypto/WC)
    - + tester img generation (how [?]).

- Signals (no needs)
- Layout (integrate) ?
    ~> own view thingy ?