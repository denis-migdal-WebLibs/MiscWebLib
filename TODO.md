Project structure:
- dist/
- build/
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

Properties:
  * Object(Interface) controller for complex object (e.g. List, Record, KeyDB).
    - Interface is a wrapper around the value enabling to mutate it.
      -> mutation are more secure.
      -> a RW proxy is too costly on complex type...
    - ElementSignal -> RO raw value (can be synced).
    - SubElement: created on demand.
      /!\ a SubElement need to be able to be merged with other SubElement.
  * intention (even if non-opti impl)
    - syncProperties(src, dst, {key: {target, from, to}})
    - syncArray(array, subparts, {from, to [for each elets]})
    - PropertiesArray (get/set/has/sync/keys/resize(?))
      - ArrayView + SubPart[bidir]View ~> bidir not necessary if ignored ?
    - PropertiesRecord (get/set/has/sync/etc)
      - RecordView + SubPart[bidir]View ~> bidir not necessary if ignored ?
    - /!\ SubPart merging... (~cacheCompute field ? + cache [true/false])
      -> requires to be notified...
    - View
      -> also support function.
  * delete
    - Computed property controller (replace with a "MultiView" -think better name).
Considerations:
  - SyncWithFormula
    -> twin Properties (share a node).
    -> need to notify each other
    -> if one replaced by FCT_FALSE -> becomes View.
    -> 1v1v1 ?
      -> un même "réseau" + "dynamique" get.
      => [MASTER] => set last source ?
  - 1vsN sync
    => Stocke valeur interne.
      => stocke les dernières mises à jours pour le get.
        => 1 update supprime les N updates.
        => [MASTER] => set last source ?
    -> 1 peut être remplacé par FCT_FALSE => N devient View.
    -> N peut être remplacé par FCT_FALSE => force la propriété.
  - Nv1vN: recycler/fusionner les N en commun.
  - 1vNv1: partager le N en bonne intelligence.
  - 1vN:1v1 / 1v1vN ? Notion de "reseau" ?

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