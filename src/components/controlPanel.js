import React from 'react';
import './controlPanel.css';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

function controlPanel(props) {
    return (
        <div className="control-panel">
            <h3 className="legend_title">Instruction</h3>
            <p className="instru_text">You can click on individual pins for more details. To close details window, press ESC or click on the window</p>
            <p className="instru_text">The map is displaying daily confirmed cases</p>
            
            <h3 className="legend_title">Legend</h3>

            <div>
                <span className="icon">
                    <svg height = {22} viewBox="0 0 24 24" style = {{cursor: 'pointer', fill: 'red'}}><path d={ICON} /></svg>
                </span>
                <span className="text">&nbsp;&nbsp;confirmed &gt; 5000</span>
            </div>

            <div>
                <span className="icon">
                    <svg height = {22} viewBox="0 0 24 24" style = {{cursor: 'pointer', fill: 'orange'}}><path d={ICON} /></svg>
                </span>
                <span className="text">&nbsp;&nbsp;1000 &le; confirmed &lt; 5000</span>
            </div>

            <div>
                <span className="icon">
                    <svg height = {22} viewBox="0 0 24 24" style = {{cursor: 'pointer', fill: '#7754F2'}}><path d={ICON} /></svg>
                </span>
                <span className="text">&nbsp;&nbsp;500 &le; confirmed &lt; 1000</span>
            </div>

            <div>
                <span className="icon">
                    <svg height = {22} viewBox="0 0 24 24" style = {{cursor: 'pointer', fill: '#4287f5'}}><path d={ICON} /></svg>
                </span>
                <span className="text">&nbsp;&nbsp;100 &le; confirmed &lt; 500</span>
            </div>

            <div>
                <span className="icon">
                    <svg height = {22} viewBox="0 0 24 24" style = {{cursor: 'pointer', fill: '#00F9FF'}}><path d={ICON} /></svg>
                </span>
                <span className="text">&nbsp;&nbsp;50 &le; confirmed &lt; 100</span>
            </div>

            <div>
                <span className="icon">
                    <svg height = {22} viewBox="0 0 24 24" style = {{cursor: 'pointer', fill: '#ffffff'}}><path d={ICON} /></svg>
                </span>
                <span className="text">&nbsp;&nbsp;confirmed &lt; 50</span>
            </div>
        </div>
    )
}

export default controlPanel