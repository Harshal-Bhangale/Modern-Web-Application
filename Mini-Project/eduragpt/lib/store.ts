import { create } from "zustand"
import { persist } from "zustand/middleware"

export type StudyMaterial = {
  id: string
  name: string
  type: string
  size: number
  pages: number
  uploadDate: string
  content: string
}

type StudyMaterialsState = {
  materials: StudyMaterial[]
  addMaterial: (material: StudyMaterial) => void
  addMaterials: (materials: StudyMaterial[]) => void
  removeMaterial: (id: string) => void
  clearMaterials: () => void
}

export const useStudyMaterialsStore = create<StudyMaterialsState>()(
  persist(
    (set) => ({
      materials: [],
      addMaterial: (material) =>
        set((state) => ({
          materials: [...state.materials, material],
        })),
      addMaterials: (materials) =>
        set((state) => ({
          materials: [...state.materials, ...materials],
        })),
      removeMaterial: (id) =>
        set((state) => ({
          materials: state.materials.filter((material) => material.id !== id),
        })),
      clearMaterials: () => set({ materials: [] }),
    }),
    {
      name: "study-materials-storage",
    },
  ),
)
