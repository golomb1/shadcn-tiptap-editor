"use client"

import { Editor } from "@tiptap/core"
import { type SuggestionOptions, type SuggestionProps } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react"
import type { GetReferenceClientRect, Instance } from "tippy.js"
import tippy from "tippy.js"
import { Component } from "react"
import { type MentionNodeAttrs } from "@tiptap/extension-mention";

////////////////////////////////////////////////////////////////////////////////
// Extension implementation
////////////////////////////////////////////////////////////////////////////////


class MentionView extends Component<SuggestionProps> {
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
            this.props.command({ id: item })
        }
    }

    render() {
        const { items } = this.props;
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 max-h-72 overflow-y-auto min-w-[260px]">
                {items.length
                        ? items.map((item, index) => (
                            <button
                                className={`w-full flex gap-3 items-start rounded-md px-3 py-2 text-left hover:bg-gray-100 ${
                                    index === this.state.selectedIndex ? "bg-gray-100" : ""
                                }`}
                                key={index}
                                onClick={() => this.selectItem(index)}
                            >
                                <p className="text-sm font-medium leading-none">{item}</p>
                            </button>
                        ))
                        : <div className="item">No result</div>
                }
        </div>
    );
    }
}

export interface MentionListOptions {
    queryFunction: (query: string) => string[]
}

export function MentionSuggestions(queryFunction: (query: string) => string[]): Omit<SuggestionOptions<string, MentionNodeAttrs>, 'editor'> {
    return {
        items: (props: { query: string; editor: Editor }) => {
            return queryFunction(props.query)
        },
        render: () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let component: ReactRenderer<MentionView, any>, popup: Instance<any>;
            return {
                onStart: (props: SuggestionProps) => {
                    component = new ReactRenderer(MentionView, {
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
                onUpdate: (props: SuggestionProps) => {
                    component.updateProps(props);
                    popup.setProps({
                        getReferenceClientRect: props.clientRect,
                    });
                },
                onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                    if (event.key === "Escape") {
                        popup.hide();
                        return true;
                    }
                    if (component.ref)
                        return component.ref?.onKeyDown(event as KeyboardEvent);
                    else return true;
                },
                onExit: () => {
                    component.destroy();
                    popup.destroy();
                },
            }
        },
    }
}