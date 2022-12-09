import React from 'react';

const Legende = () => {
    return (
        
            <div id="legende">
		<svg
	    viewBox="0 0 36 36"
	    xmlns="<http://www.w3.org/2000/svg>"
		>
				<circle
			cx="18" cy="18" r="4"
			strokeWidth="4" stroke="tomato"
			fill="tomato"
		/> <text  x="50%" y="50%" textAnchor="middle" fill="#fff" fontSize="3px" dy=".3em">Seuil non respecté </text>
    </svg>
	<svg
	    viewBox="0 0 36 36"
	    xmlns="<http://www.w3.org/2000/svg>"
		>
				<circle
			cx="18" cy="18" r="4"
			strokeWidth="4" stroke="seagreen"
			fill="seagreen"
		/> <text  x="50%" y="50%" textAnchor="middle" fill="#fff" fontSize="3px" dy=".3em">Seuil respecté </text>
    </svg>
	<svg
	    viewBox="0 0 36 36"
	    xmlns="<http://www.w3.org/2000/svg>"
		>
				<circle
			cx="18" cy="18" r="4"
			strokeWidth="4" stroke="slategrey"
			fill="slategrey"
		/> <text  x="50%" y="50%" textAnchor="middle" fill="#fff" fontSize="3px" dy=".3em">Absence de données</text>
    </svg>
		</div>
            
       
    );
};

export default Legende;