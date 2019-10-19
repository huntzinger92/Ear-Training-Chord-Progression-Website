//your code for button styling on click works, but is not causing a re-render of child button components
//to solve this, you need to separate your random chord generating logic and the creation of child component instances s.t. the child component instances are in the render() method of parent
//to do THAT, create a list of objects, where each object has a key equal to the value (i or 10 * i + j) : [chordname, true if correct or false if incorrect, styleReference], use map under render() to pass
//that information to the current button component, could probably reduce IncorrectButton and CorrectButton button to one by checking for the true or false condition
//the render() method is called when state is altered, and the way your code is laid out, that doesn't pass new props to children. (JFC)

//in CSS, style all buttons as blue, but classNames "incorrect" and "correct" red and green, respectively
//also, "displayAllPossible" checkbox not adjusting properly for mode changes

//after that, build scorekeeper
//build the design itself (settings on left, buttons and score in middle, possible chords on right, boxes) - find out where the html/css being referenced in this is
//after that, have an about page with link to personal website
//after that, deploy and debug


//eventually, allow borrowing from parallel major and minor if major/minor selected
// - would involve making minor triad chord sound files (already did sevenths) for parallel minor. maybe eventually, but finish your app first
//eventually, add a little reverb with audioContext.createConvolver
//eventually, don't immediately stop chords and playback on settings changes?

