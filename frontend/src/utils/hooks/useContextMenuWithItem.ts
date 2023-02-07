import { useState } from "react"

const useContextMenuWithItem = <T,> () => {
  const [contextMenu, setContextMenu] = useState<{
    position: {
      top: number
      left: number
    }
    item: T | null
  } | null>(null)

  const handleContextMenu = (
    event: React.MouseEvent, 
    item: T | null
  ) => {
    event.preventDefault()
    event.stopPropagation()

    setContextMenu(
      contextMenu === null
        ? {
            position: {
              left: event.clientX + 6,
              top: event.clientY - 2,
            },
            item
          }
        : null,
    )
  }

  const handleClose = () => {
    setContextMenu(null)
  }

  return { handleClose, handleContextMenu, contextMenu }
}

export default useContextMenuWithItem