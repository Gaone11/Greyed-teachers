// Knowledge Galaxy — Static data tree
// Structure: Subject → Domain → Flagship Topic → Micro Topic
// Each flagship topic contains: multi-level explanations, flashcards, experiments, real-world apps, quiz, curiosity branches

export type DifficultyLevel = 'explorer' | 'investigator' | 'scholar' | 'researcher';

export interface MicroTopic {
  id: string;
  title: string;
  notes?: Record<DifficultyLevel, string>;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  microTopicId?: string;  // which subtopic this card belongs to
}

export interface Experiment {
  level: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  safety: string;
  expected: string;
  microTopicId?: string;  // which subtopic this experiment belongs to
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  microTopicId?: string;  // which subtopic this question belongs to
}

export interface CuriosityBranch {
  label: string;
  topicId: string;
}

export interface FlagshipTopic {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  microTopics: MicroTopic[];
  explanations: Record<DifficultyLevel, string>;
  flashcards: Flashcard[];
  experiments: Experiment[];
  realWorld: string[];
  relatedTopicIds: string[];
  curiosityBranches: CuriosityBranch[];
  quiz: QuizQuestion[];
  diagrams?: string[];   // diagram names from DiagramLibrary
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: string;
  flagshipTopics: FlagshipTopic[];
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  color: string;         // tailwind gradient from-x to-y
  textColor: string;
  domains: Domain[];
}

// ─────────────────────────────────────────────
// SUBJECTS — imported from dedicated data files
// ─────────────────────────────────────────────
import { PHYSICS_SUBJECT } from './physicsData';
import { MATHEMATICS_SUBJECT } from './subjects/mathematics';
import { CHEMISTRY_SUBJECT } from './subjects/chemistry';
import { BIOLOGY_SUBJECT } from './subjects/biology';
import { GENERAL_SCIENCE_SUBJECT } from './subjects/generalScience';
import { COMPUTER_STUDIES_SUBJECT } from './subjects/computerStudies';
import { ENVIRONMENTAL_SCIENCE_SUBJECT } from './subjects/environmentalScience';
import { AGRICULTURE_SUBJECT } from './subjects/agriculture';
import { STATISTICS_SUBJECT } from './subjects/statistics';

// ─────────────────────────────────────────────
// FLAGSHIP TOPIC DATA (other subjects)
// ─────────────────────────────────────────────

const gravityTopic: FlagshipTopic = {
  id: 'gravity',
  title: 'Gravity',
  icon: '🌍',
  tagline: 'The invisible force that shapes the universe',
  microTopics: [
    { id: 'newtons-law', title: "Newton's Law of Gravitation" },
    { id: 'orbital-motion', title: 'Orbital Motion' },
    { id: 'escape-velocity', title: 'Escape Velocity' },
    { id: 'black-holes', title: 'Black Holes' },
    { id: 'gravity-waves', title: 'Gravitational Waves' },
    { id: 'planet-formation', title: 'Planet Formation' },
  ],
  explanations: {
    explorer: 'Gravity is the invisible force that pulls things toward Earth. That is why when you drop something, it falls down instead of floating away.',
    investigator: 'Gravity is a force of attraction between any two objects that have mass. The heavier an object and the closer it is, the stronger the pull. Earth\'s gravity keeps us on the ground and the Moon in its orbit.',
    scholar: 'Gravity follows Newton\'s Law of Universal Gravitation: F = Gm₁m₂/r². The gravitational force between two masses is proportional to the product of their masses and inversely proportional to the square of the distance between them.',
    researcher: 'In General Relativity, gravity is not a force but a curvature of spacetime caused by mass and energy. Massive objects warp the fabric of spacetime, and other objects follow geodesics through that curved spacetime. This explains phenomena like gravitational lensing, time dilation near massive bodies, and gravitational waves.',
  },
  flashcards: [
    { id: 'g-fc-1', question: 'What is gravity?', answer: 'A force of attraction between objects with mass.' },
    { id: 'g-fc-2', question: 'Who first described gravity mathematically?', answer: 'Isaac Newton, in 1687.' },
    { id: 'g-fc-3', question: 'What is the gravitational acceleration on Earth\'s surface?', answer: 'Approximately 9.8 m/s².' },
    { id: 'g-fc-4', question: 'What keeps the Moon orbiting Earth?', answer: 'Earth\'s gravitational pull continuously curves the Moon\'s path.' },
    { id: 'g-fc-5', question: 'What is escape velocity?', answer: 'The minimum speed needed to escape a body\'s gravitational field without further propulsion.' },
    { id: 'g-fc-6', question: 'What is a black hole?', answer: 'A region of spacetime where gravity is so strong that nothing, not even light, can escape.' },
    { id: 'g-fc-7', question: 'What are gravitational waves?', answer: 'Ripples in spacetime caused by accelerating massive objects, like merging black holes.' },
    { id: 'g-fc-8', question: 'How does gravity affect time?', answer: 'Gravity slows down time — clocks near massive objects tick slower (gravitational time dilation).' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Feather vs Coin Drop',
      description: 'Discover how gravity affects objects of different weights.',
      materials: ['A coin', 'A feather or piece of paper', 'Open space'],
      steps: [
        'Hold the coin and feather at the same height.',
        'Drop them at the exact same moment.',
        'Observe which hits the ground first.',
        'Now crumple the paper into a tight ball and repeat.',
      ],
      safety: 'No safety concerns.',
      expected: 'Air resistance slows the feather. The crumpled ball falls almost as fast as the coin, showing gravity pulls equally — air resistance is the difference.',
    },
    {
      level: 'medium',
      title: 'Pendulum Period Experiment',
      description: 'Measure how gravity drives pendulum motion.',
      materials: ['String (50 cm)', 'Small weight (e.g. nut or bolt)', 'Ruler', 'Stopwatch', 'Tape'],
      steps: [
        'Tie the weight to the string and hang it from a fixed point.',
        'Pull the weight 10 cm to one side and release.',
        'Count 10 complete swings and record the total time.',
        'Change the string length to 25 cm and repeat.',
        'Compare: does a shorter pendulum swing faster or slower?',
      ],
      safety: 'Ensure the weight is small and secure.',
      expected: 'Shorter pendulums swing faster. Period T = 2π√(L/g) — only string length matters, not the weight.',
    },
    {
      level: 'hard',
      title: 'Orbital Simulation with Data',
      description: 'Model planetary orbits using Newton\'s gravitational formula.',
      materials: ['Spreadsheet software (Excel or Google Sheets)', 'Calculator'],
      steps: [
        'Use G = 6.674×10⁻¹¹, Earth mass = 5.97×10²⁴ kg.',
        'Calculate the orbital speed of the ISS at altitude 408 km: v = √(GM/r).',
        'Compare to Moon\'s orbital speed using r = 384,400 km.',
        'Plot a graph of orbital speed vs. distance.',
        'Explain why closer orbits are faster.',
      ],
      safety: 'No physical safety concerns.',
      expected: 'Orbital speed decreases with distance from Earth, following v ∝ 1/√r.',
    },
  ],
  realWorld: [
    'Satellites orbit Earth because gravity keeps them falling without hitting the surface.',
    'GPS satellites account for gravitational time dilation to stay accurate.',
    'Tidal forces — the Moon\'s gravity causes ocean tides on Earth.',
    'Engineers design rockets to overcome Earth\'s gravitational pull.',
    'Roller coasters use gravity to accelerate riders without an engine.',
  ],
  relatedTopicIds: ['energy', 'motion', 'black-holes-topic', 'orbital-mechanics'],
  curiosityBranches: [
    { label: 'Why do planets orbit stars?', topicId: 'orbital-motion' },
    { label: 'How do rockets escape Earth?', topicId: 'escape-velocity' },
    { label: 'What happens at a black hole?', topicId: 'black-holes-topic' },
    { label: 'Why do astronauts float?', topicId: 'weightlessness' },
    { label: 'Can gravity bend light?', topicId: 'gravitational-lensing' },
  ],
  quiz: [
    {
      question: 'What happens to gravitational force when the distance between two objects doubles?',
      options: ['It doubles', 'It halves', 'It becomes one-quarter', 'It stays the same'],
      answer: 2,
      explanation: 'Gravity follows an inverse-square law: F ∝ 1/r². Doubling the distance makes the force one-quarter as strong.',
    },
    {
      question: 'Which scientist described gravity as a curvature of spacetime?',
      options: ['Isaac Newton', 'Galileo Galilei', 'Albert Einstein', 'Stephen Hawking'],
      answer: 2,
      explanation: 'Einstein\'s General Theory of Relativity (1915) reframed gravity as spacetime curvature caused by mass.',
    },
    {
      question: 'What is Earth\'s approximate surface gravitational acceleration?',
      options: ['1.6 m/s²', '9.8 m/s²', '11.2 m/s²', '3.7 m/s²'],
      answer: 1,
      explanation: 'g ≈ 9.8 m/s² on Earth\'s surface. The Moon\'s is ~1.6 m/s².',
    },
    {
      question: 'What keeps the Moon in orbit around Earth?',
      options: ['Magnetic force', 'Centrifugal force pushes it away', 'Gravity continuously bends its path', 'The Moon is stationary'],
      answer: 2,
      explanation: 'The Moon moves forward while gravity pulls it inward — this balance creates a stable orbit.',
    },
    {
      question: 'What are gravitational waves?',
      options: ['Ocean waves caused by the Moon', 'Ripples in spacetime from accelerating masses', 'Sound waves in outer space', 'Radio waves from planets'],
      answer: 1,
      explanation: 'First detected in 2015 by LIGO, gravitational waves are spacetime ripples caused by events like black hole mergers.',
    },
  ],
};

