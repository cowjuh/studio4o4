import { useEffect } from 'react'

interface AcuityBookingButtonProps {
  className?: string
}

const AcuityBookingButton = ({ className = '' }: AcuityBookingButtonProps) => {
  useEffect(() => {
    // Load Acuity styles
    const styleLink = document.createElement('link')
    styleLink.rel = 'stylesheet'
    styleLink.href = 'https://embed.acuityscheduling.com/embed/button/34857787.css'
    styleLink.id = 'acuity-button-styles'
    document.head.appendChild(styleLink)

    // Add our custom style overrides
    const customStyles = document.createElement('style')
    customStyles.id = 'acuity-custom-styles'
    customStyles.textContent = `
      .acuity-embed-button {
        background: transparent !important;
        color: currentColor !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: 1px solid black !important;
        padding: 0.5rem 1rem !important;
      }
      .acuity-embed-button:hover {
        filter: none !important;
        background: black !important;
        color: white !important;
      }
      .acuity-embed-button:active,
      .acuity-embed-button:focus,
      .acuity-embed-button:visited {
        color: currentColor !important;
      }
      .acuity-embed-button:hover:active,
      .acuity-embed-button:hover:focus,
      .acuity-embed-button:hover:visited {
        color: white !important;
      }
    `
    document.head.appendChild(customStyles)

    // Load Acuity script
    const script = document.createElement('script')
    script.src = 'https://embed.acuityscheduling.com/embed/button/34857787.js'
    script.async = true
    document.body.appendChild(script)

    // Cleanup
    return () => {
      styleLink.remove()
      script.remove()
      const customStylesElement = document.getElementById('acuity-custom-styles')
      if (customStylesElement) {
        customStylesElement.remove()
      }
    }
  }, [])

  return (
    <a
      href="https://app.acuityscheduling.com/schedule.php?owner=34857787&ref=booking_button"
      target="_blank"
      className={`acuity-embed-button text-sm ${className}`}
    >
      Book Now
    </a>
  )
}

export default AcuityBookingButton