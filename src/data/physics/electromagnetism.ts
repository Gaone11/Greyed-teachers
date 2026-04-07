import type { Domain, FlagshipTopic } from '../knowledgeGalaxy';

// ─── Electrostatics ───────────────────────────────────────────────────────────
const electrostaticsTopic: FlagshipTopic = {
  id: 'electrostatics',
  title: 'Electrostatics',
  icon: '⚡',
  tagline: 'Static charges, electric fields, and the invisible force that shapes matter',
  microTopics: [
    { id: 'es-charge', title: 'Electric Charge' },
    { id: 'es-coulomb', title: 'Coulomb\'s Law' },
    { id: 'es-field', title: 'Electric Field' },
    { id: 'es-field-lines', title: 'Field Lines & Flux' },
    { id: 'es-gauss', title: 'Gauss\'s Law' },
    { id: 'es-potential', title: 'Electric Potential' },
    { id: 'es-conductors', title: 'Conductors & Insulators' },
    { id: 'es-dipole', title: 'Electric Dipoles' },
  ],
  explanations: {
    explorer: 'Rub a balloon on your hair and it sticks to the wall — that\'s static electricity. Objects can gain a positive or negative charge. Like charges repel; opposite charges attract. The force between charges gets weaker the further apart they are.',
    investigator: 'Electric charge is quantised (multiples of e = 1.6 × 10⁻¹⁹ C) and conserved. Coulomb\'s law: F = kq₁q₂/r². The electric field E = F/q (N/C). Field lines point from + to −. Electric potential V = kq/r (J/C = V); potential energy U = qV.',
    scholar: 'Gauss\'s law: ∮E·dA = Q_enc/ε₀ relates electric flux through a closed surface to enclosed charge. For a uniform sphere: E = kQ/r² outside, E = kQr/R³ inside. Electric potential V = −∫E·dr. Conductors: E = 0 inside, charge resides on surface; E = σ/ε₀ just outside.',
    researcher: 'Electrostatics governed by Poisson\'s equation ∇²V = −ρ/ε₀ (Laplace: ∇²V = 0 in charge-free regions). Method of images solves conductor boundary problems. Multipole expansion: monopole (1/r), dipole (1/r²), quadrupole (1/r³) terms. Capacitance of arbitrary geometries via Green\'s function. Electrostatic energy density u = ε₀E²/2.',
  },
  flashcards: [
    { id: 'es-f1', question: 'What is the SI unit of electric charge?', answer: 'Coulomb (C).', microTopicId: 'es-charge' },
    { id: 'es-f2', question: 'What is the charge of one proton?', answer: '+1.6 × 10⁻¹⁹ C (elementary charge e).', microTopicId: 'es-charge' },
    { id: 'es-f3', question: 'What is the charge of one electron?', answer: '−1.6 × 10⁻¹⁹ C.', microTopicId: 'es-charge' },
    { id: 'es-f4', question: 'State Coulomb\'s law.', answer: 'F = kq₁q₂/r² where k = 9×10⁹ N·m²/C².', microTopicId: 'es-coulomb' },
    { id: 'es-f5', question: 'What is the value of Coulomb\'s constant k?', answer: 'k = 1/(4πε₀) ≈ 9 × 10⁹ N·m²/C².', microTopicId: 'es-coulomb' },
    { id: 'es-f6', question: 'What is the permittivity of free space ε₀?', answer: 'ε₀ = 8.85 × 10⁻¹² C²/(N·m²).', microTopicId: 'es-coulomb' },
    { id: 'es-f7', question: 'Define electric field E.', answer: 'E = F/q — force per unit positive test charge; units N/C or V/m.', microTopicId: 'es-field' },
    { id: 'es-f8', question: 'Electric field due to a point charge Q at distance r?', answer: 'E = kQ/r², directed radially outward (positive charge).', microTopicId: 'es-field' },
    { id: 'es-f9', question: 'Electric field inside a conductor in electrostatic equilibrium?', answer: 'Zero — free charges redistribute until E = 0 inside.', microTopicId: 'es-conductors' },
    { id: 'es-f10', question: 'Where does charge reside on a conductor?', answer: 'On the outer surface.', microTopicId: 'es-conductors' },
    { id: 'es-f11', question: 'What are electric field lines?', answer: 'Imaginary lines showing E-field direction; tangent = field direction, density = field magnitude.', microTopicId: 'es-field-lines' },
    { id: 'es-f12', question: 'Electric field lines start and end where?', answer: 'Start on positive charges; end on negative charges (or at infinity).', microTopicId: 'es-field-lines' },
    { id: 'es-f13', question: 'Can electric field lines cross?', answer: 'No — crossing would imply two field directions at one point, which is impossible.', microTopicId: 'es-field-lines' },
    { id: 'es-f14', question: 'State Gauss\'s law.', answer: '∮E·dA = Q_enc/ε₀ — total electric flux through a closed surface equals enclosed charge divided by ε₀.', microTopicId: 'es-gauss' },
    { id: 'es-f15', question: 'What is electric flux?', answer: 'Φ = ∫E·dA — the number of field lines passing through a surface; unit: N·m²/C.', microTopicId: 'es-field-lines' },
    { id: 'es-f16', question: 'Define electric potential V.', answer: 'V = W/q — work done per unit charge moving a positive test charge from infinity; units volts (V = J/C).', microTopicId: 'es-potential' },
    { id: 'es-f17', question: 'Electric potential due to a point charge?', answer: 'V = kQ/r', microTopicId: 'es-potential' },
    { id: 'es-f18', question: 'Relationship between E and V?', answer: 'E = −dV/dr (or E = −∇V in 3D) — field points toward decreasing potential.', microTopicId: 'es-potential' },
    { id: 'es-f19', question: 'What is an equipotential surface?', answer: 'A surface where V is constant; E is always perpendicular to equipotential surfaces.', microTopicId: 'es-potential' },
    { id: 'es-f20', question: 'What is an electric dipole?', answer: 'Two equal and opposite charges +q and −q separated by distance d; dipole moment p = qd.', microTopicId: 'es-dipole' },
    { id: 'es-f21', question: 'What is the torque on a dipole in a uniform field E?', answer: 'τ = p × E (magnitude: τ = pE sinθ).', microTopicId: 'es-dipole' },
    { id: 'es-f22', question: 'What is electric potential energy of two charges?', answer: 'U = kq₁q₂/r', microTopicId: 'es-potential' },
    { id: 'es-f23', question: 'What is a Faraday cage?', answer: 'A closed conducting shell that shields its interior from external electric fields.', microTopicId: 'es-conductors' },
    { id: 'es-f24', question: 'Electrostatic energy stored in a field?', answer: 'u = ½ε₀E² (energy density in J/m³).', microTopicId: 'es-field' },
    { id: 'es-f25', question: 'What happens to force if distance between charges doubles?', answer: 'Force decreases to ¼ of original (inverse square law).', microTopicId: 'es-coulomb' },
    { id: 'es-f26', question: 'What is an insulator?', answer: 'A material where charges cannot move freely; electrons are bound to atoms.', microTopicId: 'es-conductors' },
    { id: 'es-f27', question: 'What is charging by induction?', answer: 'Bringing a charged object near a conductor causes charge redistribution without contact.', microTopicId: 'es-conductors' },
    { id: 'es-f28', question: 'Electric field between two infinite parallel plates with charge density σ?', answer: 'E = σ/ε₀ (uniform field, directed from + to − plate).', microTopicId: 'es-gauss' },
    { id: 'es-f29', question: 'What is quantisation of charge?', answer: 'Charge exists only in integer multiples of e = 1.6×10⁻¹⁹ C; no fraction of elementary charge is observed.', microTopicId: 'es-charge' },
    { id: 'es-f30', question: 'What is conservation of charge?', answer: 'The total electric charge of an isolated system remains constant.', microTopicId: 'es-charge' },
  ],
  experiments: [
    {
      id: 'es-e1',
      level: 'easy',
      title: 'Electrostatic Attraction with Balloon',
      microTopicId: 'es-charge',
      materials: ['Balloon', 'Wool or hair', 'Small paper pieces', 'Wall'],
      steps: [
        'Inflate the balloon and tie it.',
        'Rub vigorously against wool or hair for 30 seconds.',
        'Hold near small paper pieces — observe attraction.',
        'Hold against wall — observe it sticking.',
        'Try attracting a thin stream of water from a tap.',
      ],
      safetyNote: 'No specific hazard.',
      expected: 'Paper and water stream deflect toward balloon; balloon sticks to wall due to induced charges.',
    },
    {
      id: 'es-e2',
      level: 'easy',
      title: 'Mapping Electric Field Lines',
      microTopicId: 'es-field-lines',
      materials: ['Two metal electrodes', 'Conducting paper or water tank', 'Voltmeter with probes'],
      steps: [
        'Place two electrodes on conducting paper, connected to 9V battery.',
        'Use voltmeter probes to find points of equal potential.',
        'Draw equipotential lines connecting same-voltage points.',
        'Draw E-field lines perpendicular to equipotentials.',
        'Compare with theoretical pattern.',
      ],
      safetyNote: 'Use low voltage (9V) only.',
      expected: 'Radial field lines from + to − electrode; equipotentials as ellipses between them.',
    },
    {
      id: 'es-e3',
      level: 'medium',
      title: 'Coulomb\'s Law Verification (Torsion Balance)',
      microTopicId: 'es-coulomb',
      materials: ['Coulomb torsion balance or simulation', 'Charged spheres', 'Ruler', 'Protractor'],
      steps: [
        'Charge both spheres to known charges (or use simulation).',
        'Measure deflection angle at different separations r.',
        'Calculate F from torsion balance constant: F = kτ.',
        'Plot F vs 1/r² — expect straight line.',
        'Verify slope gives k = 9×10⁹ N·m²/C².',
      ],
      safetyNote: 'High voltages possible — follow equipment instructions.',
      expected: 'Linear F vs 1/r² graph confirming inverse square law.',
    },
    {
      id: 'es-e4',
      level: 'medium',
      title: 'Van de Graaff Generator — Charge Behaviour',
      microTopicId: 'es-conductors',
      materials: ['Van de Graaff generator', 'Metal dome', 'Grounding rod', 'Small foil pieces'],
      steps: [
        'Run Van de Graaff generator; place foil pieces on dome.',
        'Observe foil pieces flying off (like charges repel).',
        'Hold grounded sphere near dome — spark jump.',
        'Measure spark gap vs voltage (rough estimate).',
        'Demonstrate Faraday cage with metal mesh.',
      ],
      safetyNote: 'Keep pacemaker users away. Discharge fully before touching.',
      expected: 'Foil pieces levitate off dome; sparks jump at ~1 cm per 10 kV.',
    },
    {
      id: 'es-e5',
      level: 'hard',
      title: 'Gauss\'s Law — Field Inside a Conductor',
      microTopicId: 'es-gauss',
      materials: ['Hollow metal sphere', 'Electroscope inside sphere', 'Charge source', 'Insulating rod'],
      steps: [
        'Place electroscope inside hollow conducting sphere.',
        'Charge the outer sphere using Van de Graaff or charged rod.',
        'Observe electroscope inside — leaves should remain at zero divergence.',
        'Open sphere and charge an object placed inside — measure field outside.',
        'Verify Gauss\'s law: charge inside induces equal charge on outer surface.',
      ],
      safetyNote: 'Use insulating rods to handle charged objects.',
      expected: 'Electroscope inside shows zero field; charging interior does induce measurable exterior field.',
    },
    {
      id: 'es-e6',
      level: 'hard',
      title: 'Mapping Equipotentials Numerically (Simulation)',
      microTopicId: 'es-potential',
      materials: ['PhET Charges and Fields simulation', 'Computer'],
      steps: [
        'Open PhET simulation.',
        'Place a positive and negative charge 2 units apart.',
        'Use the E-field sensor to measure field magnitude and direction at 20 points.',
        'Use the voltmeter to trace equipotential lines at V = −2, −1, 0, +1, +2 V.',
        'Draw E-field lines perpendicular to equipotentials.',
        'Identify regions of highest field strength.',
      ],
      safetyNote: 'None.',
      expected: 'Dipole field pattern with equipotentials perpendicular to radial field lines; strongest field between charges.',
    },
  ],
  realWorld: [
    'Lightning rods use conductors to safely redirect static charge from thunderclouds to ground.',
    'Photocopiers and laser printers use electrostatic attraction to transfer toner onto paper.',
    'Inkjet printers electrostatically deflect charged ink droplets to precise positions.',
    'Electrostatic precipitators in chimneys remove pollution particles from industrial smoke.',
    'Defibrillators use large electric potentials to restore normal heart rhythm during cardiac arrest.',
    'The cell membrane acts as a capacitor — ion pumps maintain electric potential differences across it.',
  ],
  relatedTopicIds: ['capacitors', 'electric-current', 'magnetism'],
  curiosityBranches: [
    { label: 'How does lightning form?', topicId: 'electrostatics' },
    { label: 'How does a touchscreen detect your finger?', topicId: 'electrostatics' },
    { label: 'Why does your hair stand up near a Van de Graaff?', topicId: 'electrostatics' },
    { label: 'How do electrostatic precipitators clean air?', topicId: 'electrostatics' },
  ],
  quiz: [
    { id: 'es-q1', question: 'Two charges of +2 μC and −2 μC are 0.1 m apart. The force between them is (k = 9×10⁹):', options: ['3.6 N attractive', '3.6 N repulsive', '0.36 N attractive', '36 N attractive'], answer: 0, explanation: 'F = k|q₁q₂|/r² = 9×10⁹ × 4×10⁻¹² / 0.01 = 3.6 N; attractive (opposite charges).', microTopicId: 'es-coulomb' },
    { id: 'es-q2', question: 'Electric field inside a charged conductor is:', options: ['Maximum at centre', 'Zero', 'Equal to surface field', 'σ/ε₀'], answer: 1, explanation: 'Free charges redistribute so E = 0 inside a conductor in electrostatic equilibrium.', microTopicId: 'es-conductors' },
    { id: 'es-q3', question: 'Gauss\'s law states that electric flux through a closed surface equals:', options: ['kQ', 'Q_enc / ε₀', 'ε₀ Q_enc', 'Q_enc × 4πr²'], answer: 1, explanation: '∮E·dA = Q_enc/ε₀.', microTopicId: 'es-gauss' },
    { id: 'es-q4', question: 'Electric potential at distance r from charge Q:', options: ['kQ/r²', 'kQ/r', 'kQ·r', 'Q/4πr²'], answer: 1, explanation: 'V = kQ/r (potential, not force — falls as 1/r not 1/r²).', microTopicId: 'es-potential' },
    { id: 'es-q5', question: 'Which of these is NOT a conductor?', options: ['Copper', 'Silver', 'Rubber', 'Aluminium'], answer: 2, explanation: 'Rubber is an insulator — electrons cannot move freely through it.', microTopicId: 'es-conductors' },
    { id: 'es-q6', question: 'The direction of E-field lines is:', options: ['From negative to positive', 'From positive to negative', 'Along equipotentials', 'Perpendicular to field'], answer: 1, explanation: 'By convention, E-field lines point from positive to negative charges.', microTopicId: 'es-field-lines' },
    { id: 'es-q7', question: 'If charge is doubled and distance halved, Coulomb force becomes:', options: ['Same', '2×', '8×', '16×'], answer: 2, explanation: 'F ∝ q₁q₂/r². Doubling both charges × 4; halving distance × 4. Total: ×16. Wait — only one charge doubled: ×2 × ×4 = ×8.', microTopicId: 'es-coulomb' },
    { id: 'es-q8', question: 'An electric dipole in a uniform field experiences:', options: ['Net force and torque', 'Net force only', 'Torque only', 'Neither'], answer: 2, explanation: 'In a uniform field, forces on +q and −q cancel (no net force) but create a torque that aligns the dipole with the field.', microTopicId: 'es-dipole' },
  ],
};

