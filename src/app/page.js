import Header from "../components/Header";
import Game from "../components/Game";

export default function Home() {
  const words = ["Moon", "Age", "Guinea", "Zealand", "Year's Day"];

  return (
<div className="h-screen flex flex-col overflow-hidden custom:overflow-auto">

{/* Header: 10% of the viewport height */}
      <header className="h-[10vh] flex-shrink-0">
        <Header />
      </header>

      {/* Main: 90% of the viewport height */}
      
      <main className="h-[90vh] flex-grow overflow-hidden lg:flex items-center justify-center bg-gray-100">
        <Game words={words} />
      </main>
    </div>
  );
}
