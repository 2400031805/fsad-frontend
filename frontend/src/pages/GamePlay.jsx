import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const gameDetails = {
  'memory-match': {
    title: 'Memory Match',
    description: 'Flip cards to find matching pairs and boost your focus.',
    instructions: 'Click cards to reveal them, then match pairs before time runs out.',
    type: 'memory',
  },
  'word-scramble': {
    title: 'Word Scramble',
    description: 'Solve a quick scramble and exercise your brain.',
    instructions: 'Rearrange the letters into the correct word.',
    type: 'puzzle',
    scramble: 'LPUZEZ',
    answer: 'puzzle',
  },
  'comedy-quiz': {
    title: 'Comedy Quiz',
    description: 'Answer silly questions in a quick comedy challenge.',
    instructions: 'Pick the funniest answer and see how many you get right.',
    type: 'comedy',
    questions: [
      {
        question: 'What does a comedian bring to the math class?',
        options: ['A punch line', 'A slide rule', 'A funny angle'],
        answerIndex: 0,
      },
      {
        question: 'Why did the student eat his homework?',
        options: ['It was a piece of cake', 'To get extra credit', 'To make math tasty'],
        answerIndex: 0,
      },
      {
        question: 'How does a joke stay cool?',
        options: ['It has good delivery', 'It uses chill humor', 'It wears a punchline'],
        answerIndex: 1,
      },
    ],
  },
  'mood-bingo': {
    title: 'Mood Bingo',
    description: 'Create a mood board full of feelings and win with kindness.',
    instructions: 'Toggle the squares that fit your mood and aim for a bingo line.',
    type: 'bingo',
  },
  'calm-quest': {
    title: 'Calm Quest',
    description: 'Follow a calming journey that emphasizes breathing and pauses.',
    instructions: 'Press next to progress through the relaxing quest.',
    type: 'calm',
  },
};

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function GamePlay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = gameDetails[gameId];

  const [memoryState, setMemoryState] = useState(() => {
    const baseCards = ['🌟', '🌟', '🌈', '🌈', '💡', '💡', '💖', '💖'];
    return shuffle(baseCards).map((symbol, index) => ({ id: index, symbol, flipped: false, matched: false }));
  });
  const [selected, setSelected] = useState([]);
  const [bingoState, setBingoState] = useState([
    ['Grateful', 'Relaxed', 'Playful'],
    ['Creative', 'Focused', 'Kind'],
    ['Patient', 'Brave', 'Hopeful'],
  ]);
  const [bingoSelected, setBingoSelected] = useState(() => Array(3).fill(0).map(() => Array(3).fill(false)));
  const [calmStep, setCalmStep] = useState(0);
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [puzzleResult, setPuzzleResult] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');

  const memoryDone = useMemo(
    () => memoryState.every((card) => card.matched),
    [memoryState]
  );

  const bingoCount = useMemo(
    () => bingoSelected.flat().filter(Boolean).length,
    [bingoSelected]
  );

  const handleMemoryClick = (card) => {
    if (card.flipped || card.matched || selected.length === 2) return;
    const next = memoryState.map((item) =>
      item.id === card.id ? { ...item, flipped: true } : item
    );
    const nextSelected = [...selected, card];
    setMemoryState(next);
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      const [first, second] = nextSelected;
      if (first.symbol === second.symbol) {
        setTimeout(() => {
          setMemoryState((current) =>
            current.map((item) =>
              item.symbol === first.symbol ? { ...item, matched: true } : item
            )
          );
          setSelected([]);
        }, 600);
      } else {
        setTimeout(() => {
          setMemoryState((current) =>
            current.map((item) =>
              item.id === first.id || item.id === second.id
                ? { ...item, flipped: false }
                : item
            )
          );
          setSelected([]);
        }, 900);
      }
    }
  };

  const handleBingoClick = (rowIndex, colIndex) => {
    setBingoSelected((current) =>
      current.map((row, r) =>
        row.map((value, c) =>
          r === rowIndex && c === colIndex ? !value : value
        )
      )
    );
  };

  const handleNextCalm = () => {
    setCalmStep((step) => Math.min(step + 1, calmInstructions.length - 1));
  };

  const handlePuzzleSubmit = () => {
    if (puzzleAnswer.trim().toLowerCase() === game.answer) {
      setPuzzleResult('Nice work! You solved the scramble.');
    } else {
      setPuzzleResult('Try again with a new combination.');
    }
  };

  const handleQuizAnswer = (choiceIndex) => {
    if (quizCompleted) return;
    const question = game.questions[quizIndex];
    const isCorrect = choiceIndex === question.answerIndex;
    setQuizFeedback(isCorrect ? 'Great choice! High-five for the laugh.' : 'Good attempt! Keep playing.');
    setQuizScore((score) => score + (isCorrect ? 1 : 0));
    if (quizIndex === game.questions.length - 1) {
      setQuizCompleted(true);
    } else {
      setQuizIndex((index) => index + 1);
    }
  };

  const calmInstructions = [
    'Find a comfortable seat and take a deep breath in through your nose.',
    'Slowly inhale for 4 counts, hold gently for 2 counts.',
    'Exhale smoothly for 6 counts and feel your shoulders soften.',
    'Repeat once more and notice the calm flow through your body.',
    'You completed the Calm Quest. Great job taking a mindful break!',
  ];

  if (!game) {
    return (
      <section className="content-page">
        <div className="section-header">
          <h2>Game Not Found</h2>
          <p>Sorry, that game does not exist yet. Choose another one to play.</p>
        </div>
        <button className="button button-primary" onClick={() => navigate('/games')}>
          Back to Games
        </button>
      </section>
    );
  }

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>{game.title}</h2>
        <p>{game.description}</p>
      </div>
      <div className="game-play-card">
        <p className="meta-text">{game.instructions}</p>

        {game.type === 'memory' && (
          <>
            <div className="game-grid">
              {memoryState.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={`game-card ${card.flipped || card.matched ? 'flipped' : ''}`}
                  onClick={() => handleMemoryClick(card)}
                >
                  {card.flipped || card.matched ? card.symbol : '❔'}
                </button>
              ))}
            </div>
            {memoryDone && <div className="success-card">You matched all pairs! Well done.</div>}
          </>
        )}

        {game.type === 'bingo' && (
          <>
            <div className="bingo-grid">
              {bingoState.map((row, rowIndex) =>
                row.map((label, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    className={`bingo-cell ${bingoSelected[rowIndex][colIndex] ? 'selected' : ''}`}
                    onClick={() => handleBingoClick(rowIndex, colIndex)}
                  >
                    {label}
                  </button>
                ))
              )}
            </div>
            <p className="meta-text">Squares selected: {bingoCount}</p>
          </>
        )}

        {game.type === 'calm' && (
          <>
            <div className="calm-card">
              <h3>Step {calmStep + 1}</h3>
              <p>{calmInstructions[calmStep]}</p>
            </div>
            <button className="button button-secondary" onClick={handleNextCalm}>
              {calmStep < calmInstructions.length - 1 ? 'Next Step' : 'Finished'}
            </button>
          </>
        )}

        {game.type === 'puzzle' && (
          <div className="puzzle-card">
            <div className="puzzle-prompt">
              <p className="meta-text">Scrambled letters: <strong>{game.scramble}</strong></p>
              <label>
                Enter your answer:
                <input
                  type="text"
                  value={puzzleAnswer}
                  onChange={(e) => setPuzzleAnswer(e.target.value)}
                  placeholder="Type your word"
                />
              </label>
              <button className="button button-secondary" onClick={handlePuzzleSubmit}>
                Submit Answer
              </button>
              {puzzleResult && <div className="success-card">{puzzleResult}</div>}
            </div>
          </div>
        )}

        {game.type === 'comedy' && (
          <div className="comedy-card">
            <div className="puzzle-prompt">
              <p className="meta-text">{game.questions[quizIndex].question}</p>
              <div className="quiz-options">
                {game.questions[quizIndex].options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    className="button button-secondary"
                    onClick={() => handleQuizAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="meta-text">{quizFeedback}</p>
              {quizCompleted && (
                <div className="success-card">
                  You finished the comedy quiz with {quizScore}/{game.questions.length} correct answers!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default GamePlay;
