import { useEffect, useState } from 'react'
import { useTelemetry } from '../context/TelemetryContext'

const permittedCommands = [
  'CAL',
  'TX_ON',
  'TX_OFF',
  'STATE?',
  'SIM_ENABLE',
  'SIM_DISABLE',
  'RESET',
  'RESET_CLEAR',
]

function UplinkControl() {
  const { sendUplinkCommand, uplinkStatus, resetUplinkStatus } = useTelemetry()
  const [command, setCommand] = useState('')
  const [invalidCommand, setInvalidCommand] = useState(false)

  useEffect(() => {
    if (uplinkStatus !== 'success') return undefined

    const timeout = setTimeout(() => {
      setCommand('')
      resetUplinkStatus()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [uplinkStatus, resetUplinkStatus])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (uplinkStatus === 'sending') return

    const input = command.trim()
    if (!permittedCommands.includes(input)) {
      setInvalidCommand(true)
      return
    }

    setInvalidCommand(false)
    sendUplinkCommand(`CMD,046,${input}\r\n`)
  }

  const handleChange = (event) => {
    setCommand(event.target.value)
    setInvalidCommand(false)
    if (uplinkStatus === 'error') resetUplinkStatus()
  }

  const hasError = invalidCommand || uplinkStatus === 'error'
  const isSuccess = uplinkStatus === 'success'

  return (
    <form
      aria-label="Uplink command"
      className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-slate-100 shadow-lg sm:flex-row"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="uplink-command">
        Command text
      </label>
      <input
        autoComplete="off"
        aria-invalid={hasError}
        className={`min-w-0 flex-1 rounded-lg ${
          hasError
            ? 'border-4 border-red-500'
            : isSuccess
              ? 'border-4 border-green-500'
              : 'border border-slate-700'
        } bg-slate-950 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60`}
        disabled={uplinkStatus === 'sending'}
        id="uplink-command"
        onChange={handleChange}
        placeholder="Enter uplink command"
        type="text"
        value={command}
      />
      <button
        className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white transition hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={uplinkStatus === 'sending'}
        type="submit"
      >
        {uplinkStatus === 'sending'
          ? 'Sending...'
          : invalidCommand
            ? 'Invalid Command'
            : isSuccess
              ? 'Success!'
              : uplinkStatus === 'error'
            ? 'Failed - Retry'
            : 'Send Command'}
      </button>
    </form>
  )
}

export default UplinkControl
