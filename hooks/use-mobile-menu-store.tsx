import { create } from "zustand";

type MobileMenuStoreType = {
    isOpen: boolean,
    setIsOpen: (value: boolean) => void
}

export const useMobileMenuStore = create<MobileMenuStoreType>((set) => ({
    isOpen: false,
    setIsOpen: (value: boolean) => set({ isOpen: value })
}))