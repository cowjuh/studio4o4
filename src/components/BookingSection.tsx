import PageSection from './PageSection'
import AcuityBookingButton from './AcuityBookingButton'

const BookingSection = () => {
  return (
    <PageSection title="Booking">
      <div className="space-y-4">
        <AcuityBookingButton/>
        <div className="space-y-2">
          <p className="text-sm">
            Payment via Venmo, Zelle, or Cash
          </p>
        </div>
      </div>
    </PageSection>
  )
}

export default BookingSection 