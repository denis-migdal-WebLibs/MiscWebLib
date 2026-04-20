~3j pour tout réintégrer (?).

Setup environment [1j]
----------------------

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
    - add "npm run tests"
    + vscode/github config files...
    - try out .d.ts bundle. (cf Chart.js) + tester...
    - [?]

Map [^]
-------

- marquer les principes.
- image des différents dossiers, de leur dépendance, et fonctions.
- /index.ts => export vs /core/ (internal) vs README.md.
- libs: multi-generation ?

WebComp [1j]
------------

- importer Crypto/WebComp
    - refactors
    - features

Components [1j]
---------------

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