const energyTopic: FlagshipTopic = {
  id: 'energy',
  title: 'Energy',
  icon: '⚡',
  tagline: 'The capacity to do work — the currency of the universe',
  microTopics: [
    { id: 'kinetic-energy', title: 'Kinetic Energy' },
    { id: 'potential-energy', title: 'Potential Energy' },
    { id: 'conservation-of-energy', title: 'Conservation of Energy' },
    { id: 'heat-energy', title: 'Heat & Thermal Energy' },
    { id: 'electromagnetic-energy', title: 'Electromagnetic Energy' },
    { id: 'nuclear-energy', title: 'Nuclear Energy' },
  ],
  explanations: {
    explorer: 'Energy is what makes things move, light up, heat up, or make sound. Everything that happens uses some form of energy.',
    investigator: 'Energy is the ability to do work. It comes in many forms — kinetic (motion), potential (stored), thermal (heat), chemical, and more. Energy cannot be created or destroyed — it only changes form.',
    scholar: 'Energy is a scalar physical quantity measured in Joules. Forms include kinetic (KE = ½mv²), gravitational potential (PE = mgh), elastic, thermal, chemical, electrical, and nuclear. The law of conservation of energy states that total energy in a closed system remains constant.',
    researcher: 'Energy is a fundamental concept in physics described by the Hamiltonian formalism. In relativity, mass and energy are equivalent (E = mc²). In quantum mechanics, energy is quantised. Thermodynamic entropy governs the direction of energy transformations (Second Law of Thermodynamics).',
  },
  flashcards: [
    { id: 'e-fc-1', question: 'What is kinetic energy?', answer: 'Energy due to motion. KE = ½mv²' },
    { id: 'e-fc-2', question: 'What is potential energy?', answer: 'Stored energy due to position or state. Gravitational PE = mgh.' },
    { id: 'e-fc-3', question: 'State the law of conservation of energy.', answer: 'Energy cannot be created or destroyed; it can only be transformed from one form to another.' },
    { id: 'e-fc-4', question: 'What famous equation links energy and mass?', answer: 'E = mc² (Einstein).' },
    { id: 'e-fc-5', question: 'What unit is energy measured in?', answer: 'Joules (J).' },
    { id: 'e-fc-6', question: 'What happens to kinetic energy when speed doubles?', answer: 'It quadruples, because KE ∝ v².' },
    { id: 'e-fc-7', question: 'What is thermal energy?', answer: 'The internal energy of a substance due to the kinetic energy of its particles.' },
    { id: 'e-fc-8', question: 'What is power?', answer: 'The rate of energy transfer. P = E/t, measured in Watts.' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Rubber Band Energy Store',
      description: 'Feel the difference between stored and released energy.',
      materials: ['Rubber band', 'Small toy car or block'],
      steps: [
        'Stretch the rubber band around two fingers and feel the resistance.',
        'Use the stretched rubber band to flick a small block across a table.',
        'Stretch it further and flick again.',
        'Observe the relationship between stretch and distance traveled.',
      ],
      safety: 'Aim away from faces.',
      expected: 'More stretch = more stored elastic potential energy = greater kinetic energy on release.',
    },
    {
      level: 'medium',
      title: 'Roller Coaster Energy Model',
      description: 'Build a track that demonstrates energy conservation.',
      materials: ['Cardboard tube / foam pipe insulation', 'Marble', 'Tape', 'Books to create height'],
      steps: [
        'Create a ramp by propping one end of the tube on books.',
        'Mark a start height.',
        'Release the marble and note how far it travels on a flat surface.',
        'Raise the start height and repeat.',
        'Calculate approximate PE = mgh at start, then observe KE at bottom.',
      ],
      safety: 'Ensure the tube is stable.',
      expected: 'Higher start → more PE → more KE → marble travels further. Energy is conserved (minus friction losses).',
    },
    {
      level: 'hard',
      title: 'Measuring Solar Energy Output',
      description: 'Quantify solar energy using a small solar panel and resistor.',
      materials: ['Small solar panel', 'Multimeter', 'Resistor (10Ω)', 'Sunlight source'],
      steps: [
        'Connect the solar panel to the resistor.',
        'Measure voltage (V) and current (I) at different light intensities.',
        'Calculate power: P = V × I.',
        'Compare output on a cloudy vs. sunny day.',
        'Research and compare to rated panel output.',
      ],
      safety: 'Use low-voltage panel only.',
      expected: 'Power output increases with light intensity. Students compute energy efficiency.',
    },
  ],
  realWorld: [
    'Fossil fuels store chemical energy formed from ancient organisms over millions of years.',
    'Solar panels convert electromagnetic energy (sunlight) into electrical energy.',
    'The human body converts chemical energy from food into kinetic and thermal energy.',
    'Hydroelectric dams convert gravitational PE of water into electrical energy.',
    'Nuclear power plants convert nuclear binding energy into heat and electricity.',
  ],
  relatedTopicIds: ['gravity', 'motion', 'thermodynamics', 'electricity'],
  curiosityBranches: [
    { label: 'How do nuclear reactors work?', topicId: 'nuclear-energy' },
    { label: 'What is dark energy?', topicId: 'dark-energy' },
    { label: 'Why does the Sun shine?', topicId: 'nuclear-fusion' },
    { label: 'How do batteries store energy?', topicId: 'electrochemistry' },
  ],
  quiz: [
    {
      question: 'A ball of mass 2 kg moves at 3 m/s. What is its kinetic energy?',
      options: ['3 J', '6 J', '9 J', '12 J'],
      answer: 2,
      explanation: 'KE = ½mv² = ½ × 2 × 3² = ½ × 2 × 9 = 9 J.',
    },
    {
      question: 'Which form of energy is stored in a stretched spring?',
      options: ['Kinetic', 'Thermal', 'Elastic potential', 'Nuclear'],
      answer: 2,
      explanation: 'A stretched or compressed spring stores elastic potential energy.',
    },
    {
      question: 'What happens to the total energy in a perfectly closed system over time?',
      options: ['It increases', 'It decreases', 'It stays constant', 'It converts to mass'],
      answer: 2,
      explanation: 'The law of conservation of energy states total energy is conserved in a closed system.',
    },
    {
      question: 'In E = mc², what does c represent?',
      options: ['Charge', 'The speed of light', 'Coulomb\'s constant', 'Specific heat capacity'],
      answer: 1,
      explanation: 'c is the speed of light in a vacuum ≈ 3×10⁸ m/s. The enormous value of c² means a tiny mass holds vast energy.',
    },
    {
      question: 'What unit measures power?',
      options: ['Joule', 'Newton', 'Watt', 'Pascal'],
      answer: 2,
      explanation: 'Power = energy/time, measured in Watts (W) = J/s.',
    },
  ],
};

