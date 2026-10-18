import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from '../../pages/index.module.css';

/** Same Radix primitive and filled/popover treatment as packages/ui Select. */
export default function LanguageSelect({value, onChange, options}: {value: string; onChange: (value: string) => void; options: string[]}) {
  return <Select.Root value={value} onValueChange={onChange}>
    <Select.Trigger aria-label="Code language" className={styles.selectTrigger}>
      <Select.Value />
      <Select.Icon><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content position="popper" align="end" sideOffset={4} className={styles.selectContent}>
        <Select.Viewport>{options.map(option => <Select.Item key={option} value={option} className={styles.selectItem}>
          <Select.ItemText>{option}</Select.ItemText>
          <Select.ItemIndicator className={styles.selectIndicator}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></Select.ItemIndicator>
        </Select.Item>)}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>;
}
