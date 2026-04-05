import type { Subject } from './knowledgeGalaxy';
import { CLASSICAL_MECHANICS_DOMAIN } from './physics/classicalMechanics';
import { THERMODYNAMICS_DOMAIN } from './physics/thermodynamics';
import { WAVES_OSCILLATIONS_DOMAIN } from './physics/wavesOscillations';
import { ELECTROMAGNETISM_DOMAIN } from './physics/electromagnetism';
import { OPTICS_DOMAIN } from './physics/optics';
import { MODERN_PHYSICS_DOMAIN } from './physics/modernPhysics';
import { ASTROPHYSICS_ADVANCED_DOMAIN } from './physics/astrophysicsAdvanced';

export const PHYSICS_SUBJECT: Subject = {
  id: 'physics',
  title: 'Physics',
  icon: '⚛️',
  color: 'from-indigo-600 to-purple-800',
  textColor: 'text-indigo-600',
  domains: [
    CLASSICAL_MECHANICS_DOMAIN,
    THERMODYNAMICS_DOMAIN,
    WAVES_OSCILLATIONS_DOMAIN,
    ELECTROMAGNETISM_DOMAIN,
    OPTICS_DOMAIN,
    MODERN_PHYSICS_DOMAIN,
    ASTROPHYSICS_ADVANCED_DOMAIN,
  ],
};
