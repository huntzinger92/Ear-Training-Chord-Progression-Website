//right now, code doesn't work. You need to add a promise to the handleClick method that will call renderMusic and then playMusic after it is finished, same with the getChords method and calling
//renderMusic and THEN playMusic from there. In this way, you can always only play music from a click.
//second, right now you are altering this.state.chords if the inversion rule is changed, allowing user to A|B a chord progression with different rules. However, this isn't reflected in audio
//playback. You need to figure how to make altered chord list make it to audioElements

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
      type: 'major', //major or minor. will be used to determine which soundbank/filepath to use
      chords: [], //list of chosen chords (objects from soundbank var)
      transpositions: true, //enable random transposition logic
      inversions: true, //enable inversion logic (will just do root for everything on false)
      sevenths: false, //choose from seventh chord soundbank
      loop: false, //automatically loop chords until unchecked
      amount: 2, //amount of chords to be heard by user, selected with radio button
      init: true, //if chords have not been gotten yet, useful to ensure "hear chord" button both generates chords on first click and replays them on second click
      play: false //must be true for music to play on update (keep it false when you want user to adjust settings without playing music)
    };
    this.renderMusic = this.renderMusic.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.getChords = this.getChords.bind(this);
    this.handleClick = this.handleClick.bind(this); //called when "hear chords" button is pressed
    this.handleLoop = this.handleLoop.bind(this);
    this.handleInversions = this.handleInversions.bind(this);
    this.handleTranspositions = this.handleTranspositions.bind(this);
    this.playMusic = this.playMusic.bind(this);
    //variables with "global" access (within component)
    this.audioContext = new AudioContext();
    this.audioElements = []; //to be played within audio context
    this.audioTags = []; //list of all audioTags generated (passed via inline callback ref, which includes nulls in some instances, filtered out on processing);
    //this.intervalID = ''; //used to call playMusic repeatedly
    this.count = 0; //count will be used to keep track of how many chords have played, function playMusic clears intervalID when count === this.state.amount
  };

  componentDidUpdate() {
    //console.log('update');
    //idea is that, when play is true, audioTags will only have a truthy value on button press. This isn't ideal, seek a better solution at some point.
    if (this.audioTags && this.state.play) {
      //console.log('this.audioTags:');
      //console.log(this.audioTags);
      this.renderMusic();
    };
  };

  handleTypeChange(e) {
    this.audioElements = []; //clearing audio refs for next set of chords
    if (typeof e.target.value === 'string') {
      this.setState({
        type: e.target.value,
        init: true,
        play: false
      });
    } else {
      this.setState({
        type: 'major', //the actual type in music theory terms is modal, however we will be using the soundbank chords from the major key folder, which is the purpose here
        shift: e.target.value, //for renaming the chords later (dorian will need to make the 2 chord the 1 chord, all other chords shift accordingly)
        init: true,
        play: false
      });
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

  handleClick() { //specifically, "hear chords" button click
    this.setState({
      play: true
    });
    //you've decided you only want one button to hear chords - if chords have already been chosen, simply renderMusic. Else, pick chords (which will then call the renderMusic function indirectly)
    //console.log('this.audioElements:');
    //console.log(this.audioElements);
    if (this.state.init && (this.audioElements.length < 1)) { //if this.state.init is true and if there are NO audio refs
      //this.audioElements.stop(); <-- you are probably going to need something like the .stop() method from https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode
      console.log('getting chords');
      this.getChords();
    } else { //either replaying the original chords, or if init is true but we are already have a set a chords (rule change, such as inversions becoming prohibited), renderMusic is called
      console.log('trying to render existing chords');
      this.renderMusic(); //note that if init and we already have a set of chords, renderMusic will rewrite audio (allowing inversions or not)
    };

  };

  handleLoop() {
    //console.log('this.state.loop should become the opposite of:');
    //console.log(this.state.loop);
    this.setState({
      loop: !this.state.loop
    });
  };

  handleInversions() {
    if (!this.state.inversions && (this.state.chords.length > 0) { //if inversions have just been allowed and we already have chords
      var chordList = this.state.chords; //semantically easier and will not alter or reference state directly for processing
      for (var i = 1; i < chordList.length; i++) { //redo chord list to accomodate inversions. Allows the user to hear same chord progression with different settings
        if ((chordList[i].root.value - chordList[i-1].value) <= (chordList[i].inverted.value - chordList[i - 1].value)) {
          chordList[i].src = chordList[i].chordList.src;
          chordList[i].value = chordList[i].chordList.value;
        } else {
          chordList[i].src = chordList[i].inverted.src;
          chordList[i].value = chordList[i].inverted.value;
        };
      };
      this.setState({
        chords: chordList
      });
    } else if (this.state.inversion && this.state.chords) { //if inversions have just been prohibited and we already have chords
      var chordList = this.state.chords;
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

  handleTranspositions() {
    console.log('does nothing right now');
  };

  getChords() {
    var tempChordHolder = [soundbank[0]]; //if you want to include the modal functionality, should be simple as making this initial chord dependent on state
    tempChordHolder[0].src = tempChordHolder[0].root.src; //initialize first chord with root position and value
    tempChordHolder[0].value = tempChordHolder[0].root.value;
    for (var i = 0; i < this.state.amount - 1; i++) {
      var rand = soundbank[Math.floor(Math.random() * 7)]; //choose random chord from soundbank. Will have to use filter to include all UI options later (LATER FFS NOT NOW PLEASE)
      //finding the min between root and inv, achieving the smoother voice leading
      if (this.state.inversion) { //if inversions are allowed, calculate better voice leading
        if ((rand.root.value - tempChordHolder[tempChordHolder.length - 1].value) <= (rand.inverted.value - tempChordHolder[tempChordHolder.length - 1].value)) {
          rand.src = rand.root.src;
          rand.value = rand.root.value;
        } else {
          rand.src = rand.inverted.src;
          rand.value = rand.inverted.value;
        };
      } else { //if not inversions are allowed, simply use root position
        rand.src = rand.root.src;
        rand.value = rand.root.value; //probably unnecessary, since values only matter for voice leading, but kept just to be as consistent as possible
      };
      tempChordHolder.push(rand);
    };
    //console.log('tempChordHolder list:');
    //console.log(tempChordHolder);
    this.setState({
      chords: tempChordHolder
    });
    this.renderMusic();
  };

  renderMusic() {
    this.setState({
      play: false
    });

    if (this.state.init) {
      console.log('init is true');
      for (let audio of this.audioTags) {
        console.log('the looping works');
        if (audio) { //we have to clear out null audio values because React will pass nulls as refs on re-renders, seems unavoidable at the moment
          this.audioElements.push(audio);
          if (!audio.captureStream()) {  //effectively: if audio does not already have a source
            var track = this.audioContext.createMediaElementSource(audio);
            track.connect(this.audioContext.destination);
          };
        };
      };

    //if (this.state.init) {
      //console.log('this.audioTags (should have audio refs):');
      //console.log(typeof this.audioTags);
      //console.log(this.audioTags);
      //console.log(this.audioTags.length);
      //var testObj = {1: 'one', 2: 'two', 3: 'three'};
      //console.log('testObj:');
      //console.log(typeof testObj);
      //console.log(testObj);
      //this.audioElements = []; //clearing audio elements to redo audio. Redundant in some cases, but probably inexpensive
      //for (var i = 0; i < this.audioTags.length; i++) {
        //console.log('what the f');
        //if (this.audioTags[i]) {
          //console.log(this.audioTags[i]);
          //if (!this.audioTags[i].captureStream()) {
            //var track = this.audioContext.createMediaElementSource(this.audioTags[i]);
            //track.connect(this.audioContext.destination);
          //};
          //this.audioElements.push(this.audioTags[i]);
        //};
      //};
    };
      //for (let audio of this.audioTags) {
        //console.log(audio);
        //if (audio) { //we have to clear out null audio values because React will pass nulls as refs on re-renders, seems unavoidable at the moment

          //this.audioElements.push(audio);
          //if (!audio.captureStream()) {  //effectively: if audio does not already have a source
            //var track = this.audioContext.createMediaElementSource(audio);
            //track.connect(this.audioContext.destination);
          //};
        //};
      //};
      //console.log('for loop that pushes elements to this.audioElements has finished:');
      //console.log(this.audioElements);
    this.setState({
      init: false
    });
    console.log('this.audioElements (should have stuff): ');
    console.log(this.audioElements);
    //console.log('setting interval that calls playMusic, should happen every click');
    //this.intervalID = setInterval(this.playMusic, 1560, this.state.amount);
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
      this.count = 0;
      if (this.state.loop) {
        //console.log('should be hit when this.state.loop is true');
        this.playMusic(this.state.amount);
      };
    } else if (this.count >= 0) {
      //console.log('playing this audio element: ');
      //console.log(this.audioElements[this.count]);
      this.audioElements[this.count].play();
      this.count++;
      setTimeout(this.playMusic, 1550, this.state.amount);
    } else {
      console.log('this.count is less than 0. This is bad.');
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
            <input type="checkbox" id="allow-seventh-chords" name="allow-seventh-chords"></input>
            <label htmlFor="allow-seventh-chords">Use Seventh Chords</label>
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
