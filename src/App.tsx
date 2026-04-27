import InfoVotingChart from "./components/InfoVotingChart";
import './App.css'

function App() {
  return (
    <>
      <main className="container">
      <section className="hero">
        <div className="kicker">Survey Results · Peruvians in the U.S.</div>
        <h1>Information, trust, and barriers shaped voting in the U.S.</h1>
        <p>
          This interactive project explores how Peruvians living in the United
          States experienced the 2026 Peruvian election, focusing on information
          access, trust in sources, and barriers to voting from abroad.
        </p>
      </section>

      <section className="section-card">
        <div className="section-header">
          <h2>More informed respondents were more likely to vote.</h2>
          <p>
            Respondents who felt “very informed” reported much higher voting
            participation than those who felt less informed. This suggests that
            access to clear election information may be closely connected to
            participation among Peruvians living in the U.S.
          </p>
        </div>

        <div className="chart-wrap">
          <InfoVotingChart />
        </div>
      </section>
    </main>
    </>
  )
}

export default App