// ─── Capacitors ───────────────────────────────────────────────────────────────
const capacitorsTopic: FlagshipTopic = {
  id: 'capacitors',
  title: 'Capacitors & Dielectrics',
  icon: '🔋',
  tagline: 'Storing electric energy — the charge-voltage relationship in every circuit',
  microTopics: [
    {
      id: 'cap-definition',
      title: 'Capacitance',
      notes: {
        explorer: `## What is Capacitance?

Think of a **water bucket** for electric charge. Some buckets are big and hold lots of water — some capacitors are big and hold lots of charge.

**Capacitance** measures how much electric charge a capacitor can store for every volt of electricity applied to it.

## The Simple Formula

> C = Q ÷ V

- **C** = capacitance (how "big" the bucket is)
- **Q** = charge stored (measured in coulombs)
- **V** = voltage applied (measured in volts)

## The Unit: Farad (F)

Capacitance is measured in **farads (F)**, named after the brilliant scientist **Michael Faraday**.

- 1 farad is actually a very large amount of capacitance
- Most capacitors in everyday electronics are measured in **microfarads (μF)** — one millionth of a farad!

## Key Ideas to Remember

- Higher voltage → more charge stored
- Bigger capacitance → more charge stored at the same voltage
- Capacitors are found in **phones, cameras, TVs, computers, and even electric cars**`,

        investigator: `## Definition of Capacitance

**Capacitance C** is the ratio of charge Q stored on a capacitor to the potential difference V across it:

> C = Q / V      (unit: farad, F = coulomb/volt)

## Physical Meaning

- C depends only on the **geometry** of the capacitor and the **material** between its plates
- C does NOT depend on Q or V individually — it is a property of the device
- Doubling Q doubles V proportionally; the ratio C remains constant

## Key Formula — Parallel Plate Capacitor

> C = ε₀ × A / d

- **ε₀** = 8.85 × 10⁻¹² F/m (permittivity of free space)
- **A** = plate area (m²)
- **d** = plate separation (m)

**Larger plate area → more C. Smaller gap between plates → more C.**

## Common Capacitor Size Ranges

- **pF (picofarad)** = 10⁻¹² F — radio/tuning circuits
- **nF (nanofarad)** = 10⁻⁹ F — signal filtering
- **μF (microfarad)** = 10⁻⁶ F — power supply smoothing
- **F (farad)** — supercapacitors and energy storage

## Worked Example

A capacitor stores 40 μC when charged to 10 V. What is its capacitance?

> C = Q/V = 40×10⁻⁶ / 10 = **4 × 10⁻⁶ F = 4 μF**`,

        scholar: `## Formal Definition of Capacitance

> C = Q / V

where Q is the charge on one plate and V is the potential difference between the plates. Since V and Q are always proportional for a linear dielectric, C depends only on geometry and permittivity — not on the applied values.

## Derivation: Parallel Plate Capacitor

**Step 1:** Surface charge density on each plate:
> σ = Q / A

**Step 2:** Electric field between plates (Gauss's law for a conductor surface):
> E = σ / ε₀ = Q / (ε₀A)

**Step 3:** Potential difference V = E × d (uniform field):
> V = Qd / (ε₀A)

**Step 4:** Therefore:
> C = Q/V = **ε₀A / d** ✓

## Capacitance for Other Geometries

**Cylindrical capacitor** (inner radius a, outer radius b, length L):
> C = 2πε₀L / ln(b/a)

**Spherical capacitor** (inner radius a, outer radius b):
> C = 4πε₀ · ab / (b − a)

**Isolated sphere** of radius R:
> C = 4πε₀R

## Self-Capacitance vs Mutual Capacitance

- **Self-capacitance** Cᵢᵢ: charge on conductor i per unit potential on i (others grounded)
- **Mutual capacitance** Cᵢⱼ: charge induced on j per unit potential on i

For a two-conductor system: Q₁ = C₁₁V₁ + C₁₂V₂ (linear superposition applies)

## Dimension Check

> [C] = [Q]/[V] = C / (J/C) = C²/J = A²s⁴/(kg·m²) = F ✓`,

        researcher: `## Capacitance Matrix

For an N-conductor system, charges and potentials obey the linear relation:

> **Q** = **C** · **V**      i.e. Qᵢ = Σⱼ Cᵢⱼ Vⱼ

- Diagonal entries Cᵢᵢ > 0: self-capacitances
- Off-diagonal Cᵢⱼ ≤ 0 for i≠j: mutual capacitances (charge induction)
- **C** is symmetric and positive semi-definite (required by energy considerations)

## Green's Function Approach

For arbitrary conductor geometry, capacitance follows from:

> C = ε₀ ∮_S ∮_S G_N(r, r') dS dS'

where G_N is the Neumann Green's function of the Laplace equation on the domain. Numerical solutions via the **Boundary Element Method (BEM)** or **Finite Element Method (FEM)**.

## Quantum Capacitance

In 2D electron systems (graphene, MOSFETs at inversion), finite density of states adds a **quantum capacitance** in series:

> 1/C_total = 1/C_geom + 1/C_Q      where C_Q = e² D(E_F)

D(E_F) is the density of states at the Fermi level. In graphene: C_Q ∝ |V_g|^(1/2) near the Dirac point — dominant at high gate voltages.

## Casimir Effect on Nano-Capacitors

At separations d < 100 nm, quantum vacuum fluctuations produce an attractive pressure:

> F_Casimir = −ℏcπ²A / (240d⁴)

This sets a pull-in instability for MEMS/NEMS capacitors and is a limiting factor in sub-nm dielectric scaling.

## Kinetic Correction in Superconductors

In superconducting circuits (qubits, resonators), carrier inertia adds a kinetic inductance Lₖ = ℏ/(2eIc) modifying the effective impedance:

> Z(ω) = 1/(jωC) + jωLₖ

This resonance at ω₀ = 1/√(LₖC) is central to transmon qubit design.`,
      },
    },
    {
      id: 'cap-parallel-plate',
      title: 'Parallel Plate Capacitor',
      notes: {
        explorer: `## What is a Parallel Plate Capacitor?

The most common type of capacitor has **two flat metal plates** facing each other with a small gap between them.

## How It Works

- Connect a battery → electrons pile up on one plate (making it **negative**)
- The other plate loses electrons (making it **positive**)
- An electric field forms in the gap between the plates
[diagram:parallel-plate]
- Disconnect the battery → the capacitor holds the charge!

## What Makes It Store More Charge?

- **Bigger plates** — more surface area means more charge can spread out
- **Smaller gap** — the plates attract each other's charge more strongly when closer

## The Formula

> C = ε₀ × A ÷ d

- **A** = area of the plates (bigger = more capacitance)
- **d** = distance between plates (smaller = more capacitance)
- **ε₀** = a special number about how electric fields work in space

## Real Life Example

The capacitors inside your computer's motherboard are tiny parallel plate capacitors — billions of them store data in DRAM memory!`,

        investigator: `## The Parallel Plate Capacitor

A parallel plate capacitor consists of two conducting plates of area A separated by distance d (d << √A so edge effects are negligible).

## Capacitance Formula

> C = ε₀A / d

- **ε₀** = 8.85 × 10⁻¹² F/m (permittivity of free space)
- **A** = plate area in m²
- **d** = plate separation in m

## Effect of Changing Parameters

- Double A → C doubles (more surface area for charge)
- Halve d → C doubles (stronger attraction between plates)
- Insert dielectric K → C increases by factor K

## Electric Field Between the Plates

[diagram:parallel-plate]

The field is **uniform** (away from edges):

> E = V / d = σ / ε₀

- **V** = potential difference (volts)
- **σ** = Q/A = surface charge density

## Worked Example

A capacitor has plates of area 0.01 m² separated by 2 mm. Find C.

> C = (8.85×10⁻¹²)(0.01) / (0.002) = **44.25 pF**

Charge stored at 100 V:
> Q = CV = 44.25×10⁻¹² × 100 = **4.43 nC**`,

        scholar: `## Derivation of C = ε₀A/d

**Assumptions:** Infinite parallel plates (edge effects ignored), vacuum between plates, uniform surface charge density σ = Q/A.

**Step 1 — Electric field from Gauss's law:**

Apply Gauss's law to a pillbox surface straddling one plate:
> Φ_E = E·A = Q_enc/ε₀ = σA/ε₀
> **E = σ/ε₀ = Q/(ε₀A)** (directed from + to − plate)

**Step 2 — Potential difference:**
> V = ∫₀ᵈ E·dx = Ed = **Qd/(ε₀A)**

**Step 3 — Capacitance:**
> C = Q/V = **ε₀A/d** ✓

## Breakdown Voltage

The electric field must stay below the **dielectric strength** E_max:
> V_max = E_max × d

For air: E_max ≈ 3 × 10⁶ V/m. A 2 mm gap: V_max ≈ 6000 V.

## With a Dielectric

Inserting dielectric constant K:
> C = Kε₀A/d      E_field = V/(d) (same), but D = Kε₀E

The dielectric reduces internal field by polarisation, allowing more charge at same voltage.

## Charge Distribution

In a real finite capacitor, fringing fields appear at edges. The Schwarz-Christoffel transformation gives the exact fringe correction. For large plates this is negligible:

> C_real ≈ ε₀A/d × (1 + d/πA · corrections)`,

        researcher: `## Beyond the Ideal Model

The ideal model C = ε₀A/d assumes infinite plates, uniform field, and perfect dielectric. Real capacitors deviate due to:

## Fringing Field Correction (Kirchhoff)

The first-order correction to capacitance for a square plate of side a:

> C = ε₀a²/d + ε₀a/π × [1 + ln(2πa/d)]

For d << a this is small but measurable in precision instruments.

## Non-uniform Dielectric

If the dielectric has a spatially varying ε(r), capacitance is:

> C = ε₀ × (1/∫₀ᵈ dx/ε(x)/ε₀)⁻¹ × A

Layered dielectrics in series: 1/C = d₁/(ε₁A) + d₂/(ε₂A) + ...

## AC Behaviour and ESR/ESL

Real capacitors have series resistance (ESR) and series inductance (ESL):
> Z(ω) = ESR + j(ωESL − 1/ωC)

Self-resonant frequency: f₀ = 1/(2π√(ESL·C)). Above f₀ the capacitor behaves inductively!

## MEMS Variable Capacitors

In MEMS, d is controlled electrostatically. The **pull-in instability** occurs at:

> d_pull-in = 2d₀/3

beyond which the electrostatic force exceeds the restoring spring force and the plates snap together. Critical for capacitive pressure sensors and RF MEMS switches.`,
      },
    },
    {
      id: 'cap-dielectric',
      title: 'Dielectrics',
      notes: {
        explorer: `## What is a Dielectric?

A **dielectric** is an insulating material placed between the plates of a capacitor.

Examples: rubber, plastic, glass, ceramic, paper, air

## Why Use a Dielectric?

- It lets you store **more charge** for the same voltage
- It keeps the plates from touching each other
- It lets you make capacitors **smaller and safer**

## How it Helps

When you put a dielectric between the plates:
- The molecules inside line up with the electric field
- This creates a tiny opposing field inside the dielectric
- The capacitor can now hold even more charge!

[diagram:dielectric-polarisation]

## The Dielectric Constant K

Every material has a **dielectric constant K** (also called relative permittivity):

- **Air** → K ≈ 1 (no improvement)
- **Paper** → K ≈ 3.7
- **Glass** → K ≈ 7
- **Ceramic** → K up to 10,000!

Higher K = capacitor stores much more charge.

## The New Formula

> C = K × ε₀ × A / d

Just multiply by K — the bigger K is, the bigger the capacitance!`,

        investigator: `## Dielectric Materials

A **dielectric** is an insulating material with no free charges. When placed between capacitor plates it increases capacitance by the **relative permittivity K** (dielectric constant):

> C = Kε₀A/d = εA/d      where ε = Kε₀

## Common Dielectric Constants K

- Air: 1.0006
- Paper: 3.5
- Glass: 4–8
- Mica: 5–8
- Ceramic (BaTiO₃): 1,000–10,000
- Water: 80

## Why Capacitance Increases

The dielectric molecules **polarise** in the electric field — positive ends shift toward the negative plate, negative ends toward the positive plate. This creates an opposing internal field **E_p** which reduces the net field between the plates. The capacitor can then store more charge at the same voltage.

[diagram:dielectric-polarisation]

## Breakdown Voltage (Dielectric Strength)

Every dielectric breaks down above a maximum field:

- Air: 3 × 10⁶ V/m
- Mica: 100 × 10⁶ V/m
- Ceramic: 10 × 10⁶ V/m

Higher dielectric strength → capacitor can handle higher voltages safely.

## Energy with a Dielectric

Energy density increases with dielectric:
> u = ½εE² = ½Kε₀E²`,

        scholar: `## Dielectric Polarisation

When an external field **E₀** is applied, a dielectric develops a **polarisation P** (dipole moment per unit volume):

> P = ε₀ χₑ E

where χₑ = K − 1 is the **electric susceptibility**.

The total bound surface charge density on the dielectric surface:
> σ_bound = P · n̂

## Electric Displacement Field D

To account for both free and bound charges, define the **displacement field D**:

> D = ε₀E + P = ε₀(1 + χₑ)E = Kε₀E = εE

Gauss's law in matter:
> ∮ D · dA = Q_free,enc

This separates free charges (on plates) from bound charges (in dielectric).

## Boundary Conditions at a Dielectric Interface

- Normal D: D₁ₙ − D₂ₙ = σ_free (free surface charge)
- Tangential E: E₁ₜ = E₂ₜ (continuous)

## Effect on Capacitance

With dielectric filling the entire gap:
> C = εA/d = Kε₀A/d

Energy density with dielectric:
> u = ½D·E = ½εE² = ½KD²/ε

## Partial Dielectric (Dielectric Slab)

If dielectric fills only fraction f of the gap:

**In series:** 1/C = (fd)/(εA) + ((1−f)d)/(ε₀A)

**In parallel:** C = Kε₀(fA)/d + ε₀((1−f)A)/d`,

        researcher: `## Complex Permittivity and Dielectric Loss

In AC fields, the permittivity is complex:

> ε(ω) = ε'(ω) − jε''(ω)

- **ε'** (real part): energy storage (capacitive behaviour)
- **ε''** (imaginary part): energy dissipation (dielectric loss)
- **Loss tangent**: tan δ = ε''/ε'

The **Kramers-Kronig relations** connect ε'(ω) and ε''(ω) via causality (Hilbert transform):
> ε'(ω) − ε∞ = (2/π) P ∫₀^∞ ω'ε''(ω')/(ω'²−ω²) dω'

## Debye Relaxation Model

For a polar dielectric with relaxation time τ:

> ε(ω) = ε∞ + (εₛ − ε∞)/(1 + jωτ)

Gives a Debye loss peak at ω = 1/τ. Cole-Cole and Havriliak-Negami models extend this for distributed relaxation times.

## Ferroelectric Materials

Materials like BaTiO₃ and PZT show **spontaneous polarisation** and hysteresis in P–E curves. Applications:
- Ferroelectric RAM (FeRAM): non-volatile memory
- Piezoelectric sensors
- Electrocaloric cooling

## Dielectric Breakdown Mechanisms

- **Avalanche breakdown**: impact ionisation cascade
- **Thermal breakdown**: resistive heating → runaway
- **Electromechanical breakdown**: Maxwell stress compresses dielectric

Weibull statistics describe the stochastic failure distribution — critical for capacitor reliability engineering.`,
      },
    },
    {
      id: 'cap-energy',
      title: 'Energy Stored',
      notes: {
        explorer: `## Capacitors Store Energy!

A capacitor doesn't just store charge — it stores **electrical energy** that can be released later.

## A Good Analogy: A Spring

Think of a spring. The more you compress it, the more energy it stores. When you let go, that energy is released all at once.

A capacitor is similar — the more charge you push in, the more energy it stores. Release the charge and the energy comes out quickly!

## Real Life: Camera Flash

- Press the camera button → capacitor **charges up slowly** from the battery
- Take a photo → capacitor **releases all its energy instantly** as a bright flash of light
- Much faster than a battery could deliver on its own!

## The Energy Formula

> E = ½ × C × V²

- **C** = capacitance (farads)
- **V** = voltage (volts)
- **E** = energy stored (joules)

## Key Point

- Double the voltage → **4 times** more energy stored (squared relationship!)
- Double the capacitance → 2 times more energy`,

        investigator: `## Energy Stored in a Capacitor

Work is done to push charge onto a capacitor against its own electric field. This work is stored as electric potential energy.

## Three Equivalent Formulas

> U = ½CV²
> U = ½QV
> U = Q²/(2C)

All three are equivalent — use whichever quantities you know.

## Derivation

As charge q builds up on the capacitor, the voltage is v = q/C. The work done to add a tiny extra charge dq:

> dW = v · dq = (q/C) dq

Integrate from 0 to Q:

> U = ∫₀^Q (q/C) dq = Q²/(2C) = **½CV²** ✓

[diagram:energy-in-capacitor]

## Worked Example

A 100 μF capacitor is charged to 12 V. How much energy is stored?

> U = ½ × 100×10⁻⁶ × 12² = ½ × 100×10⁻⁶ × 144 = **7.2 × 10⁻³ J = 7.2 mJ**

## Comparing Storage

Same capacitor at 24 V stores:
> U = ½ × 100×10⁻⁶ × 24² = **28.8 mJ** — four times more energy at double the voltage!`,

        scholar: `## Energy Derivation

Work done charging a capacitor from 0 to final charge Q:

> U = ∫₀^Q V dq = ∫₀^Q (q/C) dq = Q²/(2C)

Since Q = CV: **U = ½CV² = ½QV = Q²/2C**

## Energy Density

The energy is stored in the **electric field** between the plates. The energy density (J/m³):

> u = U/Volume = (½CV²)/(Ad) = (½ε₀A/d·V²)/(Ad) = **½ε₀E²**

This is a fundamental result — electric field energy density is ½ε₀E² regardless of geometry.

With dielectric: **u = ½εE² = ½Kε₀E²**

## Energy in Charging Through a Resistor

When charging a capacitor C through resistance R from supply V:

- Total energy from supply: Q·V = CV²
- Energy stored in capacitor: ½CV²
- Energy dissipated in R: **½CV²** (exactly half, regardless of R!)

This 50% efficiency limit is fundamental, not due to R being large or small.

## Parallel Connection Energy Loss

Connecting two capacitors of equal C (one at V₀, one uncharged):

> V_final = V₀/2    (charge conserves)
> U_initial = ½CV₀²
> U_final = ½(2C)(V₀/2)² = ¼CV₀²

Energy lost = **¼CV₀²** — dissipated as heat/EM radiation in connecting wire, unavoidable!`,

        researcher: `## Energy in the Electromagnetic Field

The macroscopic energy stored in an electric field:

> U = (ε₀/2) ∫ E² dV      (vacuum)

With linear dielectric: U = (1/2) ∫ D·E dV = (1/2) ∫ εE² dV

This is the starting point for deriving Maxwell's stress tensor and radiation pressure.

## Thermodynamic Fluctuations

At temperature T, thermal fluctuations cause charge noise on the capacitor:

> ⟨(ΔQ)²⟩ = kT·C      (Johnson-Nyquist noise on capacitance)
> ⟨(ΔV)²⟩ = kT/C

This sets the fundamental noise floor in charge amplifiers and MEMS sensors. Reducing capacitance reduces charge noise but increases voltage noise.

## Nonlinear Capacitor Energy

For a nonlinear capacitor where Q = f(V):

> U = ∫₀^V Q(V') dV' = ∫₀^Q V(Q') dQ'

This is relevant for varactors, ferroelectric capacitors, and MOS structures.

## Quantum Energy Levels in LC Oscillator

For a quantum LC circuit (superconducting qubit precursor):

> H = Q̂²/(2C) + Φ̂²/(2L)

This is exactly a quantum harmonic oscillator with:
> ω₀ = 1/√(LC)
> ΔE = ℏω₀

The zero-point energy ½ℏω₀ is fundamental to superconducting qubit operation and quantum noise in microwave resonators.`,
      },
    },
    {
      id: 'cap-series',
      title: 'Capacitors in Series',
      notes: {
        explorer: `## Capacitors in Series

When capacitors are connected **end-to-end** (in a line), they are said to be in **series**.

## A Water Analogy

Imagine water buckets connected by pipes. If you pour water in, every bucket gets the same amount of water. But together, they don't hold more than the smallest bucket — in fact, they hold less!

## The Rule for Series Capacitors

- Every capacitor in series stores the **same charge** Q
- The voltages across each capacitor **add up** to the total voltage
- The total capacitance is **less** than any single capacitor

## The Formula

> 1/C_total = 1/C₁ + 1/C₂ + 1/C₃ + ...

For two capacitors:
> C_total = (C₁ × C₂) / (C₁ + C₂)

## Example

Two capacitors: C₁ = 4 μF, C₂ = 4 μF connected in series:

> 1/C_total = 1/4 + 1/4 = 2/4 = 1/2
> C_total = **2 μF**   (half of each!)

## When is Series Used?

- When you need to handle **high voltages** — each capacitor only sees part of the total voltage`,

        investigator: `## Capacitors in Series

In a series connection, capacitors are connected one after another with no branches between them.

## Key Properties

- **Same charge Q** on every capacitor (charge is conserved on the isolated inner nodes)
- **Voltage divides** across each capacitor
- **Total capacitance decreases** — less than the smallest individual capacitor

## Derivation

[diagram:cap-series]

Let each capacitor have voltage Vᵢ = Q/Cᵢ. The total voltage:

> V_total = V₁ + V₂ + ... = Q/C₁ + Q/C₂ + ...
> V_total/Q = 1/C₁ + 1/C₂ + ...

Since C_total = Q/V_total:

> **1/C_total = 1/C₁ + 1/C₂ + ...**

For two capacitors: C_total = C₁C₂/(C₁+C₂)

## Voltage Division

Each capacitor's voltage is inversely proportional to its capacitance:

> V₁ = Q/C₁ = (C_total/C₁) × V_total

Smaller capacitor → larger voltage share.

## Worked Example

C₁ = 6 μF, C₂ = 3 μF in series at 12 V:
> C_total = (6×3)/(6+3) = **2 μF**
> Q = C_total × V = 2×10⁻⁶ × 12 = 24 μC
> V₁ = Q/C₁ = 24/6 = **4 V**,  V₂ = 24/3 = **8 V** ✓ (4+8=12 V)`,

        scholar: `## Series Capacitance — Formal Analysis

For n capacitors in series, the equivalent capacitance satisfies:

> 1/C_eq = Σᵢ (1/Cᵢ)

This follows from charge neutrality of the isolated inner conductors: the charge +Q on the right plate of C₁ equals the charge −Q on the left plate of C₂ (electrostatic induction with no source/sink of charge on isolated nodes).

## Impedance Perspective

In terms of impedance Z = 1/(jωC):

> Z_total = Z₁ + Z₂ + ... = 1/(jωC₁) + 1/(jωC₂) = 1/(jω) × Σ(1/Cᵢ)

So the series combination behaves as a single capacitor with 1/C_series = Σ(1/Cᵢ). ✓

## Voltage Distribution and Capacitor Selection

Since V₁/V₂ = C₂/C₁, capacitors with **different C** share voltage unequally. This is exploited in:

- **High-voltage capacitor stacks**: series capacitors divide voltage so each handles a lower voltage
- **Capacitive voltage dividers**: precision voltage scaling in AC circuits

## Energy in Series Combination

Total energy stored:
> U = ½C_eq V² = Σᵢ ½CᵢVᵢ²

Each capacitor stores energy ½CᵢVᵢ² = Q²/(2Cᵢ). Sum equals total: Σ Q²/(2Cᵢ) = (Q²/2)Σ(1/Cᵢ) = Q²/(2C_eq). ✓`,

        researcher: `## Series Capacitors in Circuit Theory

In AC analysis, series capacitors are treated as series impedances:

> Z_total(jω) = Σ 1/(jωCᵢ) → C_series = 1/Σ(1/Cᵢ)

For a series RLC circuit:
> Z(jω) = R + jωL + 1/(jωC_series)

Resonance at ω₀ = 1/√(LC_series), half-power bandwidth Δω = R/L.

## Non-ideal Series Capacitors

Real capacitors have parasitic elements:
> Z_real(jω) = ESR + jωESL + 1/(jωC)

Series combination: parasitics add as series impedances. ESR and ESL of series-connected capacitors stack, increasing losses at high frequency.

## Switched Capacitor Networks

In switched-capacitor circuits (CMOS signal processing), capacitors are periodically switched to implement resistive behaviour. Series capacitor arrays implement FIR filters and DACs. The effective resistance of a switched capacitor:

> R_eff = 1/(f_clk × C)

where f_clk is the switching frequency. This enables precision resistors on CMOS chips.

## Charge Sharing and Sampling Noise

When two series capacitors are connected (charge redistribution):

> ΔQ = C₁C₂/(C₁+C₂) × ΔV      (sharing formula)

The associated **kT/C noise**: σ²_V = kT/C_total. Critical in sample-and-hold circuits and ADC front ends — minimum capacitance set by SNR requirements.`,
      },
    },
    {
      id: 'cap-parallel',
      title: 'Capacitors in Parallel',
      notes: {
        explorer: `## Capacitors in Parallel

When capacitors are connected **side by side** sharing the same two connection points, they are in **parallel**.

## A Water Analogy

Imagine adding more buckets side by side. Each bucket is at the same height (same voltage), and together they hold much more water than any one alone!

## The Rule for Parallel Capacitors

- Every capacitor in parallel has the **same voltage** V
- The charges on each capacitor **add up**
- The total capacitance is the **sum** of all capacitors

## The Formula

> C_total = C₁ + C₂ + C₃ + ...

## Example

Three capacitors: C₁ = 2 μF, C₂ = 3 μF, C₃ = 5 μF in parallel:

> C_total = 2 + 3 + 5 = **10 μF**

## Why Use Parallel?

- When you need to store **more charge** at the same voltage
- To share current between capacitors so none gets overloaded
- To increase total capacitance in power supply circuits`,

        investigator: `## Capacitors in Parallel

Parallel connection means both terminals of each capacitor are connected to the same two nodes.

## Key Properties

- **Same voltage V** across every capacitor
- **Charges add up**: Q_total = Q₁ + Q₂ + ...
- **Total capacitance increases**: C_total = ΣCᵢ

## Derivation

[diagram:cap-parallel]

Each capacitor stores charge Qᵢ = CᵢV (same V for all):

> Q_total = Q₁ + Q₂ + ... = C₁V + C₂V + ... = (C₁ + C₂ + ...)V

Since C_total = Q_total/V:

> **C_total = C₁ + C₂ + ...**

## Current in Parallel Capacitors (AC)

For AC: Iᵢ = Cᵢ dV/dt. Total current:

> I_total = (C₁ + C₂) dV/dt = C_total dV/dt ✓

## Worked Example

Two capacitors C₁ = 8 μF, C₂ = 4 μF in parallel charged to 9 V:

> C_total = 12 μF
> Q₁ = 8×10⁻⁶ × 9 = 72 μC
> Q₂ = 4×10⁻⁶ × 9 = 36 μC
> Q_total = 72 + 36 = **108 μC** = C_total × V = 12×10⁻⁶ × 9 ✓

## Uses

- Power supply decoupling: parallel caps of different values cover different frequency ranges
- Motor start/run capacitors in parallel for correct rating`,

        scholar: `## Parallel Capacitance — Formal Analysis

For n capacitors in parallel, the equivalent capacitance:

> C_eq = Σᵢ Cᵢ

This follows from: all capacitors share the same potential difference V (they are connected between the same two nodes), so charge sums while V is fixed.

## Impedance Perspective

In terms of admittance Y = jωC (inverse of impedance):

> Y_total = Y₁ + Y₂ + ... = jωC₁ + jωC₂ = jω(C₁ + C₂)

So parallel capacitors add as admittances — exactly analogous to conductances in parallel. ✓

## Charge Distribution

In steady state each capacitor holds charge proportional to its capacitance:

> Q₁/Q₂ = C₁/C₂

When the voltage is changed (dV/dt ≠ 0), each draws current:
> Iᵢ = Cᵢ × dV/dt

Larger capacitor draws more current — important in parallel RC timing circuits.

## Energy in Parallel Combination

> U = ½C_eq V² = Σᵢ ½Cᵢ V² ✓

Each capacitor stores energy proportional to its capacitance; total is just the sum.

## Resonant Circuit (Parallel LC)

Adding an inductor L in parallel:
> Z(jω) = (jωL)/(jωL × jωC_total + 1) → resonance at ω₀ = 1/√(LC_total)

Parallel resonance has high impedance at ω₀ — useful as a band-stop (notch) filter.`,

        researcher: `## Parallel Capacitors in High-Frequency Design

The standard technique for broadband power delivery is **multi-value parallel capacitor arrays**:

Bulk (100 μF electrolytic) + mid-range (1 μF ceramic) + bypass (100 nF ceramic) + HF (10 nF) mounted in parallel on IC power rails.

Each capacitor handles a different frequency decade. The composite impedance:

> Z(jω) = [Σᵢ (ESRᵢ + jωESLᵢ + 1/(jωCᵢ))⁻¹]⁻¹

Minimising |Z| across the entire frequency range is the design objective for power integrity.

## Parallel Resonance in RF Circuits

A parallel RLC tank circuit has admittance:

> Y = 1/R + jωC − j/(ωL)

Resonance at ω₀ = 1/√(LC): Y_min = 1/R (purely resistive), maximum impedance. Quality factor:

> Q = R/ω₀L = Rω₀C

Tank circuits with parallel capacitor banks allow varactor-tuned frequency synthesis.

## Switched Capacitor Arrays (DAC)

In binary-weighted capacitor DACs (used in successive-approximation ADCs):

> C_array = C₀(2^(N−1) + 2^(N−2) + ... + 1) = C₀(2^N − 1)

Each bit switches a capacitor from GND to reference. The output voltage is proportional to the digital word. Linearity limited by capacitor matching (unit cell C₀ mismatch σ/C₀).

## Quantum Capacitance Arrays

In superconducting quantum computing, Josephson junction arrays use parallel capacitance to control charging energy:

> E_C = e²/(2C_total)

Tuning C_total (via parallel SQUID-based capacitors) sets the qubit spectrum — anharmonicity Δ = E_C determines single-photon addressability.`,
      },
    },
    {
      id: 'cap-charging',
      title: 'Charging & Discharging',
      notes: {
        explorer: `## Charging a Capacitor

When you connect a capacitor to a battery through a wire, charge flows onto the capacitor.

But it doesn't happen instantly — it takes time!

## Why Does It Take Time?

The resistance in the wire and circuit **slows down** the flow of charge. As the capacitor fills up, it pushes back harder, slowing the charging even more.

Eventually the capacitor is fully charged and no more current flows.

## The RC Circuit

An **RC circuit** has a Resistor (R) and Capacitor (C) together.

- **Bigger R** → charges more slowly (more resistance slowing current)
- **Bigger C** → takes longer to fill up (more charge needed)

[diagram:rc-circuit]

## Time Constant τ (tau)

> τ = R × C

This is how long it takes to charge to about **63%** of full charge.

- After 1τ: 63% charged
- After 3τ: 95% charged
- After 5τ: 99% charged (basically full!)

## Discharging

When you disconnect the battery and connect the capacitor to a resistor, it **discharges** — releasing its stored energy back through the circuit. It empties out following the same time pattern!`,

        investigator: `## The RC Charging Circuit

[diagram:rc-circuit]

A capacitor C in series with resistor R, connected to supply voltage V₀.

## Charging Equations

Applying Kirchhoff's voltage law:

> V₀ = V_R + V_C = IR + Q/C

This gives the differential equation: R(dQ/dt) + Q/C = V₀

**Solution (charging from 0):**

> Q(t) = CV₀(1 − e^(−t/RC))
> V_C(t) = V₀(1 − e^(−t/RC))
> I(t) = (V₀/R) e^(−t/RC)

## Discharging Equations

Capacitor (charged to V₀) discharged through R:

> Q(t) = CV₀ e^(−t/RC)
> V_C(t) = V₀ e^(−t/RC)
> I(t) = (V₀/R) e^(−t/RC)

## Time Constant τ = RC

[diagram:rc-curve]

| Time | Charge (charging) | Charge (discharging) |
|---|---|---|
| t = τ | 63% Q_max | 37% Q_max |
| t = 2τ | 86% Q_max | 14% Q_max |
| t = 5τ | 99% Q_max | ~1% Q_max |

## Worked Example

C = 100 μF, R = 1 kΩ, V₀ = 10 V. Find τ and V_C at t = 0.2 s.

> τ = RC = 1000 × 100×10⁻⁶ = **0.1 s**
> V_C(0.2) = 10(1 − e^(−0.2/0.1)) = 10(1 − e^(−2)) ≈ **8.65 V**`,

        scholar: `## Derivation of the RC Charging Equation

KVL around the loop: V₀ = IR + Q/C

Since I = dQ/dt:
> R(dQ/dt) + Q/C = V₀

This is a first-order linear ODE. Rearranging:
> dQ/dt + Q/(RC) = V₀/R

**Integrating factor:** e^(t/RC)

> d/dt[Q·e^(t/RC)] = (V₀/R)·e^(t/RC)
> Q·e^(t/RC) = CV₀·e^(t/RC) + constant

With Q(0) = 0:
> **Q(t) = CV₀(1 − e^(−t/τ))**,  τ = RC ✓

## Current and Voltage

- I(t) = dQ/dt = (V₀/R)e^(−t/τ) — decays exponentially from V₀/R
- V_C(t) = Q/C = V₀(1 − e^(−t/τ)) — rises toward V₀
- V_R(t) = IR = V₀e^(−t/τ) — drops exponentially

## Energy Analysis

Total energy delivered by supply: U_supply = Q_∞ × V₀ = CV₀²

Energy stored in capacitor: U_C = ½CV₀²

Energy dissipated in R: U_R = ½CV₀² — **exactly half, regardless of R!**

This is a fundamental result — you can never charge a capacitor from a voltage source with more than 50% efficiency (unless using inductor-based switching).

## RC as an Integrator/Differentiator

- Large RC (slow): V_out ≈ (1/RC)∫V_in dt → **integrator**
- Small RC (fast): V_out ≈ RC(dV_in/dt) → **differentiator**`,

        researcher: `## Laplace Domain Analysis

The RC charging circuit in the s-domain (Laplace transform):

> Z_total(s) = R + 1/(sC)
> I(s) = V₀/s / (R + 1/(sC)) = V₀C/(1 + sRC)
> V_C(s) = I(s)/(sC) = V₀/(s(1 + sRC)) = V₀/R × 1/(s(s + 1/τ))

Inverse Laplace: V_C(t) = V₀(1 − e^(−t/τ))·u(t) ✓

## Complex Impedance and Phase

In sinusoidal steady state: Z_C = 1/(jωC)

> V_C/V_in = 1/(1 + jωRC)      (low-pass filter)
> |V_C/V_in| = 1/√(1 + (ωRC)²)
> Phase: φ = −arctan(ωRC)

Current **leads** voltage by phase angle φ — capacitors are reactive loads.

## RC Circuit as Integrating Amplifier

Op-amp with C in feedback, R at input:

> V_out = −(1/RC) ∫ V_in dt

Used in: analog computers, PID controllers (I-term), waveform generators, sigma-delta modulators.

## Stochastic Charging (kT/C Noise)

In a real RC circuit at temperature T, thermal noise in R (Johnson noise: S_V = 4kTR) integrates onto C:

> σ²_{V_C} = kT/C

The total noise is **independent of R** — set only by C and T. Critical design limit for sample-and-hold circuits and CMOS ADCs.

## Quantum Mechanical RC Circuit

For a quantum capacitor (SET device, qubit), the charging energy:
> E_C = e²/(2C)

When E_C >> kT (achieved with C < ~1 aF at 10 mK), single-electron charging becomes observable — Coulomb blockade. Tunneling rate: Γ ∝ e^(−2πZ/R_K), R_K = h/e² = 25.8 kΩ.`,
      },
    },
    {
      id: 'cap-applications',
      title: 'Applications',
      notes: {
        explorer: `## Where Are Capacitors Used?

Capacitors are everywhere — you probably have thousands of them within arm's reach right now!

## Camera Flash

- Your camera has a capacitor that **slowly charges** from the battery
- When you take a photo, it **releases all its energy instantly** as a brilliant flash of light
- This is faster than a battery alone could manage!

## Touch Screens

- Your phone or tablet screen is covered with a grid of tiny capacitors
- When your finger touches the screen, it **changes the capacitance** at that spot
- The phone detects exactly where you touched!

## Power Supplies

- The charger for your phone and laptop uses capacitors to **smooth out electricity**
- Without them, the power would wobble and your devices would malfunction

## Computers and Memory

- Old-style computer RAM (called DRAM) stores each bit of information in a tiny capacitor
- If the capacitor is charged = 1
- If the capacitor is discharged = 0

## Electric Cars

- Large capacitors (supercapacitors) help **store and release energy quickly** during acceleration
- They work alongside batteries to make electric cars more efficient`,

        investigator: `## Key Applications of Capacitors

## 1. Power Supply Smoothing (Filter Capacitor)

AC mains is converted to pulsating DC by a rectifier. A large capacitor in parallel with the load **smooths the ripple**:

- Charges during voltage peaks
- Discharges to maintain voltage between peaks
- Larger C → smoother output

Required capacitance: C ≈ I_load / (f × ΔV)

## 2. Timing and Oscillator Circuits

RC time constant τ = RC controls oscillation frequency:

> f ≈ 1/(2πRC)   (for RC oscillators)

Used in: clocks, function generators, 555 timer circuits.

## 3. Signal Coupling / DC Blocking

A **series capacitor** passes AC signals but blocks DC:
- Connects stages of an amplifier without sharing DC bias
- Blocks DC offset from reaching speakers (audio circuits)

## 4. Decoupling / Bypass Capacitor

Placed across IC power pins to **absorb switching noise**:
- Provides local charge reservoir during fast logic transitions
- Prevents voltage spikes on power rail

## 5. Touchscreen Sensing

A finger near a capacitor electrode changes the fringe capacitance:

> ΔC ≈ ε₀ × A_finger / d_finger ≈ 1–5 pF

Measured by charging time variation → exact touch position determined.

## 6. Defibrillator (Medical)

A large capacitor (~32 μF) is charged to ~2500 V (U = ½CV² ≈ 200 J) and discharged through the patient's chest in ~10 ms to restore heart rhythm.`,

        scholar: `## Advanced Capacitor Applications

## Active Filters

RC networks with op-amps implement **Butterworth, Chebyshev, Bessel filters**:

- Low-pass: C in feedback path → integrates high frequencies to zero
- High-pass: C in input path → differentiates low frequencies (passes high)
- Sallen-Key topology: two RC sections + unity-gain amp → 2nd order filter

Pole placement: ω_p = 1/(RC√(Q_factor adjustments))

## Phase-Locked Loop (PLL) Loop Filter

The RC loop filter in a PLL integrates phase error signal:

> F(s) = (1 + sτ₂)/(1 + sτ₁)   (lead-lag filter)

The loop filter bandwidth determines lock range, phase noise, and reference spur suppression.

## Sample-and-Hold Circuit

In ADCs, a capacitor samples an analog input:

1. Track mode: switch closed, C follows V_in
2. Hold mode: switch open, C holds V_sample

Aperture error, droop rate (leakage current / C), and kT/C noise determine ADC accuracy.

## Integrating ADC (Dual-Slope)

Reference current charges C for fixed time T₁ → then unknown current discharges C until V_C = 0 (time T₂):

> V_in/V_ref = T₂/T₁

Excellent noise rejection, used in precision instruments (multimeters, pH meters).

## Power Factor Correction

Capacitors compensate for inductive loads (motors) by supplying reactive power locally:

> Q_C = V²/X_C = V²ωC   (VAR)

Reduces reactive current in supply lines, improving efficiency and reducing transformer sizing.`,

        researcher: `## Supercapacitors (Electrochemical Double-Layer Capacitors)

EDLC supercapacitors exploit the double-layer capacitance at the electrode–electrolyte interface:

> C_DL = ε_r ε₀ A / d_Helmholtz   (d ≈ 0.3–0.5 nm, A_BET up to 2000 m²/g)

Typical: 1–3000 F, energy density 5–15 Wh/kg, power density 1–10 kW/kg. Ragone plot positioned between batteries and conventional capacitors.

Pseudocapacitance in RuO₂ and MnO₂ adds faradaic contribution, increasing energy density to 20–60 Wh/kg (hybrid supercapacitors).

## DRAM Cell Scaling

Each DRAM cell stores one bit in a single MOS capacitor + access transistor. The storage node requires C_cell ≥ 20–30 fF for adequate noise margin.

At sub-10 nm nodes, 3D capacitor structures (deep trench, fin-on-capacitor) achieve C/footprint > 30 fF/μm². High-κ dielectrics (HfO₂, ZrO₂, κ > 20) replace SiO₂ to maintain capacitance while reducing physical thickness.

## RF MEMS Tunable Capacitors

Electrostatically actuated membrane capacitors achieve tuning ratio up to 4:1:

> C(V) = C₀ / (1 − V/V_PI)^(2/3)    (valid for V < V_PI)

V_PI = pull-in voltage. Used in: phased array antennas, cognitive radio, wideband VCOs.

## Ferroelectric Tunnel Junction Capacitors

In FeRAM and FeFET devices, the remnant polarisation of a ferroelectric (PZT, HZO) represents stored binary information. Read via the polarisation reversal current:

> I = A × dP/dt = A × 2P_r / t_switch

Non-destructive readout schemes (using sub-coercive field sensing) are active research area for compute-in-memory architectures.`,
      },
    },
  ],
  explanations: {
    explorer: 'A capacitor is like a tiny rechargeable bucket for electric charge. It has two metal plates separated by a gap. When connected to a battery, one plate gets positive charge and the other gets negative. When you disconnect the battery, the capacitor holds that charge until needed.',
    investigator: 'Capacitance C = Q/V (farads, F). Parallel plate capacitor: C = ε₀A/d. Inserting a dielectric (insulator) increases capacitance: C = Kε₀A/d where K is the dielectric constant. Energy stored: U = ½CV² = Q²/2C. Series: 1/C_total = Σ1/Cᵢ. Parallel: C_total = ΣCᵢ.',
    scholar: 'Charging through resistor R: Q(t) = Q₀(1 − e^(−t/RC)); time constant τ = RC. Discharge: Q(t) = Q₀e^(−t/RC). Dielectric polarisation: D = ε₀E + P = εE. Energy density: u = ½εE². Cylindrical capacitor: C = 2πεL/ln(b/a). Spherical: C = 4πε(ab)/(b−a).',
    researcher: 'Capacitors in AC circuits: impedance Z_C = 1/(jωC), causes 90° phase lead of current over voltage. Supercapacitors use double-layer electrochemical capacitance (F range). Quantum capacitance arises in 2D materials (graphene) from finite density of states. Casimir effect: quantum fluctuations cause attractive force between uncharged parallel plates separated by nm gaps.',
  },
  flashcards: [
    { id: 'cap-f1', question: 'Define capacitance.', answer: 'C = Q/V — charge stored per unit potential difference; unit is the farad (F).', microTopicId: 'cap-definition' },
    { id: 'cap-f2', question: 'Capacitance of a parallel plate capacitor?', answer: 'C = ε₀A/d where A = plate area, d = separation.', microTopicId: 'cap-parallel-plate' },
    { id: 'cap-f3', question: 'What happens to capacitance when plate separation doubles?', answer: 'Capacitance halves (C ∝ 1/d).', microTopicId: 'cap-parallel-plate' },
    { id: 'cap-f4', question: 'What is a dielectric?', answer: 'An insulating material placed between capacitor plates that increases capacitance by reducing the effective field.', microTopicId: 'cap-dielectric' },
    { id: 'cap-f5', question: 'Effect of dielectric constant K on capacitance?', answer: 'C = Kε₀A/d — capacitance increases by factor K.', microTopicId: 'cap-dielectric' },
    { id: 'cap-f6', question: 'Energy stored in a capacitor?', answer: 'U = ½CV² = ½QV = Q²/2C', microTopicId: 'cap-energy' },
    { id: 'cap-f7', question: 'Equivalent capacitance of two capacitors in series?', answer: '1/C_eq = 1/C₁ + 1/C₂', microTopicId: 'cap-series' },
    { id: 'cap-f8', question: 'Equivalent capacitance of two capacitors in parallel?', answer: 'C_eq = C₁ + C₂', microTopicId: 'cap-parallel' },
    { id: 'cap-f9', question: 'In series capacitors, which is the same for all capacitors?', answer: 'Charge Q — same charge on every capacitor in series.', microTopicId: 'cap-series' },
    { id: 'cap-f10', question: 'In parallel capacitors, which is the same for all capacitors?', answer: 'Voltage V — same potential difference across each capacitor.', microTopicId: 'cap-parallel' },
    { id: 'cap-f11', question: 'Time constant for RC circuit charging?', answer: 'τ = RC; time to reach 63% of full charge.', microTopicId: 'cap-charging' },
    { id: 'cap-f12', question: 'Charge on a capacitor charging through R at time t?', answer: 'Q(t) = Q₀(1 − e^(−t/RC))', microTopicId: 'cap-charging' },
    { id: 'cap-f13', question: 'Charge remaining when discharging at time t?', answer: 'Q(t) = Q₀ e^(−t/RC)', microTopicId: 'cap-charging' },
    { id: 'cap-f14', question: 'What does the area under a Q-t discharge curve represent?', answer: 'Total charge released (coulombs).', microTopicId: 'cap-charging' },
    { id: 'cap-f15', question: 'Energy density in a capacitor?', answer: 'u = ½ε₀E² (J/m³)', microTopicId: 'cap-energy' },
    { id: 'cap-f16', question: 'A 4 μF capacitor is charged to 12 V. How much energy is stored?', answer: 'U = ½ × 4×10⁻⁶ × 144 = 2.88 × 10⁻⁴ J = 0.288 mJ.', microTopicId: 'cap-energy' },
    { id: 'cap-f17', question: 'What is a supercapacitor?', answer: 'An electrochemical double-layer capacitor with very high capacitance (farads) using surface area of activated carbon electrodes.', microTopicId: 'cap-applications' },
    { id: 'cap-f18', question: 'Application of capacitors in power supplies?', answer: 'Smoothing: capacitors charge during peaks and discharge during troughs to smooth AC ripple into DC.', microTopicId: 'cap-applications' },
    { id: 'cap-f19', question: 'Application of capacitors in camera flashes?', answer: 'Large capacitor charges slowly from battery then discharges rapidly to produce a bright flash.', microTopicId: 'cap-applications' },
    { id: 'cap-f20', question: 'How does a capacitor block DC but pass AC?', answer: 'DC charges it to supply voltage then current stops; AC continuously reverses, allowing charge/discharge current to flow.', microTopicId: 'cap-applications' },
    { id: 'cap-f21', question: 'Two 6 μF capacitors in series — equivalent capacitance?', answer: '1/C_eq = 1/6 + 1/6 = 2/6; C_eq = 3 μF.', microTopicId: 'cap-series' },
    { id: 'cap-f22', question: 'Two 6 μF capacitors in parallel — equivalent capacitance?', answer: 'C_eq = 6 + 6 = 12 μF.', microTopicId: 'cap-parallel' },
    { id: 'cap-f23', question: 'What is the unit of capacitance?', answer: 'Farad (F) = C/V. Practical units: μF (10⁻⁶ F), nF (10⁻⁹ F), pF (10⁻¹² F).', microTopicId: 'cap-definition' },
    { id: 'cap-f24', question: 'Why does inserting a dielectric increase capacitance?', answer: 'Dielectric molecules polarise and reduce the electric field between plates, allowing more charge to be stored at the same voltage.', microTopicId: 'cap-dielectric' },
    { id: 'cap-f25', question: 'Capacitive reactance in AC circuit?', answer: 'X_C = 1/(ωC) = 1/(2πfC); higher frequency → lower reactance.', microTopicId: 'cap-applications' },
  ],
  experiments: [
    {
      id: 'cap-e1',
      level: 'easy',
      title: 'Capacitor Charging and LED Flash',
      microTopicId: 'cap-charging',
      materials: ['1000 μF capacitor', '9V battery', 'LED', 'Resistor 1kΩ', 'Connecting wires'],
      steps: [
        'Connect capacitor to battery through resistor for 10 seconds.',
        'Disconnect battery.',
        'Connect LED across capacitor.',
        'Observe LED light and gradually dim as capacitor discharges.',
        'Time the discharge and estimate τ = RC.',
      ],
      safetyNote: 'Observe capacitor polarity; wrong polarity can damage electrolytic capacitors.',
      expected: 'LED glows brightly then fades over ~1–2 seconds; τ ≈ 1 s.',
    },
    {
      id: 'cap-e2',
      level: 'easy',
      title: 'Exploring C = Q/V',
      microTopicId: 'cap-definition',
      materials: ['Capacitor (known C, e.g. 100 μF)', 'Variable DC supply', 'Voltmeter', 'Charge sensor or coulombmeter'],
      steps: [
        'Charge capacitor to 1, 2, 3, 4, 5 V in steps.',
        'Measure charge stored at each voltage using coulombmeter.',
        'Plot Q vs V — expect straight line.',
        'Slope = C; compare with labelled value.',
      ],
      safetyNote: 'Do not exceed voltage rating of capacitor.',
      expected: 'Linear Q-V graph; slope equals capacitance within 10%.',
    },
    {
      id: 'cap-e3',
      level: 'medium',
      title: 'RC Time Constant Measurement',
      microTopicId: 'cap-charging',
      materials: ['100 μF capacitor', '10 kΩ resistor', '9V battery', 'Voltmeter or data logger', 'Stopwatch'],
      steps: [
        'Build RC charging circuit with switch.',
        'Close switch, start timer.',
        'Record voltage every 0.5 seconds until ~5τ.',
        'Plot V vs t; fit to V₀(1 − e^(−t/RC)).',
        'Read τ where V = 0.63V₀.',
        'Compare with calculated τ = RC = 1 s.',
      ],
      safetyNote: 'Check capacitor polarity.',
      expected: 'Exponential charging curve; τ ≈ 1.0 s confirming RC calculation.',
    },
    {
      id: 'cap-e4',
      level: 'medium',
      title: 'Effect of Dielectric on Capacitance',
      microTopicId: 'cap-dielectric',
      materials: ['Parallel plate capacitor (large plates, adjustable)', 'Plastic/glass sheet', 'Capacitance meter', 'Ruler'],
      steps: [
        'Measure capacitance of parallel plate capacitor in air.',
        'Insert plastic sheet between plates — measure new capacitance.',
        'Insert glass — measure capacitance.',
        'Compare ratios C_dielectric/C_air to expected K values.',
      ],
      safetyNote: 'Handle glass carefully.',
      expected: 'Capacitance increases with dielectric; K_plastic ≈ 2–4, K_glass ≈ 5–10.',
    },
    {
      id: 'cap-e5',
      level: 'hard',
      title: 'Energy Stored in a Capacitor',
      microTopicId: 'cap-energy',
      materials: ['Large capacitor (1000 μF)', 'Voltmeter', 'Small electric motor or lamp', 'Scale for measuring work'],
      steps: [
        'Charge capacitor to measured voltage V.',
        'Discharge through small motor lifting a measured weight.',
        'Calculate mechanical work done W = mgh.',
        'Calculate stored energy U = ½CV².',
        'Compute efficiency η = W/U.',
      ],
      safetyNote: 'Handle charged capacitors carefully; discharge fully after use.',
      expected: 'Efficiency 50–80%; U = ½CV² confirmed within experimental error.',
    },
    {
      id: 'cap-e6',
      level: 'hard',
      title: 'Capacitors in Series and Parallel',
      microTopicId: 'cap-series',
      materials: ['3 × 100 μF capacitors', 'Capacitance meter', 'Breadboard', 'Connecting wires'],
      steps: [
        'Measure individual capacitances C₁, C₂, C₃.',
        'Wire all three in series — measure total.',
        'Compare with formula 1/C = 1/C₁ + 1/C₂ + 1/C₃.',
        'Wire all three in parallel — measure total.',
        'Compare with C = C₁ + C₂ + C₃.',
        'Build series-parallel combination and predict before measuring.',
      ],
      safetyNote: 'No specific hazard at low voltage.',
      expected: 'Series: C_total < smallest capacitor; Parallel: C_total = sum. Both within 5% of theoretical.',
    },
  ],
  realWorld: [
    'Camera flashes store energy in large capacitors and release it in milliseconds to produce bright light.',
    'Capacitors smooth out AC ripple in phone chargers and power supplies to provide clean DC.',
    'Touch screens use a grid of capacitors — your finger changes local capacitance, locating the touch.',
    'Defibrillators charge large capacitors to thousands of volts then discharge across the chest wall.',
    'DRAM memory cells store each bit as charge on a tiny capacitor (refreshed thousands of times per second).',
    'Supercapacitors in regenerative braking systems on buses recover kinetic energy as electric charge.',
  ],
  relatedTopicIds: ['electrostatics', 'electric-current', 'dc-circuits'],
  curiosityBranches: [
    { label: 'How does DRAM store data as charge?', topicId: 'capacitors' },
    { label: 'What makes a supercapacitor different from a battery?', topicId: 'capacitors' },
    { label: 'How does touchscreen capacitance work?', topicId: 'capacitors' },
    { label: 'Can a capacitor replace a battery?', topicId: 'capacitors' },
  ],
  quiz: [
    { id: 'cap-q1', question: 'A capacitor stores 60 μC at 12 V. Its capacitance is:', options: ['5 μF', '720 μF', '0.2 μF', '12 μF'], answer: 0, explanation: 'C = Q/V = 60×10⁻⁶ / 12 = 5 × 10⁻⁶ F = 5 μF.', microTopicId: 'cap-definition' },
    { id: 'cap-q2', question: 'Two 4 μF capacitors in series: total capacitance is:', options: ['8 μF', '4 μF', '2 μF', '1 μF'], answer: 2, explanation: '1/C = 1/4 + 1/4 = 2/4; C = 2 μF.', microTopicId: 'cap-series' },
    { id: 'cap-q3', question: 'Inserting a dielectric (K = 3) into a capacitor:', options: ['Triples V', 'Triples C', 'Reduces C by 3', 'Has no effect'], answer: 1, explanation: 'C = Kε₀A/d; dielectric constant K multiplies capacitance.', microTopicId: 'cap-dielectric' },
    { id: 'cap-q4', question: 'Energy stored in a 10 μF capacitor charged to 100 V:', options: ['0.05 J', '0.1 J', '1 J', '0.5 J'], answer: 0, explanation: 'U = ½CV² = ½ × 10×10⁻⁶ × 10000 = 0.05 J.', microTopicId: 'cap-energy' },
    { id: 'cap-q5', question: 'After one time constant τ = RC, a charging capacitor has reached what % of final voltage?', options: ['37%', '50%', '63%', '100%'], answer: 2, explanation: 'V(τ) = V₀(1 − e⁻¹) = V₀ × 0.632 ≈ 63%.', microTopicId: 'cap-charging' },
    { id: 'cap-q6', question: 'Capacitors in parallel share the same:', options: ['Charge', 'Voltage', 'Energy', 'Current'], answer: 1, explanation: 'Parallel elements share the same voltage across their terminals.', microTopicId: 'cap-parallel' },
    { id: 'cap-q7', question: 'Doubling plate separation of a parallel plate capacitor:', options: ['Doubles C', 'Halves C', 'Has no effect on C', 'Quadruples C'], answer: 1, explanation: 'C = ε₀A/d; doubling d halves C.', microTopicId: 'cap-parallel-plate' },
    { id: 'cap-q8', question: 'A capacitor blocks DC because:', options: ['It has zero resistance', 'Charge builds up opposing further current', 'It is an open circuit always', 'It converts charge to heat'], answer: 1, explanation: 'As DC charges the capacitor, back-EMF builds up until it equals supply voltage — current falls to zero.', microTopicId: 'cap-applications' },
  ],
};

