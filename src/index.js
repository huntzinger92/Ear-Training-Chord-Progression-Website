import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from "three";
import './index.css'

//all samples 1.56 sec (whole notes at 154 bpm), C and D in 1st inv higher, E - A second inversion, Bdim first inversion
const soundbank = [
  {
    name: 1,
    triad: {
      quality: 'major',
      root: {
          value: 7,
          src: './chords/Cmaj_root.mp3'
        },
      inverted: {
        value: 12,
        src: './chords/Cmaj_inv.mp3'
        }
    },
    seventh: {
      quality: 'major 7th',
      root: {
        value: 11,
        src: './chords/major_seventh_chords/Cmaj7_root.mp3'
      },
      inverted: {
        value: 7,
        src: './chords/major_seventh_chords/Cmaj7_root.mp3'
      }
    }
  },
  {
    name: 2,
    triad: {
      quality: 'minor',
      root: {
        value: 9,
        src: './chords/Dmin_root.mp3'
      },
      inverted: {
        value: 14,
        src: './chords/Dmin_inv.mp3'
        }
    },
    seventh: {
      quality: 'minor 7th',
      root: {
        value: 12,
        src:'./chords/major_seventh_chords/Dm7_root.mp3'
      },
      inverted: {
        value: 5,
        src:'./chords/major_seventh_chords/Dm7_inv.mp3'
      }
    }
  },
  {
    name: 3,
    triad: {
      quality: 'minor',
      qualityMinor: 'major',
      root: {
          value: 11,
          src: './chords/Emin_root.mp3',
          srcMinor: './chords/Emaj_root.mp3'
        },
      inverted: {
        value: 7,
        src: './chords/Emin_inv.mp3',
        srcMinor: './chords/Emaj_inv.mp3'
        }
    },
    seventh: {
      quality: 'minor 7th',
      qualityMinor: 'dominant 7th',
      root: {
        value: 2,
        src:'./chords/major_seventh_chords/Em7_root.mp3',
        srcMinor: './chords/major_seventh_chords/E7_root.mp3'
      },
      inverted: {
        value: 7,
        src:'./chords/major_seventh_chords/Em7_inv.mp3',
        srcMinor: './chords/major_seventh_chords/E7_inv.mp3'
      }
    }
  },
  {
    name: 4,
    triad: {
      quality: 'major',
      root: {
          value: 12,
          src: './chords/Fmaj_root.mp3'
        },
      inverted: {
        value: 9,
        src: './chords/Fmaj_inv.mp3'
        }
    },
    seventh: {
      quality: 'major 7th',
      root: {
        value: 4,
        src: './chords/major_seventh_chords/Fmaj7_root.mp3'
      },
      inverted: {
        value: 9,
        src: './chords/major_seventh_chords/Fmaj7_inv.mp3'
      }
    }
  },
  {
    name: 5,
    triad: {
      quality: 'major',
      qualityMinor: 'diminished',
      root: {
          value: 2,
          src: './chords/Gmaj_root.mp3',
          srcMinor: './chords/Gsharpdim_root.mp3'
        },
      inverted: {
        value: 11,
        src: './chords/Gmaj_inv.mp3',
        srcMinor: './chords/Gsharpdim_inv.mp3'
        },
    },
    seventh: {
      quality: 'dominant 7th',
      qualityMinor: 'fully diminished 7th',
      root: {
        value: 5,
        src: './chords/major_seventh_chords/G7_root.mp3',
        srcMinor: './chords/major_seventh_chords/Gsharpfulldim_root.mp3'
      },
      inverted: {
        value: 11,
        src: './chords/major_seventh_chords/G7_inv.mp3',
        srcMinor: './chords/major_seventh_chords/Gsharpfulldim_inv.mp3'
      }
    }
  },
  {
    name: 6,
    triad: {
      quality: 'minor',
      root: {
          value: 4,
          src: './chords/Amin_root.mp3'
        },
      inverted: {
        value: 12,
        src: './chords/Amin_inv.mp3'
        }
    },
    seventh: {
      quality: 'minor 7th',
      root: {
        value: 7,
        src: './chords/major_seventh_chords/Am7_root.mp3'
      },
      inverted: {
        value: 12,
        src: './chords/major_seventh_chords/Am7_inv.mp3'
      }
    }
  },
  {
    name: 7,
    triad: {
      quality: 'diminished',
      root: {
          value: 5,
          src: './chords/Bdim_root.mp3'
        },
      inverted: {
        value: 11,
        src: './chords/Bdim_inv.mp3'
        }
    },
    seventh: {
      quality: 'half diminished 7th',
      root: {
        value: 9,
        src: './chords/major_seventh_chords/Bhalfdim7_root.mp3'
      },
      inverted: {
        value: 2,
        src: './chords/major_seventh_chords/Bhalfdim7_inv.mp3'
      }
    }
  }
];

