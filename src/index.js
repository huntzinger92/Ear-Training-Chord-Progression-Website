import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faStop, faRedoAlt, faSlidersH, faCheck, faTimes, faHome, faCog } from '@fortawesome/free-solid-svg-icons'
import * as THREE from "three";
import './index.scss';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

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

function App() {
  return (
    <div id='all-container'>
      <Router>
        <div id='nav-bar'>
          <NavLink to='/' className='nav-links'>Home</NavLink>
          <NavLink to='/test' className='nav-links'>Test</NavLink>
          <a rel="noopener noreferrer" target='_blank' href='https://www.trevorspheresmith.com/' id='by-line' className='nav-links'>About</a>
        </div>
        <Switch id='settings-or-test'>
          <Route path='/test'>
            <Test/>
          </Route>
          <Route path='/'>
            <Home/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function Home() {
  return (
    <div id='home-wrapper'>
      <div id='header-wrapper'>
        <h3 className='headers' id='title'> A Comprehensive Chord Progression Ear Trainer</h3>
      </div>
      <div id='description'>
        <p className='header-text'>This website is meant to help you become able to identify a wide variety of chord progressions by ear. You are quizzed on chord progressions
        that are randomly generated from settings you can adjust. Every chord progression plays the tonic (the one chord) first, as an aural reference. Just hit the "Start Test" button below
        to get started!</p>
      </div>
        <div id='explanation'>
          <p className='explanation-text'>In any given key or mode, there are seven chords you can make, each one based off of one note of the scale. The names of these chords come from which note of
          the scale they are based on (known as <em>scale degrees</em>), expressed as a roman numeral. The <em>quality</em> of the chord (major, minor, etc.) determines whether
          or not the roman numeral is uppercase or lowercase, and which symbols may need to be added.</p>
          <div id='example'>
            <p className='explanation-text'>Take a look at the chord chart for some major key triads below:</p>
            <div id='example-grid'>
              <p id='example-degree'>Scale Degree</p>
              <p id='example-1'>1</p>
              <p id='example-2'>2</p>
              <p id='example-3'>3</p>
              <p id='example-4'>4</p>
              <p id='example-5'>5</p>
              <p id='example-key'>Key of C Major</p>
              <p id='example-C'>C</p>
              <p id='example-D'>Dm</p>
              <p id='example-E'>Em</p>
              <p id='example-F'>F</p>
              <p id='example-G'>G</p>
              <p id='example-numeral'>Roman Numeral</p>
              <p id='example-I'>I</p>
              <p id='example-ii'>ii</p>
              <p id='example-iii'>iii</p>
              <p id='example-IV'>IV</p>
              <p id='example-V'>V</p>
            </div>
            <p className='explanation-text'>If we want to refer to a chord based off of the fifth <em>scale degree</em> in the key of C major, we simply write "V". The roman numeral is capitalized because the
            chord is major, when constructed from the notes of the C major scale. For the same reason, the three chord ("iii") is minor and therefore lowercase. You can find a comprehensive
            list of chord types and their respective symbols <a rel="noopener noreferrer" target='_blank' href='https://en.wikipedia.org/wiki/Chord_names_and_symbols_(popular_music)'className='link'><strong>here</strong></a>.</p>
          </div>
        </div>

        <NavLink to='/test' className='nav-link' id='start-the-test'>
          <FontAwesomeIcon icon={faCaretRight} size="2x" className='sound-icon'/>
          <p>Start Test</p>
        </NavLink>
    </div>
  );
}

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chords: [], //list of chosen chords (objects from soundbank var)
      transpositions: false,
      inversions: false,
      chordClass: 'triad', //triad or seventh, see soundbank chord object props and relevant logic in getChords
      allowedList: [1,4,5], //keeps track of which chords are allowed, accomodating for mode change, used in handleTypeChange to recalculate allowed chords
      stop: false, //when this is true, stops any playback on next chord, set to true when chords are cleared out or stop button pressed, set to false when play
      loop: false,
      minor: false, //true only with tonal minor, not minor modes, indicates use of altered 5 and 7 chords
      modal: 0, //integer with which to rename chords (in Dorian, two becomes the one, etc.)
      amount: 4, //amount of chords to be heard by user, selected with dropdown
      init: true, //if chords have not been gotten yet, useful to ensure "hear chord" button both generates chords on first click and replays them on second click
      play: false, //must be true for music to play on update (keep it false when you want user to adjust settings without playing music)
      displayPossible: false, //toggles display of all possible chords with current settings
      displaySettings: false, //toggles display of settings/quiz
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
    this.toggleDisplay = this.toggleDisplay.bind(this);
    //variables with "global" access (within component)
    this.timeout = 0; //id to hold timeout on playMusic calls, to be cleared on this.state.stop (note: just initialized with an integer, used as a timeout object)
    this.listener = new THREE.AudioListener();
    this.audioLoader = new THREE.AudioLoader();
    this.sound = 0; //used to temporarily hold each chord to be played (need access within playMusic and componentDidUpdate)
    this.detuneValue = 0; //used to detune audio to enable transpositions
    this.count = 0; //count will be used to keep track of how many chords have played, function playMusic clears intervalID when count === this.state.amount
    this.chordsAllowed = [soundbank[0], soundbank[3], soundbank[4]]; //used to generate random chord progressions, to be initialized with 1,4,5 in major soundbank[3], soundbank[4]
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

  componentDidMount() {
    this.handleClick();
  }

  toggleDisplay() {
    if (this.state.displaySettings) {
      this.handleClick();
    };
    this.setState({
      displaySettings: !this.state.displaySettings
    });
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
      //var modal = this.state.modal;
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
    }, () => this.handleClick());
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

  playMusic(totalChordsPlayed) {
    if (this.listener.context.state === 'suspended') {
      this.listener.context.resume();
    };

    if (this.count === Number(totalChordsPlayed)) {
      this.count = 0;
      if (this.state.loop) {
        this.playMusic(this.state.amount);
      }
    } else if (this.count >= 0 && !this.state.stop) {
      var url = this.state.chords[this.count].src;
      this.sound = new THREE.Audio(this.listener);
      if (this.state.transpositions) {
        this.sound.detune = this.detuneValue;
      };
      var tempSound = this.sound; //buffer code loses access to "this"
      this.audioLoader.load(url, function(buffer) {
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
      <div id='test-wrapper'>
        <div id='settings-wrapper' style={{display: this.state.displaySettings ? 'block' : 'none'}}>
          <div id='configure-test-header'>
            <h2>
              <svg version="1.1" id="configure" className='settings-icon' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 43.73 36.41" xmlSpace="preserve">
                <g>
                  <rect x="7.71" y="5.03" width="4.11" height="26.72"/>
                  <rect x="19.92" y="5.03" width="4.11" height="26.72"/>
                  <rect x="32.14" y="5.03" width="4.11" height="26.72"/>
                  <rect x="31.43" y="18.89" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 58.5102 -9.8721)" width="5.53" height="10.85"/>
                  <rect x="19.21" y="6.13" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 33.5347 -10.419)" width="5.53" height="10.85"/>
                  <rect x="7" y="14.99" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 30.181 10.656)" width="5.53" height="10.85"/>
                </g>
              </svg>
              <span id='configure-test-header-text'>Configure Test</span>
            </h2>
          </div>
          <div id='options-wrapper'>
          <h3 className='settings-label' id='mode-key'>Mode/Key:</h3>
          <select className='settings-dropdown' onChange={this.handleTypeChange} id='type-selection'>
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
          <select className='settings-dropdown'onChange={this.handleAmountChange} id='amount-selection' value={this.state.amount}>
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
              <div className='allowed-checkbox-wrapper' id='div-allowed-selection-1'>
                <label htmlFor='allowed-selection-1' className='allowed-label'>
                  <input className='allowed-checkbox' type='checkbox' disabled checked></input>
                  <span className='allowed-span'>1</span>
                </label>
              </div>
              <div className='allowed-checkbox-wrapper' id='div-allowed-selection-2'>
                <label htmlFor='allowed-selection-2' className='allowed-label'>
                  <input className='allowed-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={2} id='allowed-selection-2'></input>
                  <span className='allowed-span'>2</span>
                </label>
              </div>
              <div className='allowed-checkbox-wrapper' id='div-allowed-selection-3'>
                <label htmlFor='allowed-selection-3' className='allowed-label'>
                  <input className='allowed-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={3} id='allowed-selection-3'></input>
                  <span className='allowed-span'>3</span>
                </label>
              </div>
              <div className='allowed-checkbox-wrapper' id='div-allowed-selection-4'>
                <label htmlFor='allowed-selection-4' className='allowed-label'>
                  <input className='allowed-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={4} id='allowed-selection-4' defaultChecked={true}></input>
                  <span className='allowed-span'>4</span>
                </label>
              </div>
              <div className='allowed-checkbox-wrapper' id='div-allowed-selection-5'>
                <label htmlFor='allowed-selection-5' className='allowed-label'>
                  <input className='allowed-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={5} id='allowed-selection-5' defaultChecked={true}></input>
                  <span className='allowed-span'>5</span>
                </label>
              </div>
              <div className='allowed-checkbox-wrapper' id='div-allowed-selection-6'>
                <label htmlFor='allowed-selection-6' className='allowed-label'>
                  <input className='allowed-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={6} id='allowed-selection-6'></input>
                  <span className='allowed-span'>6</span>
                </label>
              </div>
              <div className='allowed-checkbox-wrapper' id='div-allowed-selection-7'>
                <label htmlFor='allowed-selection-7' className='allowed-label'>
                  <input className='allowed-checkbox' type='checkbox' onClick={(event) => this.handleChordAllowedChange(event)} value={7} id='allowed-selection-7'></input>
                  <span className='allowed-span'>7</span>
                </label>
              </div>
            </div>
          </div>
          <div id='assorted-checkboxes'>
            <div className='checkbox'>
              <input type="checkbox" id="allow-transpositions" name="allow-transpositions" onChange={this.handleTranspositions}></input>
              <label htmlFor="allow-transpositions">
                <svg version="1.1" id="transpose" className='settings-icon' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 26.44 30.61" xmlSpace="preserve">
                  <rect x="16.63" y="4.48" transform="matrix(-1 -1.224647e-16 1.224647e-16 -1 35.3472 28.0688)" width="2.08" height="19.12"/>
                  <polygon points="21.6,22.37 17.67,26.3 13.75,22.37 "/>
                  <rect x="7.63" y="7.18" width="2.08" height="19.12"/>
                  <polygon points="4.75,8.4 8.67,4.48 12.6,8.4 "/>
                </svg>
              <span className='settings-text'>Allow Transpositions</span></label>
            </div>
            <div className='checkbox'>
              <input type="checkbox" id="allow-inversions" name="allow-inversions" onChange={this.handleInversions}></input>
              <label htmlFor="allow-transpositions">
                <svg version="1.1" id="inversions" className="settings-icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	               viewBox="0 0 26.44 30.3" xmlSpace="preserve">
                 <polygon points="12.42,0 16.28,3.86 12.42,7.72 "/>
                 <circle cx="15.39" cy="25.64" r="2.21"/>
                 <circle cx="15.39" cy="18.79" r="2.21"/>
                 <circle cx="15.39" cy="11.94" r="2.21"/>
                 <g>
	                <path d="M10.81,26.25c-4.19-1.76-7.01-6.35-7.01-11.43c0-6.03,3.96-11.21,9.21-12.06l0.32,1.97C9.04,5.43,5.81,9.77,5.81,14.82
		                c0,4.28,2.32,8.13,5.78,9.58L10.81,26.25z"/>
                 </g>
                </svg>
              <span className='settings-text'>Allow Inversions</span></label>
            </div>
            <div className='checkbox'>
              <input type="checkbox" id="use-seventh-chords" name="use-seventh-chords" onChange={(event) => this.handleSeventhChords(event)}></input>
              <label htmlFor="use-seventh-chords">
                <svg version="1.1" id="allowSevenths" className='settings-icon' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	               viewBox="0 0 28.6 25.27" xmlSpace="preserve">
	               <g>
		               <path d="M5.24,4.47h3.33l3.64,12.4h0.1l3.59-12.4h3.16L13.78,21.8h-3.26L5.24,4.47z"/>
		               <path d="M22.38,8.88c0.57-1.5,1.29-2.81,2.14-3.94H20.4V3.29h6.04v1.19c-0.83,1.26-1.54,2.58-2.11,3.98s-0.86,2.79-0.86,4.18
			                c0,0.26,0,0.52,0.01,0.75h-1.96C21.52,11.88,21.81,10.37,22.38,8.88z"/>
	               </g>
                </svg>
              <span className='settings-text'>Use Seventh Chords</span></label>
            </div>
            <div className='checkbox'>
              <input type="checkbox" id="loop" name="loop" onChange={this.handleLoop}></input>
              <label htmlFor="loop">
                <svg version="1.1" id="loopPlayback" className='settings-icon' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 25.11 19.84" xmlSpace="preserve">
                  <polygon points="15.08,9.24 11.33,5.48 15.08,1.73 "/>
                  <g>
                    <path d="M18.74,17.46H6.03c-2.13,0-3.87-2.02-3.87-4.5V8.98c0-2.48,1.74-4.5,3.87-4.5h2.72v2H6.03c-1.01,0-1.87,1.14-1.87,2.5v3.98
                      c0,1.35,0.86,2.5,1.87,2.5h12.71c1.01,0,1.87-1.14,1.87-2.5V8.98c0-1.35-0.86-2.5-1.87-2.5h-4.27v-2h4.27
                      c2.13,0,3.87,2.02,3.87,4.5v3.98C22.62,15.44,20.88,17.46,18.74,17.46z"/>
                  </g>
                </svg>
                <span className='settings-text'>Loop Chord Playback</span></label>
            </div>
            <div className='checkbox'>
              <input type='checkbox' id='displayPossible' name='displayPossible' onChange={this.handleDisplayPossible}></input>
              <label htmlFor='displayPossible'>
                <svg version="1.1" id="displayAll" className='settings-icon' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 28.6 26.94" xmlSpace="preserve">
                  <g>
                    <path d="M13.89,21.32c-4.74,0-9.16-2.55-11.54-6.66l-0.29-0.5l0.29-0.5c2.37-4.11,6.79-6.67,11.54-6.67
                      c4.74,0,9.16,2.55,11.54,6.67l0.29,0.5l-0.29,0.5C23.05,18.77,18.62,21.32,13.89,21.32z M4.39,14.16c2.08,3.2,5.67,5.16,9.5,5.16
                      c3.83,0,7.42-1.96,9.51-5.16c-2.08-3.2-5.67-5.17-9.51-5.17C10.05,8.99,6.47,10.96,4.39,14.16z"/>
                  </g>
                  <circle cx="13.89" cy="14.16" r="5.41"/>
                </svg>
                <span className='settings-text'>Display All Possible Chords</span></label>
            </div>
          </div>
          <div id='start-test-header' onClick={this.toggleDisplay}>
            <FontAwesomeIcon icon={faCaretRight} className='sound-icon' size="3x"/>
            <h2>Start Test</h2>
          </div>
          </div>
        </div>
        <div id='quiz-wrapper' style={{display: this.state.displaySettings ? 'none' : 'grid'}}>
          <div id='sound-button-wrapper'>
  		      <button id='play' className='sound-button' onClick={this.handleClick}>
              <FontAwesomeIcon icon={faCaretRight} size="3x" className="sound-icon"/>
              <p className='sound-button-text'>P L A Y</p>
            </button>
            <button id='stop' className='sound-button' onClick={this.handleStop}>
              <FontAwesomeIcon icon={faStop} size="2x" className="sound-icon"/>
              <p className='sound-button-text'>S T O P</p>
            </button>
            <button id='get-new-chords' className='sound-button' onClick={this.handleGetNewChords}>
              <FontAwesomeIcon icon={faRedoAlt} size="2x" className="sound-icon"/>
              <p className='sound-button-text'>N E W</p>
            </button>
            <div id='configure-test-link' onClick={this.toggleDisplay}>
                <FontAwesomeIcon icon={faCog} rotation={90} size="2x" id="configure-link-icon"/>
            </div>
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
    return (
      <div className="div-chord-button">
        <button className='chord-button correct' id='given-one-chord' value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)} disabled>
          <p>{props.chordName}</p>
          <FontAwesomeIcon icon={faCheck} className='chord-icon check'/>
        </button>
      </div>
    );
  } else {
    if (props.clicked) {
      return (
        <div className="div-chord-button" onClick={(e) => props.makeClicked(e)}>
          <button className='chord-button correct' value={props.value} key={props.value} >
            <p>{props.chordName}</p>
            <FontAwesomeIcon icon={faCheck} className='chord-icon check'/>
          </button>
        </div>
      );
    } else {
      return (
        <div className="div-chord-button">
          <button className='chord-button unanswered' value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)}>
            <p onClick={(e) => console.log('chordname clicked')}>{props.chordName}</p>
            <FontAwesomeIcon icon={faCheck} className='chord-icon check' style={{opacity: 0}} onClick={(e) => console.log('fontAwesomeIcon clicked')}/>
          </button>
        </div>
      );
    };
  };
};


function IncorrectButton(props) {
  if (props.clicked) {
    return (
      <div className="div-chord-button">
        <button className='chord-button incorrect' value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)}>
          <p>{props.chordName}</p>
          <FontAwesomeIcon icon={faTimes} className='chord-icon x'/>
        </button>
      </div>
    );
  } else {
      return (
        <div className="div-chord-button">
          <button className='chord-button unanswered' value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)}>
            <p>{props.chordName}</p>
            <FontAwesomeIcon icon={faTimes} className='chord-icon x' style={{opacity: 0}}/>
          </button>
        </div>
      );
  };
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
  ReactDOM.render(
    <App />, document.getElementById('root')
  );
});
