Roadmap
-------

- widget => data- => w:id / w:attr.

- test avec TPEngine
    - dossier /model ?
        - QuestionModel
        - QuestionsModel (?) => Tuple ?
    - dossier /components ?
        - WithProperties() -> Model()
        - Input()/Output()/Internal()/External()

            - SubProperties({key: RO/RW}).
- Properties.
    - sync/sub.

Principles
----------

- Pas de listen pour synchroniser (utiliser un lien)
    - listen dans l'ordre de stabilisation, et après la phase de stabilisation.
- ReactiveObject (peut être écouté, on peut obtenir son ReactiveNode, peut être dans un link/next).
    - valeur non-lazy.
    -> (ro)tuple : de valeurs réactives ou property de valeurs réactives (?).
        -> (RO)Object() <= valeur est un ReactiveObject ?
    -> ad hoc subElement : détecter si subElement a changé, et filtrer event en fonction ?
    -> LazyReactiveObject : nécessite de soit cloner les PropertyValue soit de résoudre la valeur, lorsqu'une boucle est détectée (pas évident, pas nécessairement utile).
        -> on peut partir du principe que les choses coûteuses ne sont pas réintégrées à des objets complexes.
        -> au pire une sorte de LazyWrapper ?
        -> ObjectProperty résout partiellement le problème ?
            -> enregistre les subProperty qui changent.
            -> applique/résout lors du premier get ?

Questions
---------

- link(src, dst, ?)
    => pour le moment un callback.
    => parfois besoin d'un callback sur dst indépendamment du link ?
    => propagateValue() on PropertyController (?)
        -> is it really useful ?

- on set:
    -> isChange(newVal, oldVP) => i.e. should trigger.
        -> only if ValueKnown in oldVP...
        -> is it *really* useful ?

- Renderer
    - Value special case (ou View avec Value source).
        -> really useful ?

Possible improvements
---------------------