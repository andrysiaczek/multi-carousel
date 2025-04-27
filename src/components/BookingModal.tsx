interface BookingModalProps {
  name: string;
  onClose: () => void;
}

export const BookingModal = ({ name, onClose }: BookingModalProps) => {
  const duration = 1500;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-fadeIn">
        <h3 className="text-2xl font-bold text-darkGreen mb-2">
          Booking Confirmed!
        </h3>
        <p className="text-gray-600 mb-4">
          Enjoy your stay at <span className="font-semibold">{name}</span>!
        </p>
        <div className="text-4xl animate-bounce mb-4">🎉</div>

        {/* Live Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-4">
          <div
            className="h-full bg-darkGreen"
            style={{
              animation: `fillBar ${duration}ms linear forwards`,
            }}
            onAnimationEnd={onClose}
          />
        </div>
      </div>
    </div>
  );
};
