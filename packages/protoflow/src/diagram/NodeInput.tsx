import React from 'react';
import useTheme from './Theme';
import { Input } from 'protolib/dist/components/Input'

const NodeInput = React.forwardRef((props:any, ref:any) => {
  const nodeBorderColor = useTheme('nodeBorderColor')
  return (
    <Input
      unstyled={true}
      {...props}
      ref={ref}
      style={{
        fontSize: useTheme('nodeFontSize'),
        fontFamily: 'Jost-Regular', 
        border: useTheme('inputBorder'),
        color: props.readOnly ? useTheme('disableTextColor') : useTheme("textColor"),
        backgroundColor: useTheme("inputBackgroundColor"), 
        padding: '0.35ch', 
        paddingLeft: '1ch',
        borderRadius: '0.5ch', 
        display: 'flex',
        flex: 1,
        width: '100%',
        boxSizing: 'border-box',
        cursor: props.readOnly ? 'grab' : 'text',
        ...props.style
      }}
      onFocus={(e:any) => {
        e.currentTarget.style.boxShadow = "inset 0px 0px 0px 2px " + nodeBorderColor
        props.onFocus ? props.onFocus(e) : null
      }}
      onBlur={(e:any) => {
        e.currentTarget.style.boxShadow = ""
        props.onBlur ? props.onBlur(e) : null
      }}
    >
      {props.children}
    </Input>
  );
})

export default NodeInput