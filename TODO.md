Properties:
  - delete
    - Computed property controller (replace with a "MultiView" -think better name).
    - watchProperties
    - linkProperties
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