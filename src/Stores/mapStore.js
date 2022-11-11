// import create from "zustand";
import React from "react";
import create from "zustand"
const useMapStore = create((set) => ({
  map: null,
  populateMap: (mapGenerated) => set((state) => ({ map: mapGenerated })),
  removeMap: () => set({ map: null }),
}));
export default useMapStore;