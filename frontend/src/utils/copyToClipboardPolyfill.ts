export default async function copyToClipboard(textToCopy: string) {
  const textArea = document.createElement("textarea")
  textArea.value = textToCopy
  
  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()
	textArea.focus()
	textArea.select()

  try {
		document.execCommand('copy')
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

	document.body.removeChild(textArea)
}