import { GlassOption, SpecialService } from '@shared/schema';

export const glassOptionCatalog: GlassOption[] = [
  {
    id: 'none',
    name: 'No Glass',
    description: 'No glass protection',
    price: '0.00' // no cost
  },
  {
    id: 'regular',
    name: 'Regular Glass',
    description: 'Standard protection',
    price: '0.08' // per square inch (wholesale)
  },
  {
    id: 'uv',
    name: 'Museum Glass',
    description: 'Museum non-glare',
    price: '0.45' // per square inch (wholesale)
  },
  {
    id: 'museum',
    name: 'Conservation Glass',
    description: 'Premium UV protection',
    price: '0.25' // per square inch (wholesale)
  }
];

// Helper function to get glass option by ID
export const getGlassOptionById = (id: string): GlassOption | undefined => {
  return glassOptionCatalog.find(glass => glass.id === id);
};

// Special services
export const specialServicesCatalog: SpecialService[] = [
  {
    id: 'float-mount',
    name: 'Float Mount',
    description: 'Artwork appears to float',
    price: '50.00'
  },
  {
    id: 'glass-float',
    name: 'Glass Float',
    description: 'Suspended between glass',
    price: '55.00'
  },
  {
    id: 'shadowbox',
    name: 'Shadowbox',
    description: 'For 3D objects',
    price: '65.00'
  },
  {
    id: 'labor-30min',
    name: 'Additional Labor (30 min)',
    description: 'Custom work',
    price: '30.00'
  },
  {
    id: 'labor-1hour',
    name: 'Additional Labor (1 hour)',
    description: 'Custom work',
    price: '55.00'
  }
];

// Helper function to get special service by ID
export const getSpecialServiceById = (id: string): SpecialService | undefined => {
  return specialServicesCatalog.find(service => service.id === id);
};
