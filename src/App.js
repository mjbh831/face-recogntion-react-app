import React, {Component} from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Particles from 'react-particles-js';
import Rank from './components/Rank/Rank';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register'


const app = new Clarifai.App({
 apiKey: '2a33cca5a44245d99831c62a43cb963d'
});


const particleOptions = {
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },  
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      }
    }
  }         
};

class App extends Component{

  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
          id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
      }
    }
  }

  componentDidMount(){
    fetch('http://localhost:3001')
    .then( response => response.json() )
    .then( console.log )
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(clarifaiFace);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onSubmit = () => {

    this.setState({imageURL: this.state.input})

        app.models
        .predict( 
          Clarifai.FACE_DETECT_MODEL,
          // URL
          this.state.input)
        .then(response => {
          if (response) {
            fetch('http://localhost:3001/image',{
              method: 'put',
              headers: { 'Content-type': 'application/json'},
              body: JSON.stringify({
                  id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })

          }
          this.displayFaceBox(this.calculateFaceLocation(response)) 
        })
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {

    

    if( route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if ( route === 'home') {
      this.setState({ isSignedIn: true })
    }

    this.setState({ route: route}); 
  }
       
    


  render() {

    const { isSignedIn, imageURL, route, box } = this.state;

    return (
        <div className="App">
          <Particles className='particles' params={particleOptions} />
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
          { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition box={box} imageURL={imageURL} />
            </div>
          : ( route === 'signin'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

            )
          }
          
          
        </div>
    );
  }
}
  

export default App;
