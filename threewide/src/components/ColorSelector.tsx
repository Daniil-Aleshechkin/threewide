import type { PieceType, Rotation } from "src/types/tetris";
import { getTileLocationsFromPieceAndRotations } from "@utils/tetris/PieceRotations";
import { getColorFromBoardStateTile } from "@utils/tetris/PieceColors";

type ColorSelectorProps = {
  onSelectColor: (color: PieceType) => void;
  selectedPieceType: PieceType;
};

const ColorSelector = ({
  onSelectColor,
  selectedPieceType,
}: ColorSelectorProps) => {
  const getColorOptions = () => {
    const pieceTypes: PieceType[] = ["T", "S", "I", "Z", "O", "L", "J"];

    let options = [];

    for (let pieceType in pieceTypes) {
      options.push(
        <ColorOption
          key={`Color selector ${pieceType}`}
          selectedPieceType={selectedPieceType}
          onSelectColor={onSelectColor}
          pieceType={pieceTypes[pieceType] as PieceType}
        />
      );
    }
    return options;
  };

  return (
    <div className="align-center flex w-fit justify-center p-3">
      {getColorOptions()}
    </div>
  );
};

type ColorOptionProps = {
  pieceType: PieceType;
  selectedPieceType: PieceType;
  onSelectColor: (color: PieceType) => void;
};

const getBackgroundColorFromBoardState = (pieceType: PieceType): String =>
  `bg-[${getColorFromBoardStateTile(pieceType)}]`;

const ColorOption = ({
  pieceType,
  onSelectColor,
  selectedPieceType,
}: ColorOptionProps) => {
  return (
    <div
      key={`Color selector Option ${pieceType}`}
      onClick={() => onSelectColor(pieceType)}
      className={`m-2 h-3 w-3 ${getBackgroundColorFromBoardState(
        pieceType
      )} p-3 hover:cursor-pointer ${
        selectedPieceType == pieceType ? "border-2 border-black" : ""
      }`}
    ></div>
  );
};

export default ColorSelector;
