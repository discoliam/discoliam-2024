// Ajax Form
// Submits the Netlify form in the background, then shows a success or error
// message. Focus moves to the message so screen reader users hear the result.

export default function form() {
  const contactForm = document.getElementById('ContactForm')
  if (!contactForm) return

  const contactMessage = document.querySelector('.Contact__Message')
  const successMessage = document.querySelector('.Contact__MessageText--success')
  const errorMessage = document.querySelector('.Contact__MessageText--error')
  const submitButton = contactForm.querySelector('[type="submit"]')

  const showMessage = (message) => {
    ;[successMessage, errorMessage].forEach((el) => (el.style.display = 'none'))
    contactMessage.classList.add('Contact__Message--active')
    message.style.display = 'block'
    message.setAttribute('tabindex', '-1')
    message.focus()
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    submitButton.disabled = true

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString(),
      })

      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.status}`)
      }

      contactForm.style.display = 'none'
      showMessage(successMessage)
    } catch (error) {
      console.error(error)
      // Keep the form so their message isn't lost and they can try again
      submitButton.disabled = false
      showMessage(errorMessage)
    }
  })
}
