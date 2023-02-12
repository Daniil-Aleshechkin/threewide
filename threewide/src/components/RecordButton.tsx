import * as React from "react";
import { FunctionComponent, useState } from "react";

interface RecordButtonsProps {}

const RecordButtons: FunctionComponent<RecordButtonsProps> = () => {
  const [isRecording, setIsRecording] = useState(false);

  const record = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div>
      <div
        onClick={() => record()}
        className={`${
          isRecording ? "bg-red-500" : "bg-black"
        } h-10 w-10 rounded-full`}
      ></div>
      <div
        onClick={() => {
          stopRecording();
        }}
        className=" h-10 w-10 bg-black"
      ></div>
    </div>
  );
};

export default RecordButtons;
