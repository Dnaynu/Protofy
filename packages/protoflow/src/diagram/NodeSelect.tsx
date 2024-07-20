import React from 'react';
import useTheme from './Theme';
import { ChevronDown } from '@tamagui/lucide-icons';

const NodeSelect = (props) => {
	const onSelect = (event) => {
		const value = event.target.value
		props.onChange({ label: value, value })
	}
	return (
		<div style={{ position: 'relative' }}>
			<select
				value={props.defaultValue.value}
				onClick={onSelect}
				onChange={onSelect}
				style={{
					width: '100%',
					boxSizing: 'border-box',
					backgroundColor: useTheme("inputBackgroundColor"),
					color: useTheme("textColor"),
					fontFamily: 'Jost-Regular',
					fontSize: useTheme('nodeFontSize'),
					border: useTheme('inputBorder'),
					padding: '0.35ch',
					paddingLeft: '1ch',
					paddingRight: '1ch',
					flex: 1,
					display: 'flex',
					borderRadius: '0.5ch',
					appearance: 'none'
				}}
			>
				<option value="" disabled selected={props?.value === undefined}>{'Select an option'}</option>
				{props.options?.map((opt, key) => (
					<option key={key} value={opt.value}>{opt.label}</option>
				))}
			</select>
			{/* @ts-ignore */}
			<ChevronDown style={{ position: 'absolute', right: '10px', top: useTheme('nodeFontSize') / 2 , pointerEvents: 'none'}} />
		</div>
	)
}
export default NodeSelect
