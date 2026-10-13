import { useState } from 'react'
import { Radio, Square, TriangleAlert } from 'lucide-react'
import { useTelemetry } from '../context/TelemetryContext'

function TelemetryControls() {
  const { communication, sendUplinkCommand } = useTelemetry()
  const [feedback, setFeedback] = useState('')

  const sendCommand = (command) => {
    try {
      const sent = sendUplinkCommand(command)
      setFeedback(
        sent
          ? `${command === 'START_TELEMETRY' ? 'Start' : 'Stop'} command sent.`
          : 'Unable to send command: socket is disconnected.',
      )
    } catch {
      setFeedback('Unable to send command because of a socket error.')
    }
  }

  return (
    <section
      aria-label="Telemetry controls"
      className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-slate-100 shadow-lg sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <Radio aria-hidden="true" className="text-cyan-400" size={20} />
        <div>
          <h2 className="font-semibold">Telemetry Control</h2>
          <p
            aria-live="polite"
            className={`flex items-center gap-1 text-sm ${
              communication.connected ? 'text-emerald-400' : 'text-amber-400'
            }`}
            role="status"
          >
            {communication.connected ? (
              'Socket connected'
            ) : (
              <>
                <TriangleAlert aria-hidden="true" size={14} />
                Socket disconnected. Commands are unavailable.
              </>
            )}
          </p>
          {feedback && <p className="text-xs text-slate-400">{feedback}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!communication.connected}
          onClick={() => sendCommand('START_TELEMETRY')}
          type="button"
        >
          Start Telemetry
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 font-medium text-white transition hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!communication.connected}
          onClick={() => sendCommand('STOP_TELEMETRY')}
          type="button"
        >
          <Square aria-hidden="true" fill="currentColor" size={12} />
          Stop Telemetry
        </button>
      </div>
    </section>
  )
}

export default TelemetryControls
