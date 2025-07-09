
// Fallback frame data for when API is unavailable
export const fallbackFrames = [
  {
    id: "fallback-1",
    item: "LJ-001",
    description: "Classic Wood Frame - Oak",
    width: 1.5,
    height: 2.0,
    material: "Wood",
    finish: "Oak",
    color: "Natural",
    listPrice: 25.00,
    chopPrice: 12.50,
    joinPrice: 50.00,
    category: "Wood Frames"
  },
  {
    id: "fallback-2", 
    item: "LJ-002",
    description: "Metal Frame - Silver",
    width: 1.0,
    height: 1.5,
    material: "Metal",
    finish: "Brushed",
    color: "Silver",
    listPrice: 18.00,
    chopPrice: 9.00,
    joinPrice: 36.00,
    category: "Metal Frames"
  }
];

export const getFramesWithFallback = async () => {
  try {
    const response = await fetch('/api/frames');
    if (!response.ok) throw new Error('API unavailable');
    const data = await response.json();
    return data.length > 0 ? data : fallbackFrames;
  } catch (error) {
    console.warn('Frame API unavailable, using fallback data:', error);
    return fallbackFrames;
  }
};
