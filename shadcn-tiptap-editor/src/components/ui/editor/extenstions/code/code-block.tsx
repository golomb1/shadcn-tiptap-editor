"use client"

import type { ComponentType } from 'react'
import './code-block.scss'
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectLabel, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'


export const CodeBlockComponent: ComponentType<ReactNodeViewProps> = ({ editor, node , updateAttributes, extension }) => {
    const code = node.textContent;
    const showLineNumbers = editor.getText();
    const getLineNumbers = () => {
        if (!showLineNumbers) return null
        const lines = code.split("\n")
        return (
            <div className="flex flex-col text-right pr-4 text-gray-500 select-none text-sm leading-6 min-w-[3em]"
                 style={{padding: '0.75rem 1rem'}}>
                {lines.map((_, index) => (
                    <span key={index + 1}>{index + 1}</span>
                ))}
            </div>
        )
    }


    return (
        <NodeViewWrapper className="code-block text-xs">
            <Card className='p-0 gap-0'>
                <CardHeader className='flex flex-row items-center justify-between text-sm pb-2 pt-2 gap-2'>
                    <CardTitle>Code Block</CardTitle>
                    <Select
                        defaultValue={node.attrs.defaultLanguage}
                        onValueChange={(newLang: string) => updateAttributes({ language: newLang })}
                    >
                        <SelectTrigger className="w-[180px] text-current text-xs" style={{
                        }}>
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Languages</SelectLabel>
                                {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
                                    <SelectItem key={index} value={lang} className='text-xs'>{lang}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative bg-gray-900 rounded-b-lg overflow-hidden">
                        <div className="flex text-sm">
                            {getLineNumbers()}
                            <pre className="flex-1 p-0 overflow-x-auto">
                <NodeViewContent as="code" className="leading-6" />
                                {/*<code className="text-gray-100 leading-6">{getHighlightedCode()}</code>*/}
              </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </NodeViewWrapper>
    )
}

export default CodeBlockComponent;