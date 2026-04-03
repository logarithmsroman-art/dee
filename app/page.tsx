export const runtime = 'edge';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 font-serif">
      <div className="text-center p-8 border border-slate-100">
        <h1 className="text-4xl mb-4 italic">Dee's Pen House</h1>
        <p className="text-slate-500 tracking-widest uppercase text-xs">Architect of Narratives</p>
        <p className="mt-12 text-blue-500 animate-pulse">Test Build #26: Is this page refreshing?</p>
      </div>
    </div>
  )
}
