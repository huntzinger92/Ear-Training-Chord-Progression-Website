//add logic that establishes good voice leading, figure out how to clear context connections on reset (currently done by radio buttons)

import React from 'react';
import ReactDOM from 'react-dom';
const AudioContext = window.AudioContext || window.webkitAudioContext; //note that window.webkit is supposed to be for Safari

//all samples 1.56 sec (whole notes at 154 bpm), C and D in 1st inv higher, E - A second inversion, Bdim first inversion
var soundbank = [
  {
    name: 'I',
    class: 'triad',
    root: {
        value: 0,
        src: './chords/Cmaj_root.mp3'
      },
    inverted: {
      value: 4,
      src: './chords/Cmaj_inv.mp3'
      }
  },
  {
    name: 'ii',
    class: 'triad',
    root: {
        value: 2,
        src: './chords/Dmin_root.mp3'
      },
    inverted: {
      value: 5,
      src: './chords/Dmin_inv.mp3'
      }
  },
  {
    name: 'iii',
    class: 'triad',
    root: {
        value: 4,
        src: './chords/Emin_root.mp3'
      },
    inverted: {
      value: -1,
      src: './chords/Emin_inv.mp3'
      }
  },
  {
    name: 'IV',
    class: 'triad',
    root: {
        value: 5,
        src: './chords/Fmaj_root.mp3'
      },
    inverted: {
      value: 0,
      src: './chords/Fmaj_inv.mp3'
      }
  },
  {
    name: 'V',
    class: 'triad',
    root: {
        value: 7,
        src: './chords/Gmaj_root.mp3'
      },
    inverted: {
      value: 2,
      src: './chords/Gmaj_inv.mp3'
      }
  },
  {
    name: 'vi',
    class: 'triad',
    root: {
        value: -3,
        src: './chords/Amin_root.mp3'
      },
    inverted: {
      value: 4,
      src: './chords/Amin_inv.mp3'
      }
  },
  {
    name: 'vii°',
    class: 'triad',
    root: {
        value: -1,
        src: './chords/Bdim_root.mp3'
      },
    inverted: {
      value: 2,
      src: './chords/Bdim_inv.mp3'
      }
  },
];

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chords: [], //list of chosen chords (objects from soundbank var)
      amount: 0, //amount of chords to be heard by user, selected with radio button
      init: true //if chords have not been gotten yet, useful to ensure "hear chord" button both generates chords on first click and replays them on second click
    };
    this.renderMusic = this.renderMusic.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.getChords = this.getChords.bind(this);
    this.setRef = this.setRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.playMusic = this.playMusic.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    //variables with "global" access (within component)
    this.audioContext = new AudioContext();
    this.audioElements = []; //to be played within audio context
    this.audioTags = []; //list of all audioTags generated (passed via callback ref);
    this.intervalID = '';
    this.count = 0; //count will be used to iterate over chord list until it reaches this.state.amount.
  };

  setRef(ref) {
    if (ref === null) {
      return null;
    };
    console.log('setRef: ');
    console.log(ref);
    this.audioTags.push(ref);
    //it's important to call renderMusic AFTER the refs are created, so that the audioElements can actually refer to the audio tags (stupid obv in hindsight...)
    //note that the only explicit call to setRef is in the .map function under the render section. This means renderMusic will get called over and over with multiple tags. May have to
    //ensure that this.renderMusic only gets called after .map is finished. Best way may be to run renderMusic when audioTags list is equal to this.state.amount - 1
    //console.log('this.audioTags.length: ' + this.audioTags.length);
    //console.log('this.state.amount: ' + this.state.amount);
    if (this.audioTags.length === Number(this.state.amount)) {
      this.renderMusic();
    };
  };

  componentWillUnmount() {
    console.log('componentWillUnmount');
  };

  handleAmountChange(e) {
    //updates the amount of chords user wants to hear (also responsible for rendering selected radio button correctly)
    //console.log('handleAmountChange');
    this.setState({
      amount: e.target.value,
      init: true
    });
  };

  handleClick() {
    //you've decided you only want one button to hear chords - if chords have already been chosen, simply renderMusic. Else, pick chords (which will then call the renderMusic function indirectly)
    //console.log('handleClick');
    this.audioTags = []; //this clears audioTags for the reset, not needed after initial run of renderMusic
    if (!this.state.init) {
      //this.audioElements.stop(); <-- you are probably going to need something like the .stop() method from https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode
      this.renderMusic();
    } else {
      this.getChords();
    };
  };

  getChords() {
    //eventually, this will be where the logic goes to select what chords will be chosen for this question in the test.
    //console.log('getChords');
    var tempChordHolder = [soundbank[0]];
    for (var i = 0; i < this.state.amount - 1; i++) {
      tempChordHolder.push(soundbank[Math.floor(Math.random() * 7)]);
    };
    //console.log('tempChordHolder list:');
    //console.log(tempChordHolder);
    //when choosing chords, each chord name will need to be stored in state. as each chord is chosen, .push to tempChordHolder, then set whole list as chords setState
    this.setState({
      chords: tempChordHolder
    });
  };

  renderMusic() {
    //console.log('renderMusic');
    //console.log('this.state.chords: ');
    //console.log(this.state.chords);
    //eventually the following will need to be a loop that does the task iteratively
    //console.log(this.audioTags);
    if (this.state.init) {
      //console.log('audioElements:');
      //console.log(audioElements);
      for (let audio of this.audioTags) {
        //console.log('iterating over audioTags. Current value: ');
        //console.log(audio);
        this.audioElements.push(audio);
        var track = this.audioContext.createMediaElementSource(audio);
        track.connect(this.audioContext.destination);
      };
      this.setState({
        init: false
      });
    };
    //console.log('this.audioElements: ');
    //console.log(this.audioElements);
    //console.log('audiocontext:');
    //console.log(this.audioContext);
    if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    };

    //console.log('setting interval that calls playMusic, should happen every click');
    //this.playMusic(this.state.amount);
    this.playMusic(this.state.amount);
  };

  playMusic(total) {
    //console.log('this.audioElements inside playMusic: ');
    //console.log(this.audioElements);
    //console.log('this.count current value:' + this.count);
    //console.log('total for this.count to match: ' + total);
    //console.log('playMusic');
    if (this.count === Number(total)) {
      //console.log('total and this.count match');
      clearInterval(this.intervalID);
      this.count = 0;
    } else if (this.count > 0) {
      //console.log('playing this audio element: ');
      //console.log(this.audioElements[this.count]);
      this.audioElements[this.count].play();
      this.count++;
    } else {
      this.audioElements[0].play()
      this.count++;
      this.intervalID = setInterval(this.playMusic, 1560, this.state.amount);
    }
  };

  render() {
    return (
      <div>
        {console.log('JSX right before this.state.chords.map')}
        <h3>Press the button to begin the test</h3>
        <form>
          <div className="amount-button">
            <label>
              <input
              type="radio"
              name="chord-amount"
              value={1}
              checked={Number(this.state.amount) === 1}
              onChange={this.handleAmountChange}
              />
              1
            </label>
          </div>
          <div className="amount-button">
            <label>
              <input
              type="radio"
              name="chord-amount"
              value={2}
              checked={Number(this.state.amount) === 2}
              onChange={this.handleAmountChange}
              />
              2
            </label>
          </div>
          <div className="amount-button">
            <label>
              <input
              type="radio"
              name="chord-amount"
              value={3}
              checked={Number(this.state.amount) === 3}
              onChange={this.handleAmountChange}
              />
              3
            </label>
          </div>
          <div className="amount-button">
            <label>
              <input
              type="radio"
              name="chord-amount"
              value={4}
              checked={Number(this.state.amount) === 4}
              onChange={this.handleAmountChange}
              />
              4
            </label>
          </div>
        </form>
  		  <button id='hear-chords' onClick={this.handleClick}>Hear some chords</button>
        {this.state.chords.map((a, index) => {
          console.log('current object to become audio tag: ');
          console.log(a);
          return <audio key={index} className={a.name} src={a.root.src} ref={this.setRef}></audio>
        })}
      </div>
    );
  };
};

window.addEventListener('DOMContentLoaded', (event) => {
  ReactDOM.render(<Quiz />, document.getElementById('root'));
});