const motionTopic: FlagshipTopic = {
  id: 'motion',
  title: 'Motion',
  icon: '🚀',
  tagline: 'How objects move through space and time',
  microTopics: [
    { id: 'velocity-acceleration', title: 'Velocity & Acceleration' },
    { id: 'newtons-laws', title: "Newton's Three Laws" },
    { id: 'projectile-motion', title: 'Projectile Motion' },
    { id: 'circular-motion', title: 'Circular Motion' },
    { id: 'momentum', title: 'Momentum & Collisions' },
    { id: 'friction', title: 'Friction' },
  ],
  explanations: {
    explorer: 'Motion means something is moving — changing position over time. A ball rolling, a bird flying, or a car driving are all examples of motion.',
    investigator: 'Motion involves displacement, speed, velocity (speed with direction), and acceleration. Newton\'s three laws describe how forces cause and change motion.',
    scholar: 'Motion is described by kinematics (equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as) and Newton\'s laws: inertia, F = ma, and action-reaction pairs. Momentum p = mv is conserved in collisions.',
    researcher: 'At relativistic speeds, classical mechanics breaks down. Lorentz transformations describe how time and space measurements change with velocity. Four-momentum is conserved in special relativity. Lagrangian mechanics provides an energy-based alternative formulation of motion.',
  },
  flashcards: [
    { id: 'm-fc-1', question: "State Newton's First Law.", answer: 'An object remains at rest or in uniform motion unless acted on by a net external force (inertia).' },
    { id: 'm-fc-2', question: "State Newton's Second Law.", answer: 'F = ma. Net force equals mass times acceleration.' },
    { id: 'm-fc-3', question: "State Newton's Third Law.", answer: 'For every action, there is an equal and opposite reaction.' },
    { id: 'm-fc-4', question: 'What is the difference between speed and velocity?', answer: 'Speed is scalar (magnitude only); velocity is vector (magnitude and direction).' },
    { id: 'm-fc-5', question: 'What is acceleration?', answer: 'The rate of change of velocity. a = Δv/Δt.' },
    { id: 'm-fc-6', question: 'What is momentum?', answer: 'p = mv. A measure of how hard it is to stop a moving object.' },
    { id: 'm-fc-7', question: 'What is inertia?', answer: 'The tendency of an object to resist changes to its state of motion.' },
    { id: 'm-fc-8', question: 'What happens to momentum in a collision?', answer: 'Total momentum is conserved (law of conservation of momentum).' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Coin Inertia Trick',
      description: 'Demonstrate Newton\'s First Law with a coin and card.',
      materials: ['A smooth playing card', 'A coin', 'A cup'],
      steps: [
        'Place the card on top of the cup.',
        'Place the coin on top of the card (directly over the cup opening).',
        'Flick the card quickly sideways.',
        'Observe where the coin lands.',
      ],
      safety: 'No safety concerns.',
      expected: 'The coin drops into the cup. Because the card moved quickly, the coin\'s inertia kept it still — demonstrating Newton\'s First Law.',
    },
    {
      level: 'medium',
      title: 'Measuring Acceleration on a Ramp',
      description: 'Calculate the acceleration of a trolley on an inclined ramp.',
      materials: ['Plank of wood', 'Books', 'Toy car or trolley', 'Ruler', 'Stopwatch'],
      steps: [
        'Prop the plank at a small angle using books.',
        'Mark start and end points (e.g. 50 cm apart).',
        'Release the car from rest and time how long it takes to reach the end.',
        'Use s = ½at² to calculate acceleration.',
        'Increase the angle and repeat. Compare accelerations.',
      ],
      safety: 'Place a barrier at the ramp\'s end.',
      expected: 'Steeper angle → greater acceleration. Results follow Newton\'s Second Law.',
    },
    {
      level: 'hard',
      title: 'Impulse & Momentum Lab',
      description: 'Measure how force-time (impulse) changes momentum.',
      materials: ['Force sensor', 'Motion sensor', 'Dynamics trolley', 'Track', 'Data logger'],
      steps: [
        'Set up two trolleys on a frictionless track with motion sensors.',
        'Record initial velocities of both trolleys.',
        'Let them collide (elastic and inelastic setups).',
        'Record post-collision velocities.',
        'Calculate momenta before and after. Verify conservation.',
        'Measure the force-time curve during collision and compare to momentum change.',
      ],
      safety: 'Secure the track on a flat surface.',
      expected: 'Total momentum conserved. Impulse (area under F-t curve) equals change in momentum.',
    },
  ],
  realWorld: [
    'Car airbags increase collision time to reduce the force of impact (impulse principle).',
    'Rockets work by Newton\'s Third Law — exhaust gases pushed down, rocket pushed up.',
    'Friction on roads provides the force needed for cars to accelerate and brake.',
    'Athletes use momentum to their advantage — a sprinter\'s stride maximises forward momentum.',
    'GPS systems must account for relativistic effects on satellite motion.',
  ],
  relatedTopicIds: ['gravity', 'energy', 'electricity'],
  curiosityBranches: [
    { label: 'How fast can anything travel?', topicId: 'speed-of-light' },
    { label: 'What is momentum exactly?', topicId: 'momentum' },
    { label: 'How do gyroscopes work?', topicId: 'circular-motion' },
    { label: 'Why do spinning tops not fall?', topicId: 'angular-momentum' },
  ],
  quiz: [
    {
      question: 'A 5 kg object accelerates at 3 m/s². What is the net force?',
      options: ['1.7 N', '8 N', '15 N', '53 N'],
      answer: 2,
      explanation: 'F = ma = 5 × 3 = 15 N.',
    },
    {
      question: 'Which law explains why passengers lurch forward when a bus brakes suddenly?',
      options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", 'Law of Conservation of Energy'],
      answer: 0,
      explanation: 'Inertia (First Law) — passengers\' bodies tend to continue moving forward when the bus decelerates.',
    },
    {
      question: 'What is the momentum of a 3 kg object moving at 4 m/s?',
      options: ['7 kg·m/s', '1.3 kg·m/s', '12 kg·m/s', '0.75 kg·m/s'],
      answer: 2,
      explanation: 'p = mv = 3 × 4 = 12 kg·m/s.',
    },
    {
      question: 'What is the SI unit of force?',
      options: ['Watt', 'Joule', 'Pascal', 'Newton'],
      answer: 3,
      explanation: 'Force is measured in Newtons (N). 1 N = 1 kg·m/s².',
    },
    {
      question: 'A rocket ejects gas downward. By which law does the rocket move upward?',
      options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", 'Archimedes\' Principle'],
      answer: 2,
      explanation: 'Newton\'s Third Law: every action (gas pushed down) has an equal and opposite reaction (rocket pushed up).',
    },
  ],
};

const lightTopic: FlagshipTopic = {
  id: 'light',
  title: 'Light',
  icon: '💡',
  tagline: 'Electromagnetic waves that carry energy at the fastest speed',
  microTopics: [
    { id: 'reflection', title: 'Reflection' },
    { id: 'refraction', title: 'Refraction' },
    { id: 'spectrum', title: 'The Electromagnetic Spectrum' },
    { id: 'photons', title: 'Photons & Quantum Light' },
    { id: 'lenses-mirrors', title: 'Lenses & Mirrors' },
    { id: 'colour', title: 'Colour & Perception' },
  ],
  explanations: {
    explorer: 'Light is what lets us see. It travels incredibly fast and bounces off things, which is why we can see objects around us.',
    investigator: 'Light is a form of electromagnetic radiation that travels at 300,000 km/s. It can be reflected (bounced), refracted (bent), and absorbed. White light splits into the colours of the rainbow when it passes through a prism.',
    scholar: 'Light behaves both as a wave (interference, diffraction) and as a particle (photoelectric effect, photons). The electromagnetic spectrum ranges from radio waves to gamma rays. Snell\'s Law governs refraction: n₁sinθ₁ = n₂sinθ₂.',
    researcher: 'Quantum electrodynamics (QED) describes light as photons mediating the electromagnetic force. Photon energy E = hf. Coherent photons produce lasers. The dual wave-particle nature is explained through the path integral formulation and wavefunction collapse.',
  },
  flashcards: [
    { id: 'l-fc-1', question: 'What is the speed of light in a vacuum?', answer: 'Approximately 3×10⁸ m/s (300,000 km/s).' },
    { id: 'l-fc-2', question: 'What happens when light hits a mirror?', answer: 'It reflects. Angle of incidence = angle of reflection.' },
    { id: 'l-fc-3', question: 'What is refraction?', answer: 'The bending of light as it passes from one medium to another.' },
    { id: 'l-fc-4', question: 'What is a photon?', answer: 'A quantum particle of light with energy E = hf.' },
    { id: 'l-fc-5', question: 'Why does a prism split white light?', answer: 'Different colours (wavelengths) refract at different angles — dispersion.' },
    { id: 'l-fc-6', question: 'What is the visible spectrum?', answer: 'The range of light visible to humans: red, orange, yellow, green, blue, indigo, violet (ROY G BIV).' },
    { id: 'l-fc-7', question: 'What is total internal reflection?', answer: 'When light hits a boundary at an angle greater than the critical angle and reflects entirely back inside.' },
    { id: 'l-fc-8', question: 'What is a converging lens?', answer: 'A convex lens that bends parallel light rays toward a focal point.' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Prism Rainbow',
      description: 'Split white light into the visible spectrum.',
      materials: ['Glass prism or CD disc', 'Torch or sunlight', 'White paper'],
      steps: [
        'Shine a narrow beam of light through the prism.',
        'Hold white paper on the other side.',
        'Observe the colours that appear.',
        'Try different angles to change the rainbow.',
      ],
      safety: 'Do not stare directly at concentrated light.',
      expected: 'White light splits into ROYGBIV — the visible spectrum.',
    },
    {
      level: 'medium',
      title: "Snell's Law Verification",
      description: 'Measure the refractive index of a glass block.',
      materials: ['Rectangular glass or perspex block', 'Pins', 'Paper', 'Protractor', 'Ruler'],
      steps: [
        'Place the block on paper and trace its outline.',
        'Shine a ray at the block and mark the incident ray.',
        'Trace the refracted ray inside and the emergent ray.',
        'Measure angles of incidence and refraction.',
        'Calculate n = sinθ₁/sinθ₂.',
      ],
      safety: 'Handle glass carefully.',
      expected: 'Consistent refractive index confirms Snell\'s Law. Glass n ≈ 1.5.',
    },
    {
      level: 'hard',
      title: 'Double-Slit Interference Pattern',
      description: 'Demonstrate the wave nature of light.',
      materials: ['Laser pointer', 'Double-slit card', 'Screen (white paper)', 'Ruler'],
      steps: [
        'Set up the laser 1–2 m from the screen.',
        'Place the double-slit between them.',
        'Observe the pattern on the screen.',
        'Measure fringe spacing y.',
        'Calculate wavelength: λ = yd/L where d = slit separation, L = distance.',
      ],
      safety: 'Never look directly into the laser. Use ≤1 mW laser pointer only.',
      expected: 'Alternating bright and dark fringes — proving light\'s wave nature through interference.',
    },
  ],
  realWorld: [
    'Optical fibres use total internal reflection to carry data as light pulses across continents.',
    'Cameras and human eyes use converging lenses to focus light onto a sensor or retina.',
    'Rainbows form when sunlight refracts and reflects inside water droplets.',
    'Lasers (coherent light) are used in surgery, barcode scanners, and DVD players.',
    'Telescopes collect and focus light from distant stars to reveal the universe.',
  ],
  relatedTopicIds: ['energy', 'magnetism', 'electromagnetic-spectrum'],
  curiosityBranches: [
    { label: 'Why is the sky blue?', topicId: 'rayleigh-scattering' },
    { label: 'How do fibre optics work?', topicId: 'total-internal-reflection' },
    { label: 'What is a laser?', topicId: 'laser' },
    { label: 'Can light slow down?', topicId: 'refractive-index' },
  ],
  quiz: [
    {
      question: 'What is the approximate speed of light in a vacuum?',
      options: ['3×10⁵ m/s', '3×10⁸ m/s', '3×10¹¹ m/s', '3×10⁶ m/s'],
      answer: 1,
      explanation: 'Light travels at approximately 3×10⁸ m/s (300,000 km/s) in a vacuum.',
    },
    {
      question: 'What law describes the relationship between incident and refracted angles?',
      options: ["Newton's Law", "Snell's Law", "Hooke's Law", "Boyle's Law"],
      answer: 1,
      explanation: "Snell's Law: n₁sinθ₁ = n₂sinθ₂ relates the angles of refraction.",
    },
    {
      question: 'What colour of visible light has the highest frequency?',
      options: ['Red', 'Green', 'Yellow', 'Violet'],
      answer: 3,
      explanation: 'Violet light has the highest frequency (shortest wavelength) in the visible spectrum.',
    },
    {
      question: 'Optical fibres work on the principle of:',
      options: ['Diffraction', 'Refraction', 'Total internal reflection', 'Absorption'],
      answer: 2,
      explanation: 'Light is guided along the fibre by total internal reflection at the glass-air boundary.',
    },
    {
      question: 'What is a photon?',
      options: ['A charged particle', 'A type of atom', 'A quantum packet of electromagnetic energy', 'A magnetic field'],
      answer: 2,
      explanation: 'A photon is the elementary quantum of light (and all EM radiation). Energy E = hf.',
    },
  ],
};

