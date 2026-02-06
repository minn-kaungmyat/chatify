// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/
function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#172033,theme(colors.slate.900)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.4)_80%,_theme(colors.sky.500)_86%,_theme(colors.sky.300)_90%,_theme(colors.sky.500)_94%,_theme(colors.slate.600/.4))_border-box] rounded-3xl border border-transparent animate-border flex overflow-hidden shadow-[0_30px_80px_-50px_rgba(15,23,42,0.95)]">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
