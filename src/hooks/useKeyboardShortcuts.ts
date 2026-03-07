import { useHotkeys } from "react-hotkeys-hook";

type Shortcut = {
  keys: string;
  handler: (e?: KeyboardEvent) => void;
};

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  shortcuts.forEach(({ keys, handler }) => {
    useHotkeys(keys, (event) => handler(event), {
      enableOnFormTags: true,
      preventDefault: true,
    });
  });
};