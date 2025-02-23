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

      /* Override the close button to use Radix icon */
      .acuity-modal-close {
        font-size: 0 !important; /* Hide the original × character */
      }
      .acuity-modal-close::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background-image: url('data:image/svg+xml,${encodeURIComponent(`<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor"/></svg>`)}');
        background-repeat: no-repeat;
        background-position: center;
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