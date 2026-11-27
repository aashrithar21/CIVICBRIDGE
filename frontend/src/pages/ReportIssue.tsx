import { useEffect, useState, type DragEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, MapPin, Loader2, Check } from 'lucide-react'
import axios from 'axios'
import { complaintAPI } from '../services/api'
import LiveMap from '../components/common/LiveMap'
import PageHeader from '../components/ui/PageHeader'

const categories = ['Road Damage', 'Garbage', 'Water Leakage', 'Streetlight', 'Drainage', 'Other']
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export default function ReportIssue() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [dragging, setDragging] = useState(false)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)

  // Local preview of the chosen photograph; released when it changes.
  useEffect(() => {
    if (!image) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  function detectLocation() {
    if (!navigator.geolocation) {
      setError('Location detection is not supported by this browser.')
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLocationLoading(false)
        setError('')
      },
      () => {
        setError('Unable to detect location. Please allow location access or enter your address.')
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setImage(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (latitude === null || longitude === null) {
      setError('Choose the issue location on the map or use GPS.')
      return
    }

    if (image && !ACCEPTED.includes(image.type)) {
      setError('Please upload a JPG, PNG or WEBP image.')
      return
    }

    if (image && image.size > 5 * 1024 * 1024) {
      setError('Image size must be 5 MB or smaller.')
      return
    }

    const data = new FormData()
    data.append('title', title)
    data.append('category', category)
    data.append('description', description)
    data.append('address', address)

    if (image) data.append('image', image)
    if (latitude !== null) data.append('latitude', String(latitude))
    if (longitude !== null) data.append('longitude', String(longitude))

    setLoading(true)

    try {
      await complaintAPI.create(data)
      navigate('/citizen/complaints')
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Unable to submit your complaint.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const located = latitude !== null && longitude !== null

  return (
    <main className="page container">
      <div className="form-shell">
        <PageHeader
          eyebrow="Make your voice heard"
          title="Report a civic issue"
          lede="Three short steps. Your report is routed to the responsible department and published for the community to follow."
        />

        <form onSubmit={handleSubmit} className="card">
          <section className="form-step" aria-labelledby="step-1">
            <div className="step-head"><span className="n" aria-hidden="true">1</span><h2 id="step-1">What’s the problem?</h2></div>

            <div className="field">
              <label htmlFor="report-title" className="label">Issue title</label>
              <input id="report-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required placeholder="Example: Damaged road near main street" />
            </div>

            <div className="field">
              <label htmlFor="report-category" className="label">Category</label>
              <select id="report-category" className="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select category</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="report-description" className="label">Description</label>
              <textarea id="report-description" className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={2000} required placeholder="Describe the problem and its impact…" aria-describedby="desc-count" />
              <p id="desc-count" className="counter">{description.length} / 2000</p>
            </div>
          </section>

          <section className="form-step" aria-labelledby="step-2">
            <div className="step-head"><span className="n" aria-hidden="true">2</span><h2 id="step-2">Add a photograph <span className="label opt" style={{ display: 'inline', fontSize: 14 }}>(optional)</span></h2></div>

            {preview && image ? (
              <div className="preview">
                <img src={preview} alt="Selected photograph preview" />
                <div className="preview-bar">
                  <span>{image.name}</span>
                  <button type="button" onClick={() => setImage(null)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>Remove image</button>
                </div>
              </div>
            ) : (
              <label
                className={`dropzone ${dragging ? 'is-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <Camera size={30} aria-hidden="true" />
                <strong>Click to upload, or drag a photo here</strong>
                <small>JPG, PNG or WEBP · Maximum 5 MB</small>
                <input type="file" accept="image/png,image/jpeg,image/webp" aria-label="Upload complaint photograph" className="sr-only" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              </label>
            )}
          </section>

          <section className="form-step" aria-labelledby="step-3">
            <div className="step-head"><span className="n" aria-hidden="true">3</span><h2 id="step-3">Where is it?</h2></div>

            <div className="field">
              <label htmlFor="report-address" className="label">Address or landmark</label>
              <input id="report-address" className="input" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={300} required placeholder="Enter nearby address or landmark" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '16px 0 12px' }}>
              <button type="button" onClick={detectLocation} disabled={locationLoading} className="btn btn-outline btn-sm">
                {locationLoading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <MapPin size={16} aria-hidden="true" />}
                {locationLoading ? 'Detecting location…' : 'Detect my location'}
              </button>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>or click the map to place the pin.</span>
            </div>

            <LiveMap items={[]} point={located ? [latitude as number, longitude as number] : undefined} onPick={(lat, lon) => { setLatitude(lat); setLongitude(lon) }} />

            <p className={`pin-status ${located ? '' : 'is-empty'}`} role="status">
              {located ? <><Check size={16} aria-hidden="true" /> GPS coordinates captured successfully.</> : 'No location chosen yet.'}
            </p>
          </section>

          {error && <div style={{ padding: '0 clamp(20px, 3vw, 32px) 20px' }}><p role="alert" className="alert">{error}</p></div>}

          <div className="form-submit">
            <p>Reports are public. Please don’t include personal details in the description.</p>
            <button type="submit" disabled={loading} className="btn btn-primary" aria-busy={loading}>
              {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              {loading ? 'Submitting…' : 'Submit report'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
