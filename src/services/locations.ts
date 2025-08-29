
import type { Location } from '@/lib/types';

let mockLocations: Location[] = [
  {
    id: 'main-warehouse',
    name: 'Main Warehouse',
    address: '123 Industrial Ave, Suite 100',
    type: 'warehouse',
    active: true,
  },
  {
    id: 'downtown-store',
    name: 'Downtown Store',
    address: '456 Main St',
    type: 'store',
    active: true,
  },
  {
    id: 'eastside-warehouse',
    name: 'Eastside Warehouse',
    address: '789 Distribution Blvd',
    type: 'warehouse',
    active: true,
  },
  {
    id: 'westside-popup',
    name: 'Westside Pop-up',
    address: 'Pop-up location, no permanent address',
    type: 'store',
    active: false,
  },
];

/**
 * A mock service to fetch locations.
 * In a real application, this would fetch data from a database or API.
 */
export async function getLocations(): Promise<Location[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLocations;
}

export async function createLocation(locationData: Omit<Location, 'id'>): Promise<Location> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLocation: Location = {
      ...locationData,
      id: `loc_${locationData.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`,
    };
    mockLocations.push(newLocation);
    return newLocation;
}

export async function updateLocation(locationData: Omit<Location, 'variants'>): Promise<Location> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockLocations.findIndex(l => l.id === locationData.id);
    if (index === -1) {
        throw new Error('Location not found');
    }
    const updatedLocation = {
        ...mockLocations[index],
        ...locationData,
    };
    mockLocations[index] = updatedLocation;
    return updatedLocation;
}

export async function deleteLocation(locationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockLocations.findIndex(l => l.id === locationId);
    if (index === -1) {
        throw new Error('Location not found');
    }
    mockLocations.splice(index, 1);
}