const cellsTopic: FlagshipTopic = {
  id: 'cells',
  title: 'Cells',
  icon: '🔬',
  tagline: 'The fundamental building blocks of all living things',
  microTopics: [
    { id: 'cell-structure', title: 'Cell Structure & Organelles' },
    { id: 'cell-membrane', title: 'Cell Membrane & Transport' },
    { id: 'cell-division', title: 'Mitosis & Meiosis' },
    { id: 'prokaryotes-eukaryotes', title: 'Prokaryotes vs Eukaryotes' },
    { id: 'stem-cells', title: 'Stem Cells' },
    { id: 'cell-metabolism', title: 'Cellular Respiration' },
  ],
  explanations: {
    explorer: 'A cell is the smallest living unit. Your body is made of trillions of tiny cells — each one is like a tiny factory that does a job to keep you alive.',
    investigator: 'Cells are the basic unit of life. They have a membrane, cytoplasm, and nucleus (in eukaryotes). Different cells have different jobs: red blood cells carry oxygen, muscle cells contract, nerve cells send signals.',
    scholar: 'Eukaryotic cells contain membrane-bound organelles: nucleus (DNA), mitochondria (ATP production), ribosomes (protein synthesis), endoplasmic reticulum (transport), Golgi apparatus (packaging). Cell division occurs by mitosis (growth/repair) or meiosis (reproduction).',
    researcher: 'Cellular processes are regulated by gene expression networks, signal transduction cascades, and post-translational modifications. The cell cycle (G1-S-G2-M) is tightly controlled by cyclins and CDKs. Apoptosis (programmed cell death) is critical for development and cancer suppression.',
  },
  flashcards: [
    { id: 'c-fc-1', question: 'What is the cell theory?', answer: 'All living things are made of cells. The cell is the basic unit of life. All cells come from pre-existing cells.' },
    { id: 'c-fc-2', question: 'What controls the cell?', answer: 'The nucleus — it contains the DNA that directs all cell activities.' },
    { id: 'c-fc-3', question: 'What organelle produces energy for the cell?', answer: 'The mitochondrion ("powerhouse of the cell").' },
    { id: 'c-fc-4', question: 'What is the difference between plant and animal cells?', answer: 'Plant cells have a cell wall, chloroplasts, and a large central vacuole; animal cells do not.' },
    { id: 'c-fc-5', question: 'What is osmosis?', answer: 'Diffusion of water across a semi-permeable membrane from high to low water concentration.' },
    { id: 'c-fc-6', question: 'What is mitosis?', answer: 'Cell division that produces two genetically identical daughter cells — for growth and repair.' },
    { id: 'c-fc-7', question: 'What are ribosomes?', answer: 'Organelles that synthesise proteins by translating mRNA.' },
    { id: 'c-fc-8', question: 'What is the cell membrane made of?', answer: 'A phospholipid bilayer with embedded proteins — the fluid mosaic model.' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Onion Cell Microscopy',
      description: 'Observe real plant cells under a microscope.',
      materials: ['Onion', 'Microscope', 'Slides', 'Cover slips', 'Iodine stain', 'Dropper', 'Forceps'],
      steps: [
        'Peel a thin layer from the inside of an onion.',
        'Place it on a slide and add a drop of iodine.',
        'Cover with a cover slip carefully.',
        'Observe under low then high magnification.',
        'Draw and label what you see: cell wall, nucleus, cytoplasm.',
      ],
      safety: 'Iodine can stain — avoid contact with skin and clothes.',
      expected: 'Rectangular plant cells with purple-stained nuclei clearly visible.',
    },
    {
      level: 'medium',
      title: 'Osmosis in Potato Strips',
      description: 'Investigate how water moves across cell membranes.',
      materials: ['Potato', 'Knife', 'Ruler', 'Salt solutions (0%, 2%, 10%)', 'Beakers', 'Paper towel'],
      steps: [
        'Cut 4 equal potato strips (~5 cm each) and measure masses.',
        'Place one in each solution and one in water.',
        'Leave for 30 minutes.',
        'Remove, pat dry, and measure mass again.',
        'Calculate % change in mass for each strip.',
      ],
      safety: 'Take care with knife.',
      expected: 'Strips in low salt gain mass (water enters cells by osmosis); strips in high salt lose mass (water exits cells).',
    },
    {
      level: 'hard',
      title: 'Mitosis Observation in Root Tips',
      description: 'Observe stages of mitosis in actively dividing cells.',
      materials: ['Onion root tip', 'HCl (1M)', 'Acetocarmine stain', 'Microscope', 'Slides'],
      steps: [
        'Cut 1 cm of onion root tip.',
        'Place in 1M HCl for 5 minutes to soften.',
        'Stain with acetocarmine for 5–10 minutes.',
        'Squash gently on slide under cover slip.',
        'Observe under microscope — identify prophase, metaphase, anaphase, telophase.',
      ],
      safety: 'HCl is corrosive — wear gloves and safety glasses.',
      expected: 'Distinct mitosis stages visible — chromosomes condensed and separating in various cells.',
    },
  ],
  realWorld: [
    'Cancer is caused by cells dividing uncontrollably — understanding the cell cycle is key to treatment.',
    'Stem cell therapy aims to replace damaged tissues in conditions like Parkinson\'s and spinal injuries.',
    'Vaccines work by introducing antigens that train immune cells (lymphocytes).',
    'Fermentation (bread, yoghurt, beer) relies on yeast and bacterial cells.',
    'CRISPR gene editing directly modifies the DNA inside cells to treat genetic diseases.',
  ],
  relatedTopicIds: ['dna', 'evolution', 'photosynthesis', 'genetics'],
  curiosityBranches: [
    { label: 'How do cancer cells behave differently?', topicId: 'cancer-biology' },
    { label: 'What is a stem cell?', topicId: 'stem-cells' },
    { label: 'How does CRISPR work?', topicId: 'crispr' },
    { label: 'How do cells communicate?', topicId: 'cell-signalling' },
  ],
  quiz: [
    {
      question: 'Which organelle is known as the "powerhouse of the cell"?',
      options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Golgi Apparatus'],
      answer: 2,
      explanation: 'Mitochondria produce ATP through cellular respiration — the energy currency of the cell.',
    },
    {
      question: 'What process does a cell use to divide and produce two identical daughter cells?',
      options: ['Meiosis', 'Binary fission', 'Mitosis', 'Fertilisation'],
      answer: 2,
      explanation: 'Mitosis produces two genetically identical diploid daughter cells for growth and tissue repair.',
    },
    {
      question: 'What is the function of the ribosome?',
      options: ['Energy production', 'DNA replication', 'Protein synthesis', 'Waste removal'],
      answer: 2,
      explanation: 'Ribosomes translate mRNA sequences into amino acid chains (proteins).',
    },
    {
      question: 'Which of the following is found in plant cells but NOT animal cells?',
      options: ['Mitochondria', 'Cell membrane', 'Chloroplast', 'Ribosome'],
      answer: 2,
      explanation: 'Chloroplasts carry out photosynthesis — they are unique to plant (and algal) cells.',
    },
    {
      question: 'Osmosis is the movement of which substance across a semi-permeable membrane?',
      options: ['Glucose', 'Oxygen', 'Water', 'Protein'],
      answer: 2,
      explanation: 'Osmosis is specifically the diffusion of water from a region of high water potential to low water potential.',
    },
  ],
};