import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from "three";

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
        srcMinor: './chords_Gsharpdim_inv.mp3'
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
  };
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
      chordClass: 'triad', //triad or seventh, see soundbank chord object props and relevant logic in getChords
      allowedList: [1], //keeps track of which chords are allowed, accomodating for mode change, used in handleTypeChange to recalculate allowed chords
      stop: false, //when this is true, stops any playback on next chord, set to true when chords are cleared out or stop button pressed, set to false when play
      loop: false,
      minor: false, //only with tonal minor, not minor modes, includes altered 5 and 7 chords
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
    this.timeout = 0; //id to hold timeout on playMusic calls, to be cleared on stop
    this.listener = new THREE.AudioListener();
    this.sound = 0; //used to temporarily hold each chord to be played (need access within playMusic and componentDidUpdate)
    this.detuneValue = 0; //used to detune audio
    this.count = 0; //count will be used to keep track of how many chords have played, function playMusic clears intervalID when count === this.state.amount
    this.chordsAllowed = [soundbank[0]];

  };

  componentDidUpdate() {
    //console.log('update');
    if (this.state.chords.length > 1 && this.state.play) { //this is not ideal, try to find a better way to do renderMusic
      //call renderMusic from getChords with some kind of awaiting state update promise to fix this
      //console.log('renderMusic and thus playMusic called from 283 (within componentDidUpdate)');
      this.renderMusic();
    };
    if (this.state.stop) {
      //not a function?
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
      //special processing, probably make this.state.modal === 2 and then include whatever will be necessary to accomodate dom7 and diminished 7th chords
      //maybe include altered versions of those chords for minor (E major with inversions, G also includes Gsharp diminished, seventh chords for the sevenths)
      this.setState({
        modal: 2,
        minor: true,
        chords: [],
        init: true,
        stop: true
      });
      modal = 2;
    } else { //modal, e.target.value is a number used for processing names to accomodate new "one"
      this.setState({
        modal: Number(e.target.value),
        minor: false,
        chords: [],
        init: true,
        stop: true
      });
      modal = Number(e.target.value);
    };
    this.chordsAllowed = []; //remove all previous chords and remake list with respect to new mode
    for (var i = 0; i < tempAllowedList.length; i++) {
      var tempChord = {};
      Object.assign(tempChord, soundbank.find(function(obj) { //deep copy
        var tempName = (tempAllowedList[i] + 7 - modal) % 7; //convoluted math converts the number chord with respect to new tonic to the "originally named" chord as held in soundbank
        if (tempName === 0) {
          tempName = 7;
        };
        //console.log('tempName: ' + tempName);
        return obj.name === tempName;
      }));
      //console.log('on mode change - chord to be added to this.chordsAllowed:');
      //console.log(tempChord);
      tempChord.name = tempAllowedList[i]; //rename chord to accomodate mode - NOTE: this will not alter soundbank only because of Object.assign earlier, need deep copy
      this.chordsAllowed.push(tempChord);
    };
    //console.log('chords allowed after mode change:');
    //console.log(this.chordsAllowed);
  };

  handleAmountChange(e) {
    //updates the amount of chords user wants to hear (also responsible for rendering selected radio button correctly)
    //this.audioElements = []; //clearing audio refs for next set of chords
    this.setState({
      amount: e.target.value,
      init: true,
      play: false,
      chords: [], //clearing out chords, which is important for the path of processing with handleClick
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
      var chordList = this.state.chords; //semantically easier and will not alter or reference state directly for processing
      //console.log('chordList (inversions have just been allowed): ');
      //console.log(chordList);
      for (var i = 1; i < chordList.length; i++) { //redo chord list to accomodate inversions. Allows the user to hear same chord progression with different settings
        if (Math.abs(chordList[i][this.state.chordClass].root.value - chordList[i-1].value) <= Math.abs(chordList[i][this.state.chordClass].inverted.value - chordList[i - 1].value)) {
          chordList[i].src = chordList[i][this.state.chordClass].root.src;
          chordList[i].value = chordList[i][this.state.chordClass].root.value;
        } else {
          chordList[i].src = chordList[i][this.state.chordClass].inverted.src;
          chordList[i].value = chordList[i][this.state.chordClass].inverted.value;
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
        chordList[i].src = chordList[i][this.state.chordClass].root.src;
        chordList[i].value = chordList[i][this.state.chordClass].root.value; //we probably don't need value when only using root position, but keeping it just to be consistent
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
    //console.log(e.target.checked);
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
      init: true,
      stop: true
    });

    var modal = this.state.modal;
    var tempChord = soundbank.find(function(obj) {
      var tempName = (obj.name + modal) % 7; //when users are using modes/minor, they will be selecting chord names with respect to a different one than how the names are saved
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
      Object.assign(tempChord, soundbank.find(function(obj) { //deep copy, very important to avoid mutating soundbank
        var tempName = (obj.name + modal) % 7; //when users are using modes/minor, they will be selecting chord names with respect to a different one than how the names are saved, this code handles that
        if (tempName === 0) {
          tempName = 7;
        };
        return tempName === Number(e.target.value);
      }));
      tempChord.name = Number(e.target.value); //chords in chordsAllowed are renamed with respect to mode - important for rendering in QuizUI, one line to be careful about touching
      this.chordsAllowed.push(tempChord);
    } else { //else (if chord has been forbidden), remove chord from allowed chords if it is currently in that list (it should always be in the list, just trying to accomodate any weirdness)
      //console.log('should run on uncheck');
      var tempIndex = tempAllowedList.indexOf(Number(e.target.value));
      tempAllowedList.splice(tempIndex, 1);
      this.setState({
        allowedList: tempAllowedList
      });

      var tempChord = this.chordsAllowed.find(function(obj) {
        return obj.name === Number(e.target.value);
      });
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
    //console.log('allowed list:');
    //console.log(this.state.allowedList);
    this.setState({
      play: true,
      stop: false
    });
    //you've decided you only want one button to hear chords - if chords have already been chosen, simply renderMusic. Else, pick chords (which will then call the renderMusic function indirectly)
    //console.log(this.state.chords);
    if (this.state.chords.length > 0) {
      //this.audioElements.stop(); <-- you are probably going to need something like the .stop() method from https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode
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

  handleDisplayPossible() {
    this.setState({
      displayPossible: !this.state.displayPossible
    });
  };

  getChords() {
    var tempChordHolder = [{}];
    Object.assign(tempChordHolder[0], soundbank[(7 - this.state.modal) % 7]); //makes a deep copy. VERY IMPORTANT - if you change this make sure you are not merely passing a reference to soundbank obj
    tempChordHolder[0].name = 1; //initialize first chord with root position and value with name 1
    tempChordHolder[0].src = tempChordHolder[0][this.state.chordClass].root.src;
    tempChordHolder[0].value = tempChordHolder[0][this.state.chordClass].root.value;
    tempChordHolder[0].quality = tempChordHolder[0][this.state.chordClass].quality;

    for (var i = 0; i < this.state.amount - 1; i++) {
      var rand = {};
      Object.assign(rand, this.chordsAllowed[Math.floor(Math.random() * this.chordsAllowed.length)]); //choose random chord from allowedChords, generated from handleChordAllowedChange;
      //console.log('rand:');
      //console.log(rand);
      //finding the min between root and inv, achieving the smoother voice leading. if minor, here is where you would use altered source on rand.name = 3 or 5
      if (this.state.inversions) {
        //console.log('first line is difference between root and value of prior, 2nd is diff between inverted and value of prior');
        //console.log(rand[this.state.chordClass].root.value - tempChordHolder[tempChordHolder.length - 1].value);
        //console.log((rand[this.state.chordClass].inverted.value - tempChordHolder[tempChordHolder.length - 1].value));
        if (Math.abs(rand[this.state.chordClass].root.value - tempChordHolder[tempChordHolder.length - 1].value) <= Math.abs(rand[this.state.chordClass].inverted.value - tempChordHolder[tempChordHolder.length - 1].value)) {
          rand.value = rand[this.state.chordClass].root.value;
          if (this.state.minor && (rand.name === 7 || rand.name === 5)) {
            rand.quality = rand[this.state.chordClass].qualityMinor;
            rand.src = rand[this.state.chordClass].root.srcMinor;
            //console.log(rand.src);
          } else {
            rand.src = rand[this.state.chordClass].root.src;
            rand.quality = rand[this.state.chordClass].quality;
          };
        } else {
          rand.value = rand[this.state.chordClass].inverted.value;
          if (this.state.minor && (rand.name === 7 || rand.name === 5)) {
            rand.quality = rand[this.state.chordClass].qualityMinor;
            rand.src = rand[this.state.chordClass].inverted.srcMinor;
            //console.log(rand.src);
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
          //console.log(rand.src);
        } else {
          rand.quality = rand[this.state.chordClass].quality;
          rand.src = rand[this.state.chordClass].root.src;
        };
      };
      //rename chords if modal (or minor, probably, eventually)
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

    if (this.state.init) { //broken up into two different if statements because other processing based on init may be possible later
      if (this.state.transpositions) {
        this.detuneValue = (((Math.floor(Math.random() * 6)) - 3) * 100); //anywhere from -300 to +200 cents
        //console.log(this.detuneValue);
      };
      this.setState({
        init: false
      });
    };
    //console.log(this.state.chords);
    //console.log("allowed chords:");
    //console.log(this.chordsAllowed);
    //setTimeout(this.playMusic, 150, this.state.amount); <- avoid that fade in issue on loads?
    //console.log('playmusic called on line 605 (within renderMusic)');
    this.playMusic(this.state.amount);
  };

  playMusic(total) {
    //playback loops for some reason after stop, even with added condition if else if below, function STILL tries to read chords after they've been cleared out. delay with setState?
    if (this.listener.context.state === 'suspended') {
      this.listener.context.resume();
    };
    //console.log('this.state.chords:');
    //console.log(this.state.chords);
    //console.log(this.count);
    if (this.count === Number(total)) {
      //console.log('total and this.count match');
      this.count = 0;
      if (this.state.loop) {
        //console.log('playmusic called on 621');
        this.playMusic(this.state.amount);
      }
    } else if (this.count >= 0 && !this.state.stop) {
      var url = this.state.chords[this.count].src;
      //console.log(url);
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
      //console.log('playmusic called on 638 (with timeout within function)');
      this.timeout = setTimeout(this.playMusic, 1550 - (this.detuneValue/2), this.state.amount); //note: timeout value has to be adjusted according to detune value because detune alters playback speed of chords
      //console.log('this.timeout:');
      //console.log(this.timeout);
    } else {
      console.log('this.count is less than 0. Something terrible has happened.');
    };
    //this.setState({
      //stop: true
    //});
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
  		  <button id='hear-chords' onClick={this.handleClick}>Hear some chords</button>
        <button id='get-new-chords' onClick={this.handleGetNewChords}>Get new chords</button>
        <button id='stop' onClick={this.handleStop}>Stop</button>
        <div id='test-chord-display'>
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
    );
  };
};

function CorrectButton(props) {
  console.log('props.clicked:');
  console.log(props.clicked);
  return <button className={props.clicked ? 'chordButton correct' : 'chordButton'} value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)}>{props.chordName}</button>
};

function IncorrectButton(props) {
  console.log('props.clicked:');
  console.log(props.clicked);
  return <button className={props.clicked ? 'chordButton incorrect' : 'chordButton'} value={props.value} key={props.value} onClick={(e) => props.makeClicked(e)}>{props.chordName}</button>
};

class QuizUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: {} //will contain cumbersome array of styling for each button element, generated with getButtons
    };
    this.makeClicked = this.makeClicked.bind(this);
    this.getButtons = this.getButtons.bind(this);
    this.cleanChordNameData = this.cleanChordNameData.bind(this);
    //variables
    this.newAllowedList = this.props.chordsAllowed; //do not want to alter original list to keep stuff from getting more complicated and co-dependent

    this.possibleChordNames = []; //names of possible chords, used to generate false answers

    this.actualChordNames = []; //names of sounded chords

    this.buttonArray = []; //stores all buttons as html in an array where each row is a sublist

    this.clicked = {}; //will be an object that indicates whether each button has been clicked or not, temp hold in processing, passed to state at end, referenced in the button components
  };
  //methods

  componentDidUpdate() {
    if (this.props.init) {
      this.buttonArray = []; //clear out button html and styles
      this.clicked = {};
    };
  };

  makeClicked(e) {
    console.log('makeClicked running with:');
    console.log(e.target.value);
    this.clicked[e.target.value] = true;
    console.log('this.clicked:');
    console.log(this.clicked);
    this.setState({clicked: this.clicked});
  };

  cleanChordNameData() {
    this.newAllowedList.sort(function(a,b) { //always list possible chords in ascending order
      return a.name - b.name;
    });

    var minor = this.props.minor; //for each loses access to this
    var chordClass = this.props.chordClass;
    this.newAllowedList.forEach(function(chord) { //make sure each entry's quality prop is assigned
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
    //console.log(this.possibleChordNames);
  };

  getButtons() { //creates an array of buttons, with each item being an array of button html contained with a div, that constitutes a row
    //console.log('calling cleanChordNameData from getButtons'); //add an if statement here later
    this.cleanChordNameData();
    this.clicked = {}; //make sure you are clearing out previous list
    if (this.props.chords.length > 0 && Object.keys(this.buttonArray).length < 1) { //only do all this stuff if we actually have chords and not buttons
      console.log('if statement inside getButtons is executing');
      var actualChordNames = this.actualChordNames; //again, loses access to this inside callbacks

      for (var i = 0; i < this.actualChordNames.length; i++) { //this code will generate necessary amount of rows with answer and 1-3 (depending on how many allowed chords) wrong answers, stored in buttonArray
        var tempButtonList = [];
        var tempColor = {};
        if (i === 0) {
          tempButtonList.push(<button className='chordButton correct' key={i} disabled>{this.actualChordNames[i]}</button>); //first chord is always the 1 and therefore inactive
        } else {
          this.clicked[i] = false;
          //console.log(this.buttonStyling[i]);
          tempButtonList.push(<CorrectButton clicked={this.state.clicked[i]} value={i} chordName={this.actualChordNames[i]} makeClicked={this.makeClicked}/>); //put answer in row
        };


        var answerlessAllowed = this.possibleChordNames.filter(function(a) { //create list without correct answer from all possible chords to generate wrong answers from
          return a !== actualChordNames[i];
        });

        var incorrectAmount;
        var random;

        if (this.possibleChordNames.length > 4) { // if 2 allowed chords, 1 wrong answer, if 3, then 2, if 4+, then 3
          incorrectAmount = 3;
        } else {
          incorrectAmount = this.possibleChordNames.length - 1;
        };

        if (i > 0) { //don't add incorrect answers on the first chord, because it's always a given that it is a one chord
          for (var j = 0; j < incorrectAmount; j++) {
            this.clicked[10 * i + j] = false;
            //console.log(this.buttonStyling[10 * i + j]);
            random = Math.floor(Math.random() * answerlessAllowed.length); //index of random chord
            tempButtonList.push(<IncorrectButton clicked={this.state.clicked[10 * i + j]} value={10 * i + j} makeClicked={this.makeClicked} chordName={answerlessAllowed[random]} />)
            answerlessAllowed.splice(random, 1);
          };
        };
        //reconstruct tempButtonList here with shuffle using random splicing, then push
        this.buttonArray[i] = <div key={(i * 10).toString()}>{tempButtonList}</div>; //adds a row to button array, wrapped in div
      };

      if (i === this.actualChordNames.length && j === incorrectAmount && this.state.clicked !== this.clicked) { //if the for loop has created all buttons and setState hasn't already been called on completion
        console.log('setting state to clicked');
        //console.log(i);
        this.setState({
          clicked: this.clicked
        });
      };
    };
  };

  componentDidUpdate() { //putting getButtons here instead of under render
    //console.log('componentDidUpdate, calling getButtons');
    if (this.props.init) { //if init from main component, clear out buttons and styles
      this.clicked = {};
      this.buttonArray = [];
    };
    //console.log('testing if propositions in cDU');
    //console.log(this.props.chords.length);
    //console.log(Object.keys(this.buttonStyling).length);
    if (this.props.chords.length > 0 && this.buttonArray.length < 1) {
      this.getButtons();
    };
  };

  render() {
    //this.cleanChordNameData();
    //console.log('this.state.buttonStyling');
    //console.log(this.state.buttonStyling);
    return (
      <div>
        <div id='possibleChordDiv'>
        {this.props.displayPossible && //can't figure out how to chain multiple bits of html after props check, so broken up into two. Try a div?
          <h3>Possible chords:</h3>
        }
        {this.props.displayPossible &&
          this.possibleChordNames.map(function(a) {
          return <p className='possibleChords'>{a}</p>
          })}
        </div>
        <div id='buttons'>
          {this.buttonArray.map(function(a) {
            return a;
          })}
        </div>
      </div>
    );
  };
};

window.addEventListener('DOMContentLoaded', (event) => {
  ReactDOM.render(<Quiz />, document.getElementById('root'));
});
