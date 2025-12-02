import { useState } from "react";
import { Location } from "../../features/location/locationTypes";

// דמו נתונים
const initialLocations: Location[] = [
  // {
  //   id: "1",
  //   name: "בית חב\"ד מרכזי",
  //   rabbiName: "הרב כהן",
  //   phone: "050-1234567",
  //   address: "רח' הראשי 1",
  //   city: "תל אביב",
  //   isactive: true,
  //   inventory: {
  //     tefillinCount: 5,
  //     tallitCount: 3,
  //     kippahCount: 10,
  //     tanyaCount: 2,
  //     otherItems: { סידורים: 7 }
  //   },
  //   createdAt: new Date("2024-01-01"),
  //   updatedAt: new Date("2024-06-01")
  // },
  // {
  //   id: "2",
  //   name: "בית חב\"ד צפון",
  //   rabbiName: "הרב לוי",
  //   phone: "050-7654321",
  //   address: "רח' הצפון 10",
  //   city: "חיפה",
  //   isactive: false,
  //   inventory: {
  //     tefillinCount: 2,
  //     tallitCount: 1,
  //     kippahCount: 5,
  //     tanyaCount: 0,
  //     otherItems: { חומשים: 3 }
  //   },
  //   createdAt: new Date("2024-02-01"),
  //   updatedAt: new Date("2024-06-10")
  // }
];

// שליפת כל המיקומים
export const useGetLocations = () => {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  // כדי לאפשר עדכון מבחוץ, נחשוף את setLocations (לשימוש בפונקציות אחרות)
  (window as any).__setLocations = setLocations;
  (window as any).__locations = locations;
  return { data: locations, isLoading: false, error: null, setLocations };
};

// שליפת מיקום לפי מזהה
export const useGetLocationById = (id: string) => {
  const [locations] = useState<Location[]>(initialLocations);
  const data = locations.find(l => l.id === id);
  return { data, isLoading: false, error: null };
};

// יצירת מיקום חדש
export const useCreateLocation = () => {
  const setLocations = (window as any).__setLocations;
  const createLocation = (location: Location) => {
    setLocations((prev: Location[]) => [...prev, location]);
  };
  return [createLocation, { isLoading: false, error: null }] as const;
};

// עדכון מיקום קיים
export const useUpdateLocation = () => {
  const setLocations = (window as any).__setLocations;
  const updateLocation = (location: Location) => {
    setLocations((prev: Location[]) =>
      prev.map(l => (l.id === location.id ? location : l))
    );
  };
  return [updateLocation, { isLoading: false, error: null }] as const;
};

// מחיקת מיקום
export const useRemoveLocation = () => {
  const setLocations = (window as any).__setLocations;
  const removeLocation = (id: string) => {
    setLocations((prev: Location[]) => prev.filter(l => l.id !== id));
  };
  return [removeLocation, { isLoading: false, error: null }] as const;
};