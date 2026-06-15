import { APP_NAME } from '../../lib/constants'

function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: '#7C5CFF' }}
            >
              ?
            </div>
            <span className="text-base font-semibold text-white">{APP_NAME}</span>
          </div>
          <p className="text-sm text-white/45">Answers with proof, not promises.</p>
          <p className="text-xs text-white/25 mt-2">2025 AskPaper. Built for thinkers.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer