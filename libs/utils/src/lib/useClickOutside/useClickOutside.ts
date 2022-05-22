import { useEffect } from 'react'

export const useClickOutside: TUseClickOutside = (isOpen, setIsOpen, rootRef, active = true) => {
  useEffect(() => {
    const clickOutsideEvent = (event: MouseEvent) => {
      if (!active || !rootRef.current) return
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const closeDropdown = () => {
      if (!active) return
      setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener('mousedown', clickOutsideEvent)
      window.addEventListener('blur', closeDropdown)
      return () => {
        window.removeEventListener('mousedown', clickOutsideEvent)
        window.removeEventListener('blur', closeDropdown)
      }
    }

    return () => {
      //
    }
  }, [isOpen, setIsOpen, active, rootRef])

  return null
}

type TUseClickOutside = (
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  rootRef: React.RefObject<HTMLElement>,
  active?: boolean
) => null
