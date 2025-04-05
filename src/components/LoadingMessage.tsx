interface LoadingMessageProps {
  message: string;
}

export const LoadingMessage = ({ message }: LoadingMessageProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-2 text-gray-600 animate-pulse">
        <svg
          className="w-8 h-8 text-darkGreen animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C3.58 0 0 5.82 0 12s3.58 12 8 12v-4a8 8 0 01-4-8z"
          />
        </svg>
        <p className="text-lg font-semibold">{message}</p>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
};
