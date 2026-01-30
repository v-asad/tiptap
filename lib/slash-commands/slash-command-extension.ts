import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export interface SlashCommandOptions {
  triggerChar: string;
  onOpen: (props: {
    range: { from: number; to: number };
    query: string;
    position: { top: number; left: number };
  }) => void;
  onClose: () => void;
  onUpdate: (props: {
    range: { from: number; to: number };
    query: string;
  }) => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const slashCommandPluginKey = new PluginKey("slashCommand");

export const SlashCommandExtension = Extension.create<SlashCommandOptions>({
  name: "slashCommand",

  addOptions() {
    return {
      triggerChar: "/",
      onOpen: () => {},
      onClose: () => {},
      onUpdate: () => {},
      onKeyDown: () => false,
    };
  },

  addProseMirrorPlugins() {
    const { triggerChar, onOpen, onClose, onUpdate, onKeyDown } = this.options;

    return [
      new Plugin({
        key: slashCommandPluginKey,

        state: {
          init() {
            return {
              active: false,
              range: null as { from: number; to: number } | null,
              query: "",
            };
          },

          apply(tr, prev) {
            const meta = tr.getMeta(slashCommandPluginKey);
            if (meta?.deactivate) {
              return { active: false, range: null, query: "" };
            }
            if (meta?.activate) {
              return {
                active: true,
                range: meta.range,
                query: meta.query || "",
              };
            }
            if (meta?.updateQuery !== undefined) {
              return {
                ...prev,
                query: meta.updateQuery,
                range: meta.range || prev.range,
              };
            }
            return prev;
          },
        },

        props: {
          handleKeyDown(view, event) {
            const state = slashCommandPluginKey.getState(view.state);

            if (state?.active) {
              // Let the hook handle navigation keys
              if (
                event.key === "ArrowUp" ||
                event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === "Escape"
              ) {
                return onKeyDown(event);
              }
            }

            return false;
          },

          handleTextInput(view, from, to, text) {
            const state = slashCommandPluginKey.getState(view.state);

            // Check if typing the trigger character
            if (text === triggerChar) {
              // Check if at start of block or after whitespace
              const $from = view.state.doc.resolve(from);
              const textBefore = $from.parent.textBetween(
                0,
                $from.parentOffset,
                undefined,
                "\ufffc"
              );
              const isAtStart =
                textBefore.length === 0 ||
                textBefore.endsWith(" ") ||
                textBefore.endsWith("\n");

              if (isAtStart) {
                // Schedule opening the menu after the character is inserted
                setTimeout(() => {
                  const coords = view.coordsAtPos(from + 1);
                  const range = { from, to: from + 1 };

                  view.dispatch(
                    view.state.tr.setMeta(slashCommandPluginKey, {
                      activate: true,
                      range,
                      query: "",
                    })
                  );

                  onOpen({
                    range,
                    query: "",
                    position: {
                      top: coords.bottom + 8,
                      left: coords.left,
                    },
                  });
                }, 0);
              }
            } else if (state?.active) {
              // Update query while menu is open
              setTimeout(() => {
                const { selection } = view.state;
                const $from = selection.$from;
                const textBefore = $from.parent.textBetween(
                  0,
                  $from.parentOffset,
                  undefined,
                  "\ufffc"
                );

                // Find the slash position
                const slashIndex = textBefore.lastIndexOf(triggerChar);

                if (slashIndex !== -1) {
                  const query = textBefore.slice(slashIndex + 1);
                  const blockStart = $from.start();
                  const range = {
                    from: blockStart + slashIndex,
                    to: blockStart + $from.parentOffset,
                  };

                  view.dispatch(
                    view.state.tr.setMeta(slashCommandPluginKey, {
                      updateQuery: query,
                      range,
                    })
                  );

                  onUpdate({ range, query });
                } else {
                  // Slash was deleted, close menu
                  view.dispatch(
                    view.state.tr.setMeta(slashCommandPluginKey, {
                      deactivate: true,
                    })
                  );
                  onClose();
                }
              }, 0);
            }

            return false;
          },
        },

        view() {
          return {
            update(view) {
              const state = slashCommandPluginKey.getState(view.state);

              if (state?.active) {
                const { selection } = view.state;
                const $from = selection.$from;
                const textBefore = $from.parent.textBetween(
                  0,
                  $from.parentOffset,
                  undefined,
                  "\ufffc"
                );

                // Check if slash still exists
                const slashIndex = textBefore.lastIndexOf(triggerChar);

                if (slashIndex === -1) {
                  view.dispatch(
                    view.state.tr.setMeta(slashCommandPluginKey, {
                      deactivate: true,
                    })
                  );
                  onClose();
                }
              }
            },
          };
        },
      }),
    ];
  },
});