const dnaTopic: FlagshipTopic = {
  id: 'dna',
  title: 'DNA',
  icon: '🧬',
  tagline: 'The molecule of life — the instruction manual for every living thing',
  microTopics: [
    { id: 'dna-structure', title: 'Double Helix Structure' },
    { id: 'dna-replication', title: 'DNA Replication' },
    { id: 'transcription', title: 'Transcription' },
    { id: 'translation', title: 'Translation' },
    { id: 'mutations', title: 'Mutations' },
    { id: 'genetic-code', title: 'The Genetic Code' },
  ],
  explanations: {
    explorer: 'DNA is like the instruction book inside every cell that tells your body how to grow, work, and look. It is why you look like your parents.',
    investigator: 'DNA (deoxyribonucleic acid) is a long molecule that carries genetic information. It is shaped like a twisted ladder (double helix). The rungs are made of base pairs: A-T and C-G. DNA tells cells which proteins to make.',
    scholar: 'DNA is a double-stranded polymer of nucleotides. Each nucleotide has a sugar (deoxyribose), phosphate group, and one of four bases (A, T, C, G). The Central Dogma: DNA → RNA → Protein. Replication uses DNA polymerase. Transcription produces mRNA; translation on ribosomes builds proteins.',
    researcher: 'DNA is packaged into chromatin via histone proteins. Epigenetic modifications (methylation, acetylation) regulate gene expression without altering sequence. Telomere shortening is linked to ageing. Horizontal gene transfer and retrotransposons contribute to genomic evolution. CRISPR-Cas9 enables precise genomic editing.',
  },
  flashcards: [
    { id: 'd-fc-1', question: 'What does DNA stand for?', answer: 'Deoxyribonucleic Acid.' },
    { id: 'd-fc-2', question: 'What is the structure of DNA?', answer: 'A double helix — two complementary strands wound around each other.' },
    { id: 'd-fc-3', question: 'What are the four DNA bases?', answer: 'Adenine (A), Thymine (T), Cytosine (C), Guanine (G).' },
    { id: 'd-fc-4', question: 'Which bases pair together in DNA?', answer: 'A pairs with T; C pairs with G.' },
    { id: 'd-fc-5', question: 'What is the Central Dogma of molecular biology?', answer: 'DNA → RNA (transcription) → Protein (translation).' },
    { id: 'd-fc-6', question: 'What enzyme copies DNA during replication?', answer: 'DNA polymerase.' },
    { id: 'd-fc-7', question: 'What is a mutation?', answer: 'A change in the DNA base sequence.' },
    { id: 'd-fc-8', question: 'Where in the cell is most DNA found?', answer: 'In the nucleus (chromosomes).' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Extract DNA from a Strawberry',
      description: 'See real DNA with the naked eye.',
      materials: ['Strawberry', 'Dish soap', 'Salt', 'Water', 'Ziplock bag', 'Coffee filter', 'Rubbing alcohol (cold)'],
      steps: [
        'Mash the strawberry in a ziplock bag.',
        'Add 2 tsp dish soap, 1 tsp salt, 3 tsp water. Mix gently.',
        'Filter the mixture through a coffee filter into a glass.',
        'Slowly pour cold alcohol down the side of the glass.',
        'Observe white threads forming at the alcohol-liquid boundary.',
      ],
      safety: 'Rubbing alcohol is flammable — keep away from flames.',
      expected: 'White stringy DNA precipitates at the alcohol layer — visible to the naked eye.',
    },
    {
      level: 'medium',
      title: 'Protein Synthesis Simulation',
      description: 'Model transcription and translation using cards.',
      materials: ['Coloured index cards (A, T, C, G)', 'mRNA codon chart', 'Amino acid chart'],
      steps: [
        'Write a DNA sequence on cards (e.g. ATG-GCT-TAA).',
        'Transcribe it to mRNA (A→U, T→A, C→G, G→C).',
        'Use a codon table to identify the amino acid for each codon.',
        'Build the polypeptide chain.',
        'Introduce a point mutation — observe how the protein changes.',
      ],
      safety: 'No safety concerns.',
      expected: 'Students understand the flow of genetic information and the consequences of mutations.',
    },
    {
      level: 'hard',
      title: 'Gel Electrophoresis Simulation',
      description: 'Simulate DNA fingerprinting using dye and agar.',
      materials: ['Agar gel', 'Food dye (as DNA proxy)', 'Electrophoresis tank (or built from cardboard)', 'Battery', 'Wire'],
      steps: [
        'Pour agar into the electrophoresis mould with wells.',
        'Load different coloured dyes into each well.',
        'Apply 9V current across the gel.',
        'Observe dye migration over 20 minutes.',
        'Compare "band" patterns.',
      ],
      safety: 'Ensure electrical connections are insulated.',
      expected: 'Smaller dye molecules migrate further — models how DNA fragments separate by size in forensic analysis.',
    },
  ],
  realWorld: [
    'DNA fingerprinting is used in forensic investigations and paternity tests.',
    'CRISPR-Cas9 uses DNA editing to potentially cure genetic diseases like sickle cell anaemia.',
    'COVID-19 mRNA vaccines were designed by reading the virus\'s genetic sequence.',
    'Ancestry companies like 23andMe analyse your DNA to trace heritage.',
    'Genetic engineers insert useful genes into bacteria to produce insulin for diabetics.',
  ],
  relatedTopicIds: ['cells', 'evolution', 'genetics', 'protein-synthesis'],
  curiosityBranches: [
    { label: 'How does CRISPR edit DNA?', topicId: 'crispr' },
    { label: 'What causes genetic mutations?', topicId: 'mutations' },
    { label: 'How was DNA\'s structure discovered?', topicId: 'dna-history' },
    { label: 'How do cancer genes work?', topicId: 'oncogenes' },
  ],
  quiz: [
    {
      question: 'Which base pairs with Adenine in DNA?',
      options: ['Cytosine', 'Guanine', 'Thymine', 'Uracil'],
      answer: 2,
      explanation: 'In DNA, A pairs with T (via two hydrogen bonds). In RNA, A pairs with U.',
    },
    {
      question: 'What shape is the DNA molecule?',
      options: ['Single helix', 'Double helix', 'Triple strand', 'Circular loop'],
      answer: 1,
      explanation: 'DNA is a double helix — discovered by Watson and Crick in 1953 using X-ray data from Rosalind Franklin.',
    },
    {
      question: 'Which process converts DNA to RNA?',
      options: ['Translation', 'Replication', 'Transcription', 'Mutation'],
      answer: 2,
      explanation: 'Transcription copies the DNA code into a complementary mRNA strand using RNA polymerase.',
    },
    {
      question: 'What is a gene?',
      options: ['A type of protein', 'A section of DNA that codes for a protein', 'An organelle', 'A type of cell'],
      answer: 1,
      explanation: 'A gene is a specific sequence of DNA bases that carries instructions for building a specific protein.',
    },
    {
      question: 'What enzyme builds a new DNA strand during replication?',
      options: ['RNA polymerase', 'Helicase', 'DNA polymerase', 'Ligase'],
      answer: 2,
      explanation: 'DNA polymerase reads the template strand and adds complementary nucleotides to build the new strand.',
    },
  ],
};

