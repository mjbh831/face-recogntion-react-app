import React from 'react';
import Tilt from 'react-tilt'
import './logo.css'
import brain from './brain.png';
 


const Logo = () => {

	return (
		<div className='ma4 mt0 center'>	
			{
			<Tilt className="Tilt br2 shadow-3" options={{ max : 45 }} style={{ height: 150, width: 150 }} >
			 	<div className="Tilt-inner pa4"><img style={{ width: '100%'}} src={brain} alt="brain logo"/></div>
			</Tilt>
			}
		</div>
	);
	
}

export default Logo;