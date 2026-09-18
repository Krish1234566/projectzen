import { useEffect, useRef, useState } from 'react'
import './VoiceDictation.css'

/**
 * Voice -> prescription dictation, entirely in the browser.
 *
 * Uses the Web Speech API (SpeechRecognition) — no server, no API key, no cost.
 * Chrome and Edge only, and the page must be served over HTTPS or localhost.
 *
 *   <VoiceDictation
 *     onTranscript={(text) =>
 *       setForm((prev) => ({ ...prev, notes: prev.notes ? `${prev.notes}\n${text}` : text }))
 *     }
 *   />
 */

const FATAL_ERRORS = {
  'not-allowed': 'Microphone access was blocked. Allow it in the browser address bar and try again.',
  'service-not-allowed': 'Speech recognition was blocked by the browser.',
  'audio-capture': 'No microphone was found on this device.',
  network: 'Speech recognition needs an internet connection.',
}

function getSpeechRecognition() {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

function formatDuration(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function VoiceDictation({
  title = 'Voice — Prescription',
  hint = 'Tap the mic and dictate — it is transcribed straight into the field below.',
  onTranscript,
  disabled = false,
  lang = 'en-IN',
  maxSeconds = 120,
}) {
  // 'idle' | 'recording' | 'review'
  const [status, setStatus] = useState('idle')
  const [seconds, setSeconds] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  const finalTextRef = useRef('')
  const keepGoingRef = useRef(false)
  const timerRef = useRef(null)

  const supported = Boolean(getSpeechRecognition())

  function clearTimer() {
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  // Chrome pauses recognition on silence; restart until the doctor taps stop.
  function handleEnd() {
    if (keepGoingRef.current) {
      try {
        recognitionRef.current?.start()
        return
      } catch {
        // already restarting — fall through and settle
      }
    }

    clearTimer()
    recognitionRef.current = null
    setInterim('')
    setStatus(finalTextRef.current.trim() ? 'review' : 'idle')
  }

  function handleResult(event) {
    let pending = ''
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i]
      if (result.isFinal) {
        finalTextRef.current += `${result[0].transcript.trim()} `
      } else {
        pending += result[0].transcript
      }
    }
    setTranscript(finalTextRef.current.trimStart())
    setInterim(pending)
  }

  function handleError(event) {
    if (event.error === 'no-speech' || event.error === 'aborted') return
    const message = FATAL_ERRORS[event.error]
    if (!message) return
    keepGoingRef.current = false
    setError(message)
  }

  function startRecording() {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) return

    setError(null)
    setTranscript('')
    setInterim('')
    setSeconds(0)
    finalTextRef.current = ''

    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = handleResult
    recognition.onerror = handleError
    recognition.onend = handleEnd

    try {
      recognition.start()
    } catch {
      setError('Recording could not be started. Try again.')
      return
    }

    recognitionRef.current = recognition
    keepGoingRef.current = true
    setStatus('recording')

    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1
        if (next >= maxSeconds) stopRecording()
        return next
      })
    }, 1000)
  }

  function stopRecording() {
    keepGoingRef.current = false
    clearTimer()
    recognitionRef.current?.stop()
  }

  function cancelRecording() {
    keepGoingRef.current = false
    finalTextRef.current = ''
    clearTimer()
    recognitionRef.current?.abort()
    setTranscript('')
    setInterim('')
    setSeconds(0)
    setStatus('idle')
  }

  useEffect(() => {
    return () => {
      keepGoingRef.current = false
      clearInterval(timerRef.current)
      recognitionRef.current?.abort()
    }
  }, [])

  function insertTranscript() {
    const text = transcript.trim()
    if (!text) return
    onTranscript?.(text)
    finalTextRef.current = ''
    setTranscript('')
    setStatus('idle')
  }

  function discardTranscript() {
    finalTextRef.current = ''
    setTranscript('')
    setStatus('idle')
  }

  const isRecording = status === 'recording'

  return (
    <section className={`voice-card${isRecording ? ' is-recording' : ''}`}>
      <div className="voice-card-main">
        <button
          type="button"
          className="voice-mic"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || !supported}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <span className="voice-stop-icon" /> : '🎙'}
        </button>

        <div className="voice-copy">
          <h4>{title}</h4>
          <p>
            {!supported
              ? 'Voice dictation needs Chrome or Edge, on an HTTPS or localhost address.'
              : isRecording
                ? `Listening… ${formatDuration(seconds)} — tap stop when you are done.`
                : hint}
          </p>
        </div>

        {isRecording && (
          <button type="button" className="voice-link" onClick={cancelRecording}>
            Cancel
          </button>
        )}
      </div>

      {error && <p className="voice-error">{error}</p>}

      {isRecording && (
        <p className="voice-live" aria-live="polite">
          {transcript}
          <span className="voice-interim">{interim}</span>
          {!transcript && !interim && <span className="voice-waiting">Start speaking…</span>}
        </p>
      )}

      {status === 'review' && (
        <div className="voice-review">
          <label htmlFor="voice-transcript">Transcript — edit before inserting</label>
          <textarea
            id="voice-transcript"
            rows={4}
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
          />
          <div className="voice-actions">
            <button type="button" className="voice-secondary" onClick={discardTranscript}>
              Discard
            </button>
            <button type="button" className="voice-primary" onClick={insertTranscript}>
              Insert into prescription
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default VoiceDictation