function intToChordName(chord) {
  //chord needs to be a chord object from soundbank
  var name = '';
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
  };
  return name;
};

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chords: [], //list of chosen chords (objects from soundbank var)
      transpositions: false,
      inversions: false,
      chordClass: 'triad', //triad or seventh, see soundbank chord object props and relevant logic in getChords
      allowedList: [1], //keeps track of which chords are allowed, accomodating for mode change, used in handleTypeChange to recalculate allowed chords
      stop: false, //when this is true, stops any playback on next chord, set to true when chords are cleared out or stop button pressed, set to false when play
      loop: false,
      minor: false, //true only with tonal minor, not minor modes, indicates use of altered 5 and 7 chords
      modal: 0, //integer with which to rename chords (in Dorian, two becomes the one, etc.)
      amount: 2, //amount of chords to be heard by user, selected with dropdown
      init: true, //if chords have not been gotten yet, useful to ensure "hear chord" button both generates chords on first click and replays them on second click
      play: false, //must be true for music to play on update (keep it false when you want user to adjust settings without playing music)
      displayPossible: false
    };
    this.renderMusic = this.renderMusic.bind(this);
    this.getChords = this.getChords.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleTranspositions = this.handleTranspositions.bind(this);
    this.handleInversions = this.handleInversions.bind(this);
    this.handleSeventhChords = this.handleSeventhChords.bind(this);
    this.handleLoop = this.handleLoop.bind(this);
    this.handleChordAllowedChange = this.handleChordAllowedChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleGetNewChords = this.handleGetNewChords.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleDisplayPossible = this.handleDisplayPossible.bind(this);
    this.playMusic = this.playMusic.bind(this);
    //variables with "global" access (within component)
    this.timeout = 0; //id to hold timeout on playMusic calls, to be cleared on this.state.stop (note: just initialized with an integer, used as a timeout object)
    this.listener = new THREE.AudioListener();
    this.sound = 0; //used to temporarily hold each chord to be played (need access within playMusic and componentDidUpdate)
    this.detuneValue = 0; //used to detune audio to enable transpositions
    this.count = 0; //count will be used to keep track of how many chords have played, function playMusic clears intervalID when count === this.state.amount
    this.chordsAllowed = [soundbank[0]];
  };

  componentDidUpdate() {
    if (this.state.chords.length === Number(this.state.amount) && this.state.play) { //if there are the correct amount of generated chords and play is set to true
      this.renderMusic();
    };
    if (this.state.stop) {
      if (this.sound) {
        this.sound.stop();
      };
      if (this.timeout) {
        clearTimeout(this.timeout); //stops the playMusic cycle
      };
      this.count = 0; //in case music is stopped before completing cycle in playMusic, on next play start from first chord
      this.setState({
        stop: false
      });
    };
  };

  //HANDLERS FOR SETTING CHANGES

  handleTypeChange(e) {
    var tempAllowedList = this.state.allowedList; //ensure global access within function
    var modal;
    if (e.target.value === 'major') {
      this.setState({
        modal: 0,
        minor: false,
        chords: [],
        init: true,
        stop: true
      });
      modal = 0;
    } else if (e.target.value ==='minor') {
      this.setState({
        modal: 2,
        minor: true,
        chords: [],
        init: true,
        stop: true
      });
      modal = 2;
    } else {
      this.setState({
        modal: Number(e.target.value),
        minor: false,
        chords: [],
        init: true,
        stop: true
      });
      modal = Number(e.target.value);
    };
    this.chordsAllowed = []; //remove all previous chords and make new allowed list with respect to new mode

    for (var i = 0; i < tempAllowedList.length; i++) {
      var tempChord = {};
      Object.assign(tempChord, soundbank.find(function(obj) { //deep copy of object is necessary so you aren't altering the original soundbank
        var tempName = (tempAllowedList[i] + 7 - modal) % 7; //converts the number chord with respect to new tonic to the "originally named" chord as held in soundbank
        if (tempName === 0) {
          tempName = 7;
        };
        return obj.name === tempName;
      }));
      tempChord.name = tempAllowedList[i];
      this.chordsAllowed.push(tempChord);
    };
  };

  handleAmountChange(e) {
    this.setState({
      amount: e.target.value,
      init: true,
      play: false,
      chords: [], //clearing out chords, note that this is important for the path of processing with handleClick
      stop: true
    });
  };

  handleTranspositions() {
    this.setState({
      transpositions: !this.state.transpositions
    });
  };

  handleInversions() {
    if (!this.state.inversions && (this.state.chords.length > 0)) { //if inversions have just been allowed and we already have chords
      var chordList = this.state.chords; //to avoid mutating state directly
      for (var i = 1; i < chordList.length; i++) { //redo chord list to accomodate inversions. Allows the user to hear same chord progression with different settings!
        if (Math.abs(chordList[i][this.state.chordClass].root.value - chordList[i-1].value) <= Math.abs(chordList[i][this.state.chordClass].inverted.value - chordList[i - 1].value)) {
          if (this.state.minor && (chordList[i].name === 7 || chordList[i].name === 5)) {
            chordList[i].src = chordList[i][this.state.chordClass].root.srcMinor;
            chordList[i].value = chordList[i][this.state.chordClass].root.value;
          } else {
            chordList[i].src = chordList[i][this.state.chordClass].root.src;
            chordList[i].value = chordList[i][this.state.chordClass].root.value;
          };
        } else {
          if (this.state.minor && (chordList[i].name === 7 || chordList[i].name === 5)) {
            chordList[i].src = chordList[i][this.state.chordClass].inverted.srcMinor;
            chordList[i].value = chordList[i][this.state.chordClass].inverted.value;
          } else {
            chordList[i].src = chordList[i][this.state.chordClass].inverted.src;
            chordList[i].value = chordList[i][this.state.chordClass].inverted.value;
          };
        };
      };
      this.setState({
        chords: chordList
      });
    } else if (this.state.inversions && (this.state.chords.length > 0)) { //if inversions have just been prohibited and we already have chords
      var chordList = this.state.chords;
      for (var i = 1; i < chordList.length; i++) { //chord list is remade with root position instead
        if (this.state.minor && (chordList[i].name === 7 || chordList[i].name === 5)) {
          chordList[i].src = chordList[i][this.state.chordClass].root.srcMinor;
          chordList[i].value = chordList[i][this.state.chordClass].root.value; //currently don't need to track value in the case of making all chords root position, but doing it just in case
        } else {
          chordList[i].src = chordList[i][this.state.chordClass].root.src;
          chordList[i].value = chordList[i][this.state.chordClass].root.value;
        };
      };
      this.setState({
        chords: chordList
      });
    };

    this.setState({
      inversions: !this.state.inversions,
    });
  };

  handleSeventhChords(e) {
    if (e.target.checked) {
      this.setState({
        chordClass: 'seventh',
        chords: [],
        init: true,
        stop: true
      });
    } else {
      this.setState({
        chordClass: 'triad',
        chords: [], //clear out chords, automatically create new set
        init: true,
        stop: true
      });
    };
  };

  handleLoop() {
    this.setState({
      loop: !this.state.loop
    });
  };

  handleChordAllowedChange(e) {
    this.setState({ //clear out chords because we need a new set, set init to true for processing purposes elsewhere
      chords: [],
      init: true,
      stop: true
    });

    var modal = this.state.modal;
    var tempChord = soundbank.find(function(obj) {
      var tempName = (obj.name + modal) % 7; //when users are using modes/minor, they will be selecting chord names with respect to a different one than how the names are saved in original soundbank
      if (tempName === 0) { //this code makes that adjustment (duplicated later in the getChords function)
        tempName = 7;
      };
      return tempName === Number(e.target.value);
    });

    var tempAllowedList = this.state.allowedList;

    if (e.target.checked) { //if chord has been allowed, add it to the list of allowed chords
      tempAllowedList.push(Number(e.target.value));
      this.setState({
        allowedList: tempAllowedList
      });
      var modal = this.state.modal;
      var tempChord = {};
      Object.assign(tempChord, soundbank.find(function(obj) { //deep copy, necessary to avoid mutating soundbank
        var tempName = (obj.name + modal) % 7; //when users are using modes/minor, they will be selecting chord names with respect to a different one than how the names are saved
        if (tempName === 0) {
          tempName = 7;
        };
        return tempName === Number(e.target.value);
      }));
      tempChord.name = Number(e.target.value); //chords in chordsAllowed are renamed with respect to mode - important for rendering correct name in QuizUI section
      this.chordsAllowed.push(tempChord);
    } else { //else if chord has been forbidden, remove chord from allowed chords
      var tempIndex = tempAllowedList.indexOf(Number(e.target.value));
      tempAllowedList.splice(tempIndex, 1);
      this.setState({
        allowedList: tempAllowedList
      });

      var tempChord = this.chordsAllowed.find(function(obj) {
        return obj.name === Number(e.target.value);
      });
      var index = this.chordsAllowed.indexOf(tempChord);
      if (index !== -1) { //avoiding errors if the disallowed chord was not in allowed list (should never happen, but handling the supposedly impossible case to avoid crashing can't hurt)
        this.chordsAllowed.splice(index, 1);
      };
    };
  };

  handleDisplayPossible() {
    this.setState({
      displayPossible: !this.state.displayPossible
    });
  };

  //SOUND BUTTONS

  handleClick() {
    this.setState({
      play: true,
      stop: false
    });
    if (this.state.chords.length > 0) {
      this.renderMusic();
    } else {
      this.getChords();
    };
  };

  handleGetNewChords() {
    this.setState({
      play: false,
      init: true,
      chords: [],
      stop: true
    });
  };

  handleStop() {
    this.setState({
      play: false,
      stop: true
    });
  };

  getChords() {
    var tempChordHolder = [{}];
    Object.assign(tempChordHolder[0], soundbank[(7 - this.state.modal) % 7]); //makes a deep copy to avoid mutating original soundbank
    tempChordHolder[0].name = 1; //initialize first chord with root position and value with name 1
    tempChordHolder[0].src = tempChordHolder[0][this.state.chordClass].root.src;
    tempChordHolder[0].value = tempChordHolder[0][this.state.chordClass].root.value;
    tempChordHolder[0].quality = tempChordHolder[0][this.state.chordClass].quality;

    for (var i = 0; i < this.state.amount - 1; i++) {
      var rand = {};
      Object.assign(rand, this.chordsAllowed[Math.floor(Math.random() * this.chordsAllowed.length)]); //choose random chord from allowedChords, generated from handleChordAllowedChange
      if (this.state.inversions) { //following code finds out which inversion of rand chord is closest to the previous chord in list
        if (Math.abs(rand[this.state.chordClass].root.value - tempChordHolder[tempChordHolder.length - 1].value) <= Math.abs(rand[this.state.chordClass].inverted.value - tempChordHolder[tempChordHolder.length - 1].value)) {
          rand.value = rand[this.state.chordClass].root.value;
          if (this.state.minor && (rand.name === 7 || rand.name === 5)) {
            rand.quality = rand[this.state.chordClass].qualityMinor;
            rand.src = rand[this.state.chordClass].root.srcMinor;
          } else {
            rand.src = rand[this.state.chordClass].root.src;
            rand.quality = rand[this.state.chordClass].quality;
          };
        } else {
          rand.value = rand[this.state.chordClass].inverted.value;
          if (this.state.minor && (rand.name === 7 || rand.name === 5)) {
            rand.quality = rand[this.state.chordClass].qualityMinor;
            rand.src = rand[this.state.chordClass].inverted.srcMinor;
          } else {
            rand.src = rand[this.state.chordClass].inverted.src;
            rand.quality = rand[this.state.chordClass].quality;
          };
        };
      } else {
        rand.value = rand[this.state.chordClass].root.value;
        if (this.state.minor && (rand.name === 7 || rand.name === 5)) {
          rand.quality = rand[this.state.chordClass].qualityMinor;
          rand.src = rand[this.state.chordClass].root.srcMinor;
        } else {
          rand.quality = rand[this.state.chordClass].quality;
          rand.src = rand[this.state.chordClass].root.src;
        };
      };
      tempChordHolder.push(rand);
    };

    this.setState({
      chords: tempChordHolder
    });
  };

  renderMusic() {
    this.setState({
      play: false
    });

    if (this.state.init) {
      if (this.state.transpositions) {
        this.detuneValue = (((Math.floor(Math.random() * 6)) - 3) * 100); //anywhere from -300 to +200 cents (3 half steps down to 2 half steps up)
      };
      this.setState({
        init: false
      });
    };
    this.playMusic(this.state.amount);
  };

  playMusic(total) {
    if (this.listener.context.state === 'suspended') {
      this.listener.context.resume();
    };

    if (this.count === Number(total)) {
      this.count = 0;
      if (this.state.loop) {
        this.playMusic(this.state.amount);
      }
    } else if (this.count >= 0 && !this.state.stop) {
      var url = this.state.chords[this.count].src;
      this.listener = new THREE.AudioListener();
      this.sound = new THREE.Audio(this.listener);
      if (this.state.transpositions) {
        this.sound.detune = this.detuneValue;
      };
      var tempSound = this.sound; //buffer code loses access to "this"
      var audioLoader = new THREE.AudioLoader();
      audioLoader.load(url, function(buffer) {
  	     tempSound.setBuffer(buffer);
  	     tempSound.play();
      });
      this.count++;

      if (this.state.transpositions) { //only stagger playback if transpositions are enabled
        this.timeout = setTimeout(this.playMusic, 1550 - (this.detuneValue/2), this.state.amount); //note: timeout value has to be adjusted according to detune value because detune alters playback speed of chords
      } else {
        this.timeout = setTimeout(this.playMusic, 1550, this.state.amount);
      };

    } else {
      console.log('A variable named this.count is less than 0. Something terrible has occured. Please refresh the page and pretend this never happened.');
    };
  };

  render() {
    return (
      <div id='app-wrapper'>
        <div id='header'>
          <div id='header-wrapper'>
            <h3 className='headers' id='title'> A Comprehensive Chord Progression Ear Trainer</h3>
            <h4 className='headers' id='how-to'>Wait - how do I use this?</h4>
            <p className='header-text'>In any given key or mode, there are seven chords you can generate from the notes of its scale. These chords are referenced by the number of the <em>scale
            degree</em> that the chord is based off of, written as a roman numeral. For example, if we want to refer to a chord based off of the fifth note of the scale, we would write a "V" symbol.
            The quality of the chord changes the style of roman numeral we use - if it's a major chord, the chord symbol is capitalized (V); if it's minor, lower case
            (v), etc. You can find a comprehensive list of chord qualities and their respective symbols <a target='_blank' href='https://en.wikipedia.org/wiki/Chord_names_and_symbols_(popular_music)'>here</a>.
            Notated in this way, a typical chord progression in a major key might look like this: <strong>vi ii V7 I</strong>.</p>
            <p className='header-text'>This website is meant to help you get used to identifying a wide variety of chord progressions by ear. Chords are generated at randomly with the settings you have chosen on the
            settings on the left. Every chord progression plays the tonic (the one chord) first, for reference. Just choose your settings and hit the Play or Get New Chords buttons to get started!</p>
            <p className='header-text' id='by-line'>Coded by <a id='personal-website' rel="noopener noreferrer" target='_blank' href='https://www.trevorspheresmith.com/'>Trevor Smith</a></p>
          </div>
        </div>
        <div id='settings-wrapper'>
          <h3 className='settings-label' id='mode-key'>Mode/Key:</h3>
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
          <h3 className='settings-label'>Amount of Chords:</h3>
          <select onChange={this.handleAmountChange} id='amount-selection'>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
          <div id='allowed-wrapper'>
            <h3 id='allowed-header' className='settings-label'>Allowed Chords:</h3>
            <div id='allowed-selections'>
              <div className='checkbox'>
                <input className='actual-checkbox' type='checkbox' id='allowed-section-1' checked disabled></input>
                <label htmlFor='allowed-selection-1'>1</label>
              </div>
              <div className='checkbox'>
                <input className='actual-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={2} id='allowed-selection-2'></input>
                <label htmlFor='allowed-selection-2'>2</label>
              </div>
              <div className='checkbox'>
                <input className='actual-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={3} id='allowed-selection-3'></input>
                <label htmlFor='allowed-selection-3'>3</label>
              </div>
              <div className='checkbox'>
                <input className='actual-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={4} id='allowed-selection-4'></input>
                <label htmlFor='allowed-selection-4'>4</label>
              </div>
              <div className='checkbox'>
                <input className='actual-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={5} id='allowed-selection-5'></input>
                <label htmlFor='allowed-selection-5'>5</label>
              </div>
              <div className='checkbox'>
                <input className='actual-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={6} id='allowed-selection-6'></input>
                <label htmlFor='allowed-selection-6'>6</label>
              </div>
              <div className='checkbox'>
                <input className='actual-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={7} id='allowed-selection-7'></input>
                <label htmlFor='allowed-selection-7'>7</label>
              </div>
            </div>
          </div>
          <div id='assorted-checkboxes'>
            <div className='checkbox'>
              <input type="checkbox" id="allow-transpositions" name="allow-transpositions" onChange={this.handleTranspositions}></input>
              <label htmlFor="allow-transpositions">Allow Transpositions</label>
            </div>
            <div className='checkbox'>
              <input type="checkbox" id="allow-inversions" name="allow-inversions" onChange={this.handleInversions}></input>
              <label htmlFor="allow-transpositions">Allow Inversions</label>
            </div>
            <div className='checkbox'>
              <input type="checkbox" id="use-seventh-chords" name="use-seventh-chords" onChange={(event) => this.handleSeventhChords(event)}></input>
              <label htmlFor="use-seventh-chords">Use Seventh Chords</label>
            </div>
            <div className='checkbox'>
              <input type="checkbox" id="loop" name="loop" onChange={this.handleLoop}></input>
              <label htmlFor="loop">Loop Chord Playback</label>
            </div>
            <div className='checkbox'>
              <input type='checkbox' id='displayPossible' name='displayPossible' onChange={this.handleDisplayPossible}></input>
              <label htmlFor='displayPossible'>Display All Possible Chords</label>
            </div>
          </div>
        </div>
        <div id='sec-col-wrapper'>
          <div id='sound-button-wrapper'>
  		      <button id='play' className='sound-button' onClick={this.handleClick}>Play</button>
            <button id='stop' className='sound-button' onClick={this.handleStop}>Stop</button>
            <button id='get-new-chords' className='sound-button' onClick={this.handleGetNewChords}>Get New Chords</button>
          </div>
          <div id='QuizUI'>
            <QuizUI chords = {this.state.chords}
                  chordsAllowed = {this.chordsAllowed}
                  amount = {this.state.amount}
                  minor = {this.state.minor}
                  chordClass = {this.state.chordClass}
                  displayPossible = {this.state.displayPossible}
                  init = {this.state.init}
                  />
          </div>
        </div>
      </div>
    );
  };
};

