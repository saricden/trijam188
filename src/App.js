import Rive, { useRive } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';
import Artyom from "artyom.js";
import {Howl, Howler} from 'howler';

const presidentVoice = new Artyom();

const sfxCrowdAmbient = new Howl({
  src: ['/sfx/crowd-ambient.mp3'],
  loop: true
});

const sfxCrowdCheering = new Howl({
  src: ['/sfx/crowd-cheering.mp3'],
  loop: true
});

const sfxIntro = new Howl({
  src: ['/sfx/intro.wav'],
});

function App() {
  const [presidentHeight, setPresidentHeight] = useState(window.innerHeight / 3);
  const [crowdHeight, setCrowdHeight] = useState(window.innerHeight / 2);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isAgainOpen, setIsAgainOpen] = useState(false);
  const [speech, setSpeech] = useState("We're going to do great things. This is a great country. With a long history of greatness. If you choose to re-elect me I promise I won't raise taxes again. I'll also try to make things more affordable for everyone, seriously, I will. I know that mistakes were made while I was in office previously, but don't worry, things will be better this time.");
  const { rive, RiveComponent: President } = useRive({
    src: "/gfx/president.riv"
  });

  useEffect(() => {
    setPresidentHeight(window.innerHeight / 3);
    setCrowdHeight(window.innerHeight / 2);
  }, [window.innerWidth, window.innerHeight]);

  function startSpeech() {
    const sfxID = sfxCrowdAmbient.play();

    sfxCrowdAmbient.fade(0, 1, 1000, sfxID);

    setIsModalOpen(false);

    setTimeout(() => {
      sfxIntro.play();
      sfxCrowdAmbient.fade(1, 0, 1000, sfxID);
    }, 5000);

    setTimeout(() => {
      presidentVoice.say(speech, {
        onStart: () => {
          rive.play('Talking-Normal');
        },
        onEnd: () => {
          rive.stop('Talking-Normal');
          sfxCrowdCheering.play();
          
          setTimeout(() => {
            setIsAgainOpen(true);
          }, 2500);
        }
      });
    }, 7500);
  }

  function playAgain() {
    sfxCrowdCheering.stop();
    setIsAgainOpen(false);
    setIsModalOpen(true);
  }
  
  return (
    <>
      <div className="game">
        <div style={{
          height: presidentHeight
        }}>
          <President />
        </div>
        <div style={{
          height: crowdHeight,
          marginTop: -120,
          textAlign: 'center'
        }}>
          <img
            style={{
              height: '100%',
              width: 'auto',
              transform: 'translateX(-100px)'
            }}
            src="/gfx/crowd.svg"
          />
        </div>

        <div className={`speech-modal${isModalOpen ? ' open' : ''}`}>
          <div className="instructions">
            <h1>Speech Sabotage Simulator</h1>

            <p>Welcome to Speech Sabotage Simulator!</p>

            <p>Your mission, if you choose to accept it, is to take Mr. President the 3rd out of power. For good.</p>
            <p>We've got you access to his speech writeup, and it just so happens that he has the fatal flaw of reading exactly what's on this page.</p>
            <p>We know you'll do what's right.</p>
            <p>- Definitely not the CIA</p>
          </div>

          <div className="sheet">
            <div className="l-margin margin">
              <div className="hole first-hole"></div>
              <div className="hole second-hole"></div>
              <div className="hole third-hole"></div>
            </div>
            <div className="r-margin margin"></div>
            <header>
              <span className="sheet-title">
                Presidential Speech
              </span>
            </header>
            <textarea
              className="sheet-text"
              value={speech}
              onChange={(e) => setSpeech(e.target.value)}  
            />
          </div>

          <div className="start">
            <p>When you're ready, start the speech...</p>
            <button
              className="btn-start"
              onClick={startSpeech}
            >
              Commence the speech...
            </button>
          </div>
        </div>
        
        <div className={`play-again${isAgainOpen ? ' open' : ''}`}>
          <h1>Well that didn't work.</h1>
          <h2>It was fun though wasn't it?</h2>
          <button onClick={playAgain}>Play Again</button>
        </div>
      </div>

      <p>A game silly game for Trijam 188 by <a href="https://saricden.com" target="_blank" rel="noreferrer">Kirk M. (@saricden)</a></p>
    </>
  );
}

export default App;
