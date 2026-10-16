// Mobile menu
// The nav is visible by default; this collapses it behind the toggle on small
// screens. On tablet and up, CSS shows the nav inline and hides the toggle.

const desktopQuery = window.matchMedia('(min-width: 768px)')

export default function menuInit() {
  const header = document.querySelector('.Header')
  const toggle = header?.querySelector('.Header__Toggle')
  const nav = header?.querySelector('.Header__Nav')

  if (!header || !toggle || !nav) return

  const isOpen = () => header.getAttribute('data-menu') === 'open'

  function setOpen(open) {
    header.setAttribute('data-menu', open ? 'open' : 'closed')
    toggle.setAttribute('aria-expanded', String(open))
  }

  function close({ returnFocus = false } = {}) {
    if (!isOpen()) return
    setOpen(false)
    if (returnFocus) toggle.focus()
  }

  // CSS has already collapsed the nav via html.js; sync the state attributes
  setOpen(false)

  toggle.addEventListener('click', () => setOpen(!isOpen()))

  // Escape closes the menu and returns focus to the toggle
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      close({ returnFocus: true })
    }
  })

  // Clicking outside the header closes the menu
  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target)) close()
  })

  // Don't leave the menu open when resizing up to the desktop layout
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) close()
  })
}
