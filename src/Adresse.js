import React from 'react'

export default function Adresse() {

    // React.useEffect( () => {
    //     getCoordinates()

    
    
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
       // curl "https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port"
    }


  return (
    <span>
    <h1>Mon adresse</h1>
    <input id="adresse" type="text" onChange={autofillAdress} ></input>
    <button >Trouver la source</button>
    
    </span>

   

  )
}
