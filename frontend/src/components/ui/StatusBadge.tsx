import { statusTone } from '../../utils/helpers'

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge badge--${statusTone(status)}`}>
      <i aria-hidden="true" />
      {status}
    </span>
  )
}
