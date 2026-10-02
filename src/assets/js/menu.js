// Menu

// Vars
const body = document.querySelector('body'),
  siteNav = document.querySelector('.Header__Nav'),
  menuButton = document.querySelector('.Header__NavToggle'),
  menuActive = 'open',
  menuUnactive = 'closed'

export function menuOpen() {
  body.classList.add('nav-open')
  siteNav.setAttribute('data-menu', menuActive)
  siteNav.setAttribute('aria-expanded', 'true')
  menuButton.setAttribute('data-menu', menuActive)
}

export function menuClose() {
  body.classList.remove('nav-open')
  siteNav.setAttribute('data-menu', menuUnactive)
  siteNav.removeAttribute('aria-expanded')
  menuButton.setAttribute('data-menu', menuUnactive)
}

export default function menuInit() {
  // Click Main Menu Function
  function menuButtonClick(e) {
    e.preventDefault()
    if (siteNav.getAttribute('data-menu') == menuActive) {
      menuClose()
    } else {
      menuOpen()
    }
  }
  if (menuButton) {
    menuButton.addEventListener('click', menuButtonClick)
  }
}
