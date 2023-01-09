import React, { useState } from "react";
import type { Moves } from "src/types/tetris";

export type SettingsProperties = {
  showSettings: boolean;
  onSettingsSave: (settings: Settings) => void;
  onSettingCancel: () => void;
  currentSettings: Settings;
};

export type KeySettings = {
  moveLeft: string;
  moveRight: string;
  rotate90: string;
  rotate180: string;
  rotate270: string;
  hardDrop: string;
  softDrop: string;
  holdPiece: string;
  undo: string;
  reset: string;
  next: string;
  previous: string;
};

interface SettingsData extends Settings {
  isValidDas: boolean;
}

export type Settings = {
  keySettings: KeySettings;
  dasAmount: number;
};

const SettingsPage = ({
  showSettings,
  onSettingsSave,
  onSettingCancel,
  currentSettings,
}: SettingsProperties) => {
  if (!showSettings) return <></>;

  /* eslint-disable */
  const [changingSetting, setChangingSetting] = useState<Moves | undefined>();

  const [settings, setSettings] = useState<SettingsData>({
    keySettings: { ...currentSettings.keySettings },
    dasAmount: currentSettings.dasAmount,
    isValidDas: true,
  });
  /* eslint-enable */

  const setSetting = (settingName: Moves, keyCode: string) => {
    const newSettings = { ...settings };

    newSettings.keySettings[settingName] = keyCode;

    setSettings(newSettings);
  };

  const posibleActions: Moves[] = [
    "hardDrop",
    "holdPiece",
    "moveLeft",
    "moveRight",
    "rotate180",
    "rotate270",
    "rotate90",
    "softDrop",
    "reset",
  ];

  const isValid = (settingKey: string): boolean => {
    let moveKeyCount = 0;
    posibleActions.forEach((move) => {
      if (settings.keySettings[move] == settingKey) {
        moveKeyCount += 1;
      }
    });

    return moveKeyCount <= 1;
  };

  const isAllSettingsValid = (): boolean => {
    if (!settings.isValidDas) return false;

    for (const action in settings.keySettings) {
      if (!isValid(settings.keySettings[action as Moves])) {
        return false;
      }
    }

    return true;
  };

  const onUpdateChangingSetting = (settingType: Moves) => {
    setChangingSetting(settingType);
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        e.preventDefault();
        if (changingSetting) {
          setSetting(changingSetting, e.code);
          setChangingSetting(undefined);
        }
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setChangingSetting(undefined);
      }}
      className="absolute left-0 top-0 flex h-[100vh] w-[100vw] items-center justify-center"
    >
      <div className="relative z-30 flex flex-col rounded-xl border-2 border-white bg-black  p-6 text-white">
        <h1 className="text-center text-2xl">SETTINGS</h1>
        <div className="p-3"></div>
        <h1 className="text-center text-xl">CONTROLS</h1>
        <div className="p-2"></div>
        <div className="flex ">
          <div className="mr-10">MOVE PIECE LEFT</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.moveLeft}
            settingType="moveLeft"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="flex ">
          <div className="mr-10">MOVE PIECE RIGHT</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.moveRight}
            settingType="moveRight"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="flex ">
          <div className="mr-10">SOFT DROP</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.softDrop}
            settingType="softDrop"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="flex ">
          <div className="mr-10">HARD DROP</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.hardDrop}
            settingType="hardDrop"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="flex ">
          <div className="mr-10">ROTATE COUNTERCLOCKWISE</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.rotate270}
            settingType="rotate270"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="flex ">
          <div className="mr-10">ROTATE CLOCKWISE</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.rotate90}
            settingType="rotate90"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="flex ">
          <div className="mr-10">ROTATE 180</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.rotate180}
            settingType="rotate180"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="flex ">
          <div className="mr-10">SWAP HOLD PIECE</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.holdPiece}
            settingType="holdPiece"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>

        <div className="flex ">
          <div className="mr-10">RESET</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.reset}
            settingType="reset"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>

        <div className="flex ">
          <div className="mr-10">NEXT GAME</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.next}
            settingType="next"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>

        <div className="flex ">
          <div className="mr-10">PREVIOUS GAME</div>
          <KeySetting
            onUpdateChangingSetting={onUpdateChangingSetting}
            settingKey={settings.keySettings.previous}
            settingType="previous"
            changingSetting={changingSetting}
            settings={settings}
          />
        </div>
        <div className="p-3"></div>
        <h1 className="text-center text-xl">HANDLING</h1>
        <div className="p-2"></div>
        <div className="flex ">
          <div className="mr-10">DAS</div>
          <div className="ml-auto mr-0">
            <input
              className={`mr-1 w-64 ${
                settings.isValidDas ? "text-white" : "text-red-500"
              } bg-black text-right !outline-none selection:bg-white selection:text-black hover:cursor-pointer`}
              type="text"
              defaultValue={settings.dasAmount}
              onClick={(e) => {
                e.currentTarget.select();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                const newSetting = { ...settings };
                if (!isNaN(parseInt(e.currentTarget.value))) {
                  newSetting.isValidDas = true;
                  newSetting.dasAmount = parseInt(e.currentTarget.value);
                } else {
                  newSetting.isValidDas = false;
                }
                setSettings(newSetting);
              }}
            />
            MS
          </div>
        </div>
        <div className="p-3"></div>
        <div className="flex w-full">
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              onSettingCancel();
            }}
            className="w-fit justify-self-start rounded-xl border-2 pt-1 pb-1 pl-5 pr-5 hover:cursor-pointer hover:bg-white hover:text-black"
          >
            Cancel
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              if (isAllSettingsValid()) onSettingsSave(settings);
            }}
            className="mr-0 ml-auto w-fit rounded-xl border-2 pt-1 pb-1 pl-5 pr-5 hover:cursor-pointer hover:bg-white hover:text-black"
          >
            Save and exit
          </div>
        </div>
      </div>
    </div>
  );
};

type KeySettingProperties = {
  changingSetting: Moves | undefined;
  onUpdateChangingSetting: (settingType: Moves) => void;
  settingKey: string;
  settingType: Moves;
  settings: Settings;
};

const KeySetting = ({
  changingSetting,
  onUpdateChangingSetting,
  settingKey,
  settingType,
  settings,
}: KeySettingProperties) => {
  const convertKeyCodeTostring = (keyCode: string, move: Moves): string => {
    if (move == changingSetting) {
      return "[NOT SET]";
    }

    return keyCode;
  };

  const posibleActions: Moves[] = [
    "hardDrop",
    "holdPiece",
    "moveLeft",
    "moveRight",
    "rotate180",
    "rotate270",
    "rotate90",
    "softDrop",
  ];

  const isValid = (): boolean => {
    let moveKeyCount = 0;
    posibleActions.forEach((move) => {
      if (settings.keySettings[move] == settingKey) {
        moveKeyCount += 1;
      }
    });

    return moveKeyCount <= 1;
  };

  return (
    <div
      className={`ml-auto mr-0 w-24 text-right hover:cursor-pointer ${
        isValid() ? "" : "text-red-500"
      }  ${settingType == changingSetting ? "text-red-500" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onUpdateChangingSetting(settingType);
      }}
    >
      {convertKeyCodeTostring(settingKey, settingType)}
    </div>
  );
};

export default SettingsPage;