const atomsTopic: FlagshipTopic = {
  id: 'atoms',
  title: 'Atoms',
  icon: '⚛️',
  tagline: 'The fundamental building blocks of all matter',
  microTopics: [
    { id: 'atomic-structure', title: 'Atomic Structure' },
    { id: 'periodic-table', title: 'The Periodic Table' },
    { id: 'isotopes', title: 'Isotopes & Radioactivity' },
    { id: 'electron-configuration', title: 'Electron Configuration' },
    { id: 'atomic-models', title: 'History of Atomic Models' },
    { id: 'nuclear-reactions', title: 'Nuclear Reactions' },
  ],
  explanations: {
    explorer: 'Everything around you — your chair, your food, the air — is made of tiny atoms. Atoms are so small that millions of them fit on the tip of a hair.',
    investigator: 'Atoms are the smallest units of an element. They consist of a nucleus (protons + neutrons) surrounded by electrons. The number of protons determines which element it is. The Periodic Table organises all known elements.',
    scholar: 'Atomic number = protons. Mass number = protons + neutrons. Electron shells follow the 2, 8, 8 rule. Isotopes are atoms of the same element with different numbers of neutrons. Ionic and covalent bonds form when atoms exchange or share electrons.',
    researcher: 'The quantum mechanical model describes electrons as probability clouds (orbitals: s, p, d, f). Electron spin and the Pauli Exclusion Principle govern configuration. Nuclear binding energy and the strong nuclear force hold nuclei together. Radioactive decay follows first-order kinetics (half-life). Quantum tunnelling enables nuclear fusion in stars.',
  },
  flashcards: [
    { id: 'a-fc-1', question: 'What are the three subatomic particles?', answer: 'Proton (positive), Neutron (neutral), Electron (negative).' },
    { id: 'a-fc-2', question: 'Where is most of the mass of an atom located?', answer: 'In the nucleus (protons and neutrons).' },
    { id: 'a-fc-3', question: 'What determines the element of an atom?', answer: 'The number of protons (atomic number).' },
    { id: 'a-fc-4', question: 'What are isotopes?', answer: 'Atoms of the same element with the same number of protons but different numbers of neutrons.' },
    { id: 'a-fc-5', question: 'Who proposed the nuclear model of the atom?', answer: 'Ernest Rutherford (1911), based on the gold foil experiment.' },
    { id: 'a-fc-6', question: 'What is an ion?', answer: 'An atom that has gained or lost electrons, giving it a net charge.' },
    { id: 'a-fc-7', question: 'What is the electron configuration of Carbon (Z=6)?', answer: '2, 4 (2 electrons in shell 1, 4 in shell 2).' },
    { id: 'a-fc-8', question: 'What is radioactive decay?', answer: 'The spontaneous emission of radiation (alpha, beta, or gamma) from an unstable nucleus.' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Build a Model Atom',
      description: 'Visualise atomic structure by building a model.',
      materials: ['Polystyrene balls (3 sizes)', 'Paint (red, blue, grey)', 'Wire or string', 'Cardboard base'],
      steps: [
        'Paint large balls grey (neutrons), medium red (protons).',
        'Cluster them together as the nucleus.',
        'Use wire to model electron shells around the nucleus.',
        'Attach small blue balls (electrons) on the wires.',
        'Build Carbon, Oxygen, and Sodium models.',
      ],
      safety: 'No safety concerns.',
      expected: 'Students visualise how atomic number and mass relate to the structure of atoms.',
    },
    {
      level: 'medium',
      title: 'Flame Test Experiment',
      description: 'Identify metal ions by the colour of their flame.',
      materials: ['Nichrome wire loop', 'Hydrochloric acid', 'Bunsen burner', 'Metal salt solutions (LiCl, NaCl, KCl, CuCl₂)'],
      steps: [
        'Clean the wire loop in HCl then hold in flame until colourless.',
        'Dip in LiCl solution and hold in flame — record colour.',
        'Repeat for NaCl, KCl, CuCl₂.',
        'Li = red, Na = yellow, K = lilac, Cu = blue-green.',
      ],
      safety: 'Wear safety glasses. HCl is corrosive. Bunsen burner fire safety.',
      expected: 'Each metal produces a distinctive flame colour due to electron energy transitions.',
    },
    {
      level: 'hard',
      title: 'Radioactive Decay Simulation',
      description: 'Model half-life using coins or dice.',
      materials: ['100 coins or dice', 'Graph paper', 'Spreadsheet (optional)'],
      steps: [
        'Start with 100 coins (heads = undecayed nucleus).',
        'Shake and remove all tails — these have "decayed".',
        'Record remaining coins.',
        'Repeat until fewer than 5 remain.',
        'Plot a decay curve and calculate the half-life.',
      ],
      safety: 'No safety concerns.',
      expected: 'An exponential decay curve forms. Students calculate the half-life from the graph.',
    },
  ],
  realWorld: [
    'Carbon-14 dating uses radioactive decay to determine the age of ancient objects.',
    'Medical PET scans use radioactive tracers to image metabolic processes.',
    'Nuclear power plants split uranium atoms (fission) to generate electricity.',
    'Smoke detectors use Americium-241 (a radioactive isotope) to detect smoke particles.',
    'Semiconductors (silicon chips) rely on the electron properties of atoms.',
  ],
  relatedTopicIds: ['chemical-bonds', 'reactions', 'periodic-table'],
  curiosityBranches: [
    { label: 'What is inside a proton?', topicId: 'quarks' },
    { label: 'How does radiocarbon dating work?', topicId: 'carbon-dating' },
    { label: 'What is nuclear fusion?', topicId: 'nuclear-fusion' },
    { label: 'How small is an atom really?', topicId: 'scale-of-atoms' },
  ],
  quiz: [
    {
      question: 'What determines which element an atom belongs to?',
      options: ['Number of neutrons', 'Number of electrons', 'Number of protons', 'Atomic mass'],
      answer: 2,
      explanation: 'The atomic number (number of protons) uniquely identifies each element. Carbon always has 6 protons.',
    },
    {
      question: 'An atom of Carbon-12 and Carbon-14 are:',
      options: ['Different elements', 'Isotopes', 'Ions', 'Allotropes'],
      answer: 1,
      explanation: 'Both have 6 protons (same element) but different neutron counts (6 vs 8) — they are isotopes.',
    },
    {
      question: 'Who conducted the gold foil experiment that revealed the nuclear atom?',
      options: ['John Dalton', 'Niels Bohr', 'J.J. Thomson', 'Ernest Rutherford'],
      answer: 3,
      explanation: 'Rutherford\'s 1911 experiment showed that atoms have a small, dense, positively charged nucleus.',
    },
    {
      question: 'What type of radiation has the highest penetrating power?',
      options: ['Alpha', 'Beta', 'Gamma', 'Neutron'],
      answer: 2,
      explanation: 'Gamma rays are electromagnetic radiation with very short wavelength — they require thick lead or concrete to absorb.',
    },
    {
      question: 'What is the charge of an electron?',
      options: ['+1', '0', '-1', '+½'],
      answer: 2,
      explanation: 'Electrons carry a negative charge of -1 (or -1.6×10⁻¹⁹ C in SI units).',
    },
  ],
};

