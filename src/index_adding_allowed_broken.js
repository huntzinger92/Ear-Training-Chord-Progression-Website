//you've added the logic to create a list of allowed chords
//change this.allowedChords to include entire chord object, then change random chord selection to come from this.allowedChords
//update "value" to reflect HIGHEST note, not LOWEST, you fucking chump

import React from 'react';
import ReactDOM from 'react-dom';
const AudioContext = window.AudioContext || window.webkitAudioContext; //note that window.webkit is supposed to be for Safari

//all samples 1.56 sec (whole notes at 154 bpm), C and D in 1st inv higher, E - A second inversion, Bdim first inversion
const soundbank = [
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
  } else if (chord.name === 3) {
    name = 'iii';
  } else if (chord.name === 4) {
    name = 'iv';
  } else if (chord.name === 5) {
    name = 'v';
  } else if (chord.name === 6) {
    name = 'vi';
  } else if (chord.name === 7) {
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
      //chordsAllowed: [], //which chords can be chosen from, as dictated by user
      transpositions: false,
      inversions: false,
      sevenths: false,
      loop: false,
      amount: 2, //amount of chords to be heard by user, selected with radio button
      init: true, //if chords have not been gotten yet, useful to ensure "hear chord" button both generates chords on first click and replays them on second click
      play: false //must be true for music to play on update (keep it false when you want user to adjust settings without playing music)
    };
    this.renderMusic = this.renderMusic.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.getChords = this.getChords.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTranspositions = this.handleTranspositions.bind(this);
    this.handleInversions = this.handleInversions.bind(this);
    this.handleSeventhChords = this.handleSeventhChords.bind(this);
    this.handleLoop = this.handleLoop.bind(this);
    this.handleChordAllowedChange = this.handleChordAllowedChange.bind(this);
    this.playMusic = this.playMusic.bind(this);
    //variables with "global" access (within component)
    this.audioContext = new AudioContext();
    this.audioElements = []; //to be played within audio context
    this.audioTags = []; //list of all audioTags generated (passed via inline callback ref, which includes nulls in some instances, filtered out on processing);
    this.intervalID = ''; //used to call playMusic repeatedly
    this.count = 0; //count will be used to keep track of how many chords have played, function playMusic clears intervalID when count === this.state.amount
    this.chordsAllowed = [];
  };

  componentDidUpdate() {
    //console.log('update');
    if (this.audioTags && this.state.play) { //this is not ideal, try to find a better way to do renderMusic
      //console.log('this.audioTags:');
      //console.log(this.audioTags);
      this.renderMusic();
    };
  };

  //HANDLERS FOR SETTING CHANGES

  handleAmountChange(e) {
    //updates the amount of chords user wants to hear (also responsible for rendering selected radio button correctly)
    this.audioElements = []; //clearing audio refs for next set of chords
    this.setState({
      amount: e.target.value,
      init: true,
      play: false,
      chords: [] //clearing out chords, which is important for the path of processing with handleClick
    });
  };

  handleTranspositions() {
    this.setState({
      transpositions: !this.state.transpositions
    });
  };

  handleInversions() {
    if (!this.state.inversions && (this.state.chords.length > 0)) { //if inversions have just been allowed and we already have chords
      var chordList = this.state.chords; //semantically easier and will not alter or reference state directly for processing
      //console.log('chordList (inversions have just been allowed): ');
      //console.log(chordList);
      for (var i = 1; i < chordList.length; i++) { //redo chord list to accomodate inversions. Allows the user to hear same chord progression with different settings
        if ((chordList[i].root.value - chordList[i-1].value) <= (chordList[i].inverted.value - chordList[i - 1].value)) {
          chordList[i].src = chordList[i].root.src;
          chordList[i].value = chordList[i].root.value;
        } else {
          chordList[i].src = chordList[i].inverted.src;
          chordList[i].value = chordList[i].inverted.value;
        };
      };
      this.setState({
        chords: chordList
      });
    } else if (this.state.inversions && (this.state.chords.length > 0)) { //if inversions have just been prohibited and we already have chords
      var chordList = this.state.chords;
      //console.log('chordList (inversions have just been prohibited): ');
      //console.log(chordList);
      for (var i = 1; i < chordList.length; i++) { //chord list is remade with root position instead
        chordList[i].src = chordList[i].root.src;
        chordList[i].value = chordList[i].root.value; //we probably don't need value when only using root position, but keeping it just to be consistent
      };
      this.setState({
        chords: chordList
      });
    };

    this.setState({
      inversions: !this.state.inversions,
      init: true
    });
  };

  handleSeventhChords() {
    this.setState({
      sevenths: !this.state.sevenths,
      chords: [] //clear out chords, automatically create new set
    });
    this.audioTags = [];
  };

  handleLoop() {
    //console.log('this.state.loop should become the opposite of:');
    //console.log(this.state.loop);
    this.setState({
      loop: !this.state.loop
    });
  };

  handleChordAllowedChange(e) {
    //console.log(e);
    //console.log(e.target.value);
    //console.log(e.target.checked);
    this.setState({ //clear out chords because we need a new set, set init to true for processing purposes elsewhere
      chords: [],
      init: true
    });

    var tempChord = soundbank.find(function(obj) {
      return obj.name === Number(e.target.value);
    });

    if (e.target.checked) { //if chord has been allowed, add it to the list of allowed chords
      this.chordsAllowed.push(tempChord);
    } else { //else (if chord has been forbidden), remove chord from allowed chords if it is currently in that list (it should always be in the list, just trying to accomodate any weirdness)
      //console.log('should run on uncheck');
      var index = this.chordsAllowed.indexOf(tempChord);
      //console.log('index of chord to remove: ' + index);
      if (index !== -1) {
        this.chordsAllowed.splice(index, 1);
      };
      //console.log('this.chordsAllowed:');
    };
    //console.log(this.chordsAllowed);
  };

  handleClick() {
    this.setState({
      play: true
    });
    //you've decided you only want one button to hear chords - if chords have already been chosen, simply renderMusic. Else, pick chords (which will then call the renderMusic function indirectly)

    if (this.state.chords.length > 0) {
      //this.audioElements.stop(); <-- you are probably going to need something like the .stop() method from https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode
      this.renderMusic();
    } else {
      this.getChords();
    };
  };

  getChords() {
    var tempChordHolder = [soundbank[0]]; //note: you will have to add processing later to do this for real - seventh or triad, accomodate modes, etc.
    tempChordHolder[0].src = tempChordHolder[0].root.src; //initialize first chord with root position and value
    tempChordHolder[0].value = tempChordHolder[0].root.value;
    for (var i = 0; i < this.state.amount - 1; i++) {
      var rand = this.allowedChords[Math.floor(Math.random() * this.allowedChords.length)]; //choose random chord from allowedChords, generated from handleChordAllowedChange
      //finding the min between root and inv, achieving the smoother voice leading
      if (this.state.inversions) {
        if ((rand.root.value - tempChordHolder[tempChordHolder.length - 1].value) <= (rand.inverted.value - tempChordHolder[tempChordHolder.length - 1].value)) {
          rand.src = rand.root.src;
          rand.value = rand.root.value;
        } else {
          rand.src = rand.inverted.src;
          rand.value = rand.inverted.value;
        };
      } else {
        rand.src = rand.root.src;
        rand.value = rand.root.value;
      };
      tempChordHolder.push(rand);
    };
    //console.log('tempChordHolder list:');
    //console.log(tempChordHolder);
    this.setState({
      chords: tempChordHolder
    });

  };

  renderMusic() {

    this.setState({ //why?
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

    //console.log('setting interval that calls playMusic, should happen every click');
    this.playMusic(this.state.amount);
  };

  playMusic(total) {
    if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    };
    //console.log('this.count current value:' + this.count);
    //console.log('total for this.count to match: ' + total);
    if (this.count === Number(total)) {
      //console.log('total and this.count match');
      //clearInterval(this.intervalID);
      this.count = 0;
      if (this.state.loop) {
        this.playMusic(this.state.amount);
      };
    } else if (this.count >= 0) {
      //console.log('playing this audio element: ');
      //console.log(this.audioElements[this.count]);
      this.audioElements[this.count].play();
      this.count++;
      setTimeout(this.playMusic, 1550, this.state.amount);
    } else {
      console.log('this.count is less than 0. Something terrible has happened.');
    };
  };

  render() {
    //console.log('render');
    return (
      <div>
        <h3>Press the button to begin the test</h3>
        <select onChange={this.handleTypeChange} id='type-selection'>
          <optgroup label='Keys'>
            <option value='major' defaultValue>Major</option>
            <option value='minor'>Minor</option>
          </optgroup>
          <optgroup label='Modes'>
            <option value={6}>Dorian</option>
            <option value={5}>Phrygian</option>
            <option value={4}>Lydian</option>
            <option value={3}>Mixolydian</option>
            <option value={2}>Aeolian</option>
            <option value={1}>Locrian</option>
          </optgroup>
        </select>
        <select onChange={this.handleAmountChange} id='amount-selection'>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4} defaultValue>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
        </select>
        <div id='allowed-selections'>
          <h3>Select which chords you want to allow (note that the one chord must be included):</h3>
          <input type='checkbox' id='allowed-section-1' checked disabled></input>
          <label htmlFor='allowed-selection-1'>1</label>
          <input type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={2} id='allowed-selection-2'></input>
          <label htmlFor='allowed-selection-2'>2</label>
          <input type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={3} id='allowed-selection-3'></input>
          <label htmlFor='allowed-selection-3'>3</label>
          <input type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={4} id='allowed-selection-4'></input>
          <label htmlFor='allowed-selection-4'>4</label>
          <input type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={5} id='allowed-selection-5'></input>
          <label htmlFor='allowed-selection-5'>5</label>
          <input type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={6} id='allowed-selection-6'></input>
          <label htmlFor='allowed-selection-6'>6</label>
          <input type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={7} id='allowed-selection-7'></input>
          <label htmlFor='allowed-selection-7'>7</label>
        </div>
        <div id='checkboxes'>
          <div className='checkbox'>
            <input type="checkbox" id="allow-transpositions" name="allow-transpositions" onChange={this.handleTranspositions}></input>
            <label htmlFor="allow-transpositions">Allow Transpositions</label>
          </div>
          <div className='checkbox'>
            <input type="checkbox" id="allow-inversions" name="allow-inversions" onChange={this.handleInversions}></input>
            <label htmlFor="allow-transpositions">Allow Inversions</label>
          </div>
          <div className='checkbox'>
            <input type="checkbox" id="use-seventh-chords" name="use-seventh-chords" onChange={this.handleSeventhChords}></input>
            <label htmlFor="use-seventh-chords">Use Seventh Chords</label>
          </div>
          <div className='checkbox'>
            <input type="checkbox" id="loop" name="loop" onChange={this.handleLoop}></input>
            <label htmlFor="loop">Loop Chord Playback</label>
          </div>
        </div>
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
