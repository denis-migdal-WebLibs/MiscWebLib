Properties
- sync = set PropertiesController
  -> default: src -> dst
  -> set = FCT_FALSE -> others
  -> sync others if forbidden, except if somehow "identical" ?
  -> trigger changes on sync...
  - linkProperties can be deleted.
- Properties needs to have an array of targets.
- Transaction
  - remove markStale (improve computed) [évite de de voir propager].
    - enregistrer les appels [keys] + les stamps => besoin d'un proxy...
    - sinon besoin de déclarer... (MultiView ?).
    -> remove computed ?
    -> MultiView version ++ if changed
  - register targets into array (in reverse order, only if not pending).
  - then execute listeners (parcours in reverse order).
  -> listener executed only once even if re-entry.
=> 1 vs N
  - for object if multi -> merge properties into a super object (or rather array ?).
  - can delete origin (once it works for arrays).

====

- KeysOf in types.

=====
- from LISS
  - DOM/utils
  - signal raw API (for compat)
  - move signal (?)
  - réfléchir API + profondément...
- marquer des trucs comme obsolètes.
- regarder les dossiers utils d'autres dépôts
- marker les libs/deps des autres dépôts.

- download/upload
- check other repos (1/25)