// ─── Electric Current & Ohm's Law ─────────────────────────────────────────────
const electricCurrentTopic: FlagshipTopic = {
  id: 'electric-current',
  title: 'Electric Current & Ohm\'s Law',
  icon: '🔌',
  tagline: 'The flow of charge — understanding resistance, voltage, and current',
  microTopics: [
    { id: 'ec-current', title: 'Electric Current' },
    { id: 'ec-ohm', title: 'Ohm\'s Law' },
    { id: 'ec-resistance', title: 'Resistance & Resistivity' },
    { id: 'ec-power', title: 'Electric Power' },
    { id: 'ec-emf', title: 'EMF & Internal Resistance' },
    { id: 'ec-drift', title: 'Drift Velocity' },
    { id: 'ec-temp', title: 'Temperature & Resistance' },
    { id: 'ec-semiconductors', title: 'Semiconductors & Non-ohmic' },
  ],
  explanations: {
    explorer: 'Electric current is the flow of electrons through a wire, like water flowing through a pipe. Voltage is the pressure that pushes the electrons, and resistance is anything that slows them down. Ohm\'s law simply says: more voltage → more current, more resistance → less current.',
    investigator: 'Current I = Q/t (amperes, A). Ohm\'s Law: V = IR. Resistance R = ρL/A where ρ = resistivity, L = length, A = cross-section. Power P = IV = I²R = V²/R. For a real battery: V_terminal = ε − Ir where ε is EMF and r is internal resistance.',
    scholar: 'Drift velocity v_d = I/(nqA) where n = charge carrier density. Resistivity temperature dependence: ρ = ρ₀(1 + αΔT). Ohm\'s law in vector form: J = σE (J = current density, σ = conductivity). Non-ohmic devices: diodes, thermistors (NTC), LDRs — their R-V curves are non-linear.',
    researcher: 'Quantum transport: resistance arises from electron scattering off lattice phonons and impurities. Landauer formula: G = (2e²/h)MT (conductance quantisation). At low T, quantum corrections give weak localisation. Superconductors: Cooper pairs condense, ρ → 0 below T_c; BCS theory explains via phonon-mediated pairing. Spintronics uses electron spin as current carrier.',
  },
  flashcards: [
    { id: 'ec-f1', question: 'Define electric current.', answer: 'I = Q/t — rate of charge flow; unit is ampere (A = C/s).', microTopicId: 'ec-current' },
    { id: 'ec-f2', question: 'State Ohm\'s law.', answer: 'V = IR — voltage across a conductor equals current times resistance (for ohmic conductors).', microTopicId: 'ec-ohm' },
    { id: 'ec-f3', question: 'What is resistance?', answer: 'Opposition to current flow; R = V/I; unit is ohm (Ω).', microTopicId: 'ec-resistance' },
    { id: 'ec-f4', question: 'Resistance formula in terms of material properties?', answer: 'R = ρL/A where ρ = resistivity (Ω·m), L = length, A = cross-sectional area.', microTopicId: 'ec-resistance' },
    { id: 'ec-f5', question: 'What is resistivity?', answer: 'Intrinsic property of a material (ρ, Ω·m) measuring how strongly it resists current flow.', microTopicId: 'ec-resistance' },
    { id: 'ec-f6', question: 'What are the three power equations?', answer: 'P = IV = I²R = V²/R', microTopicId: 'ec-power' },
    { id: 'ec-f7', question: 'What is EMF?', answer: 'Electromotive force ε — work done per unit charge by a source; equal to open-circuit terminal voltage.', microTopicId: 'ec-emf' },
    { id: 'ec-f8', question: 'Terminal voltage of a battery with internal resistance r and current I?', answer: 'V = ε − Ir', microTopicId: 'ec-emf' },
    { id: 'ec-f9', question: 'What is drift velocity?', answer: 'Average velocity of electrons in a conductor due to an applied field: v_d = I/(nqA).', microTopicId: 'ec-drift' },
    { id: 'ec-f10', question: 'Typical drift velocity of electrons in copper?', answer: 'About 0.1 mm/s — very slow, yet signals travel near speed of light.', microTopicId: 'ec-drift' },
    { id: 'ec-f11', question: 'How does temperature affect resistance of metals?', answer: 'Resistance increases with temperature: R = R₀(1 + αΔT).', microTopicId: 'ec-temp' },
    { id: 'ec-f12', question: 'How does temperature affect resistance of semiconductors?', answer: 'Resistance decreases with temperature — more carriers excited across band gap.', microTopicId: 'ec-semiconductors' },
    { id: 'ec-f13', question: 'What is a thermistor (NTC)?', answer: 'Negative Temperature Coefficient resistor — resistance decreases as temperature increases; used in thermometers.', microTopicId: 'ec-semiconductors' },
    { id: 'ec-f14', question: 'What is an LDR (light-dependent resistor)?', answer: 'Resistance decreases when light intensity increases; used in light sensors.', microTopicId: 'ec-semiconductors' },
    { id: 'ec-f15', question: 'What is an ohmic conductor?', answer: 'One that obeys V = IR — linear V-I graph through origin at constant temperature.', microTopicId: 'ec-ohm' },
    { id: 'ec-f16', question: 'Energy dissipated in a resistor in time t?', answer: 'E = Pt = I²Rt = V²t/R', microTopicId: 'ec-power' },
    { id: 'ec-f17', question: 'A 60 W lamp on 240 V: what is its resistance?', answer: 'R = V²/P = 240²/60 = 57600/60 = 960 Ω.', microTopicId: 'ec-power' },
    { id: 'ec-f18', question: 'What is conventional current direction?', answer: 'Positive to negative (opposite to electron flow direction).', microTopicId: 'ec-current' },
    { id: 'ec-f19', question: 'Doubling wire length (same material): effect on resistance?', answer: 'Resistance doubles (R ∝ L).', microTopicId: 'ec-resistance' },
    { id: 'ec-f20', question: 'Doubling wire cross-section area: effect on resistance?', answer: 'Resistance halves (R ∝ 1/A).', microTopicId: 'ec-resistance' },
    { id: 'ec-f21', question: 'What is superconductivity?', answer: 'Zero electrical resistance below a critical temperature T_c — no energy loss in current flow.', microTopicId: 'ec-temp' },
    { id: 'ec-f22', question: 'What is current density J?', answer: 'J = I/A (A/m²) — current per unit cross-sectional area.', microTopicId: 'ec-drift' },
    { id: 'ec-f23', question: 'Relationship between J, σ, and E (Ohm\'s law microscopic form)?', answer: 'J = σE where σ = 1/ρ is electrical conductivity.', microTopicId: 'ec-ohm' },
    { id: 'ec-f24', question: 'A 9V battery with internal resistance 1 Ω drives 2 A. Terminal voltage is:', answer: 'V = 9 − 2×1 = 7 V.', microTopicId: 'ec-emf' },
    { id: 'ec-f25', question: 'Resistivity of copper at 20°C?', answer: '≈ 1.7 × 10⁻⁸ Ω·m (very low — excellent conductor).', microTopicId: 'ec-resistance' },
  ],
  experiments: [
    {
      id: 'ec-e1',
      level: 'easy',
      title: 'Verifying Ohm\'s Law',
      microTopicId: 'ec-ohm',
      materials: ['Resistor (100 Ω)', 'Variable DC supply (0–12 V)', 'Ammeter', 'Voltmeter', 'Connecting wires'],
      steps: [
        'Build circuit: supply → ammeter → resistor → back to supply; voltmeter across resistor.',
        'Set voltage to 1, 2, 3, 4, 5, 6 V.',
        'Record current at each voltage.',
        'Plot V vs I — expect straight line.',
        'Calculate slope = R; compare with labelled value.',
      ],
      safetyNote: 'Do not exceed current rating of resistor.',
      expected: 'Linear V-I graph; slope = resistance within 5%.',
    },
    {
      id: 'ec-e2',
      level: 'easy',
      title: 'Non-ohmic Device — Filament Bulb',
      microTopicId: 'ec-semiconductors',
      materials: ['Low-voltage filament bulb (6V)', 'Variable supply', 'Ammeter', 'Voltmeter'],
      steps: [
        'Build same circuit as Ohm\'s Law experiment.',
        'Measure V and I from 0 to 6 V in 0.5 V steps.',
        'Plot V-I graph.',
        'Note the curve is non-linear (steeper at high V).',
        'Explain using temperature dependence of tungsten resistance.',
      ],
      safetyNote: 'Bulb gets hot — do not touch.',
      expected: 'Curved V-I graph — R increases as filament heats up, showing non-ohmic behaviour.',
    },
    {
      id: 'ec-e3',
      level: 'medium',
      title: 'Resistivity of a Wire',
      microTopicId: 'ec-resistance',
      materials: ['Nichrome or constantan wire (various gauges)', 'Ruler or metre stick', 'Ammeter', 'Voltmeter', 'DC supply', 'Micrometer'],
      steps: [
        'Measure diameter d of wire with micrometer; compute A = π(d/2)².',
        'Connect wire to circuit; vary length L from 0.1 to 1.0 m using crocodile clips.',
        'Measure V and I at each length; compute R = V/I.',
        'Plot R vs L — expect straight line.',
        'Slope = ρ/A; calculate ρ and compare with accepted value.',
      ],
      safetyNote: 'Wire may get warm at high currents; keep current below 1 A.',
      expected: 'Linear R-L graph; ρ for nichrome ≈ 1.1×10⁻⁶ Ω·m, within 10%.',
    },
    {
      id: 'ec-e4',
      level: 'medium',
      title: 'Internal Resistance of a Battery',
      microTopicId: 'ec-emf',
      materials: ['Battery (1.5 V AA)', 'Variable resistor (rheostat)', 'Ammeter', 'Voltmeter', 'Connecting wires'],
      steps: [
        'Connect battery to rheostat with ammeter in series, voltmeter across battery terminals.',
        'Vary resistance from large to small; record V and I at each step.',
        'Plot V vs I — expect straight line.',
        'Y-intercept = EMF ε; gradient = −internal resistance r.',
      ],
      safetyNote: 'Do not short-circuit the battery.',
      expected: 'Linear V-I graph; ε ≈ 1.5 V; r ≈ 0.5–1 Ω for used AA cell.',
    },
    {
      id: 'ec-e5',
      level: 'hard',
      title: 'Thermistor Temperature Calibration',
      microTopicId: 'ec-temp',
      materials: ['NTC thermistor', 'Water bath with heater', 'Thermometer', 'Ohmmeter', 'Ice'],
      steps: [
        'Measure thermistor resistance at 0°C (ice water).',
        'Heat water bath in steps to 10, 20, 30, 40, 50, 60°C.',
        'Record resistance at each temperature.',
        'Plot R vs T — should be exponential decay.',
        'Use calibration curve to create a simple thermometer.',
      ],
      safetyNote: 'Take care with hot water.',
      expected: 'Exponential decrease of R with T; can convert R readings to temperature.',
    },
    {
      id: 'ec-e6',
      level: 'hard',
      title: 'Power Dissipation and Energy',
      microTopicId: 'ec-power',
      materials: ['Resistor (10 Ω, 5W)', 'DC supply', 'Ammeter', 'Voltmeter', 'Calorimeter with water', 'Thermometer'],
      steps: [
        'Immerse resistor in known mass of water in calorimeter.',
        'Pass measured current I through resistor for time t.',
        'Record ΔT of water.',
        'Calculate heat energy Q = mcΔT.',
        'Calculate electrical energy W = I²Rt.',
        'Compute efficiency η = Q/W.',
      ],
      safetyNote: 'Ensure resistor is rated for power dissipated; P = I²R.',
      expected: 'η ≈ 85–95%; small loss to surroundings. Confirms P = I²R.',
    },
  ],
  realWorld: [
    'Household wiring uses thick copper wires to minimise resistance and prevent dangerous overheating.',
    'Fuses and circuit breakers protect circuits by breaking when current exceeds safe limits.',
    'Electric kettles and toasters use high-resistance elements to convert electrical energy to heat efficiently.',
    'Thermistors in phones measure battery temperature to prevent dangerous overcharging.',
    'MRI machines use superconducting coils (zero resistance) to maintain enormous currents for strong magnetic fields.',
    'LED streetlights are energy-efficient because LEDs convert electricity to light with minimal resistive heating.',
  ],
  relatedTopicIds: ['dc-circuits', 'electrostatics', 'capacitors', 'em-induction'],
  curiosityBranches: [
    { label: 'Why doesn\'t current travel at speed of light?', topicId: 'electric-current' },
    { label: 'How does a superconductor work?', topicId: 'electric-current' },
    { label: 'Why do power lines use high voltage?', topicId: 'electric-current' },
    { label: 'What is quantum resistance?', topicId: 'electric-current' },
  ],
  quiz: [
    { id: 'ec-q1', question: 'A 6 Ω resistor has 12 V across it. Current through it is:', options: ['72 A', '0.5 A', '2 A', '18 A'], answer: 2, explanation: 'I = V/R = 12/6 = 2 A.', microTopicId: 'ec-ohm' },
    { id: 'ec-q2', question: 'Power dissipated in a 4 Ω resistor carrying 3 A:', options: ['12 W', '36 W', '9 W', '6 W'], answer: 1, explanation: 'P = I²R = 9 × 4 = 36 W.', microTopicId: 'ec-power' },
    { id: 'ec-q3', question: 'Doubling the length of a wire:', options: ['Halves resistance', 'Doubles resistance', 'Quadruples resistance', 'Has no effect'], answer: 1, explanation: 'R = ρL/A; R ∝ L, so doubling L doubles R.', microTopicId: 'ec-resistance' },
    { id: 'ec-q4', question: 'A battery has EMF 6 V, internal resistance 0.5 Ω, and drives 4 A. Terminal voltage is:', options: ['8 V', '4 V', '6 V', '2 V'], answer: 1, explanation: 'V = ε − Ir = 6 − 4×0.5 = 6 − 2 = 4 V.', microTopicId: 'ec-emf' },
    { id: 'ec-q5', question: 'Which has the lowest resistivity at room temperature?', options: ['Iron', 'Silicon', 'Rubber', 'Silver'], answer: 3, explanation: 'Silver has the lowest resistivity (~1.59×10⁻⁸ Ω·m) of all metals.', microTopicId: 'ec-resistance' },
    { id: 'ec-q6', question: 'NTC thermistor resistance when heated:', options: ['Increases', 'Decreases', 'Stays constant', 'Becomes zero'], answer: 1, explanation: 'NTC = Negative Temperature Coefficient; resistance decreases as temperature increases.', microTopicId: 'ec-semiconductors' },
    { id: 'ec-q7', question: 'Drift velocity of electrons is typically:', options: ['Speed of light', '1000 m/s', '~0.1 mm/s', '10 m/s'], answer: 2, explanation: 'Drift velocity in copper ≈ 0.1 mm/s — very slow, but the electric field propagates nearly instantly.', microTopicId: 'ec-drift' },
    { id: 'ec-q8', question: 'Energy used by a 2 kW heater in 30 minutes is:', options: ['60 kJ', '3600 kJ', '3.6 kJ', '60 J'], answer: 1, explanation: 'E = Pt = 2000 × 1800 = 3,600,000 J = 3600 kJ.', microTopicId: 'ec-power' },
  ],
};

