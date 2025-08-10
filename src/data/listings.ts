export type Listing = {
  slug: string;
  name: string;
  category: string;
  rating?: number;
  address?: string;
  wheelchair?: boolean;
  images: string[];
  description: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  hours?: { day: string; open: string; close: string; closed?: boolean }[];
  reviews?: { author: string; rating: number; comment: string; date?: string }[];
};

export const listings: Listing[] = [
  {
    slug: "chaine-memorial-tower",
    name: "Chaine Memorial Tower",
    category: "Landmark",
    rating: 4.7,
    address: "Larne Harbour",
    wheelchair: true,
    images: [
      "/lovable-uploads/11c67c4c-f7fb-4290-8f45-874ba43b85f9.png",
      "/lovable-uploads/11c67c4c-f7fb-4290-8f45-874ba43b85f9.png",
      "/lovable-uploads/11c67c4c-f7fb-4290-8f45-874ba43b85f9.png"
    ],
    description:
      "A striking memorial tower overlooking Larne Harbour, offering panoramic views and a peaceful coastal walk.",
    contact: {
      phone: "+44 28 0000 0000",
      website: "https://example.com/chaine-memorial-tower",
      address: "Larne Harbour, Larne, Northern Ireland"
    },
    hours: [
      { day: "Mon", open: "08:00", close: "20:00" },
      { day: "Tue", open: "08:00", close: "20:00" },
      { day: "Wed", open: "08:00", close: "20:00" },
      { day: "Thu", open: "08:00", close: "20:00" },
      { day: "Fri", open: "08:00", close: "20:00" },
      { day: "Sat", open: "08:00", close: "20:00" },
      { day: "Sun", open: "08:00", close: "20:00" }
    ],
    reviews: [
      { author: "Aoife K.", rating: 5, comment: "Stunning views at sunset!", date: "2024-06-12" },
      { author: "Mark P.", rating: 4, comment: "Great walk with family.", date: "2024-05-30" }
    ]
  },
  {
    slug: "mourne-mountains-view",
    name: "Mourne Mountains View",
    category: "Viewpoint",
    rating: 4.8,
    address: "County Down",
    wheelchair: false,
    images: [
      "/lovable-uploads/774caacf-4765-4d50-8206-83c474f64e99.png",
      "/lovable-uploads/774caacf-4765-4d50-8206-83c474f64e99.png",
      "/lovable-uploads/774caacf-4765-4d50-8206-83c474f64e99.png"
    ],
    description:
      "Iconic panoramic vantage point of the Mourne range—crisp air, dramatic peaks, and sweeping valleys.",
    contact: {
      website: "https://example.com/mourne-mountains-view"
    },
    hours: [
      { day: "Mon", open: "00:00", close: "23:59" },
      { day: "Tue", open: "00:00", close: "23:59" },
      { day: "Wed", open: "00:00", close: "23:59" },
      { day: "Thu", open: "00:00", close: "23:59" },
      { day: "Fri", open: "00:00", close: "23:59" },
      { day: "Sat", open: "00:00", close: "23:59" },
      { day: "Sun", open: "00:00", close: "23:59" }
    ],
    reviews: [
      { author: "Sam R.", rating: 5, comment: "Best sunrise spot.", date: "2024-04-18" },
      { author: "Deirdre M.", rating: 4, comment: "Windy but worth it!", date: "2024-03-02" }
    ]
  },
  {
    slug: "winter-village-aerial",
    name: "Winter Village Aerial",
    category: "Scenic",
    rating: 4.5,
    address: "Countryside",
    wheelchair: false,
    images: [
      "/lovable-uploads/5c56be04-d2ae-485e-bcd3-c8337a1d7106.png",
      "/lovable-uploads/5c56be04-d2ae-485e-bcd3-c8337a1d7106.png",
      "/lovable-uploads/5c56be04-d2ae-485e-bcd3-c8337a1d7106.png"
    ],
    description:
      "A picturesque winter village scene captured from above—snow-dusted rooftops and winding lanes.",
    contact: {
      website: "https://example.com/winter-village-aerial"
    },
    hours: [
      { day: "Mon", open: "09:00", close: "17:00" },
      { day: "Tue", open: "09:00", close: "17:00" },
      { day: "Wed", open: "09:00", close: "17:00" },
      { day: "Thu", open: "09:00", close: "17:00" },
      { day: "Fri", open: "09:00", close: "17:00" },
      { day: "Sat", open: "10:00", close: "16:00" },
      { day: "Sun", open: "Closed", close: "Closed", closed: true }
    ],
    reviews: [
      { author: "Liam C.", rating: 4, comment: "Charming seasonal vibe.", date: "2024-01-22" }
    ]
  },
  {
    slug: "antrim-coast-road",
    name: "Antrim Coast Road",
    category: "Coastal Route",
    rating: 4.9,
    address: "Causeway Coastal",
    wheelchair: true,
    images: [
      "/lovable-uploads/27f10492-eea7-426f-92aa-2830b4f34ab7.png",
      "/lovable-uploads/27f10492-eea7-426f-92aa-2830b4f34ab7.png",
      "/lovable-uploads/27f10492-eea7-426f-92aa-2830b4f34ab7.png"
    ],
    description:
      "A breathtaking coastal drive hugging cliffs and bays—one of Northern Ireland’s most scenic routes.",
    contact: {
      website: "https://example.com/antrim-coast-road"
    },
    hours: [
      { day: "Mon", open: "00:00", close: "23:59" },
      { day: "Tue", open: "00:00", close: "23:59" },
      { day: "Wed", open: "00:00", close: "23:59" },
      { day: "Thu", open: "00:00", close: "23:59" },
      { day: "Fri", open: "00:00", close: "23:59" },
      { day: "Sat", open: "00:00", close: "23:59" },
      { day: "Sun", open: "00:00", close: "23:59" }
    ],
    reviews: [
      { author: "Niamh O.", rating: 5, comment: "Unmissable road trip.", date: "2024-05-01" },
      { author: "Paul G.", rating: 5, comment: "Epic views around every bend.", date: "2024-05-12" }
    ]
  }
];
