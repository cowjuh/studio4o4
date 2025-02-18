import PageSection from './PageSection'

const CancellationSection = () => {
  return (
    <PageSection title="Cancellation & Rescheduling">
      <div className="space-y-2 text-sm">
        <p>50% deposit required to book</p>
        <p>• Cancel 48h+ before: Full refund</p>
        <p>• Cancel under 48h: No refund</p>
        <p>• Reschedule with 24h notice, otherwise will be considered a cancellation</p>
      </div>
    </PageSection>
  )
}

export default CancellationSection