import React, { useState } from 'react'

export default function Adresse() {

    // React.useEffect( () => {
    //     getCoordinates()

    const [UDI, setUDI_List] = useState([])
    const [quali, setQuali] = useState("")
    
    // }, [])

    async function autofillAdress(event) {
        getCoordinates(event.target.value);
    }

    async function getCoordinates(adresse){
        console.log(adresse)
        const adresse_result = await fetch('https://api-adresse.data.gouv.fr/search/?q=' + adresse + '&autocomplete=1&pretty');
        const geo_result = await adresse_result.json();
        console.log(geo_result);
        console.log(geo_result.features[0].geometry.coordinates[0])
        console.log(geo_result.features[0].geometry.coordinates[1])
        console.log(geo_result.features[0].properties.citycode)
        var code_commune = (geo_result.features[0].properties.citycode)
        const UDIs = await fetch('https://hubeau.eaufrance.fr/api//vbeta/qualite_eau_potable/communes_udi?code_commune=' + code_commune + '&autocomplete=1&pretty');
        const UDI_List = await UDIs.json();
        console.log(UDI_List)
        setUDI_List(UDI_List.data)
       // curl "https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port"
    }

    async function display_results(code_reseau) {

      setQuali("Chargement...")
      const reseau_results = await fetch('https://hubeau.eaufrance.fr/api//vbeta/qualite_eau_potable/resultats_dis?code_reseau=' + code_reseau + '&autocomplete=1&pretty');
      const resultats = await reseau_results.json();
      console.log(resultats.data[0].conclusion_conformite_prelevement)

      setQuali(resultats.data[0].conclusion_conformite_prelevement)


    }




  return (
    <span>
    <h1>Mon adresse</h1>
    <input id="adresse" type="text" onChange={autofillAdress} ></input>
    <button >Trouver la source</button>
    <p>
      {UDI.map((udi, i) =>
      <span key={i} onClick={() => display_results(udi.code_reseau)}> quartier: {udi.nom_quartier} réseau: {udi.nom_reseau} code réseau:{udi.code_reseau}<br/></span>  )}
    </p>

    <p>{quali}</p>

    </span>

   

  )
}
