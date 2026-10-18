import React from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type {Props} from '@theme/CodeBlock';
import CopyField from '../../components/DocsHome/CopyField';

/** One shared presentation for MDX fences and directly imported code examples. */
export default function CodeBlock(props: Props): React.JSX.Element {
  const value = typeof props.children === 'string' ? props.children.trim() : '';
  if (value && !value.includes('\n') && !props.showLineNumbers) return <CopyField value={value}/>;
  return <CopyField value={value}><div className="vremly-code-block"><OriginalCodeBlock {...props}/></div></CopyField>;
}
