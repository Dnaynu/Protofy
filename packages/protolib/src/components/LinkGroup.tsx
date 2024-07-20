import { NextLink } from './NextLink'
import {
    Paragraph,
    Text,
    styled,
} from 'tamagui'
import { useContext } from 'react'
import HoveredGroup, { HoveredGroupContext } from './HoveredGroup'
import React from 'react'

const Subtitle = styled(Paragraph, {
    color: '$gray10',
    //@ts-ignore
    size: '$6', ta: 'left', ls: -1,
    fontFamily: '$silkscreen',
    $gtSm: {
        //@ts-ignore
        ta: 'center', size: '$7', ls: -1,
    },

    $gtMd: {
        //@ts-ignore
        size: '$8', ls: -1,
    },

    $gtLg: {
        //@ts-ignore
        size: '$9', lh: 50, ls: -1,
    },
})

const Tag = styled(Text, {
    className: 'hero-tag text-decoration-none',
    fontFamily: 'inherit' as any,
    fontSize: 'inherit' as any,
    borderRadius: '$2',
    paddingHorizontal: '$1',
    marginHorizontal: '$-1',
    cursor: 'pointer',
    color: '$color',
    backgroundColor: '$color2',

    hoverStyle: {
        color: '$color',
        //@ts-ignore
        backgroundColor: '$color3',
    },

    variants: {
        active: {
            true: {
                color: '$color10',
                backgroundColor: '$color5',

                hoverStyle: {
                    color: '$color12',
                    backgroundColor: '$color5',
                },
            },
        },
    } as const,
})


export const LinkGroupItem = React.forwardRef(({id, themeColor, children, href, ...props}:any, ref:any) => {
    const {hovered, setHovered} = useContext(HoveredGroupContext);
    return (<NextLink prefetch={false} href={href}>
        <Tag theme={themeColor} onHoverIn={() => setHovered(id)} active={hovered === id} {...props}>
            {children}
        </Tag>
    </NextLink>)
})

export const LinkGroup = React.forwardRef(({children}:any, ref:any) => {
    return (
        <Subtitle>
            {/* @ts-ignore */}
            <HoveredGroup>
                {children}
            </HoveredGroup>
        </Subtitle>
    )
})