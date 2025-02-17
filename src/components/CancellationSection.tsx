import PageSection from './PageSection'

const CancellationSection = () => {
  return (
    <PageSection title="Cancellation, Rescheduling Policy">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Cancellation Policy</h3>
          <p className="text-sm">A 50% deposit is required to book your shoot.</p>
        </div>
        <ul className="text-sm space-y-2">
          <li>Cancellations more than 48 hours before — You'll get your full deposit back</li>
          <li>Cancellations within 48 hours — Deposit is non-refundable</li>
        </ul>
      </div>
    </PageSection>
  )
}

export default CancellationSection 