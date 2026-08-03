"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const parkingOptions = [
  { name: "Structure 2", address: "5150 Lodge Service Drive", lat: 42.3567087, lon: -83.073913, walk: "5 min to State Hall", spaces: 76 },
  { name: "Structure 5", address: "5501 Anthony Wayne Drive", lat: 42.3581386, lon: -83.0741627, walk: "8 min to State Hall", spaces: 142 },
  { name: "Structure 1", address: "450 W. Palmer Avenue", lat: 42.3610227, lon: -83.0715633, walk: "12 min to State Hall", spaces: 188 },
];

const hours = [
  { time: "12 PM", value: 46 },
  { time: "1 PM", value: 58 },
  { time: "2 PM", value: 72 },
  { time: "3 PM", value: 88 },
  { time: "4 PM", value: 94 },
  { time: "5 PM", value: 91 },
  { time: "6 PM", value: 69 },
];

export default function Home() {
  const [arrival, setArrival] = useState("4:15 PM");
  const [modal, setModal] = useState<"login" | "qr" | null>(null);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [smartAlertVisible, setSmartAlertVisible] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantReply, setAssistantReply] = useState("Ask about availability, arrival time, or the weekday peak.");
  const [compareTime, setCompareTime] = useState("6:00 PM");
  const [selectedLot, setSelectedLot] = useState("Structure 2");
  const [routeNotice, setRouteNotice] = useState(false);
  const activeLot = parkingOptions.find((lot) => lot.name === selectedLot) || parkingOptions[0];

  useEffect(() => {
    setAppUrl(window.location.href.split("#")[0]);
    setLoggedIn(localStorage.getItem("stallora-demo-user") === "verified");
  }, []);

  const forecast = useMemo(() => {
    const hour = Number(arrival.match(/\d+/)?.[0] || 4);
    const peak = arrival.includes("PM") && hour >= 3 && hour <= 5;
    return peak
      ? { spaces: 76, wait: "8–12 min", level: "High demand", cls: "high" }
      : { spaces: 214, wait: "2–4 min", level: "Moderate", cls: "moderate" };
  }, [arrival]);

  function askStallora(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = assistantInput.toLowerCase();
    let reply = `At ${arrival}, Structure 2 is forecast to have ${forecast.spaces} spaces, with a ${forecast.wait} search time.`;
    if (question.includes("best") || question.includes("when") || question.includes("وقت")) {
      reply = "The best demonstrated arrival window is before 2:45 PM or after 5:45 PM.";
    } else if (question.includes("another") || question.includes("alternative")) {
      reply = "For this focused pilot, I recommend shifting your arrival to 6:00 PM. A future campus rollout would compare nearby structures live.";
    } else if (question.includes("data") || question.includes("accurate") || question.includes("confidence")) {
      reply = "This academic pilot uses scenario-based data with an 86% demonstration confidence score. Production deployment would connect to PARCS and live occupancy feeds.";
    }
    setAssistantReply(reply);
    setAssistantInput("");
  }

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      setNotice(`A verification code was prepared for ${email}.`);
    } else {
      localStorage.setItem("stallora-demo-user", "verified");
      setLoggedIn(true);
      setStep(3);
      setNotice("Demo account verified. Opening your dashboard…");
      window.setTimeout(() => {
        setModal(null);
        window.setTimeout(() => document.getElementById("account")?.scrollIntoView({ behavior: "smooth" }), 50);
      }, 450);
    }
  }

  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Stallora AI home">
          <span className="logoMark"><span>S</span></span>
          <span><strong>Stallora</strong><small>AI</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#forecast">Forecast</a>
          <a href="#how">How it works</a>
          <a href="#pilot">Pilot evidence</a>
        </nav>
        <div className="navActions">
          <button className="notificationButton" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}>♢<span>2</span></button>
          <button className="button ghost" onClick={() => { if (loggedIn) document.getElementById("account")?.scrollIntoView({ behavior: "smooth" }); else { setModal("login"); setStep(1); } }}>{loggedIn ? "My account" : "Sign in"}</button>
          {notificationsOpen && <div className="notificationPanel">
            <div><strong>Notifications</strong><button onClick={() => setNotificationsOpen(false)}>×</button></div>
            <article><span className="noticeDot high"></span><p><b>Peak-period warning</b><small>High demand is expected from 3:00–5:30 PM.</small></p></article>
            <article><span className="noticeDot good"></span><p><b>Better arrival window</b><small>Arriving at 6:00 PM may shorten your search.</small></p></article>
            <small>Demonstration notifications · Updated just now</small>
          </div>}
        </div>
      </header>

      {loggedIn && <section className="accountDashboard shell" id="account">
        <div className="accountHeading">
          <div><span className="kicker">MY STALLORA</span><h2>Welcome back.</h2><p>Your demonstration account is verified on this device.</p></div>
          <button className="button ghost" onClick={() => { localStorage.removeItem("stallora-demo-user"); setLoggedIn(false); }}>Sign out</button>
        </div>
        <div className="accountGrid">
          <article><small>SAVED ARRIVAL</small><strong>{arrival}</strong><span>Parking Structure 2</span><button onClick={() => document.getElementById("forecast")?.scrollIntoView({ behavior: "smooth" })}>Change plan</button></article>
          <article><small>FORECAST</small><strong>{forecast.spaces} spaces</strong><span>{forecast.level} · {forecast.wait} search</span><button onClick={() => document.getElementById("forecast")?.scrollIntoView({ behavior: "smooth" })}>View forecast</button></article>
          <article className="settingsCard"><small>ALERT SETTINGS</small><label><input type="checkbox" defaultChecked /> Peak-period warning</label><label><input type="checkbox" defaultChecked /> Arrival reminder</label><label><input type="checkbox" /> Weekly parking summary</label></article>
        </div>
        <p className="accountNote">Prototype settings are stored only on this device. No SMS is sent and no personal data is uploaded.</p>
      </section>}

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <div className="eyebrow"><span></span> WAYNE STATE UNIVERSITY PILOT</div>
          <h1>Know before<br />you <em>park.</em></h1>
          <p className="lead">A practical parking forecast for Structure 2. Plan around the recurring weekday rush instead of circling the block.</p>
          <div className="actions">
            <a className="button primary" href="#forecast">Plan my arrival <span>→</span></a>
            <button className="textButton" onClick={() => setModal("qr")}>Get the mobile app <span>↗</span></button>
          </div>
          <p className="microcopy">Graduate academic pilot · Synthetic demonstration data</p>
        </div>

        <div className="liveCard" aria-label="Current parking forecast">
          <div className="cardTop"><span>STRUCTURE 2</span><span className="live"><i></i> PILOT LIVE</span></div>
          <div className="availability">
            <div><span className="bigNumber">{forecast.spaces}</span><small>spaces predicted</small></div>
            <div className={`status ${forecast.cls}`}><b>{forecast.level}</b><small>at {arrival}</small></div>
          </div>
          <div className="meter"><span style={{ width: forecast.cls === "high" ? "82%" : "58%" }}></span></div>
          <div className="quickStats">
            <div><small>Expected search</small><strong>{forecast.wait}</strong></div>
            <div><small>Forecast confidence</small><strong>86%</strong></div>
          </div>
          <div className="recommend"><span>✓</span><p><strong>Best choice</strong><br />Arrive before 2:45 PM or after 5:45 PM.</p></div>
        </div>
      </section>

      {smartAlertVisible && forecast.cls === "high" && <section className="smartAlert shell">
        <div className="smartAlertIcon">!</div>
        <div><span>STALLORA SMART ALERT</span><h3>A better arrival window is available.</h3><p>Switching from {arrival} to 6:00 PM may reduce your estimated search from {forecast.wait} to 2–4 min.</p></div>
        <div className="smartAlertActions"><button className="button dark" onClick={() => { setArrival("6:00 PM"); setSmartAlertVisible(false); }}>Switch to 6:00 PM</button><button onClick={() => setSmartAlertVisible(false)}>Keep my time</button></div>
      </section>}

      <section className="trustBar">
        <div className="shell trustGrid">
          <div><strong>Mon–Thu</strong><span>Recurring pattern</span></div>
          <div><strong>3:00–5:30 PM</strong><span>Observed congestion window</span></div>
          <div><strong>Structure 2</strong><span>Focused pilot location</span></div>
          <div><strong>83%</strong><span>Campus users find parking in under 5 min*</span></div>
        </div>
      </section>

      <section className="section shell" id="forecast">
        <div className="sectionHead">
          <div><span className="kicker">ARRIVAL PLANNER</span><h2>One decision,<br />before the drive.</h2></div>
          <p>Choose when you expect to reach campus. Stallora translates the pilot forecast into a clear recommendation.</p>
        </div>
        <div className="plannerGrid">
          <div className="plannerPanel">
            <label htmlFor="arrival">Expected arrival</label>
            <select id="arrival" value={arrival} onChange={(e) => setArrival(e.target.value)}>
              <option>1:30 PM</option><option>2:30 PM</option><option>3:15 PM</option>
              <option>4:15 PM</option><option>5:15 PM</option><option>6:00 PM</option>
            </select>
            <div className={`decision ${forecast.cls}`}>
              <span className="decisionIcon">{forecast.cls === "high" ? "!" : "✓"}</span>
              <div><small>Recommendation</small><h3>{forecast.cls === "high" ? "Shift your arrival if possible" : "A reasonable time to arrive"}</h3><p>{forecast.cls === "high" ? "This sits inside the recurring Anthony Wayne Drive peak. Allow extra time or arrive after 5:45 PM." : "Demand is expected to be manageable, with a shorter search time inside Structure 2."}</p></div>
            </div>
            <button className="button dark" onClick={() => { if (loggedIn) document.getElementById("account")?.scrollIntoView({ behavior: "smooth" }); else { setModal("login"); setStep(1); } }}>{loggedIn ? "View saved plan" : "Save this plan"}</button>
          </div>
          <div className="chartPanel">
            <div className="chartTitle"><div><small>Predicted occupancy</small><strong>Thursday profile</strong></div><span>Peak window</span></div>
            <div className="bars" aria-label="Predicted occupancy by hour">
              {hours.map((item) => <div className="barItem" key={item.time}><div className={item.value >= 85 ? "peakBar" : ""} style={{ height: `${item.value}%` }}><span>{item.value}%</span></div><small>{item.time}</small></div>)}
            </div>
            <p className="chartNote"><span></span> Local congestion is most likely between 3:00 and 5:30 PM.</p>
          </div>
        </div>
      </section>

      <section className="comparison shell">
        <div className="comparisonHead"><div><span className="kicker">DECISION COMPARISON</span><h2>See the difference<br />before you leave.</h2></div>
          <label>Compare with<select value={compareTime} onChange={(e) => setCompareTime(e.target.value)}><option>2:30 PM</option><option>6:00 PM</option></select></label>
        </div>
        <div className="comparisonTable">
          <div className="compareRow compareHeader"><span>Measure</span><strong>{arrival}</strong><strong>{compareTime}</strong></div>
          <div className="compareRow"><span>Expected spaces</span><strong>{forecast.spaces}</strong><strong>{compareTime === "6:00 PM" ? 214 : 168}</strong></div>
          <div className="compareRow"><span>Search time</span><strong>{forecast.wait}</strong><strong>{compareTime === "6:00 PM" ? "2–4 min" : "4–6 min"}</strong></div>
          <div className="compareRow"><span>Demand</span><strong className={forecast.cls}>{forecast.level}</strong><strong className="moderate">Moderate</strong></div>
          <div className="compareRow recommendationRow"><span>Stallora recommendation</span><strong>{forecast.cls === "high" ? "Shift if possible" : "Reasonable"}</strong><strong>Recommended</strong></div>
        </div>
        <p className="dataDisclosure">Scenario comparison uses synthetic pilot data. Live deployment would refresh from operational parking feeds.</p>
      </section>

      <section className="mapSection shell" id="map">
        <div className="mapHeader">
          <div><span className="kicker">LIVE CAMPUS MAP</span><h2>Know where to go,<br />not only when.</h2><p>Explore the pilot structure, its relationship to State Hall, and practical alternatives when demand is high.</p></div>
          <div className="mapLegend"><span><i className="pilotPin"></i>Pilot location</span><span><i className="hallPin"></i>State Hall</span><small>Map tiles and directions are live. Availability values are pilot forecasts.</small></div>
        </div>
        <div className="mapLayout">
          <div className="liveMap">
            <iframe title={`Live map of ${activeLot.name}`} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeLot.lon - 0.008}%2C${activeLot.lat - 0.005}%2C${activeLot.lon + 0.008}%2C${activeLot.lat + 0.005}&layer=mapnik&marker=${activeLot.lat}%2C${activeLot.lon}`}></iframe>
            <div className="mapBadge"><span>LIVE MAP</span><strong>{activeLot.name}</strong><small>{activeLot.address}</small></div>
            <a className="stateHallBadge" href="https://www.openstreetmap.org/?mlat=42.3571327&mlon=-83.0688319#map=18/42.3571327/-83.0688319" target="_blank" rel="noreferrer"><span>STATE HALL</span><strong>42.35713, −83.06883</strong></a>
          </div>
          <aside className="lotSelector">
            <div className="lotSelectorTop"><span>RECOMMENDED OPTIONS</span><a href="https://parking.wayne.edu/availability" target="_blank" rel="noreferrer">WSU live availability ↗</a></div>
            {parkingOptions.map((lot, index) => <button key={lot.name} className={selectedLot === lot.name ? "lotOption active" : "lotOption"} onClick={() => { setSelectedLot(lot.name); setRouteNotice(false); }}>
              <span className="lotRank">{index + 1}</span><span><strong>{lot.name}</strong><small>{lot.address}</small><small>{lot.walk}</small></span><span className="lotSpaces"><b>{lot.spaces}</b><small>predicted</small></span>
            </button>)}
            <button className="button dark routeButton" onClick={() => setRouteNotice(true)}>Route me to {activeLot.name} <span>→</span></button>
            <small className="mapSource">Location references: Wayne State Campus Map and Parking & Transportation Services. Coordinates power the demonstration routing.</small>
          </aside>
        </div>
      </section>

      {routeNotice && <div className="routeToast" role="status">
        <button className="routeClose" onClick={() => setRouteNotice(false)}>×</button>
        <span className="routeIcon">↗</span>
        <div><small>STALLORA ROUTE READY</small><h3>{activeLot.name}</h3><p>{activeLot.address}, Detroit, MI 48202</p><dl><div><dt>Coordinates</dt><dd>{activeLot.lat.toFixed(6)}, {activeLot.lon.toFixed(6)}</dd></div><div><dt>Walking estimate</dt><dd>{activeLot.walk}</dd></div></dl>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${activeLot.lat},${activeLot.lon}`} target="_blank" rel="noreferrer">Open turn-by-turn directions →</a>
        </div>
      </div>}

      <section className="darkSection" id="how">
        <div className="shell">
          <div className="sectionHead inverted"><div><span className="kicker">THE PRODUCT</span><h2>Useful information.<br />No guesswork.</h2></div><p>The prototype combines an understandable student workflow with the data plan Parking Services would need for a future operational trial.</p></div>
          <div className="featureGrid">
            <article><span>01</span><h3>Check demand</h3><p>View expected spaces, occupancy, and search time for a selected arrival.</p></article>
            <article><span>02</span><h3>Plan the trip</h3><p>Receive a simple recommendation before entering the busy campus corridor.</p></article>
            <article><span>03</span><h3>Learn from flow</h3><p>Future integration can combine PARCS counts, lane movement, and historical patterns.</p></article>
          </div>
        </div>
      </section>

      <section className="section shell evidence" id="pilot">
        <div className="evidenceCopy"><span className="kicker">WHY THIS PILOT</span><h2>A focused test,<br />grounded in campus operations.</h2><p>Wayne State Parking & Transportation Services reported recurring local congestion Monday through Thursday from 3:00 to 5:30 PM around Anthony Wayne Drive and Warren Avenue. Structure 2 provides a specific, testable setting near State Hall.</p><p>The department also identified real-time occupancy, historical demand, lane flow, and behavior patterns as useful inputs for a future predictive approach.</p><div className="source">Stakeholder evidence: WSU Parking & Transportation Services correspondence, May 27, 2026.</div></div>
        <aside className="scopeCard"><span>PILOT SCOPE</span><h3>Manoogian Structure<br />(Parking Structure 2)</h3><dl><div><dt>Location</dt><dd>5150 Lodge Service Drive</dd></div><div><dt>Focus</dt><dd>Weekday afternoon arrival</dd></div><div><dt>User</dt><dd>Student or campus commuter</dd></div><div><dt>Current status</dt><dd>Interactive academic prototype</dd></div></dl></aside>
      </section>

      <section className="cta">
        <div className="shell ctaInner"><div><span>TAKE IT WITH YOU</span><h2>Scan before you park.</h2><p>Open the mobile experience and add Stallora to your home screen.</p></div><button className="button light" onClick={() => setModal("qr")}>Open QR poster <span>↗</span></button></div>
      </section>

      <footer className="shell"><div className="brand"><span className="logoMark"><span>S</span></span><span><strong>Stallora</strong><small>AI</small></span></div><p>Graduate academic pilot for campus parking prediction.</p><p>© 2026 Stallora AI</p></footer>

      <div className="assistantDock">
        {assistantOpen && <section className="assistantPanel" aria-label="Stallora AI assistant">
          <div className="assistantHead"><div><span className="assistantOrb">S</span><p><strong>Stallora Agent</strong><small>Parking decision assistant</small></p></div><button onClick={() => setAssistantOpen(false)}>×</button></div>
          <div className="assistantStatus"><i></i> PILOT AGENT ONLINE</div>
          <div className="agentMessage">{assistantReply}</div>
          <div className="quickPrompts"><button onClick={() => setAssistantReply("The best demonstrated arrival window is before 2:45 PM or after 5:45 PM.")}>Best arrival time</button><button onClick={() => setAssistantReply(`At ${arrival}, Structure 2 is forecast to have ${forecast.spaces} spaces with an estimated ${forecast.wait} search.`)}>Check my arrival</button></div>
          <form onSubmit={askStallora}><input aria-label="Ask Stallora" value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} placeholder="Ask about Structure 2…" required /><button type="submit">→</button></form>
          <small className="agentDisclosure">AI-style demonstration using pilot forecast rules.</small>
        </section>}
        <button className="assistantLauncher" onClick={() => setAssistantOpen(!assistantOpen)}><span>S</span><p><strong>Ask Stallora</strong><small>AI parking assistant</small></p></button>
      </div>

      {modal && <div className="overlay" role="dialog" aria-modal="true" aria-label={modal === "login" ? "Sign in" : "QR poster"} onMouseDown={() => setModal(null)}>
        <div className={`modal ${modal === "qr" ? "posterModal" : ""}`} onMouseDown={(e) => e.stopPropagation()}>
          <button className="close" onClick={() => setModal(null)} aria-label="Close">×</button>
          {modal === "login" ? <>
            <span className="kicker">STALLORA ACCOUNT</span>
            <h2>{step === 1 ? "Start with your email" : step === 2 ? "Verify your mobile" : "You are ready"}</h2>
            <p>{step === 1 ? "Use your university email to save arrival plans and receive parking alerts." : step === 2 ? "Enter the six-digit demonstration code shown below." : "Your demonstration profile is now connected to this device."}</p>
            <form onSubmit={submitLogin}>
              {step === 1 && <><label htmlFor="email">University email</label><input id="email" type="email" required placeholder="name@wayne.edu" value={email} onChange={(e) => setEmail(e.target.value)} /></>}
              {step === 2 && <><label htmlFor="phone">Mobile number</label><input id="phone" type="tel" required placeholder="+1 (___) ___-____" /><label htmlFor="code">Verification code</label><input id="code" inputMode="numeric" required pattern="[0-9]{6}" defaultValue="246810" /></>}
              {step < 3 && <button className="button primary full" type="submit">{step === 1 ? "Continue" : "Verify code"}</button>}
            </form>
            {notice && <div className="formNotice">{notice}</div>}
            <small className="demoNote">Demonstration flow only. No email or SMS is sent and no personal information is stored.</small>
          </> : <div className="poster">
            <div className="posterBrand"><div className="logoMark"><span>S</span></div><strong>Stallora <i>AI</i></strong></div>
            <span className="posterTag">STRUCTURE 2 PILOT</span><h2>Scan before<br />you park.</h2><p>Check predicted availability and plan around the weekday rush.</p>
            <div className="qrWrap"><img src={`https://quickchart.io/qr?text=${encodeURIComponent(appUrl)}&size=260&margin=1`} alt="QR code to open Stallora AI" /><span>OPEN STALLORA</span></div>
            <small>Academic prototype · Wayne State University pilot context</small>
          </div>}
        </div>
      </div>}
    </main>
  );
}
