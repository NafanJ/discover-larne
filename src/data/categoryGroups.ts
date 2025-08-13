export interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  categories: string[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: '🍽️',
    categories: [
      'bar', 'Bar', 'Bar & Restaurant', 'bar food', 'pub food', 'restaurant', 'Restaurant & Takeaway',
      'cafe', 'Cafe', 'Coffee roasters', 'takeaway', 'chinese takeaway', 'Chinese Takeaway',
      'fast food', 'fish and chips', 'sandwich shop', 'bakery'
    ]
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    icon: '🏥',
    categories: [
      'doctor', 'general practitioner', 'dentist', 'pharmacy', 'physiotherapist', 'chiropractor',
      'medical clinic', 'health center', 'gym', 'fitness center', 'spa', 'massage',
      'Sports massage therapist', 'osteopath', 'Podiatrist ', 'psychologist', 'vet', 'veterinarian'
    ]
  },
  {
    id: 'retail-shopping',
    name: 'Retail & Shopping',
    icon: '🛍️',
    categories: [
      'clothing store', 'department store', 'grocery store', 'supermarket', 'convenience store',
      'gift shop', 'jewelry store', 'furniture store', 'electronics store', 'home improvement store',
      'pet store', 'toy store', 'book store', 'charity shop', 'farm shop', 'feed store',
      'garden center', 'shop', 'store'
    ]
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    icon: '💼',
    categories: [
      'lawyer', 'accountant', 'financial advisor', 'Mortgage Advisor', 'insurance agency',
      'real estate agent', 'estate agent', 'business consultant', 'consulting', 'marketing agency',
      'advertising agency', 'Pharmaceutical company'
    ]
  },
  {
    id: 'home-construction',
    name: 'Home & Construction',
    icon: '🔨',
    categories: [
      'builder', 'construction company', 'electrician', 'plumber', 'painter', 'carpenter',
      'roofer', 'bathroom fitter', 'kitchen fitter', 'flooring contractor', 'fencing contractor',
      'driveway contractor', 'plasterer', 'tiler', 'handyman', 'heating engineer'
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    categories: [
      'car dealer', 'car repair', 'auto repair', 'mechanic', 'garage', 'car wash', 'tire shop',
      'car rental', 'truck rental'
    ]
  },
  {
    id: 'hospitality-entertainment',
    name: 'Hospitality & Entertainment',
    icon: '🎪',
    categories: [
      'hotel', 'Hotel & Restaurant', 'bed and breakfast', 'guest house', 'cinema', 'nightclub',
      'casino', 'bowling alley', 'golf club', 'tennis club', 'sports club', 'Wedding venue',
      'swimming pool'
    ]
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    icon: '💄',
    categories: [
      'hair salon', 'hairdresser', 'beauty salon', 'nail salon', 'barber', 'tanning salon',
      'tattoo shop', 'piercing studio'
    ]
  },
  {
    id: 'education-training',
    name: 'Education & Training',
    icon: '📚',
    categories: [
      'school', 'training center', 'driving school', 'language school', 'music school',
      'dance studio', 'martial arts', 'nursery', 'childcare'
    ]
  },
  {
    id: 'government-community',
    name: 'Government & Community',
    icon: '🏛️',
    categories: [
      'Town Hall', 'post office', 'police station', 'fire station', 'community center',
      'church', 'charity', 'volunteer center', 'Job Centre', 'Historical landmark',
      'Household waste recycling centre'
    ]
  },
  {
    id: 'agriculture-industrial',
    name: 'Agriculture & Industrial',
    icon: '🏭',
    categories: [
      'farm', 'agricultural contractor', 'livestock dealer', 'factory', 'manufacturing',
      'Manufacturer', 'warehouse', 'plant hire', 'engineering company'
    ]
  },
  {
    id: 'other-services',
    name: 'Other Services',
    icon: '🔧',
    categories: [
      'courier service', 'removal company', 'printing service', 'photographer', 'wedding photographer',
      'computer repair', 'appliance repair', 'locksmith', 'gardener', 'landscaper', 'tree surgeon',
      'taxi', 'bus company', 'travel agency', 'currency exchange', 'loan company', 'bank',
      'building society', 'storage facility', 'dry cleaner', 'florist', 'funeral director',
      'Funeral home', 'petrol station', 'optometrist'
    ]
  }
];

// Create a mapping from individual category to group
export const categoryToGroupMap = new Map<string, string>();
categoryGroups.forEach(group => {
  group.categories.forEach(category => {
    categoryToGroupMap.set(category.toLowerCase(), group.id);
  });
});

// Helper function to get group for a category
export const getGroupForCategory = (category: string): string | null => {
  return categoryToGroupMap.get(category.toLowerCase()) || null;
};

// Helper function to get group info
export const getGroupInfo = (groupId: string): CategoryGroup | null => {
  return categoryGroups.find(group => group.id === groupId) || null;
};