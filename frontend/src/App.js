import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import * as content from './data/content.json';
import './App.css';

function App() {
  return (
    <div className="App">
        
        <Map center = {[-27.594870, -48.548222]} zoom={12}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
            <Marker 
              //key={content.sentences[1].locations[0].loc.state[0]}
              position={[
                content.sentences[1].locations[0].loc.coordinates[0],
                content.sentences[1].locations[0].loc.coordinates[1]
              ]}
            />
           {content.sentences.locations.map(sentence => (
            <Marker 
              //key={sentence.state} 
              position={[
                sentence.loc.coordinates[0],
                sentence.loc.coordinates[1]
                ]}
            />
          ))}
        </Map>
      
    </div>
  );
}

export default App;
