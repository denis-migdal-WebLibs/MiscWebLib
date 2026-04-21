<div align="center">
  <h1>MWL : Miscellaneous Web Library</h1>

  <p>A library of miscellaneous agnostic functions/classes I use in my projects.</p>
</div>

## Build

- `npm run build`: build the project.
- `npm run watch`: re-build the project after each changes.
- `npm run tests`: run unit tests.
- `npm run types`: create the `.d.ts` files for templates and libraries.
- `npm run build-prod`: build the production version of the project.

## Modules

<center>
  <img src="./doc/modules.svg">
</center>

## X

<center>
  <img src="./doc/deps.svg">
</center>

## Content

- types
  - `Cstr<T, ARGS>` : represents a constructor
- helpers
  - `IS_INTERACTIVE` : whether we are in CLI or in Browser.
  - `WithUpdate()` : mixin for updatable classes.

## See also

- Build & frameworks
  - WebpackFramework : easily create Webpack projects
  - TPEngine : create and grade TP/DS
  - WebSlides : create Web presentation.
- Interactions & graphs
  - Computations : write computations/graphs that you can execute in CLI or in the Browser.
  - Layout : a lightweight library to build dynamic layouts.
  - Signal : a lightweight signal library.
  - LISS : a lightweight WebComponent library
  - [X] ChartJS++ : create and manipulate Chart.JS graphs with OO API.
  - ChartHTML : an HTML wrapper of ChartJS++
  - hljs editable : proof of concept for editable hljs (code widget)
- Keystroke
  - KeyLib/KeyCalc/KeyOld
  - KeyDB
- Interactive demonstrators
  - WebCalc : online spreadsheet inspired from Libre Office.
  - SQLInteractive : (for now, in Cours ?)
  - WebShell (not created)
- My websites
  - Cours
  - KeyApp
  - Keystroke
  - Migdal
- Misc
  - DrawIO-UML-Shape-Libraries : UML Shape libraries for DrawIO
  - Linux-VM-installer : automatically create & install a Linux VM.
  - VSHS : py/ts REST Web server
  - download-overleaf : download your Overleaf git repositories
  - SBrython / Brython-AOT : contributions to Brython.