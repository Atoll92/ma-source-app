import React from 'react';
import { useState } from 'react';

const Nappe = () => {

    const [nappes_array, setNappes_List] = useState([]);

    async function getNappesLevels() {
		// console.log("getStationPCFromCodeStationBatched paramters (code_station) :")
		// console.log(code_station_batch)
		const nappes = await fetch("https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/chroniques_tr"); //TODO, we can call api with up to 200 code station at a time so we should definetely do that
		const nappes_levels_tr = await nappes.json();

        // const nappes_names = await fetch()

        const nappesList = nappes_levels_tr.data.map((nappe) =>
  <li key={nappe.id}>
    {nappe.bss_id}<br/>
    {nappe.niveau_eau_ngf}<br/>
    {nappe.profondeur_nappe}<br/>
    {(nappe.niveau_eau_ngf)/(nappe.profondeur_nappe)*100}<br/>
  </li>
);
		// console.log("station_pc.data at the end of getStationPCFromCodeStationBatched :");
		console.log(nappes_levels_tr.data);
        console.log(nappes_levels_tr.data[0].niveau_eau_ngf)
        setNappes_List(nappesList)
        console.log("nappes_array:");
        console.log([nappes_array]);
		return nappes_levels_tr.data;
        // return nappesList
	}
    
    return (
        <div>
            <h1>Welcome to Nappe</h1>
            <button onClick={getNappesLevels}>search</button>
            {/* <p>[{nappes_array}]</p> */}
            <ul>{nappes_array}</ul>
            <p>
        {/* {UDI.map((udi, i) => (
          <span
            style={{ height: "350px", width: "350px" }}
            key={i}
            onClick={() => display_results(udi.code_reseau)}
          >
            {" "}
            quartier: {udi.nom_quartier} réseau: {udi.nom_reseau} code réseau:
            {udi.code_reseau} String()
            <br />
          </span>
        ))} */}
      </p>
        </div>
    );
};

export default Nappe;