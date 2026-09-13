export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  type: 'House' | 'Apartment' | 'Villa' | 'Condo';
  image: string;
  featured?: boolean;
  description: string;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Waterfront Villa",
    price: 2450000,
    location: "Malibu, CA",
    beds: 5,
    baths: 4.5,
    sqft: 4200,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    featured: true,
    description: "Stunning oceanfront villa with floor-to-ceiling windows, infinity pool, and private beach access. Architectural masterpiece with smart home features."
  },
  {
    id: 2,
    title: "Downtown Luxury Penthouse",
    price: 1890000,
    location: "Manhattan, NY",
    beds: 3,
    baths: 3,
    sqft: 2800,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    featured: true,
    description: "Exclusive penthouse with panoramic city views, private terrace, and designer finishes throughout. 24/7 concierge service."
  },
  {
    id: 3,
    title: "Hillside Contemporary Home",
    price: 1250000,
    location: "Austin, TX",
    beds: 4,
    baths: 3.5,
    sqft: 3100,
    type: "House",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    description: "Open-concept living with soaring ceilings, chef's kitchen, and expansive outdoor entertaining spaces overlooking the hills."
  },
  {
    id: 4,
    title: "Beachfront Condo",
    price: 875000,
    location: "Miami Beach, FL",
    beds: 2,
    baths: 2,
    sqft: 1450,
    type: "Condo",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    description: "Direct ocean views from every room. Resort-style amenities including spa, fitness center, and private beach club access."
  },
  {
    id: 5,
    title: "Mountain Retreat Estate",
    price: 3200000,
    location: "Aspen, CO",
    beds: 6,
    baths: 5.5,
    sqft: 5800,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    featured: true,
    description: "Secluded mountain estate with ski-in/ski-out access, gourmet kitchen, wine cellar, and breathtaking alpine views."
  },
  {
    id: 6,
    title: "Urban Loft Conversion",
    price: 695000,
    location: "Brooklyn, NY",
    beds: 2,
    baths: 2,
    sqft: 1600,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    description: "Industrial-chic loft with exposed brick, soaring ceilings, and oversized windows. Steps from trendy cafes and parks."
  },
  {
    id: 7,
    title: "Suburban Family Home",
    price: 925000,
    location: "Scottsdale, AZ",
    beds: 4,
    baths: 3,
    sqft: 2900,
    type: "House",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    description: "Immaculate single-story home with pool, mature landscaping, and open floor plan perfect for family living."
  },
  {
    id: 8,
    title: "Lakefront Cabin Modern",
    price: 1450000,
    location: "Lake Tahoe, CA",
    beds: 3,
    baths: 2.5,
    sqft: 2200,
    type: "House",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
    description: "Contemporary lake house with private dock, wraparound deck, and wall-to-wall glass showcasing the pristine water."
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};
