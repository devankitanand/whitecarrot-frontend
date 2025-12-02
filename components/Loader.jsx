'use client'

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  )
}