// ─── DC Circuits ──────────────────────────────────────────────────────────────
const dcCircuitsTopic: FlagshipTopic = {
  id: 'dc-circuits',
  title: 'DC Circuits',
  icon: '🔦',
  tagline: 'Kirchhoff\'s laws, circuit analysis, and the network of everyday electronics',
  microTopics: [
    { id: 'dc-series', title: 'Series Circuits' },
    { id: 'dc-parallel', title: 'Parallel Circuits' },
    { id: 'dc-kirchhoff', title: 'Kirchhoff\'s Laws' },
    { id: 'dc-wheatstone', title: 'Wheatstone Bridge' },
    { id: 'dc-potentiometer', title: 'Potentiometer' },
    { id: 'dc-meter', title: 'Ammeters & Voltmeters' },
    { id: 'dc-norton', title: 'Thévenin & Norton Theorems' },
    { id: 'dc-power-transfer', title: 'Maximum Power Transfer' },
  ],
  explanations: {
    explorer: 'A circuit is a path for electrons to flow. In a series circuit, there\'s only one path — like one-lane road. In a parallel circuit, there are multiple paths — like a motorway. If one bulb in series breaks, all go out. In parallel, others stay on.',
    investigator: 'Series: I same; V_total = ΣVᵢ; R_total = ΣRᵢ. Parallel: V same; I_total = ΣIᵢ; 1/R_total = Σ1/Rᵢ. Kirchhoff\'s laws: KCL — sum of currents at a junction = 0; KVL — sum of voltages around a loop = 0. Used for complex multi-loop circuits.',
    scholar: 'Nodal analysis applies KCL; mesh analysis applies KVL. Thévenin theorem: any linear circuit = one V_th source with R_th in series. Norton: constant current source I_N with R_N parallel. Wheatstone bridge balanced condition: R₁/R₂ = R₃/R₄ (zero galvanometer deflection). Maximum power transfer when R_load = R_Thévenin.',
    researcher: 'Linear circuit analysis using matrix methods (nodal admittance matrix Y·V = I). Signal-flow graphs encode transfer functions. Non-linear circuit simulation (SPICE). Mutual inductance in transformer circuits. Transient analysis with Laplace transforms: H(s) = Y(s)/X(s). Two-port network parameters (Z, Y, h, ABCD matrices) for cascaded circuit analysis.',
  },
  flashcards: [
    { id: 'dc-f1', question: 'In a series circuit, what is the same for all components?', answer: 'Current — the same current passes through every element.', microTopicId: 'dc-series' },
    { id: 'dc-f2', question: 'In a parallel circuit, what is the same for all components?', answer: 'Voltage — each branch has the same potential difference.', microTopicId: 'dc-parallel' },
    { id: 'dc-f3', question: 'Total resistance of resistors in series?', answer: 'R_total = R₁ + R₂ + R₃ + …', microTopicId: 'dc-series' },
    { id: 'dc-f4', question: 'Total resistance of resistors in parallel?', answer: '1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + …', microTopicId: 'dc-parallel' },
    { id: 'dc-f5', question: 'State Kirchhoff\'s Current Law (KCL).', answer: 'The algebraic sum of currents at any junction is zero — current in = current out.', microTopicId: 'dc-kirchhoff' },
    { id: 'dc-f6', question: 'State Kirchhoff\'s Voltage Law (KVL).', answer: 'The sum of all voltage rises and drops around any closed loop is zero.', microTopicId: 'dc-kirchhoff' },
    { id: 'dc-f7', question: 'Two resistors 6 Ω and 3 Ω in parallel: equivalent resistance?', answer: '1/R = 1/6 + 1/3 = 3/6; R = 2 Ω.', microTopicId: 'dc-parallel' },
    { id: 'dc-f8', question: 'What is a Wheatstone bridge used for?', answer: 'Precisely measuring an unknown resistance by balancing the bridge (null detection).', microTopicId: 'dc-wheatstone' },
    { id: 'dc-f9', question: 'Balanced Wheatstone bridge condition?', answer: 'R₁/R₂ = R₃/R₄ — zero current through galvanometer.', microTopicId: 'dc-wheatstone' },
    { id: 'dc-f10', question: 'What is a potentiometer?', answer: 'A variable voltage divider used to measure EMF or compare voltages with zero current drawn.', microTopicId: 'dc-potentiometer' },
    { id: 'dc-f11', question: 'What does an ammeter measure and how should it be connected?', answer: 'Measures current; connected in series with very low resistance.', microTopicId: 'dc-meter' },
    { id: 'dc-f12', question: 'What does a voltmeter measure and how should it be connected?', answer: 'Measures potential difference; connected in parallel with very high resistance.', microTopicId: 'dc-meter' },
    { id: 'dc-f13', question: 'State Thévenin\'s theorem.', answer: 'Any linear circuit can be replaced by an equivalent circuit consisting of a single voltage source V_th in series with a single resistance R_th.', microTopicId: 'dc-norton' },
    { id: 'dc-f14', question: 'State Norton\'s theorem.', answer: 'Any linear circuit can be replaced by a constant current source I_N in parallel with R_N.', microTopicId: 'dc-norton' },
    { id: 'dc-f15', question: 'Relationship between Thévenin and Norton equivalents?', answer: 'V_th = I_N × R_N; they are equivalent (same R_N = R_th).', microTopicId: 'dc-norton' },
    { id: 'dc-f16', question: 'Maximum power transfer theorem?', answer: 'Maximum power is delivered to the load when R_load = R_th (Thévenin resistance).', microTopicId: 'dc-power-transfer' },
    { id: 'dc-f17', question: 'Voltage divider formula for two series resistors R₁ and R₂?', answer: 'V_out = V_in × R₂/(R₁ + R₂)', microTopicId: 'dc-series' },
    { id: 'dc-f18', question: 'In a parallel circuit, which branch carries more current?', answer: 'The branch with lower resistance (I = V/R — same V, smaller R → larger I).', microTopicId: 'dc-parallel' },
    { id: 'dc-f19', question: 'Kirchhoff\'s laws are based on which conservation principles?', answer: 'KCL → conservation of charge; KVL → conservation of energy.', microTopicId: 'dc-kirchhoff' },
    { id: 'dc-f20', question: 'Three 9 Ω resistors in parallel: equivalent resistance?', answer: 'R = 9/3 = 3 Ω (for n equal resistors in parallel: R_eq = R/n).', microTopicId: 'dc-parallel' },
    { id: 'dc-f21', question: 'Why must an ammeter have very low resistance?', answer: 'To avoid significantly changing the current it is measuring — high R would reduce circuit current.', microTopicId: 'dc-meter' },
    { id: 'dc-f22', question: 'Why must a voltmeter have very high resistance?', answer: 'To draw negligible current so it does not affect the voltage being measured.', microTopicId: 'dc-meter' },
    { id: 'dc-f23', question: 'What is nodal analysis?', answer: 'Circuit analysis method applying KCL at each node to write equations for unknown node voltages.', microTopicId: 'dc-kirchhoff' },
    { id: 'dc-f24', question: 'What is mesh analysis?', answer: 'Circuit analysis applying KVL around each independent loop (mesh) to find mesh currents.', microTopicId: 'dc-kirchhoff' },
    { id: 'dc-f25', question: 'A potentiometer advantage over a voltmeter when measuring EMF?', answer: 'At the balance point, no current is drawn from the source — so terminal voltage equals true EMF.', microTopicId: 'dc-potentiometer' },
  ],
  experiments: [
    {
      id: 'dc-e1',
      level: 'easy',
      title: 'Series vs Parallel Bulbs',
      microTopicId: 'dc-series',
      materials: ['3 identical bulbs with holders', 'Battery (6V)', 'Connecting wires', 'Switch'],
      steps: [
        'Connect three bulbs in series with battery.',
        'Observe brightness; remove one bulb — all go out.',
        'Reconnect in parallel.',
        'Observe brightness (brighter); remove one — others stay on.',
        'Measure current from battery in each configuration.',
      ],
      safetyNote: 'Use low-voltage batteries only.',
      expected: 'Series: dim, fail together. Parallel: bright, independent. Confirms current/voltage sharing.',
    },
    {
      id: 'dc-e2',
      level: 'easy',
      title: 'Kirchhoff\'s Laws Verification',
      microTopicId: 'dc-kirchhoff',
      materials: ['3 resistors (100, 200, 300 Ω)', 'Battery', 'Ammeter (×3)', 'Voltmeter', 'Breadboard'],
      steps: [
        'Build a two-loop circuit with given resistors.',
        'Measure current at each branch (KCL: sum at node = 0).',
        'Measure voltage around each loop (KVL: sum = 0).',
        'Write KCL and KVL equations and verify with measurements.',
      ],
      safetyNote: 'Double-check circuit before powering.',
      expected: 'Measured currents and voltages satisfy KCL and KVL within 5%.',
    },
    {
      id: 'dc-e3',
      level: 'medium',
      title: 'Wheatstone Bridge — Unknown Resistance',
      microTopicId: 'dc-wheatstone',
      materials: ['Galvanometer', '3 known resistors', '1 unknown resistor', 'Battery', 'Connecting wires'],
      steps: [
        'Assemble Wheatstone bridge with three known and one unknown R.',
        'Adjust one known resistor until galvanometer reads zero.',
        'Apply balance condition: R_unknown = R₁ × R₃/R₂.',
        'Compare with ohmmeter reading.',
      ],
      safetyNote: 'Do not short-circuit galvanometer.',
      expected: 'Unknown resistance found within 2% of true value when bridge is balanced.',
    },
    {
      id: 'dc-e4',
      level: 'medium',
      title: 'Voltage Divider',
      microTopicId: 'dc-series',
      materials: ['Two resistors (1 kΩ and 2 kΩ)', 'Battery (9V)', 'Voltmeter'],
      steps: [
        'Connect 1 kΩ and 2 kΩ in series across 9V battery.',
        'Measure voltage across each resistor.',
        'Verify V₁ = 9 × 1/(1+2) = 3 V; V₂ = 9 × 2/3 = 6 V.',
        'Replace 2 kΩ with a thermistor — observe voltage change with temperature.',
      ],
      safetyNote: 'No specific hazard.',
      expected: 'Voltages in 1:2 ratio confirming voltage divider formula.',
    },
    {
      id: 'dc-e5',
      level: 'hard',
      title: 'Potentiometer — Comparing EMFs',
      microTopicId: 'dc-potentiometer',
      materials: ['Metre wire potentiometer', 'Standard cell (known EMF)', 'Unknown cell', 'Galvanometer', 'Jockey'],
      steps: [
        'Connect potentiometer wire across driver cell.',
        'Find balance length l₁ for standard cell (known ε₁).',
        'Find balance length l₂ for unknown cell.',
        'Calculate ε₂ = ε₁ × l₂/l₁.',
        'Verify with voltmeter.',
      ],
      safetyNote: 'Handle standard cells carefully; do not short circuit.',
      expected: 'EMF ratio = length ratio within 1%; potentiometer more accurate than voltmeter.',
    },
    {
      id: 'dc-e6',
      level: 'hard',
      title: 'Thévenin Equivalent Circuit',
      microTopicId: 'dc-norton',
      materials: ['Complex resistor network (3–4 resistors)', 'Variable load resistor', 'Voltmeter', 'Ammeter'],
      steps: [
        'Build a two-terminal resistor network.',
        'Measure open-circuit voltage V_oc = V_th.',
        'Measure short-circuit current I_sc.',
        'Calculate R_th = V_th/I_sc.',
        'Replace network with V_th + R_th in series.',
        'Verify same V-I behaviour for various loads.',
      ],
      safetyNote: 'Limit short-circuit current with series resistor.',
      expected: 'Thévenin equivalent reproduces full circuit behaviour within 3%.',
    },
  ],
  realWorld: [
    'House wiring is parallel so appliances operate at 230 V independently — one failure doesn\'t cut the rest.',
    'Car electrical systems use 12 V parallel circuits — each component operates independently.',
    'Wheatstone bridges are used in strain gauges to measure mechanical deformation with great precision.',
    'Potentiometers are used in audio volume controls and precision voltage references.',
    'Circuit breakers use KCL/KVL principles to detect fault currents and protect wiring.',
    'Smartphone chips contain billions of transistors forming complex DC circuits on a few mm² of silicon.',
  ],
  relatedTopicIds: ['electric-current', 'capacitors', 'em-induction', 'ac-circuits'],
  curiosityBranches: [
    { label: 'How do logic gates build a computer from circuits?', topicId: 'dc-circuits' },
    { label: 'Why are power grids AC not DC?', topicId: 'ac-circuits' },
    { label: 'How does a transistor switch work?', topicId: 'dc-circuits' },
    { label: 'What is SPICE circuit simulation?', topicId: 'dc-circuits' },
  ],
  quiz: [
    { id: 'dc-q1', question: 'Three 6 Ω resistors in series: total resistance is:', options: ['2 Ω', '6 Ω', '18 Ω', '3 Ω'], answer: 2, explanation: 'R_total = 6 + 6 + 6 = 18 Ω.', microTopicId: 'dc-series' },
    { id: 'dc-q2', question: 'Three 6 Ω resistors in parallel: total resistance is:', options: ['18 Ω', '6 Ω', '3 Ω', '2 Ω'], answer: 3, explanation: '1/R = 3/6 = 1/2; R = 2 Ω.', microTopicId: 'dc-parallel' },
    { id: 'dc-q3', question: 'KCL states that at any node:', options: ['Sum of voltages = 0', 'Sum of currents = 0', 'Sum of resistances = 0', 'Power in = power out'], answer: 1, explanation: 'Kirchhoff\'s Current Law: algebraic sum of currents entering/leaving a node = 0.', microTopicId: 'dc-kirchhoff' },
    { id: 'dc-q4', question: 'Voltage divider: V_in = 12 V, R₁ = 3 Ω, R₂ = 1 Ω. Voltage across R₂?', options: ['3 V', '6 V', '9 V', '1 V'], answer: 0, explanation: 'V₂ = 12 × 1/(3+1) = 12/4 = 3 V.', microTopicId: 'dc-series' },
    { id: 'dc-q5', question: 'A voltmeter should have:', options: ['Zero resistance', 'Low resistance', 'Very high resistance', 'Resistance equal to circuit'], answer: 2, explanation: 'High resistance ensures negligible current drawn — doesn\'t disturb the circuit.', microTopicId: 'dc-meter' },
    { id: 'dc-q6', question: 'Wheatstone bridge is balanced when:', options: ['All resistances are equal', 'R₁/R₂ = R₃/R₄', 'Galvanometer reads max', 'Supply voltage is zero'], answer: 1, explanation: 'Balance condition: R₁R₄ = R₂R₃, i.e. R₁/R₂ = R₃/R₄.', microTopicId: 'dc-wheatstone' },
    { id: 'dc-q7', question: 'Maximum power is delivered to a load when R_load equals:', options: ['Zero', 'Infinity', 'R_Thévenin', '2 × R_Thévenin'], answer: 2, explanation: 'Maximum power transfer theorem: P_max when R_load = R_th.', microTopicId: 'dc-power-transfer' },
    { id: 'dc-q8', question: 'An ammeter is connected:', options: ['In parallel with high R', 'In series with low R', 'In parallel with low R', 'In series with high R'], answer: 1, explanation: 'Ammeter goes in series (to measure current through component) and must have low R to avoid reducing current.', microTopicId: 'dc-meter' },
  ],
};