const algebraTopic: FlagshipTopic = {
  id: 'algebra',
  title: 'Algebra',
  icon: '🔢',
  tagline: 'The language of patterns, unknowns, and relationships',
  microTopics: [
    { id: 'variables-expressions', title: 'Variables & Expressions' },
    { id: 'equations', title: 'Solving Equations' },
    { id: 'inequalities', title: 'Inequalities' },
    { id: 'functions', title: 'Functions & Graphs' },
    { id: 'polynomials', title: 'Polynomials' },
    { id: 'simultaneous-equations', title: 'Simultaneous Equations' },
  ],
  explanations: {
    explorer: 'Algebra is like a puzzle where you find missing numbers. Instead of writing the number, we use a letter like x or y as a placeholder.',
    investigator: 'Algebra uses symbols to represent numbers and show mathematical relationships. You can solve for unknown values using equations. It is the foundation for all advanced mathematics.',
    scholar: 'Algebra studies mathematical structures, including variables, expressions, equations, and functions. Key topics: solving linear and quadratic equations, systems of equations, polynomial manipulation, and function notation. The quadratic formula: x = (-b ± √(b²-4ac)) / 2a.',
    researcher: 'Abstract algebra generalises arithmetic to groups, rings, and fields. Linear algebra studies vector spaces and transformations (used in ML and physics). Galois theory connects polynomial roots to group theory. Category theory provides the ultimate abstraction over mathematical structures.',
  },
  flashcards: [
    { id: 'al-fc-1', question: 'What is a variable?', answer: 'A symbol (usually a letter) that represents an unknown or changing value.' },
    { id: 'al-fc-2', question: 'What is an equation?', answer: 'A mathematical statement that two expressions are equal (contains an = sign).' },
    { id: 'al-fc-3', question: 'Solve: 2x + 4 = 12', answer: 'x = 4. (Subtract 4: 2x = 8, then divide by 2.)' },
    { id: 'al-fc-4', question: 'What is a function?', answer: 'A rule that assigns exactly one output to each input: f(x) = ...' },
    { id: 'al-fc-5', question: 'What is a polynomial?', answer: 'An expression with multiple terms involving variables and coefficients. E.g. 3x² + 2x - 5.' },
    { id: 'al-fc-6', question: 'What is the quadratic formula?', answer: 'x = (-b ± √(b²-4ac)) / 2a — solves ax² + bx + c = 0.' },
    { id: 'al-fc-7', question: 'What is the gradient (slope) of a line?', answer: 'm = (y₂ - y₁) / (x₂ - x₁) — the steepness of a line.' },
    { id: 'al-fc-8', question: 'What does it mean to factorise?', answer: 'Rewrite an expression as a product of its factors. E.g. x² + 5x + 6 = (x+2)(x+3).' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Balance Scale Equations',
      description: 'Model equations using a physical balance scale.',
      materials: ['Balance scale (or see-saw model)', 'Weights or objects', 'Labels for variables'],
      steps: [
        'Place 3 weights on the left and an unknown bag on the right.',
        'Add weights to the right until balanced.',
        'Record the equation: 3 = x.',
        'Try: 2x + 1 = 7. Model this physically.',
        'Solve by removing equal amounts from both sides.',
      ],
      safety: 'No safety concerns.',
      expected: 'Students grasp that solving an equation means keeping both sides balanced.',
    },
    {
      level: 'medium',
      title: 'Plotting Quadratics',
      description: 'Visualise parabolas by plotting quadratic equations.',
      materials: ['Graph paper', 'Pencil', 'Calculator'],
      steps: [
        'Use y = x² - 4.',
        'Create a table of values: x = -3 to 3.',
        'Calculate y for each x.',
        'Plot the points and draw the curve.',
        'Identify the vertex, axis of symmetry, and x-intercepts.',
      ],
      safety: 'No safety concerns.',
      expected: 'A U-shaped parabola with vertex at (0, -4) and x-intercepts at x = ±2.',
    },
    {
      level: 'hard',
      title: 'Modelling Real Data with Functions',
      description: 'Fit algebraic functions to real-world data.',
      materials: ['Spreadsheet software', 'Real dataset (e.g. plant growth measurements)'],
      steps: [
        'Input data into a spreadsheet.',
        'Create a scatter plot.',
        'Add a trendline — choose linear, polynomial, or exponential.',
        'Record the equation of the best-fit line.',
        'Use the equation to predict future values and discuss limitations.',
      ],
      safety: 'No safety concerns.',
      expected: 'Students apply algebra to real-world prediction and data interpretation.',
    },
  ],
  realWorld: [
    'GPS systems use algebraic equations to calculate your exact position from satellite signals.',
    'Financial analysts use algebra to model interest rates and investments.',
    'Engineers use simultaneous equations to balance forces in structures.',
    'Animators use algebraic functions to describe smooth motion paths.',
    'Doctors use algebraic formulas to calculate medication doses from body weight.',
  ],
  relatedTopicIds: ['calculus', 'statistics', 'geometry'],
  curiosityBranches: [
    { label: 'What is a matrix?', topicId: 'matrices' },
    { label: 'How does encryption use algebra?', topicId: 'cryptography' },
    { label: 'What is calculus?', topicId: 'calculus' },
    { label: 'How is algebra used in AI?', topicId: 'linear-algebra-ml' },
  ],
  quiz: [
    {
      question: 'Solve for x: 3x - 6 = 15',
      options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
      answer: 2,
      explanation: '3x = 15 + 6 = 21, so x = 21/3 = 7.',
    },
    {
      question: 'What is the slope of the line y = 3x + 2?',
      options: ['2', '3', '5', '1'],
      answer: 1,
      explanation: 'In y = mx + c, m is the slope. Here m = 3.',
    },
    {
      question: 'Which formula solves any quadratic equation ax² + bx + c = 0?',
      options: ['x = -b/2a', 'x = (-b ± √(b²-4ac)) / 2a', 'x = c/a', 'x = b²-4ac'],
      answer: 1,
      explanation: 'The quadratic formula gives both solutions. The discriminant b²-4ac tells you how many real roots exist.',
    },
    {
      question: 'Factorise: x² + 7x + 12',
      options: ['(x+3)(x+4)', '(x+6)(x+2)', '(x+1)(x+12)', '(x+5)(x+2)'],
      answer: 0,
      explanation: 'Find two numbers that multiply to 12 and add to 7: 3 × 4 = 12, 3 + 4 = 7. So (x+3)(x+4).',
    },
    {
      question: 'What is f(3) if f(x) = 2x² - 1?',
      options: ['5', '17', '11', '7'],
      answer: 1,
      explanation: 'f(3) = 2(3²) - 1 = 2(9) - 1 = 18 - 1 = 17.',
    },
  ],
};

const calculusTopic: FlagshipTopic = {
  id: 'calculus',
  title: 'Calculus',
  icon: '📈',
  tagline: 'The mathematics of change and accumulation',
  microTopics: [
    { id: 'limits', title: 'Limits' },
    { id: 'differentiation', title: 'Differentiation' },
    { id: 'integration', title: 'Integration' },
    { id: 'chain-rule', title: 'Chain Rule' },
    { id: 'applications-calculus', title: 'Applications in Physics & Engineering' },
    { id: 'differential-equations', title: 'Differential Equations' },
  ],
  explanations: {
    explorer: 'Calculus is the maths of change. If algebra is a photo, calculus is a video — it captures how things change over time.',
    investigator: 'Calculus has two main parts: differentiation (finding rates of change) and integration (finding areas). A speedometer measures rate of change of distance — that is a derivative. Filling a swimming pool over time — that is integration.',
    scholar: 'Differentiation: dy/dx = limit as Δx→0 of Δy/Δx. Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Integration is the inverse: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. The Fundamental Theorem of Calculus links them: ∫f\'(x)dx = f(x).',
    researcher: 'Real analysis provides the rigorous ε-δ foundation. Multivariable calculus extends to partial derivatives, gradient, divergence, curl, and surface integrals. Differential equations model physical systems. Stochastic calculus (Itô) governs random processes. Calculus of variations optimises functionals.',
  },
  flashcards: [
    { id: 'ca-fc-1', question: 'What is a derivative?', answer: 'The instantaneous rate of change of a function — the slope of the tangent at a point.' },
    { id: 'ca-fc-2', question: 'Differentiate y = x³', answer: 'dy/dx = 3x².' },
    { id: 'ca-fc-3', question: 'What is integration?', answer: 'The reverse of differentiation — used to find areas under curves.' },
    { id: 'ca-fc-4', question: 'Integrate ∫x² dx', answer: 'x³/3 + C.' },
    { id: 'ca-fc-5', question: 'What does the derivative of a position function give?', answer: 'Velocity.' },
    { id: 'ca-fc-6', question: 'What does the integral of velocity give?', answer: 'Displacement (position).' },
    { id: 'ca-fc-7', question: 'State the power rule for differentiation.', answer: 'If y = xⁿ, then dy/dx = nxⁿ⁻¹.' },
    { id: 'ca-fc-8', question: 'What is the derivative of a constant?', answer: 'Zero. Constants do not change.' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Rate of Change with a Car',
      description: 'Understand derivatives by timing a toy car.',
      materials: ['Toy car', 'Ruler', 'Stopwatch', 'Tape'],
      steps: [
        'Mark every 10 cm on a flat surface.',
        'Roll the car and record time at each mark.',
        'Calculate average speed for each 10 cm section.',
        'Notice how speed changes — this is the derivative of distance vs time.',
      ],
      safety: 'No safety concerns.',
      expected: 'Students observe varying speeds — the derivative concept made physical.',
    },
    {
      level: 'medium',
      title: 'Area Under a Curve (Riemann Sums)',
      description: 'Estimate integrals by counting rectangles.',
      materials: ['Graph paper', 'Ruler', 'Pencil'],
      steps: [
        'Draw y = x² from x = 0 to x = 4.',
        'Draw 4 rectangles of width 1 under the curve.',
        'Calculate the area of each: A = width × height.',
        'Sum them up — this is a Riemann sum.',
        'Increase to 8 rectangles — compare accuracy.',
      ],
      safety: 'No safety concerns.',
      expected: 'More rectangles → closer to true integral (16/3 ≈ 5.33). Students grasp how integration is the limit of infinite sums.',
    },
    {
      level: 'hard',
      title: 'Optimisation Problem',
      description: 'Use calculus to find the maximum area.',
      materials: ['Calculator or software', 'Pencil and paper'],
      steps: [
        'Problem: A farmer has 100 m of fence. Maximise the area of a rectangular field with one side along a wall.',
        'Set up: Area A = x(100-2x) = 100x - 2x².',
        'Differentiate: dA/dx = 100 - 4x.',
        'Set = 0: x = 25 m.',
        'Verify it is a maximum: d²A/dx² = -4 < 0.',
      ],
      safety: 'No safety concerns.',
      expected: 'Maximum area = 25 × 50 = 1250 m². Students apply calculus to a real optimisation problem.',
    },
  ],
  realWorld: [
    'Engineers use derivatives to find maximum stresses in structures before they fail.',
    'Economists use calculus to find the production quantity that maximises profit.',
    'Machine learning uses gradient descent — an application of differentiation — to train AI.',
    'Physicists use differential equations to model everything from fluid flow to quantum states.',
    'GPS satellites use calculus to calculate precise positions from changing signals.',
  ],
  relatedTopicIds: ['algebra', 'physics-motion', 'statistics'],
  curiosityBranches: [
    { label: 'How does calculus power machine learning?', topicId: 'gradient-descent' },
    { label: 'What are differential equations?', topicId: 'odes' },
    { label: 'Who invented calculus?', topicId: 'calculus-history' },
    { label: 'What is a fractal?', topicId: 'fractals' },
  ],
  quiz: [
    {
      question: 'Differentiate y = 5x⁴',
      options: ['20x³', '5x³', '4x³', '20x⁵'],
      answer: 0,
      explanation: 'Power rule: d/dx(5x⁴) = 5 × 4 × x³ = 20x³.',
    },
    {
      question: 'What does a derivative represent geometrically?',
      options: ['Area under a curve', 'Slope of the tangent line', 'Length of the curve', 'Volume under a surface'],
      answer: 1,
      explanation: 'The derivative dy/dx at a point gives the slope of the tangent line to the curve at that point.',
    },
    {
      question: 'Evaluate ∫₀² 3x² dx',
      options: ['4', '6', '8', '12'],
      answer: 2,
      explanation: '∫3x² dx = x³. Evaluating from 0 to 2: 2³ - 0³ = 8.',
    },
    {
      question: 'What is the derivative of a position function s(t) with respect to time?',
      options: ['Acceleration', 'Displacement', 'Speed', 'Velocity'],
      answer: 3,
      explanation: 'ds/dt = v (velocity). The derivative of velocity with respect to time is acceleration.',
    },
    {
      question: 'At a maximum of a function, the derivative is:',
      options: ['Positive', 'Negative', 'Zero', 'Undefined'],
      answer: 2,
      explanation: 'At a turning point (maximum or minimum), the gradient (derivative) equals zero.',
    },
  ],
};

