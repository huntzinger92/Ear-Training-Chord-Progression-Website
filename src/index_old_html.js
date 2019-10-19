//begin adding UI for settings that select progression type (major, minor, both with sevenths), select tonic for modal stuff??, checkbox for which chords to allow
//will need to include logic to accomodate those UI options


import React from 'react';
import ReactDOM from 'react-dom';
const AudioContext = window.AudioContext || window.webkitAudioContext; //note that window.webkit is supposed to be for Safari

//all samples 1.56 sec (whole notes at 154 bpm), C and D in 1st inv higher, E - A second inversion, Bdim first inversion
var soundbank = [
  {
    name: 1,
    class: 'triad',
    quality: 'major',
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
    name: 2,
    class: 'triad',
    quality: 'minor',
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
    name: 3,
    class: 'triad',
    quality: 'minor',
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
    name: 4,
    class: 'triad',
    quality: 'major',
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
    name: 5,
    class: 'triad',
    quality: 'major',
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
    name: 6,
    class: 'triad',
    quality: 'minor',
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
    name: 7,
    class: 'triad',
    quality: 'diminished',
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


function intToChordName(chord) {
  //chord needs to be a chord object from soundbank
  var name = '';
  //get roman numeral (note: chord.name could have been saved as a roman numeral eventually, but as integers, I can do math that allows me to make different chords the tonic)
  if (chord.name === 1) {
    name = 'i';
  } else if (chord.name === 2) {
    name = 'ii';
  } else if (chord.name === 2) {
    name = 'iii';
  } else if (chord.name === 2) {
    name = 'iv';
  } else if (chord.name === 2) {
    name = 'v';
  } else if (chord.name === 2) {
    name = 'vi';
  } else if (chord.name === 2) {
    name = 'vii';
  }
  //produce correct nomenclature
  if (chord.quality === 'major') {
    name = name.toUpperCase();
  } else if (chord.quality === 'diminished') { //note we are skipping the minor triad case because the data fits that nomenclature by default
    name = name + '°';
  } else if (chord.quality === 'major 7th') {
    name = name.toUpperCase() + 'M7';
  } else if (chord.quality === 'dominant 7th') {
    name = name.toUpperCase() + '7';
  } else if (chord.quality === 'minor 7th') {
    name = name + 'm7';
  } else if (chord.quality === 'half diminished 7th') {
    name = name + 'ø7';
  } else if (chord.quality === 'fully diminished 7th') {
    name = name + '°7';
  }
  return name;
};

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chords: [], //list of chosen chords (objects from soundbank var)
      amount: 0, //amount of chords to be heard by user, selected with radio button
      init: true, //if chords have not been gotten yet, useful to ensure "hear chord" button both generates chords on first click and replays them on second click
      play: false //must be true for music to play on update (keep it false when you want user to adjust settings without playing music)
    };
    this.renderMusic = this.renderMusic.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.getChords = this.getChords.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.playMusic = this.playMusic.bind(this);
    //variables with "global" access (within component)
    this.audioContext = new AudioContext();
    this.audioElements = []; //to be played within audio context
    this.audioTags = []; //list of all audioTags generated (passed via inline callback ref, which includes nulls in some instances, filtered out on processing);
    this.intervalID = ''; //used to call playMusic repeatedly
    this.count = 0; //count will be used to keep track of how many chords have played, function playMusic clears intervalID when count === this.state.amount
  };

  componentDidUpdate() {
    //console.log('update');
    if (this.audioTags && this.state.play) {
      //console.log('this.audioTags:');
      //console.log(this.audioTags);
      this.renderMusic();
    };
  };

  handleAmountChange(e) {
    //updates the amount of chords user wants to hear (also responsible for rendering selected radio button correctly)
    this.audioElements = []; //clearing audio refs for next set of chords
    this.setState({
      amount: e.target.value,
      init: true,
      play: false
    });
  };

  handleClick() {
    this.setState({
      play: true
    });
    //you've decided you only want one button to hear chords - if chords have already been chosen, simply renderMusic. Else, pick chords (which will then call the renderMusic function indirectly)

    if (!this.state.init) {
      //this.audioElements.stop(); <-- you are probably going to need something like the .stop() method from https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode
      this.renderMusic();
    } else {
      this.getChords();
    };
  };

  getChords() {
    var tempChordHolder = [soundbank[0]]; //if you want to include the modal functionality, should be simple as making this initial chord dependent on state
    tempChordHolder[0].src = tempChordHolder[0].root.src; //initialize first chord with root position and value
    tempChordHolder[0].value = tempChordHolder[0].root.value;
    for (var i = 0; i < this.state.amount - 1; i++) {
      var rand = soundbank[Math.floor(Math.random() * 7)]; //choose random chord from soundbank. Will have to use filter to include all UI options later (LATER FFS NOT NOW PLEASE)
      //finding the min between root and inv, achieving the smoother voice leading
      if ((rand.root.value - tempChordHolder[tempChordHolder.length - 1].value) <= (rand.inverted.value - tempChordHolder[tempChordHolder.length - 1].value)) {
        rand.src = rand.root.src;
        rand.value = rand.root.value;
      } else {
        rand.src = rand.inverted.src;
        rand.value = rand.inverted.value;
      }
      tempChordHolder.push(rand);
    };
    //console.log('tempChordHolder list:');
    //console.log(tempChordHolder);
    this.setState({
      chords: tempChordHolder
    });
  };

  renderMusic() {

    this.setState({
      play: false
    });

    if (this.state.init) {
      for (let audio of this.audioTags) {
        if (audio) { //we have to clear out null audio values because React will pass nulls as refs on re-renders, seems unavoidable at the moment
          this.audioElements.push(audio);
          if (!audio.captureStream()) {  //effectively: if audio does not already have a source
            var track = this.audioContext.createMediaElementSource(audio);
            track.connect(this.audioContext.destination);
          };
        };
      };

      this.setState({
        init: false
      });
    };
    //console.log('this.audioElements: ');
    //console.log(this.audioElements);
    if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    };
    //console.log('setting interval that calls playMusic, should happen every click');
    this.playMusic(this.state.amount);
  };

  playMusic(total) {
    //console.log('this.count current value:' + this.count);
    //console.log('total for this.count to match: ' + total);
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
    };
  };

  render() {
    //console.log('render');
    return (
      <div>
        <h3>Press the button to begin the test</h3>
        <form>
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
          //console.log('current object to become audio tag: ');
          //console.log(a);
          return <audio key={index} className={intToChordName(a)} src={a.src} ref={audio => this.audioTags[index] = audio}></audio>
        })}
      </div>
    );
  };
};

window.addEventListener('DOMContentLoaded', (event) => {
  ReactDOM.render(<Quiz />, document.getElementById('root'));
});