// ─── Magnetism ────────────────────────────────────────────────────────────────
const magnetismTopic: FlagshipTopic = {
  id: 'magnetism',
  title: 'Magnetism',
  icon: '🧲',
  tagline: 'Invisible fields and forces — the partner force to electricity',
  microTopics: [
    { id: 'mag-fields', title: 'Magnetic Fields & Field Lines' },
    { id: 'mag-force-charge', title: 'Force on Moving Charge' },
    { id: 'mag-force-wire', title: 'Force on Current-Carrying Wire' },
    { id: 'mag-biot-savart', title: 'Biot-Savart Law' },
    { id: 'mag-ampere', title: 'Ampere\'s Law' },
    { id: 'mag-materials', title: 'Magnetic Materials' },
    { id: 'mag-earth', title: 'Earth\'s Magnetic Field' },
    { id: 'mag-motors', title: 'DC Motors' },
  ],
  explanations: {
    explorer: 'Magnets have a north and south pole. Like poles repel, unlike poles attract — just like electric charges! A wire carrying electric current also creates a magnetic field around it. This connection between electricity and magnetism powers every electric motor on Earth.',
    investigator: 'Magnetic flux density B (tesla, T). Force on a moving charge: F = qv × B (Lorentz force). Force on a wire: F = BIL sinθ. Biot-Savart law: dB = (μ₀/4π) I dl × r̂/r². Field around a long wire: B = μ₀I/(2πr). Inside a solenoid: B = μ₀nI.',
    scholar: 'Ampere\'s law: ∮B·dl = μ₀I_enc. Magnetic dipole moment: m = IA (A·m²). Torque on a current loop: τ = m × B. Magnetic materials: diamagnetic (χ < 0), paramagnetic (χ > 0), ferromagnetic (permanent magnets, hysteresis). Cyclotron frequency: ω_c = qB/m.',
    researcher: 'Magnetic field from Maxwell\'s equations: ∇×B = μ₀J + μ₀ε₀∂E/∂t. Gauge invariance: B = ∇×A. Quantum mechanics: magnetic moment m = −gμ_B S (spin). Landau levels quantise electron orbits in B fields. Quantum Hall effect: σ_xy = ne²/h. Magnons are quantised spin-wave excitations in ferromagnets.',
  },
  flashcards: [
    { id: 'mag-f1', question: 'What is magnetic flux density B?', answer: 'Force per unit current per unit length on a wire; unit: tesla (T = kg/(A·s²)).', microTopicId: 'mag-fields' },
    { id: 'mag-f2', question: 'What is the Lorentz force on a moving charge?', answer: 'F = q(v × B); magnitude F = qvB sinθ.', microTopicId: 'mag-force-charge' },
    { id: 'mag-f3', question: 'Force on a current-carrying wire in a magnetic field?', answer: 'F = BIL sinθ where θ is angle between wire and field.', microTopicId: 'mag-force-wire' },
    { id: 'mag-f4', question: 'Direction of force on a wire — which rule?', answer: 'Fleming\'s Left-Hand Rule (FBI rule): First finger = Field, seCond = Current, thuMb = Motion/Force.', microTopicId: 'mag-force-wire' },
    { id: 'mag-f5', question: 'Magnetic field around an infinite straight wire?', answer: 'B = μ₀I/(2πr); circular field lines concentric with wire.', microTopicId: 'mag-biot-savart' },
    { id: 'mag-f6', question: 'Magnetic field inside a solenoid?', answer: 'B = μ₀nI where n = turns per unit length.', microTopicId: 'mag-ampere' },
    { id: 'mag-f7', question: 'Value of the permeability of free space μ₀?', answer: 'μ₀ = 4π × 10⁻⁷ T·m/A ≈ 1.26 × 10⁻⁶ T·m/A.', microTopicId: 'mag-biot-savart' },
    { id: 'mag-f8', question: 'State Ampere\'s law.', answer: '∮B·dl = μ₀I_enc — line integral of B around a closed path equals μ₀ times enclosed current.', microTopicId: 'mag-ampere' },
    { id: 'mag-f9', question: 'What is a ferromagnetic material?', answer: 'Material with strong permanent magnetism due to aligned magnetic domains (iron, nickel, cobalt).', microTopicId: 'mag-materials' },
    { id: 'mag-f10', question: 'What is diamagnetism?', answer: 'Weak repulsion from magnetic fields; all materials show this but usually dominated by other effects.', microTopicId: 'mag-materials' },
    { id: 'mag-f11', question: 'What is paramagnetism?', answer: 'Weak attraction to magnetic fields; unpaired electron spins partially align with B field.', microTopicId: 'mag-materials' },
    { id: 'mag-f12', question: 'What is magnetic hysteresis?', answer: 'In ferromagnets, B lags behind H during magnetisation/demagnetisation — energy is lost per cycle.', microTopicId: 'mag-materials' },
    { id: 'mag-f13', question: 'Cyclotron radius for a charged particle in a magnetic field?', answer: 'r = mv/(qB) — larger for faster particles or lighter particles.', microTopicId: 'mag-force-charge' },
    { id: 'mag-f14', question: 'Why does a magnetic force do no work on a moving charge?', answer: 'F = qv × B is always perpendicular to v — force perpendicular to displacement does zero work.', microTopicId: 'mag-force-charge' },
    { id: 'mag-f15', question: 'What is a magnetic dipole moment?', answer: 'm = IA (current × area); points along normal to loop (right-hand rule).', microTopicId: 'mag-motors' },
    { id: 'mag-f16', question: 'Torque on a current loop in a magnetic field?', answer: 'τ = BANI sinθ = mB sinθ where N = turns, A = area.', microTopicId: 'mag-motors' },
    { id: 'mag-f17', question: 'How does a DC motor work?', answer: 'Current in a coil creates a magnetic moment; field exerts torque; commutator reverses current to keep rotating.', microTopicId: 'mag-motors' },
    { id: 'mag-f18', question: 'Earth\'s magnetic field strength at surface?', answer: 'About 25–65 μT (0.25–0.65 Gauss).', microTopicId: 'mag-earth' },
    { id: 'mag-f19', question: 'Geographic north vs magnetic north?', answer: 'Magnetic north (compass needle) is near geographic south pole and is offset ~11° from geographic north.', microTopicId: 'mag-earth' },
    { id: 'mag-f20', question: 'What is magnetic declination?', answer: 'Angle between geographic north and magnetic north at a given location.', microTopicId: 'mag-earth' },
    { id: 'mag-f21', question: 'What is the Hall effect?', answer: 'A magnetic force deflects charge carriers sideways in a conductor, creating a transverse voltage (Hall voltage).', microTopicId: 'mag-force-charge' },
    { id: 'mag-f22', question: 'Biot-Savart law gives B due to:?', answer: 'An infinitesimal current element: dB = (μ₀/4π)(I dl × r̂)/r²', microTopicId: 'mag-biot-savart' },
    { id: 'mag-f23', question: 'Two parallel wires carrying currents in same direction:', options: ['Attract each other', 'Repel', 'No force', 'Rotate'], answer: 'Attract each other — their fields reinforce between them.', microTopicId: 'mag-force-wire' },
    { id: 'mag-f24', question: 'What does a split-ring commutator do in a DC motor?', answer: 'Reverses current direction in the coil every half turn, ensuring continuous rotation in the same direction.', microTopicId: 'mag-motors' },
    { id: 'mag-f25', question: 'Magnetic flux Φ through a surface?', answer: 'Φ = B·A = BA cosθ; unit: weber (Wb = T·m²).', microTopicId: 'mag-fields' },
  ],
  experiments: [
    {
      id: 'mag-e1',
      level: 'easy',
      title: 'Mapping Magnetic Field Lines',
      microTopicId: 'mag-fields',
      materials: ['Bar magnet', 'Iron filings', 'White paper', 'OR small plotting compass'],
      steps: [
        'Place bar magnet under white paper.',
        'Sprinkle iron filings gently — tap paper to align filings.',
        'Photograph the resulting field line pattern.',
        'Alternatively, use plotting compass to trace field line paths.',
        'Compare dipole field shape with theory.',
      ],
      safetyNote: 'Keep magnets away from electronic devices.',
      expected: 'Classic dipole field pattern — lines from N to S, concentrating near poles.',
    },
    {
      id: 'mag-e2',
      level: 'easy',
      title: 'Force on a Current-Carrying Wire',
      microTopicId: 'mag-force-wire',
      materials: ['Rigid wire (20 cm)', 'Strong U-shaped magnet', 'Variable DC supply', 'Ammeter'],
      steps: [
        'Place horizontal wire in gap of U-magnet.',
        'Connect to DC supply; increase current from 0 to 2 A.',
        'Observe wire deflection (up or down).',
        'Reverse current — wire deflects opposite direction.',
        'Verify direction with Fleming\'s Left-Hand Rule.',
      ],
      safetyNote: 'Use low currents; wire may heat at high I.',
      expected: 'Wire deflects in direction predicted by F = BIL. Reversing I reverses force.',
    },
    {
      id: 'mag-e3',
      level: 'medium',
      title: 'Magnetic Field of a Solenoid',
      microTopicId: 'mag-ampere',
      materials: ['Coil (100 turns, 10 cm)', 'DC supply', 'Ammeter', 'Hall probe or compass', 'Ruler'],
      steps: [
        'Wind solenoid (100 turns over 10 cm = n = 1000/m).',
        'Pass 1 A through solenoid.',
        'Measure B at centre using Hall probe.',
        'Calculate theoretical B = μ₀nI = 4π×10⁻⁷ × 1000 × 1 = 1.26 mT.',
        'Measure B along axis and plot B vs position.',
      ],
      safetyNote: 'Solenoid may heat; limit current to 2 A max.',
      expected: 'B at centre ≈ 1.26 mT; uniform in middle, drops off at ends.',
    },
    {
      id: 'mag-e4',
      level: 'medium',
      title: 'Building a Simple DC Motor',
      microTopicId: 'mag-motors',
      materials: ['Enamelled copper wire (1 m)', 'Two paper clips', 'Small permanent magnet', 'AA battery', 'Sandpaper'],
      steps: [
        'Wind wire into 10-turn coil, leave straight ends for axle.',
        'Sand one end of axle fully; sand only one side of other end (commutator effect).',
        'Support coil on paper clip axle supports connected to battery.',
        'Position magnet below coil.',
        'Flick coil — observe continuous rotation.',
      ],
      safetyNote: 'Wire ends may be sharp; handle carefully.',
      expected: 'Coil rotates continuously when current flows and asymmetric sanding provides commutator action.',
    },
    {
      id: 'mag-e5',
      level: 'hard',
      title: 'Hall Effect Measurement',
      microTopicId: 'mag-force-charge',
      materials: ['Hall probe sensor', 'Known magnet with calibrated field', 'Ammeter', 'Voltmeter', 'Ruler'],
      steps: [
        'Place Hall probe in calibrated magnetic field B₀.',
        'Pass known current I through probe.',
        'Measure Hall voltage V_H.',
        'Repeat for different currents.',
        'Plot V_H vs I — slope = B/(nqt) where t = thickness.',
        'Calculate charge carrier density n.',
      ],
      safetyNote: 'Handle Hall probe carefully — fragile semiconductor component.',
      expected: 'Linear V_H vs I confirming Hall effect; n calculable within 20%.',
    },
    {
      id: 'mag-e6',
      level: 'hard',
      title: 'Mapping B Along a Solenoid Axis',
      microTopicId: 'mag-biot-savart',
      materials: ['Long solenoid (300 turns, 30 cm)', 'Hall probe + data logger', 'DC supply (2A)', 'Ruler', 'Graph paper'],
      steps: [
        'Set up solenoid connected to stable 2 A supply.',
        'Move Hall probe along central axis at 1 cm intervals.',
        'Record B at each position.',
        'Plot B vs position from centre.',
        'Compare with theory: B = μ₀nI/2 × (cosα₂ − cosα₁) at ends.',
      ],
      safetyNote: 'Keep away from ferromagnetic objects that distort field.',
      expected: 'Uniform field at centre; field reduces to ~50% at the ends — matches theory.',
    },
  ],
  realWorld: [
    'Electric motors in electric vehicles convert electrical energy to mechanical energy via magnetic forces on current-carrying coils.',
    'MRI machines use superconducting solenoids producing 1–7 T fields to align hydrogen nuclei in the body.',
    'Compasses work because Earth\'s liquid iron core generates a weak (50 μT) magnetic field.',
    'Maglev trains use superconducting electromagnets to levitate above the track, eliminating friction.',
    'Hard disk drives store data as patterns of magnetisation in microscopic ferromagnetic domains.',
    'Speakers convert electrical signals to sound using force on a current-carrying coil in a permanent magnet.',
  ],
  relatedTopicIds: ['electrostatics', 'em-induction', 'electric-current', 'ac-circuits'],
  curiosityBranches: [
    { label: 'How does Earth\'s magnetic field protect us from solar wind?', topicId: 'magnetism' },
    { label: 'How do MRI machines use magnetism to see inside your body?', topicId: 'magnetism' },
    { label: 'What is a magnetic monopole?', topicId: 'magnetism' },
    { label: 'How do maglev trains levitate?', topicId: 'magnetism' },
  ],
  quiz: [
    { id: 'mag-q1', question: 'Force on a wire of length 0.5 m carrying 4 A in a field of 0.3 T (perpendicular)?', options: ['0.6 N', '0.3 N', '2.4 N', '6 N'], answer: 0, explanation: 'F = BIL = 0.3 × 4 × 0.5 = 0.6 N.', microTopicId: 'mag-force-wire' },
    { id: 'mag-q2', question: 'Magnetic field inside a solenoid (n = 2000/m, I = 3 A)?', options: ['7.5 mT', '2.4 mT', '6 mT', '1.2 mT'], answer: 0, explanation: 'B = μ₀nI = 4π×10⁻⁷ × 2000 × 3 ≈ 7.5 mT.', microTopicId: 'mag-ampere' },
    { id: 'mag-q3', question: 'A proton moves perpendicular to a 0.2 T field at 10⁶ m/s. The force on it is:', options: ['3.2 × 10⁻¹⁴ N', '1.6 × 10⁻¹⁴ N', '3.2 × 10⁻¹³ N', '1.6 × 10⁻¹³ N'], answer: 0, explanation: 'F = qvB = 1.6×10⁻¹⁹ × 10⁶ × 0.2 = 3.2×10⁻¹⁴ N.', microTopicId: 'mag-force-charge' },
    { id: 'mag-q4', question: 'Which material is ferromagnetic?', options: ['Aluminium', 'Iron', 'Copper', 'Carbon'], answer: 1, explanation: 'Iron (and nickel, cobalt) are ferromagnetic — they can form permanent magnets.', microTopicId: 'mag-materials' },
    { id: 'mag-q5', question: 'Fleming\'s Left-Hand Rule is used to find:', options: ['Direction of induced EMF', 'Direction of force on a wire', 'Direction of magnetic field around a wire', 'Polarity of a battery'], answer: 1, explanation: 'Left hand: First finger = Field, seCond finger = Current, thuMb = thrust (force/motion).', microTopicId: 'mag-force-wire' },
    { id: 'mag-q6', question: 'Magnetic force does no work because:', options: ['It is always zero', 'It is perpendicular to velocity', 'It acts against gravity', 'It is a conservative force'], answer: 1, explanation: 'F = qv × B is perpendicular to v — force perpendicular to displacement → W = F·d = 0.', microTopicId: 'mag-force-charge' },
    { id: 'mag-q7', question: 'Two parallel wires with currents in opposite directions:', options: ['Attract', 'Repel', 'Have no force', 'Oscillate'], answer: 1, explanation: 'Opposite currents — their magnetic fields between the wires add up, pushing wires apart.', microTopicId: 'mag-force-wire' },
    { id: 'mag-q8', question: 'A split-ring commutator in a DC motor:', options: ['Increases current', 'Reverses current every half turn', 'Reduces friction', 'Increases magnetic field'], answer: 1, explanation: 'The commutator reverses current direction in the coil every 180° to maintain continuous rotation.', microTopicId: 'mag-motors' },
  ],
};

