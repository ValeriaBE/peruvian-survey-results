import InfoVotingChart from "./components/InfoVotingChart";
import SourcesChart from "./components/SourcesChart";
import TrustVotingDotPlot from "./components/TrustVotingDotPlot";
import DifficultyVotingChart from "./components/DifficultyVotingChart";
import BarrierEffectChart from "./components/BarrierEffectChart";
import MiniBarChart from "./components/MiniBarChart";
import GenderPieChart from "./components/GenderPieChart";
import BarrierDivergingChart from "./components/BarrierDivergingChart";
import BarrierGroupedChart from "./components/BarrierGroupedChart";
import './App.css'

function App() {
  return (
    <>
      <nav className="site-nav">
        <div className="nav-brand">Peruvian Voters in the U.S. 🇵🇪</div>
        <div className="nav-links">
          <a href="#goal">Goal</a>
          <a href="#demographics">Sample</a>
          <a href="#toplines">Toplines</a>
          <a href="#findings">Findings</a>
          <a href="#barriers">Barriers</a>
          <a href="#takeaways">Takeaways</a>
        </div>
      </nav>
      <main className="container">
        <section className="hero">
          <div className="kicker">Survey Results · Peruvians in the U.S.</div>
          <h1>Information, trust, and barriers shaped voting in the U.S.</h1>
          <p>
            This project explores how Peruvians in the United States experienced the 2026 Peruvian election, focusing on access to information, trust in sources, and barriers to voting.
          </p>
        </section>
        <section id="goal" className="goal-section">
          <div className="goal-content">
            <div className="goal-left">
              <span className="section-kicker">Research Goal</span>
              <h2>
                How information access and barriers shape political participation
                among Peruvians in the U.S.
              </h2>
            </div>

            <div className="goal-right">
              <div className="goal-point">
                <strong>Information access</strong>
                <p>How voters navigate limited and uneven sources</p>
              </div>

              <div className="goal-point">
                <strong>Trust in sources</strong>
                <p>Confidence in social media, news, and official channels</p>
              </div>

              <div className="goal-point">
                <strong>Barriers to voting</strong>
                <p>Distance, logistics, and eligibility challenges</p>
              </div>
            </div>
          </div>
          <p className="goal-sub">
            This study focuses on how diaspora voters experience elections differently
            from those within Peru.
          </p>
        </section>
        <section className="section-card demographics-section" id="demographics">
          <div className="section-header">
            <h2>Who responded?</h2>
            <p>
              The survey sample was concentrated among younger respondents and people
              living in a few U.S. states, so the findings should be read as exploratory
              rather than representative.
            </p>
          </div>

          <div className="demo-stats">
            <div className="demo-stat">
              <span className="demo-label">Sample size</span>
              <strong>2,201</strong>
              <p>survey responses</p>
            </div>

            <div className="demo-stat">
              <span className="demo-label">Largest age group</span>
              <strong>18-24</strong>
              <p>young Peruvians were central to the sample</p>
            </div>

            <div className="demo-stat">
              <span className="demo-label">Top state</span>
              <strong>Florida</strong>
              <p>one of the strongest response locations</p>
            </div>
          </div>

          <div className="demo-chart-row">
            <div>
              <h3>Gender</h3>
              <GenderPieChart />
            </div>
            <div>
              <h3>Education</h3>
              <MiniBarChart file="demo_education.csv" labelColumn="education" maxItems={4} size="large" />
            </div>
          </div>
        </section>
        <section className="section-card topline-section" id="toplines">
          <div className="section-header">
            <h2>Survey Questions & Topline Results</h2>
            <p>
              Before looking at relationships between variables, these toplines show the
              overall distribution of responses to the core survey questions.
            </p>
          </div>

          <div className="topline-grid">
            <div className="topline-card">
              <span className="question-label">Information</span>
              <h3>How informed did you feel about the 2026 presidential election in Peru?</h3>
              <p className="topline-stat">Most respondents felt only somewhat informed or less.</p>
              <MiniBarChart file="topline_informed.csv" labelColumn="informed" maxItems={5} />
            </div>

            <div className="topline-card">
              <span className="question-label">Sources</span>
              <h3>From which sources did you get information about the Peruvian elections?</h3>
              <p className="topline-stat">Social media was one of the most common sources.</p>
              <MiniBarChart file="topline_sources.csv" labelColumn="info_sources" maxItems={4} />
              <p className="topline-note">
                Note: Percentages do not add to 100 because respondents could select multiple sources.
              </p>
            </div>

            <div className="topline-card">
              <span className="question-label">Trust</span>
              <h3>Overall, how much did you trust the information you received?</h3>
              <p className="topline-stat">Trust was mixed, with many respondents expressing limited confidence.</p>
              <MiniBarChart file="topline_trust.csv" labelColumn="trust" maxItems={5} />
            </div>

            <div className="topline-card">
              <span className="question-label">Voting</span>
              <h3>Did you vote in the 2026 Peruvian presidential election?</h3>
              <p className="topline-stat">A large share of respondents reported not voting.</p>
              <MiniBarChart file="topline_voted.csv" labelColumn="voted" />
            </div>

            <div className="topline-card">
              <span className="question-label">Barriers</span>
              <h3>How easy or difficult was it for you to vote while living in the U.S.?</h3>
              <p className="topline-stat">Difficulty varied, with many unsure or facing barriers.</p>
              <MiniBarChart file="topline_ease.csv" labelColumn="ease_vote" maxItems={6} />
            </div>

            <div className="topline-card">
              <span className="question-label">Open-ended</span>
              <h3>What made it easy or difficult for you to vote?</h3>
              <p className="topline-stat">Responses highlighted distance, eligibility, and information gaps.</p>
              <MiniBarChart file="topline_barriers.csv" labelColumn="category" maxItems={5} />
              <p className="topline-note">
                Percentages are among respondents who answered the open-ended question.
              </p>
            </div>
          </div>
        </section>
        <section className="section-card" id="findings">
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
        <section className="section-card">
          <div className="section-header">
            <h2>Social media was a major source of election information.</h2>
            <p>
              Respondents could select multiple sources, so this chart counts
              mentions rather than unique respondents. It helps show the fragmented
              information environment Peruvians in the U.S. relied on.
            </p>
          </div>

          <div className="chart-wrap">
            <SourcesChart />
          </div>
        </section>
        <section className="section-card">
          <div className="section-header">
            <h2>Trust was closely connected to participation.</h2>
            <p>
              Respondents who trusted the information they received about the election
              were more likely to report voting. Among respondents who reported a great deal of trust, voting was nearly evenly split, suggesting that trust alone may not fully explain participation. This chart compares voting rates across
              different levels of trust.
            </p>
          </div>

          <div className="chart-wrap">
            <TrustVotingDotPlot />
          </div>
        </section>
        <section className="section-card">
          <div className="section-header">
            <h2>Voting felt easier for those who participated.</h2>
            <p>
              Respondents who described voting as easy were much more likely to report
              voting. However, this question was shown to all respondents, so “Not sure”
              responses may include people who did not vote or were not eligible.
            </p>
          </div>

          <div className="chart-wrap">
            <DifficultyVotingChart />
          </div>
        </section>
        <section className="section-card" id="barriers">
          <div className="section-header">
            <h2>Structural barriers were linked to lower participation.</h2>
            <p>
              Open-ended responses showed two different kinds of answers: barriers that may
              have prevented participation, and experiences reported by people who were able
              to vote.
            </p>
          </div>
          <div className="chart-wrap">
            <BarrierGroupedChart />
          </div>
          <div className="quotes-grid">
            <div className="quote-card">
              <p>"I have to drive about 3.5 hours to get to the voting place which means a trip of 7 hours in 1 day."</p>
              <span>Distance / polling location</span>
            </div>

            <div className="quote-card">
              <p>"I couldn’t vote because I don’t have Peruvian citizenship."</p>
              <span>ID / eligibility</span>
            </div>

            <div className="quote-card">
              <p>"There were 35 candidates. It’s hard to be well informed about all of them"</p>
              <span>Lack of clear information about candidates</span>
            </div>
            <div className="quote-card">
              <p>"What made it difficult is knowing the information about how, when, and where to vote."</p>
              <span>Lack of clear information on voting</span>
            </div>
            <div className="quote-card">
              <p>"I work long hour shifts in a hospital including weekends"</p>
              <span>Time / scheduling</span>
            </div>
            <div className="quote-card">
              <p>"Excessive wait times for voting"</p>
              <span>Lines / waiting</span>
            </div>
            <div className="quote-card">
              <p>"Super fast, no issues, it was in and out"</p>
              <span>Easy / smooth process</span>
            </div>
            <div className="quote-card">
              <p>"If the gestapo (ICE) wasn’t running rampant where I live."</p>
              <span>Other</span>
            </div>
          </div>
        </section>
        <section className="section-card conclusion-section" id="takeaways">
          <div className="section-header">
            <h2>Key Takeaways</h2>
            <p>
              The survey highlights how both access to information and structural barriers
              shape participation among Peruvians living in the United States.
            </p>
          </div>

          <div className="takeaways-grid">
            <div className="takeaway-card">
              <h3>Information matters</h3>
              <p>
                Respondents who felt more informed and trusted their sources were more
                likely to vote.
              </p>
            </div>

            <div className="takeaway-card">
              <h3>Barriers reduce participation</h3>
              <p>
                Distance, eligibility requirements, and unclear processes were associated
                with lower voting rates.
              </p>
            </div>

            <div className="takeaway-card">
              <h3>Experience vs. access</h3>
              <p>
                Challenges like long lines reflect the experience of those who voted,
                while structural barriers prevented others from participating.
              </p>
            </div>

            <div className="takeaway-card">
              <h3>Access shapes outcomes</h3>
              <p>
                Improving access to reliable information and voting infrastructure could
                increase participation among diaspora voters.
              </p>
            </div>
          </div>
        </section>
        <section className="methodology-section">
          <h3>About the data</h3>

          <div className="method-grid">
            <div>
              <strong>Sample</strong>
              <p>
                2,201 Peruvians living in the United States, with responses
                concentrated among younger participants and women.
              </p>
            </div>

            <div>
              <strong>Collection</strong>
              <p>
                The survey was distributed online through social networks,
                including TikTok and outreach to Peruvian communities and
                influencers in the U.S.
              </p>
            </div>

            <div>
              <strong>Analysis</strong>
              <p>
                Open-ended responses were coded into mutually exclusive categories based on
                their primary theme, such as barriers to access, information gaps,
                or descriptions of the voting process.
              </p>
            </div>

            <div>
              <strong>Limitations</strong>
              <p>
                The sample is not representative and likely reflects a more
                digitally engaged audience, with potential bias toward younger
                respondents and those active on social media.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span className="footer-name">Valeria Berrocal</span>

        <div className="footer-links">
          <a href="https://github.com/ValeriaBE" target="_blank" title="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.74.08-.74 1.22.08 1.86 1.25 1.86 1.25 1.08 1.85 2.84 1.32 3.53 1.01.11-.79.42-1.32.76-1.63-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.25-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.78.84 1.25 1.91 1.25 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.69.83.57C20.57 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          <a href="https://www.linkedin.com/in/valeria-b-egusquiza/" target="_blank" title="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.32V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zm1.78 13.02H3.56V9h3.56v11.45z" />
            </svg>
          </a>
        </div>

        <span className="footer-year">© 2026</span>
      </footer>
    </>
  )
}

export default App
