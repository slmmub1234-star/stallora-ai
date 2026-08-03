"use client";

import { useState } from "react";

const structures = [
  { name: "Structure 2", location: "5150 Lodge Service Drive", occupancy: 82, spaces: 76, status: "High demand" },
  { name: "Structure 5", location: "5501 Anthony Wayne Drive", occupancy: 64, spaces: 142, status: "Moderate" },
  { name: "Structure 1", location: "450 W. Palmer Avenue", occupancy: 51, spaces: 188, status: "Normal" },
];

export default function AdminDashboard() {
  const [selected, setSelected] = useState(0);
  const [incident, setIncident] = useState(false);
  const [message, setMessage] = useState("");
  const lot = structures[selected];

  function publishUpdate() {
    setMessage(`Pilot update published for ${lot.name}.`);
    window.setTimeout(() => setMessage(""), 2400);
  }

  return <main className="adminPage">
    <header className="adminTopbar">
      <a className="brand" href="/stallora-ai/"><span className="logoMark"><span>S</span></span><span><strong>Stallora</strong><small>AI</small></span></a>
      <div><span className="adminMode">ADMIN DEMO</span><a className="button ghost" href="/stallora-ai/">Return to commuter view</a></div>
    </header>
    <div className="adminShell">
      <aside className="adminSidebar"><span>OPERATIONS</span><button className="active">Overview</button><button>Structures</button><button>Forecasts</button><button>Alerts</button><button>Data quality</button><small>Academic administration prototype<br />Wayne State University context</small></aside>
      <section className="adminContent">
        <div className="adminTitle"><div><span className="kicker">PARKING OPERATIONS</span><h1>System overview</h1><p>Monitor pilot demand, review forecasts, and publish commuter guidance.</p></div><div className="systemOnline"><i></i><span><strong>Pilot system online</strong><small>Last refreshed just now</small></span></div></div>
        <div className="adminMetrics"><article><small>MONITORED LOCATIONS</small><strong>3</strong><span>Structures in demonstration</span></article><article><small>FORECASTED SPACES</small><strong>406</strong><span>Across monitored locations</span></article><article><small>HIGH-DEMAND AREAS</small><strong>1</strong><span>Structure 2 requires attention</span></article><article><small>MODEL CONFIDENCE</small><strong>86%</strong><span>Demonstration score</span></article></div>
        <div className="adminGrid">
          <section className="structureTable"><div className="panelTitle"><div><small>LIVE OPERATIONS VIEW</small><h2>Parking structures</h2></div><button onClick={publishUpdate}>Publish update</button></div>
            {structures.map((item,index)=><button key={item.name} onClick={()=>setSelected(index)} className={selected===index?"structureRow active":"structureRow"}><span><strong>{item.name}</strong><small>{item.location}</small></span><span><b>{item.occupancy}%</b><small>occupancy</small></span><span><b>{item.spaces}</b><small>spaces</small></span><span className={item.status==="High demand"?"statusPill high":"statusPill"}>{item.status}</span></button>)}
          </section>
          <aside className="controlPanel"><div className="panelTitle"><div><small>SELECTED LOCATION</small><h2>{lot.name}</h2></div></div><label>Demand condition<select defaultValue={lot.status}><option>Normal</option><option>Moderate</option><option>High demand</option></select></label><label>Operator note<textarea defaultValue="Monitor the weekday afternoon peak and recommend a later arrival when possible." /></label><label className="incidentSwitch"><input type="checkbox" checked={incident} onChange={(e)=>setIncident(e.target.checked)} /><span><strong>Operational incident</strong><small>Display an urgent commuter notice</small></span></label><button className="button dark" onClick={publishUpdate}>Save pilot settings</button>{message&&<p className="adminSuccess">✓ {message}</p>}</aside>
        </div>
        <div className="adminDisclosure">This administrative interface demonstrates the intended operating workflow. Values are synthetic and no university systems are modified.</div>
      </section>
    </div>
  </main>;
}