// ─── Electromagnetic Induction ────────────────────────────────────────────────
const emInductionTopic: FlagshipTopic = {
  id: 'em-induction',
  title: 'Electromagnetic Induction',
  icon: '⚙️',
  tagline: 'Faraday\'s discovery — changing fields create currents, powering civilisation',
  microTopics: [
    { id: 'emi-faraday', title: 'Faraday\'s Law' },
    { id: 'emi-lenz', title: 'Lenz\'s Law' },
    { id: 'emi-flux', title: 'Magnetic Flux' },
    { id: 'emi-motional', title: 'Motional EMF' },
    { id: 'emi-self', title: 'Self Inductance' },
    { id: 'emi-mutual', title: 'Mutual Inductance & Transformers' },
    { id: 'emi-generators', title: 'AC Generators' },
    { id: 'emi-eddy', title: 'Eddy Currents' },
  ],
  explanations: {
    explorer: 'Michael Faraday discovered that moving a magnet near a wire creates electricity! This is electromagnetic induction — the basis of every generator on Earth. Power stations use giant spinning coils in magnetic fields to generate the electricity that comes from your plug socket.',
    investigator: 'Faraday\'s law: EMF = −dΦ/dt (induced EMF equals rate of change of magnetic flux). Φ = BA cosθ. Lenz\'s law: induced current direction opposes the change causing it (conservation of energy). Motional EMF: ε = BLv. Self-inductance: ε = −L dI/dt. Mutual inductance: ε₂ = −M dI₁/dt.',
    scholar: 'Faraday\'s law in integral form: ∮E·dl = −dΦ_B/dt. For N-turn coil: ε = −N dΦ/dt. Transformer: V₂/V₁ = N₂/N₁; I₁/I₂ = N₂/N₁ (ideal). Self-inductance of solenoid: L = μ₀n²V. Energy stored in inductor: U = ½LI². Eddy current power loss: P ∝ B²f²d² (d = thickness).',
    researcher: 'Full Maxwell\'s equations in differential form: ∇×E = −∂B/∂t (Faraday). Poynting vector S = E × H/μ₀ gives energy flux. Mutual inductance via Neumann formula: M₁₂ = (μ₀/4π)∮∮ dl₁·dl₂/r₁₂. AC transformer: complex impedance transform Z₁ = (N₁/N₂)²Z_load. Electromagnetic coupling in wireless charging via resonant inductive transfer.',
  },
  flashcards: [
    { id: 'emi-f1', question: 'State Faraday\'s law of electromagnetic induction.', answer: 'The induced EMF in a circuit equals the negative rate of change of magnetic flux: ε = −dΦ/dt.', microTopicId: 'emi-faraday' },
    { id: 'emi-f2', question: 'What is magnetic flux?', answer: 'Φ = B·A cosθ where θ is angle between B and the normal to the area; unit: weber (Wb).', microTopicId: 'emi-flux' },
    { id: 'emi-f3', question: 'State Lenz\'s law.', answer: 'The induced current flows in a direction to oppose the change in flux that caused it.', microTopicId: 'emi-lenz' },
    { id: 'emi-f4', question: 'Which conservation law does Lenz\'s law express?', answer: 'Conservation of energy — if induced current aided the change, energy would be created from nothing.', microTopicId: 'emi-lenz' },
    { id: 'emi-f5', question: 'Motional EMF when a conductor of length L moves at speed v in field B?', answer: 'ε = BLv (for v perpendicular to both B and L).', microTopicId: 'emi-motional' },
    { id: 'emi-f6', question: 'Faraday\'s law for an N-turn coil?', answer: 'ε = −N dΦ/dt', microTopicId: 'emi-faraday' },
    { id: 'emi-f7', question: 'What is self-inductance L?', answer: 'Property of a coil where changing current induces an opposing EMF in itself: ε = −L dI/dt; unit: henry (H).', microTopicId: 'emi-self' },
    { id: 'emi-f8', question: 'Self-inductance of a solenoid?', answer: 'L = μ₀n²V = μ₀N²A/l where N = total turns, A = area, l = length.', microTopicId: 'emi-self' },
    { id: 'emi-f9', question: 'Energy stored in an inductor?', answer: 'U = ½LI²', microTopicId: 'emi-self' },
    { id: 'emi-f10', question: 'What is mutual inductance?', answer: 'M: changing current in coil 1 induces EMF in coil 2: ε₂ = −M dI₁/dt; unit: henry (H).', microTopicId: 'emi-mutual' },
    { id: 'emi-f11', question: 'Transformer voltage equation?', answer: 'V₂/V₁ = N₂/N₁ (voltage ratio = turns ratio).', microTopicId: 'emi-mutual' },
    { id: 'emi-f12', question: 'Transformer current equation (ideal)?', answer: 'I₁/I₂ = N₂/N₁ (current ratio is inverse of turns ratio).', microTopicId: 'emi-mutual' },
    { id: 'emi-f13', question: 'Step-up transformer: N₂ > N₁. What happens to voltage?', answer: 'Voltage increases by factor N₂/N₁; current decreases proportionally.', microTopicId: 'emi-mutual' },
    { id: 'emi-f14', question: 'How does an AC generator work?', answer: 'A coil rotates in a magnetic field; changing flux induces alternating EMF: ε = NBA ω sin(ωt).', microTopicId: 'emi-generators' },
    { id: 'emi-f15', question: 'Peak EMF of a generator?', answer: 'ε₀ = NBAω where N = turns, B = field, A = area, ω = angular frequency.', microTopicId: 'emi-generators' },
    { id: 'emi-f16', question: 'What are eddy currents?', answer: 'Circulating induced currents in bulk conductors due to changing magnetic flux — they dissipate energy as heat.', microTopicId: 'emi-eddy' },
    { id: 'emi-f17', question: 'How are eddy currents reduced in transformers?', answer: 'By laminating the iron core (thin insulated sheets) to reduce loop area and thus eddy current magnitude.', microTopicId: 'emi-eddy' },
    { id: 'emi-f18', question: 'How does an induction hob use eddy currents?', answer: 'High-frequency AC creates rapidly changing flux in the pan base, inducing eddy currents that heat the pan directly.', microTopicId: 'emi-eddy' },
    { id: 'emi-f19', question: 'Flux rule for EMF — which three things can change Φ to induce EMF?', answer: 'Changing B magnitude, changing area of circuit, or changing angle θ between B and area normal.', microTopicId: 'emi-flux' },
    { id: 'emi-f20', question: 'What is back-EMF in a motor?', answer: 'When a motor spins, it acts as a generator and produces an EMF opposing the supply — limiting current.', microTopicId: 'emi-generators' },
    { id: 'emi-f21', question: 'Fleming\'s Right-Hand Rule is for:', answer: 'Generators (induced current) — contrast with Left-Hand Rule for motors.', microTopicId: 'emi-generators' },
    { id: 'emi-f22', question: 'Why are power lines transmitted at high voltage?', answer: 'P_loss = I²R; high V means low I for same power (P = IV), greatly reducing resistive losses.', microTopicId: 'emi-mutual' },
    { id: 'emi-f23', question: 'RL circuit time constant?', answer: 'τ = L/R — time to reach 63% of final current when switched on.', microTopicId: 'emi-self' },
    { id: 'emi-f24', question: 'A 200-turn coil in a 0.5 T field with area 0.01 m² rotates at 50 Hz. Peak EMF?', answer: 'ε₀ = NBAω = 200 × 0.5 × 0.01 × 2π×50 ≈ 314 V.', microTopicId: 'emi-generators' },
    { id: 'emi-f25', question: 'Inductive impedance in AC?', answer: 'X_L = ωL = 2πfL; inductive reactance increases with frequency.', microTopicId: 'emi-self' },
  ],
  experiments: [
    {
      id: 'emi-e1',
      level: 'easy',
      title: 'Inducing Current with a Magnet',
      microTopicId: 'emi-faraday',
      materials: ['Strong bar magnet', 'Coil (200 turns)', 'Galvanometer', 'Connecting wires'],
      steps: [
        'Connect coil to galvanometer.',
        'Push magnet into coil — observe galvanometer deflection.',
        'Pull magnet out — deflection reverses (Lenz\'s law).',
        'Hold magnet stationary inside coil — no deflection.',
        'Push faster — larger deflection (higher dΦ/dt).',
      ],
      safetyNote: 'No hazard.',
      expected: 'Deflection proportional to speed; direction reversal on withdrawal confirms Lenz\'s law.',
    },
    {
      id: 'emi-e2',
      level: 'easy',
      title: 'Lenz\'s Law — Falling Magnet',
      microTopicId: 'emi-lenz',
      materials: ['Strong neodymium magnet', 'Long copper tube', 'Identical non-magnet steel cylinder'],
      steps: [
        'Drop the steel cylinder through the tube — it falls quickly.',
        'Drop the magnet through the tube — observe it falls slowly.',
        'Explain: induced eddy currents oppose change in flux, braking the magnet.',
        'Measure fall time for each — magnet takes significantly longer.',
      ],
      safetyNote: 'Keep magnet away from computers and credit cards.',
      expected: 'Magnet falls ~5–10× slower than steel cylinder — dramatic demonstration of Lenz\'s law.',
    },
    {
      id: 'emi-e3',
      level: 'medium',
      title: 'Faraday\'s Law Quantification',
      microTopicId: 'emi-faraday',
      materials: ['Large coil (100 turns, 5 cm radius)', 'Smaller search coil (50 turns)', 'Signal generator', 'Oscilloscope'],
      steps: [
        'Drive primary coil with sinusoidal current at frequency f.',
        'Place search coil at centre.',
        'Measure induced EMF amplitude on oscilloscope.',
        'Vary frequency; plot ε vs f.',
        'Verify ε ∝ f (since ε = NΦω and Φ = BA for constant B).',
      ],
      safetyNote: 'Keep voltage within safe range.',
      expected: 'Linear ε vs f confirming Faraday\'s law; phase 90° between B and ε.',
    },
    {
      id: 'emi-e4',
      level: 'medium',
      title: 'Building a Simple Transformer',
      microTopicId: 'emi-mutual',
      materials: ['Iron C-core', 'Two coils (primary 100t, secondary 200t)', 'AC supply (2–6V)', 'Voltmeter'],
      steps: [
        'Mount primary (100t) and secondary (200t) on same iron core.',
        'Apply 2V AC to primary; measure secondary voltage.',
        'Verify V₂/V₁ = N₂/N₁ = 200/100 = 2 (step-up).',
        'Switch coils to make step-down; verify.',
        'Measure efficiency: P_in = V₁I₁, P_out = V₂I₂.',
      ],
      safetyNote: 'Use low-voltage AC only. Never connect to mains.',
      expected: 'Voltage ratio matches turns ratio within 5%; efficiency ~90%.',
    },
    {
      id: 'emi-e5',
      level: 'hard',
      title: 'AC Generator from Scratch',
      microTopicId: 'emi-generators',
      materials: ['Rectangular coil (200 turns, 5×5 cm)', 'U-shaped permanent magnet', 'Slip rings + brushes', 'Oscilloscope'],
      steps: [
        'Mount coil on axle between magnet poles.',
        'Connect via slip rings to oscilloscope.',
        'Spin coil by hand or motor at measured ω.',
        'Observe sinusoidal output on oscilloscope.',
        'Measure peak EMF; compare with ε₀ = NBAω.',
      ],
      safetyNote: 'Secure all rotating parts.',
      expected: 'Sinusoidal EMF with amplitude matching NBAω within 15%.',
    },
    {
      id: 'emi-e6',
      level: 'hard',
      title: 'Eddy Current Braking',
      microTopicId: 'emi-eddy',
      materials: ['Aluminium pendulum disc', 'Two strong magnets (adjustable gap)', 'Timer', 'Solid vs slotted disc'],
      steps: [
        'Swing solid aluminium disc through magnet gap — observe damping.',
        'Compare with slotted disc (interrupted eddy current paths).',
        'Measure oscillation decay time for both.',
        'Vary magnetic field gap — more field → stronger braking.',
        'Calculate energy lost per swing from oscillation amplitude decrease.',
      ],
      safetyNote: 'Strong magnets can trap fingers — keep clear of gap.',
      expected: 'Solid disc stops rapidly; slotted disc oscillates longer — confirms eddy current braking.',
    },
  ],
  realWorld: [
    'Power station generators use electromagnetic induction — rotating coils in magnetic fields produce national grid electricity.',
    'Transformers step voltage up for long-distance transmission (reduces I²R losses) and back down for homes.',
    'Induction hobs heat cookware directly through eddy currents — energy efficient and safer than gas.',
    'Wireless phone chargers use mutual induction to transfer energy without physical contact.',
    'Metal detectors use induced EMF changes to detect buried metal objects.',
    'Regenerative braking in electric vehicles uses motors as generators, converting kinetic energy back to electricity.',
  ],
  relatedTopicIds: ['magnetism', 'ac-circuits', 'electric-current', 'dc-circuits'],
  curiosityBranches: [
    { label: 'How do wireless chargers transfer energy without wires?', topicId: 'em-induction' },
    { label: 'How does the national grid step voltage up and down?', topicId: 'em-induction' },
    { label: 'How do metal detectors work?', topicId: 'em-induction' },
    { label: 'What is Lenz\'s law in a jumping ring demo?', topicId: 'em-induction' },
  ],
  quiz: [
    { id: 'emi-q1', question: 'Faraday\'s law: induced EMF equals:', options: ['B × A', 'Rate of change of flux', 'Current × resistance', 'Charge / time'], answer: 1, explanation: 'ε = −dΦ/dt — induced EMF equals the negative rate of change of magnetic flux.', microTopicId: 'emi-faraday' },
    { id: 'emi-q2', question: 'A conductor of length 0.2 m moves at 5 m/s perpendicular to a 0.4 T field. EMF induced:', options: ['0.4 V', '0.4 V', '1 V', '0.04 V'], answer: 0, explanation: 'ε = BLv = 0.4 × 0.2 × 5 = 0.4 V.', microTopicId: 'emi-motional' },
    { id: 'emi-q3', question: 'Lenz\'s law is an expression of:', options: ['Coulomb\'s law', 'Conservation of charge', 'Conservation of energy', 'Newton\'s 3rd law'], answer: 2, explanation: 'Lenz\'s law: induced EMF opposes change — if it aided change, energy would be created from nothing.', microTopicId: 'emi-lenz' },
    { id: 'emi-q4', question: 'A transformer has N₁ = 100, N₂ = 500, V₁ = 12V. Output voltage V₂:', options: ['2.4 V', '60 V', '120 V', '50 V'], answer: 1, explanation: 'V₂ = V₁ × N₂/N₁ = 12 × 5 = 60 V.', microTopicId: 'emi-mutual' },
    { id: 'emi-q5', question: 'To reduce eddy currents in transformer cores:', options: ['Use thick solid core', 'Use laminated core', 'Use non-magnetic core', 'Use hollow core'], answer: 1, explanation: 'Laminations interrupt large eddy current loops, reducing P_eddy ∝ (loop area)² × f².', microTopicId: 'emi-eddy' },
    { id: 'emi-q6', question: 'Energy stored in a 0.5 H inductor carrying 4 A:', options: ['1 J', '2 J', '4 J', '8 J'], answer: 2, explanation: 'U = ½LI² = ½ × 0.5 × 16 = 4 J.', microTopicId: 'emi-self' },
    { id: 'emi-q7', question: 'Peak EMF of a 100-turn coil (area 0.02 m², B = 0.1 T) rotating at ω = 100 rad/s:', options: ['20 V', '200 V', '0.2 V', '2 V'], answer: 0, explanation: 'ε₀ = NBAω = 100 × 0.1 × 0.02 × 100 = 20 V.', microTopicId: 'emi-generators' },
    { id: 'emi-q8', question: 'Why are power lines transmitted at high voltage?', options: ['To increase current', 'To reduce I²R losses', 'To increase power', 'To magnetise cables'], answer: 1, explanation: 'P = IV, so for same power, higher V means lower I. Heat loss = I²R, so lower I dramatically reduces losses.', microTopicId: 'emi-mutual' },
  ],
};

// ─── Electromagnetism Domain ──────────────────────────────────────────────────
export const ELECTROMAGNETISM_DOMAIN: Domain = {
  id: 'electromagnetism',
  title: 'Electromagnetism',
  description: 'Electric charges, fields, circuits, magnetism, and the unified electromagnetic force.',
  icon: '⚡',
  color: 'from-yellow-500 to-orange-600',
  flagshipTopics: [
    electrostaticsTopic,
    capacitorsTopic,
    electricCurrentTopic,
    dcCircuitsTopic,
    magnetismTopic,
    emInductionTopic,
  ],
};
