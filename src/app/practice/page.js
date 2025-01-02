import Header from "../../components/Header";
import Game from "../../components/Game";

export default function Home() {
  const words = ["Moon", "Age", "Guinea", "Zealand", "Year's Day"];

  return (
    <>
      <Header />
      <main>
        <Game words={words} />
      </main>
    </>
  );
}
