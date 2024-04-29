import { useGameStore } from "./hooks";
import { convertCellToPGN } from "./utils";

export const Moves = () => {
  const moves = useGameStore((state) => state.moves);
  return (
    <div className="h-[512px] overflow-y-auto overflow-x-hidden">
      <div className="grid grid-cols-3 justify-items-start">
        {moves.map((move, i) => (
          <>
            <div className="text-sm w-fit text-gray-500 font-medium py-2">
              {i + 1}.
            </div>
            {move.map((m) => (
              <>
                <button className="text-sm justify-start font-medium px-3 rounded-md hover:bg-gray-200 py-2">
                  {convertCellToPGN(m)}
                </button>
              </>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};