const statisticsTopic: FlagshipTopic = {
  id: 'statistics-topic',
  title: 'Statistics & Probability',
  icon: '📊',
  tagline: 'Making sense of data and predicting the future',
  microTopics: [
    { id: 'mean-median-mode', title: 'Mean, Median & Mode' },
    { id: 'probability', title: 'Probability' },
    { id: 'distributions', title: 'Normal Distribution' },
    { id: 'correlation', title: 'Correlation & Regression' },
    { id: 'hypothesis-testing', title: 'Hypothesis Testing' },
    { id: 'data-visualisation', title: 'Data Visualisation' },
  ],
  explanations: {
    explorer: 'Statistics is about collecting and understanding information — like counting how many students in your class like football and showing it in a chart.',
    investigator: 'Statistics helps us summarise and interpret data. We use measures like mean (average), median (middle value), and mode (most common). Probability tells us how likely something is to happen.',
    scholar: 'Descriptive statistics: mean μ = Σx/n, variance σ², standard deviation σ. Probability axioms. Binomial and normal distributions. Hypothesis testing: null hypothesis, p-values, significance levels. Linear regression: y = mx + c minimises squared residuals.',
    researcher: 'Bayesian inference updates prior beliefs with new evidence. Maximum likelihood estimation. Bootstrap methods. ANOVA, chi-squared tests, non-parametric tests. Machine learning is largely applied statistics — regularisation, cross-validation, model selection via AIC/BIC.',
  },
  flashcards: [
    { id: 'st-fc-1', question: 'What is the mean?', answer: 'The average: sum of all values divided by the number of values.' },
    { id: 'st-fc-2', question: 'What is the median?', answer: 'The middle value when data is arranged in order.' },
    { id: 'st-fc-3', question: 'What is the mode?', answer: 'The value that appears most frequently in a dataset.' },
    { id: 'st-fc-4', question: 'What is standard deviation?', answer: 'A measure of how spread out the data is around the mean.' },
    { id: 'st-fc-5', question: 'What is probability?', answer: 'P(event) = favourable outcomes / total outcomes. Ranges from 0 to 1.' },
    { id: 'st-fc-6', question: 'What is a normal distribution?', answer: 'A bell-shaped distribution symmetric around the mean. Most data falls within ±2σ.' },
    { id: 'st-fc-7', question: 'What is correlation?', answer: 'A measure of how strongly two variables are linearly related. r ranges from -1 to +1.' },
    { id: 'st-fc-8', question: 'What is a p-value?', answer: 'The probability of observing your results if the null hypothesis is true. p < 0.05 is typically significant.' },
  ],
  experiments: [
    {
      level: 'easy',
      title: 'Class Survey Analysis',
      description: 'Collect and analyse real data from your class.',
      materials: ['Survey form', 'Calculator', 'Graph paper'],
      steps: [
        'Survey 20 students: hours of TV watched per day.',
        'List all values.',
        'Calculate mean, median, and mode.',
        'Draw a bar chart of the results.',
        'Discuss: which average best represents the data?',
      ],
      safety: 'No safety concerns.',
      expected: 'Students apply all three measures of central tendency to real data.',
    },
    {
      level: 'medium',
      title: 'Probability with Dice',
      description: 'Verify theoretical probability with an experiment.',
      materials: ['2 dice', 'Tally sheet', 'Graph paper'],
      steps: [
        'Roll two dice 100 times and record the sum each time.',
        'Calculate experimental probability of each sum.',
        'Calculate theoretical probability (e.g. P(sum=7) = 6/36).',
        'Compare experimental vs theoretical.',
        'Plot both on a bar chart.',
      ],
      safety: 'No safety concerns.',
      expected: 'With enough trials, experimental probability approaches theoretical. Law of Large Numbers demonstrated.',
    },
    {
      level: 'hard',
      title: 'Linear Regression on Real Data',
      description: 'Find the line of best fit for a real dataset.',
      materials: ['Spreadsheet software', 'Real dataset (e.g. height vs shoe size)'],
      steps: [
        'Collect height and shoe size data from 15 students.',
        'Input into a spreadsheet and create a scatter plot.',
        'Add a linear trendline and display the equation.',
        'Calculate the Pearson correlation coefficient.',
        'Predict shoe size for a height not in the sample.',
      ],
      safety: 'No safety concerns.',
      expected: 'Students model and predict using linear regression. Understand r² as explained variance.',
    },
  ],
  realWorld: [
    'Polling companies use statistics to predict election results from a small sample.',
    'Insurance companies use probability distributions to price risk.',
    'Doctors use statistical significance to decide if a drug trial shows real effects.',
    'Sports teams use data analytics to optimise player selection and tactics.',
    'Weather forecasting uses probabilistic models based on millions of data points.',
  ],
  relatedTopicIds: ['algebra', 'calculus', 'computer-studies'],
  curiosityBranches: [
    { label: 'How do pollsters predict elections?', topicId: 'sampling' },
    { label: 'What is machine learning?', topicId: 'ml-intro' },
    { label: 'How does insurance work mathematically?', topicId: 'actuarial-maths' },
    { label: 'Why do casinos always win?', topicId: 'expected-value' },
  ],
  quiz: [
    {
      question: 'Find the mean of: 4, 7, 7, 8, 4',
      options: ['6', '7', '4', '8'],
      answer: 0,
      explanation: 'Mean = (4+7+7+8+4)/5 = 30/5 = 6.',
    },
    {
      question: 'A bag has 3 red and 7 blue balls. P(red) = ?',
      options: ['0.3', '0.7', '3', '7'],
      answer: 0,
      explanation: 'P(red) = 3/(3+7) = 3/10 = 0.3.',
    },
    {
      question: 'What does a standard deviation of 0 tell you?',
      options: ['No data collected', 'All values are the same', 'Mean is zero', 'Data is normally distributed'],
      answer: 1,
      explanation: 'σ = 0 means all data points are identical — there is no variation.',
    },
    {
      question: 'A correlation coefficient of r = -0.95 indicates:',
      options: ['No correlation', 'Weak positive correlation', 'Strong negative correlation', 'Strong positive correlation'],
      answer: 2,
      explanation: 'r close to -1 means a strong negative linear relationship — as one variable increases, the other decreases.',
    },
    {
      question: 'What is a p-value of 0.03 tell us at a 5% significance level?',
      options: ['Fail to reject the null hypothesis', 'Reject the null hypothesis', 'The hypothesis is definitely true', 'The result is 97% certain'],
      answer: 1,
      explanation: 'p = 0.03 < 0.05, so we reject the null hypothesis. The result is statistically significant.',
    },
  ],
};

// ─────────────────────────────────────────────
// SUBJECTS DATABASE
// ─────────────────────────────────────────────

export const SUBJECTS: Subject[] = [
  MATHEMATICS_SUBJECT,
  PHYSICS_SUBJECT,
  CHEMISTRY_SUBJECT,
  BIOLOGY_SUBJECT,
  GENERAL_SCIENCE_SUBJECT,
  COMPUTER_STUDIES_SUBJECT,
  ENVIRONMENTAL_SCIENCE_SUBJECT,
  AGRICULTURE_SUBJECT,
  STATISTICS_SUBJECT,
];

// ─────────────────────────────────────────────
// LOOKUP HELPERS
// ─────────────────────────────────────────────

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find(s => s.id === id);
}

export function getDomainById(subjectId: string, domainId: string): Domain | undefined {
  return getSubjectById(subjectId)?.domains.find(d => d.id === domainId);
}

export function getTopicById(topicId: string): FlagshipTopic | undefined {
  for (const subject of SUBJECTS) {
    for (const domain of subject.domains) {
      const topic = domain.flagshipTopics.find(t => t.id === topicId);
      if (topic) return topic;
    }
  }
  return undefined;
}

export function getFlagshipTopicsForSubject(subjectId: string): FlagshipTopic[] {
  const subject = getSubjectById(subjectId);
  if (!subject) return [];
  return subject.domains.flatMap(d => d.flagshipTopics);
}

/** Returns the 3 most prominent flagship topic titles for a subject — used in ClassForm preview */
export function getSubjectTopicPreview(subjectId: string): string[] {
  return getFlagshipTopicsForSubject(subjectId)
    .slice(0, 3)
    .map(t => t.title);
}

/** The 9 subject options for form dropdowns */
export const SUBJECT_OPTIONS = SUBJECTS.map(s => ({
  value: s.id,
  label: s.title,
  icon: s.icon,
}));
