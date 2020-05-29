import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import * as content from './data/content.json';
import './App.css';

function App() {
  const [activeContent, setActiveContent] = React.useState(null);
  return (
    <div className="App">
        
        <Map center = {[-27.594870, -48.548222]} zoom={12}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
            
           {content.locations.map(sentence => (
            <Marker 
              key={sentence.text} 
              position={[
                sentence.loc.coordinates[0],
                sentence.loc.coordinates[1]
                ]}
              onClick={() => {
                setActiveContent(sentence)
              }}
            />
          ))}

          {activeContent && 
          <Popup 
             position={[
                activeContent.loc.coordinates[0],
                activeContent.loc.coordinates[1]
                ]}
              onClose={() => {
                setActiveContent(null);
              }}
          > 
            <div>
              <h2>{activeContent.text}</h2>
            </div>
          </Popup>         
          }

        </Map>
      
    </div>
  );
}

export default App;
