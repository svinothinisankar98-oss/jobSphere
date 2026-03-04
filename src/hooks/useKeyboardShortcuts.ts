// import { useEffect } from "react";

// //shortcutkey type//

// type ShortcutHandler = {
//   key: string;        //main key pressed//
//   alt?: boolean;       //must alt pressed//
//   ctrl?: boolean;
//   shift?: boolean;
//   callback: () => void;   //Function to run//
// };

// export const useKeyboardShortcuts = (shortcuts: ShortcutHandler[]) => {
//   useEffect(() => {       //addevent listner when component mounts//                                                          
//     const handleKeyDown = (e: KeyboardEvent) => {       //key pressed//
//       shortcuts.forEach(({ key, alt = false, ctrl = false, shift = false, callback }) => {  
//         if (
//           e.key.toLowerCase() === key.toLowerCase() &&         //matching logic//
//           e.altKey === alt &&
//           e.ctrlKey === ctrl &&
//           e.shiftKey === shift
//         ) {
//           e.preventDefault();   
//           callback();
//         }
//       });
//     };

//     window.addEventListener("keydown", handleKeyDown);            
//     return () => window.removeEventListener("keydown", handleKeyDown);            
//   }, [shortcuts]);
// };


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