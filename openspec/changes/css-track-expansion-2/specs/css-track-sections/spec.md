# Delta for css-track-sections

Every requirement below is `MODIFIED`. This change adds four modules **inside**
existing sections, so the section set does not grow -- but the ordering invariant
does, and it is stated as a literal sequence that must be redlined rather than
left to drift.

## MODIFIED Requirement 4 — `order` renumbering invariant

The full CSS track (**34 modules**) SHALL number `order` 1..34 with no gaps and
no duplicates, ascending in the exact section-then-member sequence of
Requirement 3. The resulting sequence MUST be:

1 que-es-css, 2 selectores, 3 propiedades-basicas, 4 box-model,
5 unidades-css, 6 dimensiones, **7 overflow**, 8 math-functions,
9 tipografias, **10 tipografia-web**, 11 advanced-text,
12 selectores-descendientes, 13 pseudo-clases, 14 pseudo-elementos,
15 attribute-selectors, 16 especificidad, **17 herencia-valores-globales**,
18 float-display, 19 posicionamiento, 20 flexbox, 21 css-grid,
22 propiedades-logicas, **23 imagenes-y-medios**, 24 lists-and-tables,
25 shadows-gradients-filters, 26 transforms, 27 transiciones-animaciones,
28 variables-css, 29 media-queries, 30 sass-fundamentos, 31 sass-avanzado,
32 bootstrap-5, 33 tailwind-css, 34 proyecto-cv-css.

**The four insertions are not appends.** Sections must stay contiguous in
`order` -- the grouping scenario below is only true while they are -- so a module
added inside a section shifts every module after it. Twenty-six existing modules
receive a one-line `order` edit as a direct consequence.

Renumbering is display-only and safe: `Progress` and `ModuleSettings` are keyed
by **slug**, never by `order`.

This still satisfies every pre-existing ordering chain, re-verified against the
new numbers: box-model(4) < unidades-css(5) < dimensiones(6); unidades-css(5) <
tipografias(9); selectores(2) < selectores-descendientes(12) < especificidad(16);
box-model/unidades-css < the layout modules(18-22); flexbox(20)/css-grid(21) <
media-queries(29); variables-css(28)/shadows(25) < sass-fundamentos(30); the
capstone last(34).

### MODIFIED Scenario 4.1 — No gaps or duplicates

- **Given** `ALL_MODULES` filtered to `dojo === "css"`
- **When** `order` values are sorted
- **Then** they MUST equal `[1, 2, ..., 34]` exactly

### ADDED Scenario 4.4 — Each insertion lands inside its section, not after it

- **Given** the four new modules
- **When** the track is grouped by section
- **Then** each new module MUST appear between members of its own section
- **AND** every section's `order` values MUST remain contiguous

## MODIFIED Requirement 3 — Section-to-module assignment

Four modules join existing sections. No section is created and none is removed.

| Section | Gains |
|---|---|
| `css-caja` | `overflow`, after `dimensiones` |
| `css-texto` | `tipografia-web`, after `tipografias` |
| `css-selectores` | `herencia-valores-globales`, after `especificidad` |
| `css-visual` | `imagenes-y-medios`, first in the section |

### Scenario 3.2 — `css-oficio` still stays absent

- **Given** this change
- **When** the section list is read
- **Then** `css-oficio` MUST still not exist

Two Fase 3 modules will need it. Creating it now, empty, would put a section on
screen with nothing inside — the same vacuity the certificate gate refuses
elsewhere. It is created by the change that fills it.
