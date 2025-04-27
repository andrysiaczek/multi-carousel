type IntroStepProps = {
  onStart: () => void;
};

export const IntroStep = ({ onStart }: IntroStepProps) => (
  <div className="flex flex-col items-center justify-center h-screen p-6 bg-antiflashWhite text-center space-y-4">
    <h2 className="text-3xl font-bold text-darkGreen">Welcome to the Study</h2>

    <p className="text-gray-800">
      In this study you’ll see <strong>three different interfaces</strong>{' '}
      presenting travel accommodations:
    </p>
    <ul className="list-disc list-inside text-gray-700">
      <li>Multi-Axis Carousel</li>
      <li>Single-Axis Carousel</li>
      <li>Benchmark Interface</li>
    </ul>

    <div className="text-gray-800">
      For each interface you’ll complete <strong>two tasks</strong>:
      <ul className="list-inside ml-4 mt-2 text-gray-700">
        <li>1. Exploratory task (browse freely)</li>
        <li>
          2. Goal-oriented task (find a hotel under €100/night, &lt;2 km from
          the city center, with a swimming pool)
        </li>
      </ul>
    </div>

    {/* Task completion hint */}
    <p className="text-sm text-gray-600 italic">
      When you’re ready to finish a task, just click the{' '}
      <strong className="text-darkGreen">Book</strong> button.
    </p>

    <p className="text-sm text-gray-600 italic">
      Note: all data and images are simulated, so you may see occasional
      duplicates or minor inconsistencies.
    </p>

    <button
      type="button"
      onClick={onStart}
      className="mt-4 bg-darkGreen text-white px-6 py-3 rounded-lg hover:bg-darkOrange transition"
    >
      Start Study
    </button>
  </div>
);
