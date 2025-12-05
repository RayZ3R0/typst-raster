import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
    code: string;
    language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    return (
        <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={`${className} p-4 rounded-lg overflow-x-auto text-sm border border-border`} style={style}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                            <span className="inline-block w-8 text-right pr-4 text-gray-500 select-none">{i + 1}</span>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
}
