import { listen } from "MWL@2026:core/Reactive/Observers";
import Value from "MWL@2026:core/Reactive/Properties/Controllers/Value";
import { createProperties } from "MWL@2026:core/Reactive/Properties/Properties/createProperties";
import { forwardProperty } from "MWL@2026:core/Reactive/Properties/Property/syncProperty";
import { getProperty } from "MWL@2026:exports/Reactive/Properties/sync";

const src = createProperties({
    foo: Value(1)
});
const dst = createProperties({
    faa: Value(2)
});

listen(dst, () => { console.warn(dst.faa) })
listen(src, () => { console.warn("src", src.foo) })

forwardProperty( getProperty(src, "foo"), getProperty(dst, "faa") );

src.foo = 3;
dst.faa = 4;