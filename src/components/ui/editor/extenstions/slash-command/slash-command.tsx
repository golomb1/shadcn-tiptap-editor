"use client"

import { Editor, Extension } from "@tiptap/core"
import { Suggestion, type SuggestionProps } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react"
import type { GetReferenceClientRect, Instance } from "tippy.js"
import tippy from "tippy.js"
import { Component } from "react"
import { PluginKey } from "@tiptap/pm/state";
import { COMMANDS, type CommandItem } from "../../commands";



////////////////////////////////////////////////////////////////////////////////
// React component rendered inside the floating menu
////////////////////////////////////////////////////////////////////////////////
/**
 * CommandMenu component renders a list of command items for the slash command popup.
 * @param items - Array of command items to display.
 * @param selected - Index of the currently selected item.
 * @param onSelect - Callback when an item is selected.
 */
function CommandMenu({
                         items,
                         selected,
                         onSelect,
                     }: {
    items: CommandItem[]
    selected: number
    onSelect: (index: number, item: CommandItem) => void
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 max-h-72 overflow-y-auto min-w-[260px]">
            {items.length ? (
                items.map((item, idx) => (
                    <button
                        key={item.title}
                        className={`w-full flex gap-3 items-start rounded-md px-3 py-2 text-left hover:bg-gray-100 ${
                            idx === selected ? "bg-gray-100" : ""
                        }`}
                        onClick={() => onSelect(idx, item)}
                    >
                        {item.icon}
                        <div>
                            <p className="text-sm font-medium leading-none">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                    </button>
                ))
            ) : (
                <p className="px-3 py-2 text-sm text-gray-500">No results</p>
            )}
        </div>
    );
}


////////////////////////////////////////////////////////////////////////////////
// Extension implementation
////////////////////////////////////////////////////////////////////////////////


/**
 * CommandsView is a React component that manages keyboard navigation and selection for the slash command menu.
 * Handles up/down/enter keys and renders the CommandMenu.
 */
class CommandsView extends Component<SuggestionProps> {
    state = {
        selectedIndex: null,
    };

    componentDidUpdate(oldProps: SuggestionProps) {
        if (this.props.items !== oldProps.items) {
            this.setState({
                selectedIndex: 0,
            });
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === "ArrowUp") {
            this.upHandler();
            return true;
        }

        if (event.key === "ArrowDown") {
            this.downHandler();
            return true;
        }

        if (event.key === "Enter") {
            this.enterHandler();
            return true;
        }

        return false;
    }

    upHandler() {
        this.setState({
            selectedIndex:
                ((this.state.selectedIndex || 0) + this.props.items.length - 1) %
                this.props.items.length,
        });
    }

    downHandler() {
        this.setState({
            selectedIndex:
                this.state.selectedIndex === null
                    ? 0
                    : ((this.state.selectedIndex || 0) + 1) % this.props.items.length,
        });
    }

    enterHandler() {
        this.selectItem(this.state.selectedIndex);
    }

    selectItem(index: number | null) {
        const item = this.props.items[index || 0];

        if (item) {
            this.props.command(item);
        }
    }

    render() {
        const { items } = this.props;
        return (
            <CommandMenu
                items={items}
                selected={Math.min(this.state.selectedIndex ?? 0, items.length - 1)}
                onSelect={(index: number, _item: CommandItem) => { this.selectItem(index) }}
            />
        );
    }
}

/**
 * SlashCommand is a Tiptap extension that provides a slash command menu for inserting editor commands.
 * Integrates with the COMMANDS array and renders a floating menu using Tippy.js and React.
 */
export const SlashCommand = Extension.create({
    name: "slashCommand",
    addProseMirrorPlugins() {
        return [
            Suggestion<CommandItem>({
                pluginKey: new PluginKey('slash-command'),
                editor: this.editor,
                char: "/",
                startOfLine: false,
                command: ({ editor, range, props }) => {
                    props.command({ editor, range, props});
                },
                items: ({ query }: { query: string; editor: Editor }) => {
                    return COMMANDS.flat().filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
                },
                render: () => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let component: ReactRenderer<CommandsView, any>, popup: Instance<any>;
                    return {
                        onStart: (props) => {
                            component = new ReactRenderer(CommandsView, {
                                props,
                                editor: props.editor,
                            });
                            popup = tippy(props.editor.options.element, {
                                getReferenceClientRect:
                                    props.clientRect as GetReferenceClientRect,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: "manual",
                                placement: "bottom-start",
                            });
                        },
                        onUpdate: (props) => {
                            component.updateProps(props);
                            popup.setProps({
                                getReferenceClientRect: props.clientRect,
                            });
                        },
                        onKeyDown: ({ event }) => {
                            if (event.key === "Escape") {
                                popup.hide();
                                return true;
                            }
                            if (component.ref)
                                return component.ref.onKeyDown(event as KeyboardEvent);
                            else return true;
                        },
                        onExit: () => {
                            component.destroy();
                            popup.destroy();
                        },
                    }
                }})
        ]
    }})