function CorrectButton(props) {
  if (Number(props.value) === 0) {
    return <button className='chord-button correct' id='given-one-chord' value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)} disabled>{props.chordName}</button>;
  } else {
    return <button className={props.clicked ? 'chord-button correct' : 'chord-button unanswered'} value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)}>{props.chordName}</button>;
  };
};

function IncorrectButton(props) {
  return <button className={props.clicked ? 'chord-button incorrect' : 'chord-button unanswered'} value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)}>{props.chordName}</button>
};

class QuizUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: {} //object with boolean for each button element's clicked state (key is trivial integer value unique to button), passed to button components as prop
    };
    this.makeClicked = this.makeClicked.bind(this);
    this.getButtons = this.getButtons.bind(this);
    this.cleanChordNameData = this.cleanChordNameData.bind(this);
    //variables
    this.newAllowedList = this.props.chordsAllowed; //do not want to alter original list to keep stuff from getting more complicated and co-dependent

    this.possibleChordNames = []; //names of possible chords, used to generate false answers

    this.actualChordNames = []; //names of sounded, correct chords

    this.buttonArray = []; //stores all buttons as object where each row of buttons is a sublist, object rendered as html with map in render() below

    this.clicked = {}; //will be an object that indicates whether each button has been clicked or not, temp hold in processing, passed to state on completion
  };

  componentDidUpdate() {

    if (this.props.init) { //if init from parent component, clear out buttons and styles
      this.clicked = {};
      this.buttonArray = [];
      this.cleanChordNameData();
    };

    if (this.props.chords.length > 0 && this.buttonArray.length < 1) { //if we have chords, but not buttons
      this.cleanChordNameData();
      this.getButtons();
    };
  };

  makeClicked(e) {
    this.clicked[e.target.value] = true;
    this.setState({clicked: this.clicked});
  };

  cleanChordNameData() {
    this.newAllowedList = this.props.chordsAllowed; //likely redundant, but ensures that this.newAllowedList is always tracking changing prop
    this.newAllowedList.sort(function(a,b) { //always list possible chords in ascending order
      return a.name - b.name;
    });

    var minor = this.props.minor; //for each callback loses access to this
    var chordClass = this.props.chordClass;
    this.newAllowedList.forEach(function(chord) { //make sure each entry's quality prop is assigned (should already be, but redundancy just in case)
      if (minor && chord[chordClass].qualityMinor) {
        chord.quality = chord[chordClass].qualityMinor;
      } else {
        chord.quality = chord[chordClass].quality;
      };
    });

    this.possibleChordNames = this.newAllowedList.map(function(a) {
      return intToChordName(a);
    });

    this.actualChordNames = this.props.chords.map(function(a) {
      return intToChordName(a);
    });
  };

  getButtons() {
    this.clicked = {};
    if (this.props.chords.length > 0 && Object.keys(this.buttonArray).length < 1) { //only generate buttons if we have chords and not buttons (likely redundant, but trying to be safe)
      var actualChordNames = this.actualChordNames; //loses access to this inside callbacks
      for (var i = 0; i <this.actualChordNames.length; i++) {
        var tempButtonList = []; //will hold a list of objects where each object is a button with an integer value representing position and two props, chordName, and a boolean indicating whether or not answer is correct, and value, used for element key and for style reference

        this.clicked[i] = false;
        tempButtonList.push({chordName: actualChordNames[i], correct: true, value: (i)}); //generate correct answers, value should always be single digit

        var answerlessAllowed = this.possibleChordNames.filter(function(a) { //create list without correct answer from all possible chords to generate wrong answers from
          return a !== actualChordNames[i];
        });
        var incorrectAmount;
        var random;

        if (this.possibleChordNames.length > 4) { //if 2 allowed chords, 1 wrong answer, if 3, then 2, if 4+, then 3
          incorrectAmount = 3;
        } else {
          incorrectAmount = this.possibleChordNames.length - 1;
        };

        if (i > 0) {
          for (var j = 0; j < incorrectAmount; j++) { //generate incorrect answers, only after first row (which will be single button displaying one chord)
            this.clicked[10 * i + j] = false;
            random = Math.floor(Math.random() * answerlessAllowed.length); //index of random chord
            tempButtonList.push({chordName: answerlessAllowed[random], correct: false, value: (10 * i + j)});
            answerlessAllowed.splice(random, 1);
          };
        };

      //randomize row before pushing
      var shuffledArray = [];
      while (tempButtonList.length !== 0) {
        var randIndex = Math.floor(Math.random() * tempButtonList.length);
        shuffledArray.push(tempButtonList[randIndex]);
        tempButtonList.splice(randIndex, 1);
      };
      this.buttonArray.push(shuffledArray); //each list of objects represents a row and will be rendered wrapped in a div to ensure proper line breaks
      };
    };
  };

  render() {
    return (
      <div id='QuizUI-wrapper'>
        <div id='possible-chords-wrapper'>
        {this.props.displayPossible &&
          <h3 id='possible-chords-header'>Possible chords:</h3>
        }
        <div id='possible-chord-names'>
        {this.props.displayPossible &&
          this.possibleChordNames.map(function(a, index) {
          return <h3 className='possible-chords' key={index}>{a}</h3>
          })}
        </div>
      </div>
      <div id='quiz-buttons'>
          {
            this.buttonArray.map(row =>
              <div className='button-row'>
                {row.map(chord => chord.correct ?
                  <CorrectButton key={chord.value} value={chord.value} clicked={this.clicked[chord.value]} makeClicked={this.makeClicked} chordName={chord.chordName} /> :
                  <IncorrectButton key={chord.value} value={chord.value} clicked={this.clicked[chord.value]} makeClicked={this.makeClicked} chordName={chord.chordName}/>
                )}
              </div>
            )
          }
      </div>
    </div>
    );
  };
};

window.addEventListener('DOMContentLoaded', (event) => {
  ReactDOM.render(<Quiz />, document.getElementById('root'));
});
